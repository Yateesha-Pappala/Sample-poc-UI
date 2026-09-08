import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth-guard';

/**
 * Route table.
 *
 * - The authenticated area is nested under `AppShell` (header + tab nav).
 * - `login` / `register` render standalone with their own auth navbar.
 *
 * Add feature pages as lazy child routes of the shell
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
        path: 'employees',
        loadComponent: () => import('./pages/employees/employees').then((m) => m.Employees),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
      },
    ],
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
