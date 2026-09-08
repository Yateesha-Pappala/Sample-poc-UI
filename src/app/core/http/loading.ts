import { Injectable, computed, signal } from '@angular/core';

/**
 * Centralized in-flight-request counter. `loadingInterceptor` bumps it on every
 * outgoing HTTP request and drops it when the request settles, so `isLoading`
 * stays true until all concurrent requests have finished. `<app-loading-overlay>`
 * renders off this.
 */
@Injectable({ providedIn: 'root' })
export class Loading {
  private readonly activeRequests = signal(0);

  /** True while one or more HTTP requests are in flight. */
  readonly isLoading = computed(() => this.activeRequests() > 0);

  begin(): void {
    this.activeRequests.update((count) => count + 1);
  }

  done(): void {
    this.activeRequests.update((count) => Math.max(0, count - 1));
  }
}
