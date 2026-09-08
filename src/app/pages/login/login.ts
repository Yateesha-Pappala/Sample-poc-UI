import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ExampleAuthService } from '../../core/auth/example-auth.service';
import { AuthNavbar } from '../../layouts/auth-navbar/auth-navbar';
import { OtpInput } from '../../shared/components/otp-input/otp-input';

const RESEND_COOLDOWN_SECONDS = 30;

/**
 * Example email + one-time-code sign-in. It's wired to {@link ExampleAuthService}
 * (any 6-digit code works) so the flow runs end-to-end in the template. Replace
 * the service calls with your real auth API; keep the two-step shape or don't —
 * it's just an example.
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, AuthNavbar, OtpInput],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-screen flex-col bg-gray-100 dark:bg-brand-dark' },
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(ExampleAuthService);

  private readonly redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/dashboard';

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly submitted = signal(false);
  protected readonly codeSent = signal(false);
  protected readonly code = signal('');
  protected readonly codeError = signal('');
  protected readonly resendCooldown = signal(0);
  private cooldownTimer: ReturnType<typeof setInterval> | null = null;

  protected readonly emailError = computed(() => {
    if (!this.submitted()) {
      return '';
    }
    const control = this.form.controls.email;
    if (control.hasError('required')) {
      return 'Email is required.';
    }
    if (control.hasError('email')) {
      return 'Enter a valid email address.';
    }
    return '';
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearTimer());
  }

  protected sendCode(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      return;
    }
    this.codeSent.set(true);
    this.startCooldown();
  }

  protected verify(code: string): void {
    if (code.length !== 6) {
      this.codeError.set('Enter the 6-digit code.');
      return;
    }
    // Demo: accept any 6 digits.
    this.auth.signIn();
    this.router.navigateByUrl(this.redirect);
  }

  protected resend(): void {
    if (this.resendCooldown() > 0) {
      return;
    }
    this.code.set('');
    this.codeError.set('');
    this.startCooldown();
  }

  protected changeEmail(): void {
    this.codeSent.set(false);
    this.code.set('');
    this.codeError.set('');
    this.clearTimer();
    this.resendCooldown.set(0);
  }

  private startCooldown(): void {
    this.clearTimer();
    this.resendCooldown.set(RESEND_COOLDOWN_SECONDS);
    this.cooldownTimer = setInterval(() => {
      this.resendCooldown.update((s) => Math.max(0, s - 1));
      if (this.resendCooldown() === 0) {
        this.clearTimer();
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.cooldownTimer !== null) {
      clearInterval(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }
}
