import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

/**
 * An accessible on/off switch (ARIA `role="switch"`). Two-way bindable.
 *
 * ```html
 * <app-toggle-switch [(checked)]="notifications" label="Email notifications" />
 * ```
 */
@Component({
  selector: 'app-toggle-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  template: `
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="checked()"
      [attr.aria-label]="label() || null"
      [disabled]="disabled()"
      (click)="checked.set(!checked())"
      class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:outline-brand-accent"
      [class]="checked() ? 'bg-brand-700 dark:bg-brand-accent' : 'bg-gray-300 dark:bg-white/15'"
    >
      <span
        class="inline-block size-4 rounded-full bg-white shadow transition-transform"
        [class]="checked() ? 'translate-x-[18px]' : 'translate-x-0.5'"
      ></span>
    </button>
  `,
})
export class ToggleSwitch {
  readonly checked = model(false);
  readonly label = input('');
  readonly disabled = input(false);
}
