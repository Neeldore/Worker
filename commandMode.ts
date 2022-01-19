import {
  createAccount,
  createDeal,
} from './services/data-maker/helpers/dmHelper';
import { acp, gcd, genDev, pushDev } from './services/git/git';
import { assignToQa, changeStatus } from './services/odp/helpers/odphelper';

export const commandModeMapper = {
  readyForQA: () => assignToQa(process.argv[3], process.argv[4]),
  changeStatus: () => changeStatus(process.argv[3], process.argv[4]),
  createDeal: () => createDeal(!!process.argv[3]),
  createAccount: () => createAccount(process.argv[3] && +process.argv[3]),
  genDev: () => genDev(process.argv[3]),
  gcd: () => gcd(),
  pushDev: () => pushDev(process.argv[3], process.argv[4], !!process.argv[5]),
  acp: () => acp(process.argv[3], process.argv[4]),
};
