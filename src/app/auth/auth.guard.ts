import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.currentUserValue;

  if (currentUser) {
    if (route.data['roles'] && route.data['roles'].indexOf(currentUser.role) === -1) {
      router.navigate(['/']);
      return false;
    }
    return true;
  }

  router.navigate(['/login']);
  return false;
};