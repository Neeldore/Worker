import { CLOUD_CHECK, CLOUD_LOGIN, CLOUD_LOGIN_KEY } from './constants';
import { cloudUsername, clouddPassword } from '../creds';
import { get, post } from './http';
import { getKV, setKV } from './redis';

//Cloud

export async function cloudLogin() {
  return await post(CLOUD_LOGIN, {
    username: cloudUsername,
    password: clouddPassword,
  }).then(async (resp: any) => {
    await setKV(CLOUD_LOGIN_KEY, 'JWT ' + resp.data.token);
    return resp.data.token;
  });
}

export async function cloudCheck() {
  return await getKV(CLOUD_LOGIN_KEY)
    .then(async (token) => {
      if (token) {
        console.log('Found token, validating .. ');
        return get(CLOUD_CHECK, {}).then(async (resp: any) => {
          if (resp.status === 401) {
            console.log('Token invalid, logging in again');
            return cloudLogin();
          }
          console.log('Token is valid ');
          return resp.data.token;
        });
      } else {
        console.log('token not found, logging in ');
        return cloudLogin();
      }
    })
    .then((token) => token);
}

export async function cloudGet(url, params = {}) {
  let getPromise;
  return await getKV(CLOUD_LOGIN_KEY)
    .then((token) => {
      getPromise = get(url, { Authorization: token }, params);
      return getPromise;
    })
    .then((response) => {
      if (response.status === 200) {
        return response;
      } else {
        return cloudCheck()
          .then(() => getPromise)
          .then((resp) => resp);
      }
    });
}
