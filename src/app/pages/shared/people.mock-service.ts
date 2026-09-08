import { Injectable } from '@angular/core';

import { ApiResult } from '../../core/http/api-client';
import { PEOPLE, Page, Person, mockResult } from './mock';

export interface PeopleQuery {
  page: number;
  size: number;
  search?: string;
  status?: 'all' | Person['status'];
}

@Injectable({ providedIn: 'root' })
export class PeopleMockService {
  query(q: PeopleQuery): ApiResult<Page<Person>> {
    const term = q.search?.trim().toLowerCase() ?? '';
    const filtered = PEOPLE.filter((person) => {
      const matchesStatus = !q.status || q.status === 'all' || person.status === q.status;
      const matchesTerm =
        !term ||
        `${person.firstName} ${person.lastName}`.toLowerCase().includes(term) ||
        person.email.toLowerCase().includes(term) ||
        person.company.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });

    const start = q.page * q.size;
    return mockResult<Page<Person>>({
      content: filtered.slice(start, start + q.size),
      page: q.page,
      size: q.size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / q.size),
    });
  }
}
