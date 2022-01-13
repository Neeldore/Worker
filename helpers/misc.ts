import { GO_BACK } from './constants';

export function _throw(m = 'Generic error') {
  throw new Error(m);
}

export function checkOrEscape(ans, prop) {
  return ans[prop] === GO_BACK.value ? _throw() : ans;
}
