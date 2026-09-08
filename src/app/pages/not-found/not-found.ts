import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthNavbar } from '../../layouts/auth-navbar/auth-navbar';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, AuthNavbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-screen flex-col bg-gray-100 dark:bg-brand-dark' },
  template: `
    <app-auth-navbar />
    <main class="flex flex-1 items-center justify-center p-6">
      <div class="text-center">
        <p
          class="text-sm font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-accent"
        >
          Error 404
        </p>
        <h1 class="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Page not found
        </h1>
        <p class="mx-auto mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <a routerLink="/dashboard" class="sui-btn sui-btn--primary mt-6 inline-flex"
          >Back to dashboard</a
        >
      </div>
    </main>
  `,
})
export class NotFound {}
