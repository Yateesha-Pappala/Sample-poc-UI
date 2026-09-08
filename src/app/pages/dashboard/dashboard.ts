import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ExampleAuthService } from '../../core/auth/example-auth.service';
import { ApiResult } from '../../core/http/api-client';
import { Tour } from '../../core/tour/tour';
import { TourStep } from '../../core/tour/tour.models';
import { CardGrid } from '../../shared/components/card-grid/card-grid';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { ResourceCard } from '../../shared/components/resource-card/resource-card';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { SegmentedControl } from '../../shared/components/segmented-control/segmented-control';
import { Resource } from '../shared/mock';
import { ResourceMockService } from '../shared/resource.mock-service';

const TOUR: TourStep[] = [
  {
    target: '#dash-toolbar',
    title: 'Find things fast',
    body: 'Search by name, or switch between a flat grid and a grouped view.',
  },
  {
    target: '#dash-grid',
    title: 'Your resources',
    body: 'Each card is one item. The filled button is its main action; “View details” opens the full page.',
  },
  {
    target: '#tour-section',
    title: 'That’s it',
    body: 'This tour is driven by the Tour service — see pages/dashboard/dashboard.ts for how the steps are defined.',
  },
];

const ICONS = ['document', 'user', 'clock', 'chart', 'grid', 'bolt'] as const;

@Component({
  selector: 'app-dashboard',
  imports: [CardGrid, ResourceCard, SearchInput, SegmentedControl, EmptyState, ErrorState],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly router = inject(Router);
  private readonly resources = inject(ResourceMockService);
  private readonly tour = inject(Tour);
  protected readonly auth = inject(ExampleAuthService);

  private readonly call = signal<ApiResult<Resource[]>>(this.resources.list());
  protected readonly loading = computed(() => this.call().loading());
  protected readonly error = computed(() =>
    this.call().error() ? 'Could not load resources.' : null,
  );
  private readonly all = computed(() => this.call().data() ?? []);

  protected readonly search = signal('');
  protected readonly view = signal<'all' | 'category'>('all');
  protected readonly viewOptions = [
    { value: 'all' as const, label: 'All' },
    { value: 'category' as const, label: 'By category' },
  ];

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const list = this.all().filter((r) => r.status !== 'archived');
    if (!term) {
      return list;
    }
    return list.filter(
      (r) => r.name.toLowerCase().includes(term) || r.description.toLowerCase().includes(term),
    );
  });

  protected readonly groups = computed(() => {
    const map = new Map<string, Resource[]>();
    for (const resource of this.filtered()) {
      const bucket = map.get(resource.category);
      if (bucket) {
        bucket.push(resource);
      } else {
        map.set(resource.category, [resource]);
      }
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, items]) => ({ category, items }));
  });

  protected iconFor(id: number): (typeof ICONS)[number] {
    return ICONS[id % ICONS.length];
  }

  protected open(resource: Resource): void {
    this.router.navigate(['/detail', resource.id]);
  }

  protected startTour(): void {
    this.tour.start(TOUR);
  }
}
