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
import { Router, RouterLink } from '@angular/router';

import { ApiResult } from '../../core/http/api-client';
import { apiErrorMessage } from '../../core/http/api-error';
import { DataTable } from '../../shared/components/data-table/data-table';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { FormDialog } from '../../shared/components/form-dialog/form-dialog';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { EMPLOYEE_STATUSES, Employee, EmployeeStatus } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employees',
  imports: [ReactiveFormsModule, RouterLink, DataTable, ErrorState, FormDialog, SearchInput],
  templateUrl: './employees.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Employees {
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  /** `?fail=1` in the URL demonstrates the shared error state. Bound from the route. */
  readonly fail = input('');

  protected readonly statuses = EMPLOYEE_STATUSES;

  private readonly reloadKey = signal(0);
  private readonly failMode = computed(() => this.fail() === '1' || this.fail() === 'true');

  private readonly call = signal<ApiResult<Employee[]>>(this.employeeService.list());
  protected readonly loading = computed(() => this.call().loading());
  protected readonly error = computed(() => apiErrorMessage(this.call().error()));
  private readonly all = computed(() => this.call().data() ?? []);

  protected readonly search = signal('');
  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) {
      return this.all();
    }
    return this.all().filter((employee) =>
      [employee.name, employee.department, employee.role, employee.status].some((field) =>
        field.toLowerCase().includes(term),
      ),
    );
  });

  protected readonly selected = signal<Employee | null>(null);
  protected readonly addOpen = signal(false);

  protected readonly addForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    department: ['', Validators.required],
    role: ['', Validators.required],
    status: ['Active' as EmployeeStatus, Validators.required],
  });

  protected readonly trackById = (employee: Employee): number => employee.id;

  constructor() {
    effect(() => {
      this.reloadKey();
      this.call.set(this.employeeService.list({ fail: this.failMode() }));
    });
  }

  protected statusTone(status: EmployeeStatus): string {
    return status === 'Active' ? 'sui-badge--success' : 'sui-badge--warning';
  }

  protected reload(): void {
    if (this.failMode()) {
      // Drop the ?fail flag; the effect refetches when the input changes.
      void this.router.navigate(['/employees']);
      return;
    }
    this.reloadKey.update((key) => key + 1);
  }

  protected openAdd(): void {
    this.addForm.reset({ name: '', department: '', role: '', status: 'Active' });
    this.addOpen.set(true);
  }

  protected closeAdd(): void {
    this.addOpen.set(false);
  }

  protected submitAdd(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    this.employeeService.add(this.addForm.getRawValue());
    this.addOpen.set(false);
    this.reloadKey.update((key) => key + 1);
  }

  protected controlInvalid(name: 'name' | 'department' | 'role'): boolean {
    const control = this.addForm.controls[name];
    return control.invalid && control.touched;
  }
}
