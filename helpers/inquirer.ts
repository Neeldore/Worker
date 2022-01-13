import inquirer from 'inquirer';
import { EXIT, GO_BACK } from './constants';
import { serviceMapper } from './serviceMapper';

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
  return basicInquirer({
    type,
    name,
    message,
    choices,
  });
};

export const odpBaseInquirer = () => {
  return basicInquirer({
    type: 'list',
    name: 'ODP',
    message: 'Select type',
    choices: [
      { name: 'Fetch my defects', value: 'FD' },
      { name: 'Fetch my stories', value: 'FS' },
      GO_BACK,
      EXIT,
    ],
  });
};

export const odpDefectInquirer = () => {
  return basicInquirer({
    type: 'list',
    name: 'task',
    message: 'Select Task',
    choices: [
      { name: 'Change status', value: 'CS' },
      { name: 'Peek', value: 'P' },
      { name: 'Assign to QA', value: 'ATQ' },
      GO_BACK,
      EXIT,
    ],
  });
};

export const odpStatusesInquirer = () => {
  return easyInquirer(
    ['Dev In Progress', 'Open', 'Cannot Reproduce'],
    'status'
  );
};