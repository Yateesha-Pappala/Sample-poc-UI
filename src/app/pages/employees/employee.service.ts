import { Injectable, signal } from '@angular/core';

import { ApiResult } from '../../core/http/api-client';
import { failedResult, mockResult } from '../shared/mock';
import { Employee, EmployeeDraft, EmployeeSummary, SEED_EMPLOYEES } from './employee';

/**
 * In-memory stand-in for a real `EmployeeApi`. Same method / return shape you'd
 * write against `ApiClient` — every call hands back an `ApiResult<T>` the page
 * holds in a signal. Swap this class for an HTTP-backed one and the pages don't
 * change.
 *
 * No backend: the list lives in a signal. `add()` mutates it; the next `list()`
 * call reflects the change.
 */
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly employees = signal<Employee[]>([...SEED_EMPLOYEES]);

  /** Pass `fail` to demonstrate the shared error state without a real backend. */
  list(options: { fail?: boolean } = {}): ApiResult<Employee[]> {
    return options.fail
      ? failedResult<Employee[]>('Could not load employees. Please try again.')
      : mockResult(this.employees());
  }

  getById(id: number): ApiResult<Employee | null> {
    return mockResult(this.employees().find((employee) => employee.id === id) ?? null);
  }

  summary(): ApiResult<EmployeeSummary> {
    return mockResult<EmployeeSummary>({
      total: 42,
      active: 36,
      onLeave: 6,
      departments: 5,
    });
  }

  add(draft: EmployeeDraft): Employee {
    const nextId = this.employees().reduce((max, employee) => Math.max(max, employee.id), 0) + 1;
    const created: Employee = { id: nextId, ...draft };
    this.employees.update((list) => [...list, created]);
    return created;
  }
}
