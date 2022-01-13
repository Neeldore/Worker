import { EXIT } from './helpers/constants';
import { defaultInquirer } from './helpers/inquirer';
import { connectRedis } from './helpers/redis';
import { getService } from './helpers/serviceMapper';
import { assignToQa, changeStatus } from './services/odp/helpers/odphelper';

const client: any = connectRedis();

client.then(async () => {
  const commandMode = process.argv.length > 2;
  if (!commandMode) {
    for (;;) {
      console.log('\n ------------------- \n');
      const ans = await defaultInquirer();
      if (ans.service !== EXIT.value) {
        await getService(ans.service)();
      } else {
        process.exit(0);
      }
    }
  } else {
    if (process.argv[2] === 'readyForQA') {
      await assignToQa(process.argv[3]);
    }
    if (process.argv[2] === 'changeStatus') {
      await changeStatus(process.argv[3]);
    }
    process.exit(0);
  }
});

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
