import { formatDate, getRandomNumber } from '../../../helpers/misc';
import * as moment from 'moment-timezone';
export const getAccountsJSON = () => {
  const accNo = `NJTestACC${getRandomNumber()}`;
  return {
    _id: accNo,
    accountNumber: accNo,
    balances: {
      available: {
        amount: 1000000,
        currency: 'INR',
        indicator: 'Credit',
        lastUpdatedOn: null,
      },
      eod: {
        amount: 1000000,
        currency: 'INR',
        indicator: 'Credit',
        lastUpdatedOn: null,
      },
      ledger: {
        amount: 1000000,
        currency: 'INR',
        indicator: 'Credit',
        lastUpdatedOn: null,
      },
    },
    closedOn: null,
    currency: 'INR',
    country: 'IND',
    customerId: '123',
    extendedAttributes: {
      pan: null,
      numberDecimal: null,
      dropdown: null,
      date: null,
      aadharNo: '123132',
      vehicleNUmber: null,
      mothersMaidenName: '123',
    },
    name: 'ACC',
    openedOn: null,
    status: 'ACTIVE',
    helperNotes: {
      withdrawals: null,
      deposits: null,
      priorityShortfall: null,
      additional: null,
    },
    test1233: null,
    accountIdentifierKey: 'physical',
  };
};
export const getDealJSON = () => {
  const refId = 'REF' + new Date().getTime();
  const today = formatDate(new Date(), 'Asia/Kolkata');
  const dealName = `${getRandomNumber(10000, 1000)}-testdeal${getRandomNumber(
    10000,
    1000
  )}`;
  return {
    operation: 'POST',
    parentId: '',
    uniqueId: '',
    refId,
    dealId: '',
    section: 'BASIC',
    new: {
      name: dealName,
      shortName: dealName,
      businessSegmentId: 'BS1004',
      duration: {
        start: {
          tz: today,
          tzInfo: 'Asia/Kolkata',
          utc: null,
        },
        end: { tz: null, tzInfo: 'Asia/Kolkata', utc: null },
      },
      processingUnits: [
        'SPU1',
        'SPU3',
        'PU1002',
        'SPU4',
        'PU1000',
        'PU1001',
        'PU1004',
        'PU1005',
        'SPU2',
        'PU1012',
        'PU1011',
        'PU1013',
        'PU1014',
        'PU1009',
        'PU1010',
        'PU1015',
        'PU1003',
        'PU1006',
        'PU1008',
        'PU1007',
      ],
      purposes: [
        {
          name: 'Payment',
          templatePurposeId: '6112b2e7a4e60135652e28d0',
          _id: '6112b2e7a4e60135652e28d0',
        },
        {
          name: 'Retention',
          templatePurposeId: '6112b2e7a4e60147932e28d1',
          _id: '6112b2e7a4e60147932e28d1',
        },
      ],
      attributes: [
        {
          templateAttributeGroupId: '5fc0ae454c62540a054f4e67',
          attributes: [],
          groupName: 'Group 1',
        },
      ],
      contacts: [],
      refId,
      txnChecklist: [],
      dealChecklist: [],
      allowBeneficiaries: false,
      timezoneId: 'Asia/Kolkata',
      countryId: 'IND',
      templateId: 'T1007',
      userId: 'superadmin',
      userName: 'superadmin',
      executionPolicies: {
        grouping: false,
        dependencies: 'None',
        verifyBalances: 'Never',
        reattempt: 'Never',
        holidayAction: 'Execute',
        inactiveBehaviour: 'IgnoreExecutions',
        balanceConsideration: 'balances.available',
        reattemptIntervalMinutes: 60,
      },
    },
  };
};
