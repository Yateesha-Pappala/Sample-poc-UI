import { InjectionToken } from '@angular/core';

import { NavItem } from '../models/nav-item';

/** Everything the shell + auth pages need to brand and navigate the app. */
export interface AppConfig {
  /** Shown next to the logo and in the account menu context. */
  appName: string;
  /** Primary navigation shown in the shell header. */
  navItems: NavItem[];
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

/**
 * The template's default config. A project customises the app by editing this
 * one object (name + nav) — no component source changes needed.
 */
export const DEFAULT_APP_CONFIG: AppConfig = {
  // TODO(branding): your application name (shown next to the logo).
  appName: 'Sails Software',
  navItems: [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Data', route: '/data' },
    { label: 'Analytics', route: '/analytics', adminOnly: true },
    { label: 'Components', route: '/components' },
  ],
};
