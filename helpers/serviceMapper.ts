import { git } from '../services/git/git';
import { odp } from '../services/odp/odp';

export const serviceMapper = {
  ODP: odp,
  Git: git,
};
export function getService(service) {
  return serviceMapper[service];
}
