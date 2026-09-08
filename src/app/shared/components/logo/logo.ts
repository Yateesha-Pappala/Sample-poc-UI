import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A neutral placeholder mark plus the app name. The shapes are filled from
 * `--color-brand-accent` / `--color-brand-wave`, so the mark follows the palette
 * set in `styles/_branding.css`.
 *
 * Swap the `<svg>` for your own logo and keep the `<app-logo>` element — the
 * shell and auth navbar consume it.
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex items-center gap-2' },
  template: `
    <svg class="h-8 w-auto shrink-0" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="var(--color-brand-accent)" />
      <path
        d="M8 16V8l4 4 4-4v8"
        fill="none"
        stroke="var(--color-brand-wave)"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    @if (name(); as label) {
      <span class="text-[15px] font-bold text-slate-900 dark:text-white">{{ label }}</span>
    }
  `,
})
export class Logo {
  readonly name = input('');
}
