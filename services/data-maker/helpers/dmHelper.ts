import {
  DEAL_ACCOUNTS,
  DEAL_BASIC,
  DEAL_PARTY_ACCOUNT,
  DEAL_PARTY_BASIC,
  DEAL_PARTY_CONTACT,
  ODP_CREATE_ACCOUNT,
} from '../../../helpers/constants';
import { devCheck, devPost, ODPCheck, odpPost } from './credManager';
import {
  getAccountsJSON,
  getDealAccountsJSON,
  getDealJSON,
  getPartyAccountsJSON,
  getPartyContactJSON,
  getPartyJSON,
} from './staticData';

const fnMapper = {
  createAndAddAccount: _createAndAddAccount,
  createParty: _createParty,
  createPartyContacts: _createPartyContacts,
  createPartyAccounts: _createPartyAccounts,
};

export function createDeal() {
  let dealData: any;

  return devPost(DEAL_BASIC, getDealJSON())
    .then((_dealData) => (dealData = _dealData.data))
    .then((resp) => console.log('*** created deal ***', resp.refId))
    .then(() => createEntity('createAndAddAccount', dealData))
    .then(() => createEntity('createParty', dealData))
    .catch((e) => console.log('e', e));
}

export async function createEntity(type, reqData, n = 2) {
  if (type === 'createAndAddAccount') {
    await ODPCheck();
  } else {
    await devCheck();
  }

  await Promise.all(
    Array(n)
      .fill(true)
      .map((_) => fnMapper[type](reqData))
  );
}

export async function createAccount(n = 1) {
  let skipCheck = false;

  if (n > 1) {
    ODPCheck();
    skipCheck = true;
  }
  return await Promise.all(
    Array(n)
      .fill(true)
      .map((_) => _createAccount(skipCheck))
  );
}

export function _createAccount(skipCheck = false) {
  return odpPost(ODP_CREATE_ACCOUNT, getAccountsJSON(), skipCheck).then(
    (resp) => {
      console.log('*** created account ***', resp.data._id);
      return resp.data;
    }
  );
}

export function _createAndAddAccount(dealData) {
  return _createAccount(true)
    .then((resp) => {
      return devPost(
        DEAL_ACCOUNTS,
        getDealAccountsJSON(dealData.refId, dealData.dealId, resp._id)
      );
    })
    .catch((e) => console.log('e', e));
}

export function _createParty(dealData, skipCheck = true) {
  let partyData: any = {};
  return devPost(
    DEAL_PARTY_BASIC,
    getPartyJSON(dealData.refId, dealData.dealId, dealData.new.processingUnits),
    skipCheck
  )
    .then((resp) => {
      console.log('*** created and added party ***');
      return resp.data;
    })
    .then((_partyData) => (partyData = _partyData))
    .then(() => createEntity('createPartyContacts', partyData))
    .then(() => createEntity('createPartyAccounts', partyData))
    .catch((e) => console.log('e', e));
}

export function _createPartyContacts(partyData, skipCheck = true) {
  return devPost(
    DEAL_PARTY_CONTACT,
    getPartyContactJSON(
      partyData.uniqueId,
      partyData.refId,
      partyData.dealId,
      partyData.partyId
    ),
    skipCheck
  )
    .then((resp) => {
      console.log('*** created and added party contact ***');
      return resp.data;
    })
    .catch((e) => console.log('e', e));
}

export function _createPartyAccounts(partyData, skipCheck = true) {
  return devPost(
    DEAL_PARTY_ACCOUNT,
    getPartyAccountsJSON(
      partyData.uniqueId,
      partyData.refId,
      partyData.dealId,
      partyData.partyId
    ),
    skipCheck
  )
    .then((resp) => {
      console.log('*** created and added party account ***');
      return resp.data;
    })
    .catch((e) => console.log('e', e));
}
