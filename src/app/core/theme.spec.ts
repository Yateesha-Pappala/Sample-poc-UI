import { TestBed } from '@angular/core/testing';

import { Theme } from './theme';

describe('Theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({});
  });

  it('defaults to light', () => {
    const theme = TestBed.inject(Theme);
    expect(theme.current()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles to dark: sets the html class and persists', () => {
    const theme = TestBed.inject(Theme);

    theme.toggle();
    TestBed.flushEffects();

    expect(theme.current()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('restores a stored preference on construction', () => {
    localStorage.setItem('theme', 'dark');

    const theme = TestBed.inject(Theme);
    TestBed.flushEffects();

    expect(theme.current()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
