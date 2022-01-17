import {
  devPassword,
  devUsername,
  odpPassword,
  odpUsername,
} from '../../../creds';
import {
  DEV_CHECK,
  DEV_LOGIN,
  DEV_LOGIN_KEY,
  ODP_CHECK,
  ODP_LOGIN,
  ODP_LOGIN_KEY,
} from '../../../helpers/constants';
import { get, post, put } from '../../../helpers/http';
import { getKV, setKV } from '../../../helpers/redis';

//dev
export async function devLogin() {
  return await post(DEV_LOGIN, {
    username: devUsername,
    password: devPassword,
  }).then((resp: any) => {
    return resp.data.token;
  });
}

export async function isDevTokenValid(token) {
  return await get(DEV_CHECK + '/' + devUsername, {
    Authorization: token,
  }).then((resp) => resp.status === 200);
}

export async function devCheck() {
  let token = await getKV(DEV_LOGIN_KEY);
  if (token) {
    let tokenValid = await isDevTokenValid(token);
    if (tokenValid) {
      return token;
    } else {
      token = 'Bearer ' + (await devLogin());
      await setKV(DEV_LOGIN_KEY, token);
      return token;
    }
  } else {
    token = 'Bearer ' + (await devLogin());
    await setKV(DEV_LOGIN_KEY, token);
    return token;
  }
}

export async function devGet(url, params = {}, skipCheck = false) {
  const token = skipCheck ? await getKV(DEV_LOGIN_KEY) : await devCheck();
  return get(url, { Authorization: token }, params) as any;
}

export async function devPost(url, body, skipCheck = false) {
  const token = skipCheck ? await getKV(DEV_LOGIN_KEY) : await devCheck();
  return post(url, body, { Authorization: token }) as any;
}

export async function devPut(url, id, body, skipCheck = false) {
  const token = skipCheck ? await getKV(DEV_LOGIN_KEY) : await devCheck();
  return put(url, id, body, { Authorization: token }) as any;
}

//ODP
export async function ODPLogin() {
  return await post(ODP_LOGIN, {
    username: odpUsername,
    password: odpPassword,
  }).then((resp: any) => {
    return resp.data.token;
  });
}

export async function isODPTokenValid(token) {
  return await get(ODP_CHECK, {
    Authorization: token,
  }).then((resp) => resp.status === 200);
}

export async function ODPCheck() {
  let token = await getKV(ODP_LOGIN_KEY);
  if (token) {
    let tokenValid = await isODPTokenValid(token);
    if (tokenValid) {
      return token;
    } else {
      token = 'JWT ' + (await ODPLogin());
      await setKV(ODP_LOGIN_KEY, token);
      return token;
    }
  } else {
    token = 'JWT ' + (await ODPLogin());
    await setKV(ODP_LOGIN_KEY, token);
    return token;
  }
}

export async function odpGet(url, params = {}, skipCheck = false) {
  const token = skipCheck ? await getKV(ODP_LOGIN_KEY) : await ODPCheck();
  return get(url, { Authorization: token }, params) as any;
}

export async function odpPost(url, body, skipCheck = false) {
  const token = skipCheck ? await getKV(ODP_LOGIN_KEY) : await ODPCheck();
  return post(url, body, { Authorization: token }) as any;
}

export async function odpPut(url, id, body, skipCheck = false) {
  const token = skipCheck ? await getKV(ODP_LOGIN_KEY) : await ODPCheck();
  return put(url, id, body, { Authorization: token }) as any;
}
