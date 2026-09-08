import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface BarListItem {
  label: string;
  value: number;
  /** Right-aligned formatted value. Falls back to `value`. */
  valueLabel?: string;
  /** Optional sub-line under the bar. */
  sub?: string;
}

/**
 * A ranked horizontal-bar list (label, value, track + fill). Bars scale to the
 * largest value in the set.
 *
 * ```html
 * <app-bar-list [items]="[{ label: 'Reports', value: 4200, valueLabel: '1h 10m' }]" />
 * ```
 */
@Component({
  selector: 'app-bar-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="space-y-3">
      @for (item of items(); track item.label) {
        <li class="sui-card rounded-lg px-5 py-4">
          <div class="flex items-baseline justify-between gap-4">
            <p class="font-semibold text-slate-900 dark:text-white">{{ item.label }}</p>
            <p class="shrink-0 text-sm font-bold text-brand-700 dark:text-brand-accent">
              {{ item.valueLabel ?? item.value }}
            </p>
          </div>
          <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-50 dark:bg-white/10">
            <div
              class="h-full rounded-full bg-brand-700 dark:bg-brand-accent"
              [style.width.%]="percent(item.value)"
            ></div>
          </div>
          @if (item.sub; as s) {
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ s }}</p>
          }
        </li>
      }
    </ul>
  `,
})
export class BarList {
  readonly items = input.required<BarListItem[]>();

  private readonly max = computed(() => Math.max(...this.items().map((i) => i.value), 1));

  protected percent(value: number): number {
    return Math.round((value / this.max()) * 100);
  }
}
