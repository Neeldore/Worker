import { EXIT, GO_BACK } from '../../helpers/constants';
import { odpBaseInquirer, odpDefectInquirer } from '../../helpers/inquirer';
import { _throw } from '../../helpers/misc';
import {
  changeStatus,
  fetchEntities,
  getDefectDetails,
} from './helpers/odphelper';

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
  await fetchEntities('defect')
    .then((ans) => {
      if (ans.defect === GO_BACK.value) {
        _throw();
      } else {
        id = ans.defect;
        return odpDefectInquirer();
      }
    })
    .then((tasks) => {
      task = tasks.task;
      const fnMapper = {
        P: getDefectDetails,
        CS: changeStatus,
        ATQ: getDefectDetails,
      };
      return fnMapper[task](id);
    })
    .then((resp) => console.log('resp ', resp))
    .catch((e) => {
      console.log('er', e);
    });
}

async function fetchMyStories() {
  let id: any;
  let task: any;
  await fetchEntities('story')
    .then((ans) => {
      if (ans.story === GO_BACK.value) {
        _throw();
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