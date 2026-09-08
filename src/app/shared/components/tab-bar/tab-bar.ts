import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface Tab<T extends string = string> {
  value: T;
  label: string;
  /** Optional count badge shown after the label. */
  badge?: number;
}

/**
 * Page-section tab bar. Two looks:
 *  - `underline` (default): a row of tabs with an active underline.
 *  - `pill`: a segmented group on a tinted track.
 *
 * ```html
 * <app-tab-bar [tabs]="tabs" [(active)]="tab" variant="pill" ariaLabel="Sections" />
 * @switch (tab()) { @case ('overview') { … } }
 * ```
 */
@Component({
  selector: 'app-tab-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (variant() === 'pill') {
      <div
        class="inline-flex gap-1 rounded-lg bg-brand-50 p-1 dark:bg-white/10"
        role="tablist"
        [attr.aria-label]="ariaLabel()"
      >
        @for (tab of tabs(); track tab.value) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="active() === tab.value"
            (click)="active.set(tab.value)"
            class="flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 dark:focus-visible:outline-brand-accent"
            [class]="
              active() === tab.value
                ? 'bg-white text-slate-900 shadow-sm dark:bg-brand-dark-panel dark:text-white'
                : 'text-gray-600 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white'
            "
          >
            {{ tab.label }}
            @if (tab.badge) {
              <span
                class="inline-flex size-4 items-center justify-center rounded-full bg-brand-700 text-[10px] font-bold text-white dark:bg-brand-accent dark:text-brand-dark"
              >
                {{ tab.badge }}
              </span>
            }
          </button>
        }
      </div>
    } @else {
      <div
        class="flex gap-6 border-b border-gray-200 dark:border-white/10"
        role="tablist"
        [attr.aria-label]="ariaLabel()"
      >
        @for (tab of tabs(); track tab.value) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="active() === tab.value"
            (click)="active.set(tab.value)"
            class="flex items-center gap-1.5 border-b-2 pb-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700 dark:focus-visible:outline-brand-accent"
            [class]="
              active() === tab.value
                ? 'border-brand-700 text-brand-700 dark:border-brand-accent dark:text-brand-accent'
                : 'border-transparent text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
            "
          >
            {{ tab.label }}
            @if (tab.badge) {
              <span
                class="inline-flex min-w-[18px] items-center justify-center rounded-full bg-gray-100 px-1.5 text-[10px] font-bold text-gray-600 dark:bg-white/10 dark:text-gray-300"
              >
                {{ tab.badge }}
              </span>
            }
          </button>
        }
      </div>
    }
  `,
})
export class TabBar<T extends string = string> {
  readonly tabs = input.required<Tab<T>[]>();
  readonly active = model.required<T>();
  readonly variant = input<'underline' | 'pill'>('underline');
  readonly ariaLabel = input('Sections');
}
