import { ODP_CREATE_ACCOUNT, DEAL_BASIC } from '../../../helpers/constants';
import { ODPCheck, odpPost, devPost } from './credManager';
import { getAccountsJSON, getDealJSON } from './staticData';

export async function createAccount(n = 1) {
  const accountsArray = [];
  await ODPCheck();
  while (n--) {
    accountsArray.push(_createAccount());
  }
  await Promise.all(accountsArray).then((resp) => resp);
}

export function _createAccount(skipCheck = true) {
  return odpPost(ODP_CREATE_ACCOUNT, getAccountsJSON(), skipCheck)
    .then((resp) => {
      console.log('*** created account ***', resp.data._id);
      return resp.data;
    })
    .catch((e) => console.log('e', e));
}

export function createDeal() {
  const dealJson = getDealJSON();
  console.log('dealJson', JSON.stringify(dealJson));
  return devPost(DEAL_BASIC, dealJson)
    .then((resp) => {
      console.log('*** created deal ***', resp.data.refId);
      return resp.data;
    })
    .catch((e) => console.log('e', e));
}
