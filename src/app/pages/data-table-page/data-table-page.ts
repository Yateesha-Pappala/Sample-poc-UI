import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import { ApiResult } from '../../core/http/api-client';
import { DataTable } from '../../shared/components/data-table/data-table';
import { FilterChips } from '../../shared/components/filter-chips/filter-chips';
import { Pagination } from '../../shared/components/pagination/pagination';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { Page, Person } from '../shared/mock';
import { PeopleMockService } from '../shared/people.mock-service';

const PAGE_SIZE = 10;

type StatusFilter = 'all' | Person['status'];

@Component({
  selector: 'app-data-table-page',
  imports: [DataTable, Pagination, FilterChips, SearchInput, DatePipe],
  templateUrl: './data-table-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTablePage {
  private readonly people = inject(PeopleMockService);

  protected readonly search = signal('');
  protected readonly status = signal<StatusFilter>('all');
  protected readonly page = signal(0);

  protected readonly statusChips = [
    { value: 'all' as const, label: 'All' },
    { value: 'ACTIVE' as const, label: 'Active' },
    { value: 'INVITED' as const, label: 'Invited' },
    { value: 'SUSPENDED' as const, label: 'Suspended' },
  ];

  private readonly call = signal<ApiResult<Page<Person>>>(this.load());
  protected readonly loading = computed(() => this.call().loading());
  protected readonly error = computed(() =>
    this.call().error() ? 'Could not load people.' : null,
  );
  protected readonly result = computed(() => this.call().data());
  protected readonly rows = computed(() => this.result()?.content ?? []);

  constructor() {
    // Reset to the first page whenever a filter changes.
    effect(() => {
      this.search();
      this.status();
      this.page.set(0);
    });
    // Refetch on any of page / search / status.
    effect(() => {
      this.call.set(
        this.people.query({
          page: this.page(),
          search: this.search(),
          status: this.status(),
          size: PAGE_SIZE,
        }),
      );
    });
  }

  private load(): ApiResult<Page<Person>> {
    return this.people.query({ page: 0, size: PAGE_SIZE });
  }

  protected readonly trackById = (person: Person): number => person.id;

  protected statusTone(status: Person['status']): string {
    return status === 'ACTIVE'
      ? 'sui-badge--success'
      : status === 'INVITED'
        ? 'sui-badge--info'
        : 'sui-badge--danger';
  }
}
