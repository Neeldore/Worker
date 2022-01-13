import {
  MY_DEFECTS,
  MY_STORIES,
  DEFECT_DETAILS,
  GO_BACK,
} from '../../../helpers/constants';
import { cloudGet, cloudPut } from './credManager';
import { easyInquirer, odpStatusesInquirer } from '../../../helpers/inquirer';
import { _throw } from '../../../helpers/misc';

export function _fetchDefect() {
  return cloudGet(MY_DEFECTS, getDefaultFilter());
}

export function _fetchStories() {
  return cloudGet(MY_STORIES, getDefaultFilter());
}

export function getDefectDetails(id) {
  return cloudGet(`${DEFECT_DETAILS}/${id}`, { expanded: true });
}

export function changeStatus(id) {
  let defectDetails: any;
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
      defectDetails.status = ans.status;
      return cloudPut(DEFECT_DETAILS, id, defectDetails);
    })
    .then((resp) => resp.status)
    .catch((e) => console.error(e));
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
