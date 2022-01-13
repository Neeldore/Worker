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
    const adhocFunctionMapper = {
      readyForQA: () => assignToQa(process.argv[3]),
      changeStatus: () => changeStatus(process.argv[3]),
    };

    await adhocFunctionMapper[process.argv[2]]();

    process.exit(0);
  }
});
