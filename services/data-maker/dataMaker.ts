import { GO_BACK } from '../../helpers/constants';
import { dmBaseInquirer } from '../../helpers/inquirer';

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

export function dev() {
  console.log('i ams works ');
}
export function fiveEight() {
  console.log('i ams works ');
}
export function sit6() {
  console.log('i ams works ');
}
