import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { APP_CONFIG } from '../../core/app-config';
import { ExampleAuthService } from '../../core/auth/example-auth.service';
import { NavItem } from '../../models/nav-item';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { Icon } from '../../shared/components/icon/icon';
import { Logo } from '../../shared/components/logo/logo';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';

/**
 * The authenticated app frame: sticky header with the logo, a primary tab nav
 * (horizontal on `sm`+, a slide-down panel below), an account dropdown, and an
 * internally-scrolling content area. Used as a routed layout — child routes
 * render into its `<router-outlet>`.
 *
 * Branding + nav come from `APP_CONFIG`; the user comes from
 * `ExampleAuthService`. Swap those for your project's real providers and this
 * component is untouched.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ThemeToggle, ConfirmDialog, Icon, Logo],
  templateUrl: './app-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex h-screen flex-col overflow-hidden bg-gray-50 dark:bg-brand-dark' },
})
export class AppShell {
  private readonly router = inject(Router);
  protected readonly config = inject(APP_CONFIG);
  protected readonly auth = inject(ExampleAuthService);

  protected readonly showLogoutConfirm = signal(false);
  protected readonly userMenuOpen = signal(false);
  protected readonly mobileNavOpen = signal(false);

  private readonly userMenuTrigger = viewChild<ElementRef<HTMLButtonElement>>('userMenuTrigger');
  private readonly userMenuFirstItem =
    viewChild<ElementRef<HTMLButtonElement>>('userMenuFirstItem');
  private readonly mobileNavTrigger = viewChild<ElementRef<HTMLButtonElement>>('mobileNavTrigger');
  private readonly mobileNavFirstItem =
    viewChild<ElementRef<HTMLAnchorElement>>('mobileNavFirstItem');

  protected readonly navItems = computed<NavItem[]>(() =>
    this.config.navItems.filter((item) => !item.adminOnly || this.auth.isAdmin()),
  );

  protected readonly showMobileNavToggle = computed(() => this.navItems().length > 1);

  constructor() {
    effect(() => {
      if (this.userMenuOpen()) {
        this.userMenuFirstItem()?.nativeElement.focus();
      }
    });
    effect(() => {
      if (this.mobileNavOpen()) {
        this.mobileNavFirstItem()?.nativeElement.focus();
      }
    });
  }

  protected toggleUserMenu(): void {
    this.mobileNavOpen.set(false);
    this.userMenuOpen.update((open) => !open);
  }

  protected toggleMobileNav(): void {
    this.userMenuOpen.set(false);
    this.mobileNavOpen.update((open) => !open);
  }

  protected closeMobileNav(): void {
    if (!this.mobileNavOpen()) {
      return;
    }
    this.mobileNavOpen.set(false);
    this.mobileNavTrigger()?.nativeElement.focus();
  }

  protected closeUserMenu(): void {
    if (!this.userMenuOpen()) {
      return;
    }
    this.userMenuOpen.set(false);
    this.userMenuTrigger()?.nativeElement.focus();
  }

  protected onLogoutClick(): void {
    this.userMenuOpen.set(false);
    this.showLogoutConfirm.set(true);
  }

  protected onLogoutConfirmed(): void {
    this.showLogoutConfirm.set(false);
    this.auth.signOut();
    this.router.navigateByUrl('/login');
  }
}
