import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Loading } from '../../../core/http/loading';

/**
 * App-wide loading indicator: a centered spinner over a translucent scrim, shown
 * automatically whenever {@link Loading} reports in-flight HTTP requests. Mount
 * once at the app root.
 */
@Component({
  selector: 'app-loading-overlay',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    @if (loading.isLoading()) {
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/70 backdrop-blur-sm"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span
          class="size-10 animate-spin rounded-full border-4 border-white/15 border-t-brand-accent motion-reduce:animate-none"
        ></span>
        <span class="sr-only">Loading…</span>
      </div>
    }
  `,
})
export class LoadingOverlay {
  protected readonly loading = inject(Loading);
}
