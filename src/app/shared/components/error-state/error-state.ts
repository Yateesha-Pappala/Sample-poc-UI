import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Inline error panel for a failed load. Shows a message and, when `canRetry` is
 * set, a Try again button that emits `retry`.
 *
 * ```html
 * @if (error(); as message) {
 *   <app-error-state [message]="message" canRetry (retry)="reload()" />
 * }
 * ```
 */
@Component({
  selector: 'app-error-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/30 dark:bg-red-500/10"
      role="alert"
    >
      <p class="text-sm text-red-700 dark:text-red-400">{{ message() }}</p>
      @if (canRetry()) {
        <button
          type="button"
          (click)="retry.emit()"
          class="mt-2 text-sm font-semibold text-red-700 underline hover:text-red-800 dark:text-red-400"
        >
          Try again
        </button>
      }
    </div>
  `,
})
export class ErrorState {
  readonly message = input('Something went wrong. Please try again.');
  readonly canRetry = input(false);
  readonly retry = output<void>();
}
