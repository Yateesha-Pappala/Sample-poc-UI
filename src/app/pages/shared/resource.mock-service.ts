import { Injectable } from '@angular/core';

import { ApiResult } from '../../core/http/api-client';
import { RESOURCES, Resource, mockResult } from './mock';

/**
 * Stand-in for a real `ResourceApi`. Same method/return shape you'd write
 * against `ApiClient` — swap this class out and the pages don't change.
 */
@Injectable({ providedIn: 'root' })
export class ResourceMockService {
  list(): ApiResult<Resource[]> {
    return mockResult(RESOURCES);
  }

  getById(id: number): ApiResult<Resource | null> {
    return mockResult(RESOURCES.find((r) => r.id === id) ?? null);
  }
}
