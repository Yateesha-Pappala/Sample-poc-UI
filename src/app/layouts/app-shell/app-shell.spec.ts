import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { APP_CONFIG, DEFAULT_APP_CONFIG } from '../../core/app-config';
import { ExampleAuthService } from '../../core/auth/example-auth.service';
import { AppShell } from './app-shell';

describe('AppShell', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: APP_CONFIG, useValue: DEFAULT_APP_CONFIG }],
    });
  });

  it('renders the configured app name and primary nav', () => {
    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(DEFAULT_APP_CONFIG.appName);
    expect(text).toContain('Dashboard');
  });

  it('hides admin-only nav items from non-admins', () => {
    const auth = TestBed.inject(ExampleAuthService);
    auth.signIn({ id: 'u', firstName: 'Sam', lastName: 'Lee', email: 's@e.com', roles: ['USER'] });

    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();

    const labels = fixture.componentInstance['navItems']().map((i) => i.label);
    expect(labels).toContain('Dashboard');
    expect(labels).not.toContain('Analytics');
  });

  it('signs out and routes to /login on confirmed logout', () => {
    const auth = TestBed.inject(ExampleAuthService);
    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();

    fixture.componentInstance['onLogoutConfirmed']();
    expect(auth.isAuthenticated()).toBe(false);
  });
});
