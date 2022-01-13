import { git } from '../services/git/git';
import { odp } from '../services/odp/odp';

export const serviceMapper = {
  Git: git,
  ODP: odp,
};
export function getService(service) {
  return serviceMapper[service];
}
