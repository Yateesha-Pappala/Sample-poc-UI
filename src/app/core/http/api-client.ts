import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

/**
 * The shape every data call in the app exposes: three signals a template can
 * read directly, instead of subscribing to an Observable.
 */
export interface ApiResult<T> {
  readonly data: Signal<T | null>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<HttpErrorResponse | null>;
}

/**
 * Thin signal-based wrapper around `HttpClient`. Convention for the whole app:
 * a service method returns `ApiResult<T>`, the component holds it in a signal
 * and derives view state with `computed()`.
 *
 * The example pages in this template use in-memory mock services that return the
 * same `ApiResult<T>` shape (see `pages/…/*.mock.ts`), so nothing here needs a
 * real backend to run.
 */
@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);

  get<T>(path: string, params?: Record<string, string | number | boolean>): ApiResult<T> {
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    return this.run<T>(this.http.get<T>(this.url(path), { params: httpParams }));
  }

  post<T>(path: string, body: unknown): ApiResult<T> {
    return this.run<T>(this.http.post<T>(this.url(path), body));
  }

  put<T>(path: string, body: unknown): ApiResult<T> {
    return this.run<T>(this.http.put<T>(this.url(path), body));
  }

  delete<T>(path: string): ApiResult<T> {
    return this.run<T>(this.http.delete<T>(this.url(path)));
  }

  private url(path: string): string {
    return `${environment.apiUrl}${path}`;
  }

  private run<T>(request: Observable<T>): ApiResult<T> {
    const data = signal<T | null>(null);
    const loading = signal(true);
    const error = signal<HttpErrorResponse | null>(null);

    request.subscribe({
      next: (response) => data.set(response),
      error: (err: unknown) => {
        error.set(err instanceof HttpErrorResponse ? err : null);
        loading.set(false);
      },
      complete: () => loading.set(false),
    });

    return { data: data.asReadonly(), loading: loading.asReadonly(), error: error.asReadonly() };
  }
}
