import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface FilterChip<T extends string = string> {
  value: T;
  label: string;
}

/**
 * A row of rounded filter chips where exactly one is active (e.g. date-range
 * presets). Two-way bindable on `value`.
 *
 * ```html
 * <app-filter-chips
 *   [chips]="[{value:'7d',label:'7 days'},{value:'30d',label:'30 days'}]"
 *   [(value)]="range"
 * />
 * ```
 */
@Component({
  selector: 'app-filter-chips',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-wrap items-center gap-2' },
  template: `
    @for (chip of chips(); track chip.value) {
      <button
        type="button"
        (click)="value.set(chip.value)"
        [attr.aria-pressed]="value() === chip.value"
        class="rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 dark:focus-visible:outline-brand-accent"
        [class]="
          value() === chip.value
            ? 'bg-brand-700 text-white dark:bg-brand-accent dark:text-brand-dark'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20'
        "
      >
        {{ chip.label }}
      </button>
    }
  `,
})
export class FilterChips<T extends string = string> {
  readonly chips = input.required<FilterChip<T>[]>();
  readonly value = model.required<T>();
}
