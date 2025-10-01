import { CanActivateFn } from '@angular/router';

export const productosGuard: CanActivateFn = (route, state) => {
  return true;
};
