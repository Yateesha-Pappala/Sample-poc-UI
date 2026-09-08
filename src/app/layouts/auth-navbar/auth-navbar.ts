import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_CONFIG } from '../../core/app-config';
import { Logo } from '../../shared/components/logo/logo';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';

/** Slim top bar for the auth screens (login / register): logo + theme toggle. */
@Component({
  selector: 'app-auth-navbar',
  imports: [RouterLink, Logo, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="border-b border-gray-200 bg-white dark:border-white/10 dark:bg-brand-dark-panel">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <a
          routerLink="/login"
          class="flex items-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 dark:focus-visible:outline-brand-accent"
        >
          <app-logo [name]="config.appName" />
        </a>
        <app-theme-toggle />
      </div>
    </header>
  `,
})
export class AuthNavbar {
  protected readonly config = inject(APP_CONFIG);
}
