import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import { ExampleAuthService } from '../../core/auth/example-auth.service';
import { ApiResult } from '../../core/http/api-client';
import { apiErrorMessage } from '../../core/http/api-error';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { IconName } from '../../shared/components/icon/icon';
import { StatTile } from '../../shared/components/stat-tile/stat-tile';
import { EmployeeSummary } from '../employees/employee';
import { EmployeeService } from '../employees/employee.service';

interface DashboardTile {
  icon: IconName;
  label: string;
  value: number;
  sub: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [StatTile, ErrorState],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly employees = inject(EmployeeService);
  protected readonly auth = inject(ExampleAuthService);

  private readonly reloadKey = signal(0);
  private readonly call = signal<ApiResult<EmployeeSummary>>(this.employees.summary());

  protected readonly loading = computed(() => this.call().loading());
  protected readonly error = computed(() => apiErrorMessage(this.call().error()));

  protected readonly tiles = computed<DashboardTile[]>(() => {
    const summary = this.call().data();
    if (!summary) {
      return [];
    }
    return [
      { icon: 'user', label: 'Total Employees', value: summary.total, sub: 'Across all teams' },
      { icon: 'check', label: 'Active Employees', value: summary.active, sub: 'Currently working' },
      { icon: 'clock', label: 'On Leave', value: summary.onLeave, sub: 'Away today' },
      { icon: 'grid', label: 'Departments', value: summary.departments, sub: 'Org-wide' },
    ];
  });

  constructor() {
    effect(() => {
      this.reloadKey();
      this.call.set(this.employees.summary());
    });
  }

  protected reload(): void {
    this.reloadKey.update((key) => key + 1);
  }
}
