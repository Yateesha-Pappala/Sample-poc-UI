import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { Loading } from './loading';

/**
 * Drives the global loading overlay: counts every HTTP request while it's in
 * flight and releases it on completion or error. Purely observational — never
 * touches the request, response, or error.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(Loading);
  loading.begin();
  return next(req).pipe(finalize(() => loading.done()));
};
