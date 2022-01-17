import { createDeal } from './services/data-maker/helpers/dmHelper';
import { gen } from './services/git/git';
import { assignToQa, changeStatus } from './services/odp/helpers/odphelper';

export const commandModeMapper = {
  readyForQA: () => assignToQa(process.argv[3], process.argv[4]),
  changeStatus: () => changeStatus(process.argv[3], process.argv[4]),
  createDeal: () => createDeal(),
};
