import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginA } from '../services/login-a';

export const productosGuard: CanActivateFn = (route, state) => {
  const servicio = inject(LoginA);
  const router = inject(Router);

  if (servicio.logeado()) {
    return true;
  } else {
    // Redirigir al login si no está logueado
    router.navigate(['/login']);
    return false;
  }
};
