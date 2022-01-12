import { exec } from 'child_process';

export const execute = async (command, silent = true) => {
  return new Promise((resolve, reject) => {
    exec(command, (er, stdout, stderr) => {
      if (er || stderr) {
        reject(er || stderr);
      }
      if (!silent) console.log('stdout', stdout);
      resolve(stdout);
    });
  });
};
