import inquirer from 'inquirer';
import { EXIT, GO_BACK } from './constants';
import { serviceMapper } from './serviceMapper';

inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

export const basicInquirer = (options: {
  type: any;
  name: any;
  message: any;
  choices: any;
}) => {
  return inquirer.prompt([options]);
};

export const defaultInquirer = () => {
  return basicInquirer({
    type: 'list',
    name: 'service',
    message: 'Select type',
    choices: [...Object.keys(serviceMapper), ...[EXIT]],
  });
};

export const easyInquirer = (
  choices,
  name,
  message = 'Make a selection',
  type = 'list'
) => {
  choices.push(GO_BACK);
  return basicInquirer({
    type,
    name,
    message,
    choices,
  });
};

export function autoCompleteInquirer(name, message, source) {
  return inquirer.prompt([
    {
      type: 'autocomplete',
      name,
      message,
      source,
    },
  ]);
}

export const odpBaseInquirer = () => {
  return basicInquirer({
    type: 'list',
    name: 'ODP',
    message: 'Select type',
    choices: [
      { name: 'Fetch my defects', value: 'FD' },
      { name: 'Fetch my stories', value: 'FS' },
      GO_BACK,
    ],
  });
};

export const odpDefectInquirer = () => {
  return basicInquirer({
    type: 'list',
    name: 'task',
    message: 'Select Task',
    choices: [
      { name: 'Assign to QA', value: 'ATQ' },
      { name: 'Change status', value: 'CS' },
      { name: 'Peek', value: 'P' },
      GO_BACK,
    ],
  });
};

export const odpStatusesInquirer = () => {
  return easyInquirer(
    ['Dev In Progress', 'Open', 'Cannot Reproduce'],
    'status'
  );
};
