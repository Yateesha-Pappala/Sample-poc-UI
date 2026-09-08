import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ExampleAuthService } from '../../core/auth/example-auth.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(ExampleAuthService);

  protected readonly saved = signal(false);
  protected readonly submitted = signal(false);

  private readonly user = this.auth.currentUser();

  protected readonly form = this.fb.nonNullable.group({
    firstName: [this.user?.firstName ?? '', Validators.required],
    lastName: [this.user?.lastName ?? '', Validators.required],
    email: [{ value: this.user?.email ?? '', disabled: true }],
    bio: [''],
  });

  protected save(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      return;
    }
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2500);
  }
}
