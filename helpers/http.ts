import axios from 'axios';

function twirl() {
  const P = ['\\', '|', '/', '-'];
  let x = 0;
  return setInterval(() => {
    process.stdout.write(`\r${P[x++]}`);
    x %= P.length;
  }, 100);
}

export async function post(url, body, header = {}) {
  const loader = twirl();
  return await axios(url, {
    method: 'POST',
    headers: {
      ...header,
    },
    data: JSON.stringify(body),
  })
    .then((resp) => {
      return { status: resp.status, data: resp.data };
    })
    .catch((e) => {
      if (e.response.status !== 401) {
        console.error(JSON.stringify(e));
      }
      return { status: e.response.status };
    })
    .finally(() => {
      clearInterval(loader);
      process.stdout.write('\b');
    });
}

export async function get(url, header = {}, params = {}) {
  const loader = twirl();
  return await axios(url, {
    method: 'GET',
    headers: {
      ...header,
    },
    params,
  })
    .then((resp): { status: any; data: any } => {
      return { status: resp.status, data: resp.data };
    })
    .catch((e) => {
      if (e.response.status !== 401) {
        console.error(JSON.stringify(e));
      }
      return { status: e.response.status };
    })
    .finally(() => {
      clearInterval(loader);
      process.stdout.write('\b');
    });
}
