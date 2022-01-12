import { git } from '../services/git';
import { odp } from '../services/odp';

export const serviceMapper = {
  Git: git,
  ODP: odp,
};
export function getService(service) {
  return serviceMapper[service];
}
