import { formatDate, getRandomNumber } from '../../../helpers/misc';
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

export const getDealAccountsJSON = (refId, dealId, accountNumber) => {
  return {
    operation: 'POST',
    parentId: '',
    uniqueId: '',
    refId,
    dealId,
    section: 'ACCOUNTS',
    new: {
      extendedAttributes: {
        aadharNo: {
          value: '123132',
          userEdited: false,
        },
        mothersMaidenName: {
          value: '123',
          userEdited: false,
        },
        pan: {
          value: '',
          userEdited: false,
        },
        numberDecimal: {
          value: '',
          userEdited: false,
        },
        dropdown: {
          value: '',
          userEdited: false,
        },
        date: {
          value: '',
          userEdited: false,
        },
        vehicleNUmber: {
          value: '',
          userEdited: false,
        },
      },
      currency: 'INR',
      country: 'IND',
      customerId: '123',
      name: 'ACC',
      status: 'ACTIVE',
      accountIdentifierKey: 'physical',
      accountNumber,
      closedOn: '',
      openedOn: '',
      helperNotes: {},
      __v: 0,
      showBtns: true,
      accountBalanceCheckFlag: true,
      dealTemplateId: 'T1007',
      dealId,
      refId,
    },
  };
};

export const getDealJSON = () => {
  const refId = 'REF' + new Date().getTime();
  const today = formatDate(new Date(), 'Asia/Kolkata');
  const dealName = `${getRandomNumber(10000, 1000)}-testdeal-${getRandomNumber(
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

export const getPartyJSON = (refId, dealId, processingUnits) => {
  const partyName = `SampleParty${getRandomNumber(10000, 1000)}`;
  return {
    operation: 'POST',
    parentId: '',
    uniqueId: '',
    refId,
    dealId,
    section: 'PARTIES',
    new: {
      name: partyName,
      customerId: partyName,
      responsibility: 'PR1001',
      internal: false,
      isNeutral: false,
      remarks: 'Sample Remark',
      eCommerceEnabled: false,
      participantId: null,
      attributes: [],
      dealId,
      refId,
      dealTemplateId: 'T1007',
      linkedFromMdm: false,
      processingUnits,
    },
  };
};

export const getPartyContactJSON = (parentId, refId, dealId, partyId) => {
  return {
    operation: 'POST',
    parentId,
    uniqueId: '',
    refId,
    dealId,
    section: 'PARTY_CONTACTS',
    new: {
      name: `Sample Party contact ${getRandomNumber(1000, 10)}`,
      email: 'abc@abc.com',
      mobileNumber: '',
      workPhone: '123456789',
      designation: 'Manager',
      address: {
        street: 'Street 1',
        country: 'India',
        state: 'Karnataka',
        town: 'Bangalore',
        pincode: '560100',
      },
      notifyForSubinstruction: null,
      authorizedSignatory: true,
      partyId,
      dealId,
      refId,
      linkedFromMdm: false,
    },
    partyId,
  };
};

export const getPartyAccountsJSON = (parentId, refId, dealId, partyId) => {
  return {
    operation: 'POST',
    parentId,
    uniqueId: '',
    refId,
    dealId,
    section: 'PARTY_ACCOUNTS',
    new: {
      paymentInstrumentId: 'UAEFTS',
      description: '',
      paymentDetails: {
        date: '',
        accountIban: 'IBAN',
        to: `${getRandomNumber(100000000, 1000000)}`,
        name: `Test party - ${getRandomNumber(100000000, 1000000)}`,
        beneficiaryAddressLine1: '',
        beneficiaryAddressLine2: '',
        beneficiaryCountry: 'IND',
        beneficiaryBankBic: 'ICICI123456',
        priority: '',
        purposeOfPayment: '',
        charges: '',
        beneficiaryCurrency: 'INR',
      },
      dealId,
      partyId,
      refId,
      linkedFromMdm: false,
    },
    partyId,
  };
};
