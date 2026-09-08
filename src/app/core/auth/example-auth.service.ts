import { Injectable, computed, signal } from '@angular/core';

import { User } from '../../models/user';

const DEMO_USER: User = {
  id: 'demo-1',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@example.com',
  roles: ['USER', 'ADMIN'],
};

/**
 * Stand-in auth for the template. It holds a demo user in a signal and nothing
 * else — no tokens, no HTTP, no persistence. The example login page flips
 * `signIn()` / `signOut()` so the shell and the guard behave believably in the
 * running template.
 *
 * REPLACE THIS in a real project with your own auth (OTP, OIDC, session cookie,
 * …). Keep the signal surface — `currentUser`, `isAuthenticated`, `isAdmin` —
 * and the rest of the app (shell, guard) keeps working unchanged.
 */
@Injectable({ providedIn: 'root' })
export class ExampleAuthService {
  private readonly user = signal<User | null>(DEMO_USER);

  readonly currentUser = this.user.asReadonly();
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly isAdmin = computed(() => this.user()?.roles?.includes('ADMIN') ?? false);

  signIn(user: User = DEMO_USER): void {
    this.user.set(user);
  }

  signOut(): void {
    this.user.set(null);
  }
}
