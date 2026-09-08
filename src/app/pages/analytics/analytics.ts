import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { formatDuration } from '../../core/utils/format-duration';
import { BarList } from '../../shared/components/bar-list/bar-list';
import { FilterChips } from '../../shared/components/filter-chips/filter-chips';
import { LineChart } from '../../shared/components/line-chart/line-chart';
import { StatTile } from '../../shared/components/stat-tile/stat-tile';
import { TabBar } from '../../shared/components/tab-bar/tab-bar';
import { RESOURCES, dailySeries } from '../shared/mock';

type RangeKey = '7' | '30' | '90';

@Component({
  selector: 'app-analytics',
  imports: [StatTile, TabBar, LineChart, BarList, FilterChips],
  templateUrl: './analytics.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Analytics {
  protected readonly formatDuration = formatDuration;

  protected readonly tab = signal<'overview' | 'breakdown'>('overview');
  protected readonly tabs = [
    { value: 'overview' as const, label: 'Overview' },
    { value: 'breakdown' as const, label: 'By resource' },
  ];

  protected readonly range = signal<RangeKey>('30');
  protected readonly rangeChips = [
    { value: '7' as const, label: '7 days' },
    { value: '30' as const, label: '30 days' },
    { value: '90' as const, label: '90 days' },
  ];

  protected readonly series = computed(() => dailySeries(Number(this.range())));
  protected readonly totalSeconds = computed(() =>
    this.series().reduce((sum, p) => sum + p.value, 0),
  );
  protected readonly peakDay = computed(() => {
    const points = this.series();
    return points.reduce((max, p) => (p.value > max.value ? p : max), points[0]);
  });

  protected readonly byResource = computed(() =>
    RESOURCES.filter((r) => r.status === 'active').map((r, i) => ({
      label: r.name,
      value: Math.round(2400 + Math.sin(i * 1.7) * 1500 + i * 900),
      valueLabel: formatDuration(Math.round(2400 + Math.sin(i * 1.7) * 1500 + i * 900)),
      sub: `${3 + ((i * 5) % 11)} people`,
    })),
  );
}
