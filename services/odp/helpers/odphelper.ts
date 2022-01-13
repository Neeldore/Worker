import {
  MY_DEFECTS,
  MY_STORIES,
  DEFECT_DETAILS,
  GO_BACK,
  GET_CLOUD_USERS,
  GET_SERVICE_DEF,
} from '../../../helpers/constants';
import { cloudGet, cloudPut } from './credManager';
import {
  autoCompleteInquirer,
  basicInquirer,
  easyInquirer,
  odpStatusesInquirer,
} from '../../../helpers/inquirer';
import { _throw } from '../../../helpers/misc';

export function _fetchDefect(skipCheck = false) {
  return cloudGet(MY_DEFECTS, getDefaultFilter(), skipCheck);
}

export function _fetchStories(skipCheck = false) {
  return cloudGet(MY_STORIES, getDefaultFilter(), skipCheck);
}

export function getDefectDetails(id, skipCheck = false) {
  return cloudGet(`${DEFECT_DETAILS}/${id}`, { expand: true }, skipCheck);
}

export function changeStatus(id) {
  let defectDetails: any;
  let status = '';
  return getDefectDetails(id)
    .then((resp) =>
      resp && resp.data && resp.data._id
        ? resp.data
        : _throw('cannot find defect')
    )
    .then((resp) => {
      defectDetails = resp;
      return odpStatusesInquirer();
    })
    .then((ans) => {
      if (ans.status === GO_BACK.value) {
        _throw();
      }
      status = ans.status;
      defectDetails.status = status;
      return cloudPut(DEFECT_DETAILS, id, defectDetails, true);
    })
    .then((resp: any) =>
      resp.status === 200
        ? console.log(`\n Changed the status of ${id} to ${status} \n`)
        : console.log('\n Some error occured \n' + JSON.stringify(resp.data))
    )
    .catch((e) => {});
}

export function assignToQa(id) {
  let defectDetails: any;
  let nameOfQa: any = {};
  let serviceDef: Array<any> = [];
  return Promise.all([getDefectDetails(id), getServiceDefinition()])
    .then(([resp, _serviceDef]) => {
      serviceDef = _serviceDef;
      return resp && resp.data && resp.data._id
        ? resp.data
        : _throw('cannot find defect');
    })
    .then((resp) => {
      defectDetails = resp;
      nameOfQa = resp.nameOfTheQa || {};
      if (nameOfQa._id) {
        return easyInquirer(
          [
            {
              name: nameOfQa.name,
              value: { _id: nameOfQa._id, name: nameOfQa.name },
            },
            { name: 'Someone else', value: 'SE' },
          ],
          'qa',
          'assign to selected QA or someone else ?'
        ).then((ans) => {
          if (ans.qa === 'SE') {
            return autoCompleteInquirer(
              'qa',
              'Type the name of the user',
              userSource
            );
          } else {
            return ans;
          }
        });
      } else {
        return autoCompleteInquirer(
          'qa',
          'Type the name of the user',
          userSource
        );
      }
    })
    .then((ans) => {
      nameOfQa = ans;
      return basicInquirer({
        type: 'checkbox',
        name: 'components',
        message: 'selected the components affected',
        choices: [{ name: 'just web', value: 'xcro_web' }, ...serviceDef],
      });
    })
    .then((ans) => {
      defectDetails.componentsAffected = ans.components;
      defectDetails.status = 'Ready for QA';
      defectDetails.newEnvironmentVariables = 'No';
      defectDetails.newErrorMessages = 'No';
      defectDetails.newMigrationScripts = 'No';
      defectDetails.newSchemaChanges = 'No';
      defectDetails.newSetupScripts = 'No';
      defectDetails.assignedTo = { _id: nameOfQa._id };
      return cloudPut(DEFECT_DETAILS, id, defectDetails, true);
    })
    .then((resp: any) =>
      resp.status === 200
        ? console.log(`\n Changed the status of ${id} to 'Ready for QA' \n`)
        : console.log('\n Some error occured \n' + JSON.stringify(resp.data))
    )
    .catch((e) => {});
}

export function getDefaultFilter() {
  return {
    page: 1,
    count: -1,
    select:
      '_id,summary,priority,assignedTo._id,assignedTo.name,release._id,release.name,release.plannedReleaseDate,status,_metadata.workflow',
    filter: {
      $and: [
        {
          $or: [{ 'assignedTo._id': 'Neel' }, { 'assignedTo.name': 'Neel' }],
        },
      ],
    },
    expand: true,
  };
}

export function formatChoices(response) {
  return [
    ...response.map((defect) => ({
      name: `${defect._id} - ${defect.summary} - ${defect.status} - ${
        defect.release.name || defect.release._id
      }`,
      value: defect._id,
    })),
    ...[GO_BACK],
  ];
}

export function fetchEntities(type) {
  const mapper = {
    defect: {
      fetcherFn: _fetchDefect,
      inquirerName: 'defect',
    },
    story: {
      fetcherFn: _fetchStories,
      inquirerName: 'story',
    },
  };
  const mode = mapper[type];
  return mode
    .fetcherFn()
    .then((response) =>
      response && response.data && response.data.length
        ? response.data
        : _throw()
    )
    .then((response) =>
      easyInquirer(formatChoices(response), mode.inquirerName)
    );
}

function userSource(_existinAnsers, name) {
  return cloudGet(
    GET_CLOUD_USERS,
    {
      count: 20,
      select: 'name',
      filter: { name: `/${name}/` },
    },
    true
  ).then((resp) =>
    resp.data.map((users) => ({
      name: users.name,
      value: { _id: users._id, name: users.name },
    }))
  );
}

function getServiceDefinition() {
  return cloudGet(GET_SERVICE_DEF, { select: 'definition' }).then((resp) => {
    try {
      return resp.data.definition.find(
        (def) => def.key === 'componentsAffected'
      ).definition[0].properties.enum;
    } catch {
      return [];
    }
  });
}
