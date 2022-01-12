import {
  DEFECT_DETAILS,
  EXIT,
  GO_BACK,
  MY_DEFECTS,
  MY_STORIES,
} from '../helpers/constants';
import { cloudGet } from '../helpers/credManager';
import {
  easyInquirer,
  odpBaseInquirer,
  odpDefectInquirer,
} from '../helpers/inquirer';

export async function odp() {
  const functionMapper = {
    FD: fetchMyDefects,
    FS: fetchMyStories,
  };
  for (;;) {
    const ans = await odpBaseInquirer();
    if (ans.ODP === GO_BACK.value) {
      return;
    } else if (ans.ODP === EXIT.value) {
      process.exit(1);
    } else {
      await functionMapper[ans.ODP]();
    }
  }
}

async function fetchMyDefects() {
  let id: any;
  let task: any;
  await _fetchDefect()
    .then((response) => {
      if (response && response.data && response.data.length) {
        return response.data;
      } else {
        throw Error();
      }
    })
    .then((response) => {
      return easyInquirer(formatChoices(response), 'defect');
    })
    .then((ans) => {
      if (ans.defect === GO_BACK.value) {
        throw Error();
      } else {
        id = ans.defect;
        return odpDefectInquirer();
      }
    })
    .then((tasks) => {
      task = tasks.task;
      console.log('id', id);
      return getDefectDetails(id);
    })
    .then((resp) => console.log('resp ', resp))
    .catch((e) => {});
}

async function fetchMyStories() {
  let id: any;
  let task: any;
  await _fetchStories()
    .then((response) => {
      if (response && response.data && response.data.length) {
        return response.data;
      } else {
        throw Error();
      }
    })
    .then((response) => {
      return easyInquirer(formatChoices(response), 'story');
    })
    .then((ans) => {
      if (ans.story === GO_BACK.value) {
        throw Error();
      } else {
        id = ans.story;
        return odpDefectInquirer();
      }
    })
    .then((tasks) => {
      task = tasks.task;
      console.log('id', id);
    })
    .catch((e) => {});
}

export function _fetchDefect() {
  return cloudGet(MY_DEFECTS, getDefaultFilter());
}

export function _fetchStories() {
  return cloudGet(MY_STORIES, getDefaultFilter());
}

export function getDefectDetails(id) {
  return cloudGet(`${DEFECT_DETAILS}/${id}`, { expanded: true });
}

function getDefaultFilter() {
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

function formatChoices(response) {
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
