import { basicInquirer } from '../helpers/inquirer';

export function git() {
  return basicInquirer({
    type: 'list',
    name: 'Git',
    message: 'Select type',
    choices: ['Create branch for story/defect', 'Create Named branch'],
  });
}

export function createBranch() {}
