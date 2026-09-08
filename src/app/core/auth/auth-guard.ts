import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ExampleAuthService } from './example-auth.service';

/** Redirects unauthenticated users to /login, preserving the attempted URL. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(ExampleAuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};

/** Further restricts a route to admins. Non-admins are sent to the dashboard. */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(ExampleAuthService);
  const router = inject(Router);
  return auth.isAdmin() ? true : router.createUrlTree(['/dashboard']);
};
