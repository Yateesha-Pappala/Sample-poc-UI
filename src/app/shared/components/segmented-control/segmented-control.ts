import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
}

/**
 * A small bordered segmented toggle (e.g. "Combined | By category"). Two-way
 * bindable on `value`.
 *
 * ```html
 * <app-segmented-control
 *   [options]="[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]"
 *   [(value)]="view"
 * />
 * ```
 */
@Component({
  selector: 'app-segmented-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="inline-flex shrink-0 rounded-lg border border-gray-200 p-0.5 dark:border-white/10"
      role="tablist"
      [attr.aria-label]="ariaLabel()"
    >
      @for (option of options(); track option.value) {
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="value() === option.value"
          (click)="value.set(option.value)"
          class="rounded-md px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 dark:focus-visible:outline-brand-accent"
          [class]="
            value() === option.value
              ? 'bg-brand-700 text-white dark:bg-brand-accent dark:text-brand-dark'
              : 'text-gray-600 hover:text-brand-700 dark:text-gray-300 dark:hover:text-brand-accent'
          "
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
})
export class SegmentedControl<T extends string = string> {
  readonly options = input.required<SegmentedOption<T>[]>();
  readonly value = model.required<T>();
  readonly ariaLabel = input('View');
}
