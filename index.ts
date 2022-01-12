import { EXIT } from './helpers/constants';
import { defaultInquirer } from './helpers/inquirer';
import { connectRedis } from './helpers/redis';
import { getService } from './helpers/serviceMapper';

const client: any = connectRedis();

client.then(async () => {
  for (;;) {
    console.log('\n ------------------- \n');
    const ans = await defaultInquirer();
    if (ans.service !== EXIT.value) {
      await getService(ans.service)();
    } else {
      process.exit(1);
    }
  }
});
