import { Routes } from '@angular/router';

import { adminGuard, authGuard } from './core/auth/auth-guard';

/**
 * Route table for the template's example pages.
 *
 * - The authenticated area is nested under `AppShell` (header + tab nav).
 * - `login` / `register` render standalone with their own auth navbar.
 * - `detail/:id` renders standalone with a slim back-link header.
 *
 * Add your project's pages the same way. Keep feature routes lazy
 * (`loadComponent` / `loadChildren`).
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/app-shell/app-shell').then((m) => m.AppShell),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'data',
        loadComponent: () =>
          import('./pages/data-table-page/data-table-page').then((m) => m.DataTablePage),
      },
      {
        path: 'analytics',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/analytics/analytics').then((m) => m.Analytics),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
      },
      {
        path: 'components',
        loadComponent: () => import('./pages/style-guide/style-guide').then((m) => m.StyleGuide),
      },
    ],
  },

  {
    path: 'detail/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/detail/detail').then((m) => m.Detail),
  },

  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },

  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
