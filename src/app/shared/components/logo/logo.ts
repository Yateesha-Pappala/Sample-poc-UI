import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The Sails Software mark (the same inline SVG the portal uses) plus the app
 * name. The three paths are filled from `--color-brand-accent` /
 * `--color-brand-wave`, so it follows a rebrand in `styles/_branding.css`.
 *
 * For a non-Sails project, swap the `<svg>` for your own logo and keep the
 * `<app-logo>` element — the shell and auth navbar consume it.
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex items-center gap-2' },
  template: `
    <svg class="h-8 w-auto shrink-0" viewBox="0 0 6061 6282" aria-hidden="true" focusable="false">
      <path
        d="M943.879 5583.94C2490.79 2338.57 1290.05 7.0901 1290.05 7.0901C1290.05 7.0901 3891.42 1460.56 3756.75 4452.58L3239.31 4800C2041.12 4881.35 1233.43 5345.09 943.879 5583.94Z"
        fill="var(--color-brand-accent)"
      />
      <path
        d="M3728.39 4367.5C3744.19 4317.87 4132.42 2552.44 2629.72 744.461C3437.78 992.614 5861.94 1956.87 5294.89 3722.3C5252.36 2006.5 3712.6 4417.13 3728.39 4367.5Z"
        fill="var(--color-brand-accent)"
      />
      <path
        d="M2934.52 4920.53C1727.05 5869.5 659.203 6140.03 0 6281.83C2062.67 6161.3 2842.37 5312.51 3692.95 4785.82C4834.15 4079.17 5521.71 3963.37 6060.41 3800.29C5372.86 3800.29 4522.27 3672.67 2934.52 4920.53Z"
        fill="var(--color-brand-wave)"
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
