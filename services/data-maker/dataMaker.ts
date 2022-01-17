import { GO_BACK } from '../../helpers/constants';
import { dmBaseInquirer, easyInquirer } from '../../helpers/inquirer';
import { createAccount, createDeal } from './helpers/dmHelper';

export async function dm() {
  const functionMapper = {
    Dev: dev,
    FiveEight: fiveEight,
    sit6: sit6,
  };
  for (;;) {
    const ans = await dmBaseInquirer();
    if (ans.DM === GO_BACK.value) {
      return;
    } else {
      await functionMapper[ans.DM]();
    }
  }
}

export async function dev() {
  const fnMapper = {
    CA: createAccount,
    CLD: createDeal,
    CD: createDeal,
  };

  for (;;) {
    const ans = await easyInquirer(
      [
        { name: 'Create account', value: 'CA' },
        { name: 'Create live deal', value: 'CLD' },
        { name: 'Create draft deal', value: 'CD' },
      ],
      'dev'
    );
    if (ans.dev === GO_BACK.value) {
      return;
    } else {
      await fnMapper[ans.dev]();
    }
  }
}
export function fiveEight() {
  console.log('i ams works ');
}
export function sit6() {
  console.log('i ams works ');
}
