import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Icon, IconName } from '../icon/icon';

/**
 * A single KPI tile: icon chip, label, big value, sub-label. Drop several into a
 * `grid grid-cols-2 gap-3.5 lg:grid-cols-4`.
 *
 * ```html
 * <app-stat-tile icon="clock" label="Total time" value="12h 40m" sub="Last 30 days" />
 * ```
 */
@Component({
  selector: 'app-stat-tile',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'sui-card block px-4 py-3.5' },
  template: `
    <div
      class="flex size-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-accent/10 dark:text-brand-accent"
    >
      <app-icon [name]="icon()" [size]="16" />
    </div>
    <p class="mt-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400">{{ label() }}</p>
    <p class="mt-1 truncate text-2xl font-bold text-slate-900 dark:text-white">{{ value() }}</p>
    @if (sub(); as s) {
      <p class="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{{ s }}</p>
    }
  `,
})
export class StatTile {
  readonly icon = input.required<IconName>();
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly sub = input('');
}
