import {
  MY_DEFECTS,
  MY_STORIES,
  DEFECT_DETAILS,
  GO_BACK,
  GET_CLOUD_USERS,
  GET_SERVICE_DEF,
  STORY_DETAILS,
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
export function getStoryDetails(id, skipCheck = false) {
  return cloudGet(`${STORY_DETAILS}/${id}`, { expand: true }, skipCheck);
}

export function changeStatus(id: string) {
  let entityDetails: any;
  let status = '';
  let isDefect = id.includes('DEF');
  const detailsFn = isDefect ? getDefectDetails : getStoryDetails;
  return detailsFn(id)
    .then((resp) =>
      resp && resp.data && resp.data._id
        ? resp.data
        : _throw('cannot find ' + isDefect ? 'Defect' : 'Story')
    )
    .then((resp) => {
      entityDetails = resp;
      return odpStatusesInquirer(isDefect);
    })
    .then((ans) => {
      if (ans.status === GO_BACK.value) {
        _throw();
      }
      status = ans.status;
      entityDetails.status = status;
      return cloudPut(
        isDefect ? DEFECT_DETAILS : STORY_DETAILS,
        id,
        entityDetails,
        true
      );
    })
    .then((resp: any) =>
      resp.status === 200
        ? console.log(`\n Changed the status of ${id} to ${status} \n`)
        : console.log('\n Some error occured \n' + JSON.stringify(resp.data))
    )
    .catch((e) => {});
}

export function assignToQa(id) {
  let entityDetails: any;
  let nameOfQa: any = {};
  let serviceDef: Array<any> = [];
  let isDefect = id.includes('DEF');
  const detailsFn = isDefect ? getDefectDetails : getStoryDetails;

  return Promise.all([detailsFn(id), getServiceDefinition(isDefect)])
    .then(([resp, _serviceDef]) => {
      serviceDef = _serviceDef;
      return resp && resp.data && resp.data._id
        ? resp.data
        : _throw('cannot find ' + isDefect ? 'Defect' : 'Story');
    })
    .then((resp) => {
      entityDetails = resp;
      nameOfQa = resp.nameOfTheQa || {};
      return getUser(nameOfQa);
    })
    .then((ans) => {
      nameOfQa = ans;
      return getComponents(serviceDef);
    })
    .then((ans) => {
      entityDetails.componentsAffected = ans.components;
      entityDetails.status = isDefect ? 'Ready for QA' : 'Completed';
      entityDetails.newEnvironmentVariables = 'No';
      entityDetails.newErrorMessages = 'No';
      entityDetails.newMigrationScripts = 'No';
      entityDetails.newSchemaChanges = 'No';
      entityDetails.newSetupScripts = 'No';
      entityDetails.assignedTo = { _id: nameOfQa._id };
      return cloudPut(
        isDefect ? DEFECT_DETAILS : STORY_DETAILS,
        id,
        entityDetails,
        true
      );
    })
    .then((resp: any) =>
      resp.status === 200
        ? console.log(
            `\n Changed the status of ${id} to ${entityDetails.status} \n`
          )
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
  return response.map((defect) => ({
    name: `${defect._id} - ${defect.summary} - ${defect.status} - ${
      defect.release.name || defect.release._id
    }`,
    value: defect._id,
  }));
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

function getServiceDefinition(isDefect) {
  return cloudGet(
    GET_SERVICE_DEF + '/' + (isDefect ? 'SRVC2022' : 'SRVC2020'),
    {
      select: 'definition',
    }
  ).then((resp) => {
    try {
      return resp.data.definition.find(
        (def) => def.key === 'componentsAffected'
      ).definition[0].properties.enum;
    } catch {
      return [];
    }
  });
}

function getUser(nameOfQa) {
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
    return autoCompleteInquirer('qa', 'Type the name of the user', userSource);
  }
}

function getComponents(serviceDef) {
  return basicInquirer({
    type: 'checkbox',
    name: 'components',
    message: 'selected the components affected',
    choices: [{ name: 'just web', value: 'xcro_web' }, ...serviceDef],
  });
}
