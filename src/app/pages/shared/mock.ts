import { HttpErrorResponse } from '@angular/common/http';
import { Signal, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { ApiResult } from '../../core/http/api-client';

/**
 * Data-access helpers for feature pages that don't have a real backend yet.
 * Each returns the same `{ data, loading, error }` shape as `ApiClient`, so a
 * page is written exactly as it would be against HTTP — swap the mock service
 * for a real one and the page doesn't change.
 */
export function mockResult<T>(value: T, latencyMs = 400): ApiResult<T> {
  const data = signal<T | null>(null);
  const loading = signal(true);
  const error = signal(null);

  (of(value).pipe(delay(latencyMs)) as Observable<T>).subscribe({
    next: (v) => data.set(v),
    complete: () => loading.set(false),
  });

  return { data: data.asReadonly(), loading: loading.asReadonly(), error: error.asReadonly() };
}

/**
 * Like {@link mockResult}, but resolves to a failure: `loading` flips to `false`
 * after the latency and `error` is set to a synthetic `HttpErrorResponse`. Lets
 * a page exercise the shared error UI without a real backend.
 */
export function failedResult<T>(
  message = 'Something went wrong. Please try again.',
  latencyMs = 400,
): ApiResult<T> {
  const data = signal<T | null>(null);
  const loading = signal(true);
  const error = signal<HttpErrorResponse | null>(null);

  of(null)
    .pipe(delay(latencyMs))
    .subscribe(() => {
      error.set(
        new HttpErrorResponse({ status: 500, statusText: 'Server Error', error: { message } }),
      );
      loading.set(false);
    });

  return { data: data.asReadonly(), loading: loading.asReadonly(), error: error.asReadonly() };
}

/** A resolved result with no latency — handy for synchronous state. */
export function resolved<T>(value: T): ApiResult<T> {
  return {
    data: signal(value).asReadonly() as Signal<T | null>,
    loading: signal(false).asReadonly(),
    error: signal(null).asReadonly(),
  };
}
