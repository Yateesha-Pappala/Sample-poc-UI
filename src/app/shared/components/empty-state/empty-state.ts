import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Icon, IconName } from '../icon/icon';

/**
 * The "nothing here yet" panel — a dashed-border card with an optional icon,
 * a title, a line of guidance, and a projected action slot.
 *
 * ```html
 * <app-empty-state icon="search" title="No results" message="Try a different search.">
 *   <button class="sui-btn sui-btn--ghost mt-4" (click)="clear()">Clear filters</button>
 * </app-empty-state>
 * ```
 * Projected content supplies its own top margin (`mt-4`).
 */
@Component({
  selector: 'app-empty-state',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rounded-xl border border-dashed border-gray-200 px-6 py-12 text-center dark:border-white/10"
    >
      @if (icon(); as name) {
        <div
          class="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-gray-500"
        >
          <app-icon [name]="name" [size]="20" />
        </div>
      }
      <p class="text-sm font-medium text-slate-700 dark:text-gray-200">{{ title() }}</p>
      @if (message(); as text) {
        <p class="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{{ text }}</p>
      }
      <ng-content />
    </div>
  `,
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly message = input('');
  readonly icon = input<IconName | ''>('');
}
