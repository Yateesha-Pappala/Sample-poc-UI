import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiResult } from '../../core/http/api-client';
import { BackHeader } from '../../layouts/back-header/back-header';
import { Combobox, ComboboxOption } from '../../shared/components/combobox/combobox';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { FormDialog } from '../../shared/components/form-dialog/form-dialog';
import { Icon } from '../../shared/components/icon/icon';
import { RESOURCE_VERSIONS, Resource } from '../shared/mock';
import { ResourceMockService } from '../shared/resource.mock-service';

@Component({
  selector: 'app-detail',
  imports: [RouterLink, BackHeader, Combobox, ConfirmDialog, FormDialog, Icon, ReactiveFormsModule],
  templateUrl: './detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-h-screen bg-gray-50 dark:bg-brand-dark' },
})
export class Detail {
  /** From the `detail/:id` route param (withComponentInputBinding). */
  readonly id = input.required<string>();

  private readonly resources = inject(ResourceMockService);
  private readonly fb = inject(FormBuilder);

  private readonly call = signal<ApiResult<Resource | null> | null>(null);
  protected readonly loading = computed(() => this.call()?.loading() ?? true);
  protected readonly resource = computed(() => this.call()?.data() ?? null);

  protected readonly versions: ComboboxOption[] = RESOURCE_VERSIONS;
  protected readonly selectedVersion = signal<ComboboxOption | null>(null);

  protected readonly editOpen = signal(false);
  protected readonly confirmRollback = signal(false);
  protected readonly savedToast = signal('');

  protected readonly editForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const id = Number(this.id());
      this.call.set(this.resources.getById(Number.isNaN(id) ? -1 : id));
    });

    effect(() => {
      const resource = this.resource();
      if (resource) {
        this.editForm.setValue({ name: resource.name, description: resource.description });
      }
    });
  }

  protected openEdit(): void {
    const resource = this.resource();
    if (resource) {
      this.editForm.setValue({ name: resource.name, description: resource.description });
      this.editOpen.set(true);
    }
  }

  protected saveEdit(): void {
    if (this.editForm.invalid) {
      return;
    }
    this.editOpen.set(false);
    this.flash('Changes saved.');
  }

  protected rollback(): void {
    this.confirmRollback.set(false);
    this.flash(`Rolled back to ${this.selectedVersion()?.label}.`);
  }

  private flash(message: string): void {
    this.savedToast.set(message);
    setTimeout(() => this.savedToast.set(''), 2500);
  }
}
