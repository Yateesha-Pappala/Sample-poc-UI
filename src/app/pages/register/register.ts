import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthNavbar } from '../../layouts/auth-navbar/auth-navbar';

const COUNTRIES = [
  'Australia',
  'Canada',
  'Germany',
  'India',
  'Singapore',
  'United Kingdom',
  'United States',
];

/** Example registration form — a two-column reactive form with inline validation. */
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, AuthNavbar],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-screen flex-col bg-gray-100 dark:bg-brand-dark' },
})
export class Register {
  private readonly fb = inject(FormBuilder);

  protected readonly countries = COUNTRIES;
  protected readonly submitted = signal(false);
  protected readonly done = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    company: ['', Validators.required],
    jobTitle: [''],
    country: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  private readonly messages: Record<string, string> = {
    firstName: 'First name is required.',
    lastName: 'Last name is required.',
    company: 'Company is required.',
    country: 'Select a country.',
    email: 'Enter a valid email address.',
  };

  protected errorFor(field: keyof typeof this.form.controls): string {
    if (!this.submitted()) {
      return '';
    }
    return this.form.controls[field].invalid
      ? (this.messages[field] ?? 'This field is required.')
      : '';
  }

  protected onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      return;
    }
    this.done.set(true);
  }
}
