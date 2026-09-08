import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function readStoredTheme(): ThemeMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    // Storage can throw in private-mode / storage-blocked browsers.
    return 'light';
  }
}

/**
 * Class-based dark mode. `theme.css` defines the `dark` variant as
 * `&:where(.dark, .dark *)`, so this toggles `.dark` on `<html>`.
 *
 * Preference is stored only in `localStorage`. If your project has signed-in
 * users and wants the choice to follow them across devices, sync `mode` to your
 * user profile here — see the portal's own `core/theme.ts` for that pattern.
 */
@Injectable({ providedIn: 'root' })
export class Theme {
  private readonly mode = signal<ThemeMode>(readStoredTheme());

  readonly current = this.mode.asReadonly();

  constructor() {
    effect(() => {
      const mode = this.mode();
      document.documentElement.classList.toggle('dark', mode === 'dark');
      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // A non-persisted toggle still works for the session.
      }
    });
  }

  toggle(): void {
    this.mode.update((mode) => (mode === 'dark' ? 'light' : 'dark'));
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
  }
}
