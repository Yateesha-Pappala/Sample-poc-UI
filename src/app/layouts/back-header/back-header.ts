import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Icon } from '../../shared/components/icon/icon';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';

/**
 * Slim header for standalone pages that sit outside the shell (e.g. a detail
 * view): a back link on the left, theme toggle on the right.
 */
@Component({
  selector: 'app-back-header',
  imports: [RouterLink, Icon, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="border-b border-gray-200 bg-white dark:border-white/10 dark:bg-brand-dark-panel">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-3">
        <a
          [routerLink]="backLink()"
          class="flex items-center gap-1.5 rounded text-sm font-medium text-gray-500 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 dark:text-gray-400 dark:hover:text-brand-accent dark:focus-visible:outline-brand-accent"
        >
          <app-icon name="chevron-left" [size]="16" />
          {{ backLabel() }}
        </a>
        <app-theme-toggle />
      </div>
    </header>
  `,
})
export class BackHeader {
  readonly backLink = input<unknown[] | string>('/dashboard');
  readonly backLabel = input('Back');
}
