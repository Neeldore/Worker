import { GO_BACK, EXIT } from '../../helpers/constants';
import { execute } from '../../helpers/executioner';
import { basicInquirer, gitBaseInquirer } from '../../helpers/inquirer';

export async function git() {
  const functionMapper = {
    CNB: gen,
    CBS: gen,
  };
  for (;;) {
    const ans = await gitBaseInquirer();
    if (ans.ODP === GO_BACK.value) {
      return;
    } else {
      await functionMapper[ans.Git]();
    }
  }
}

export function gen() {
  return execute('git status').then((val) => {
    console.log('val', val);
  });
}
