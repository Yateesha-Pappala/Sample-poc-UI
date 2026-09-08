import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { Icon } from '../icon/icon';

/**
 * Pill-shaped search field with a leading magnifier and a clear button.
 * Two-way bindable:
 *
 * ```html
 * <app-search-input [(value)]="query" placeholder="Search people…" />
 * ```
 */
@Component({
  selector: 'app-search-input',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <app-icon
        name="search"
        [size]="16"
        class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
      />
      <input
        type="search"
        [value]="value()"
        (input)="value.set($any($event.target).value)"
        [placeholder]="placeholder()"
        [attr.aria-label]="ariaLabel() || placeholder()"
        class="sui-input sui-input--search pr-9 pl-9 [&::-webkit-search-cancel-button]:appearance-none"
      />
      @if (value()) {
        <button
          type="button"
          (click)="value.set('')"
          aria-label="Clear search"
          class="absolute top-1/2 right-2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 dark:hover:bg-white/10 dark:hover:text-gray-200 dark:focus-visible:outline-brand-accent"
        >
          <app-icon name="close" [size]="14" />
        </button>
      }
    </div>
  `,
})
export class SearchInput {
  readonly value = model('');
  readonly placeholder = input('Search…');
  readonly ariaLabel = input('');
}
