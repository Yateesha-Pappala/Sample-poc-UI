import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { BarList } from '../../shared/components/bar-list/bar-list';
import { Combobox } from '../../shared/components/combobox/combobox';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { FilterChips } from '../../shared/components/filter-chips/filter-chips';
import { FormDialog } from '../../shared/components/form-dialog/form-dialog';
import { Icon, IconName } from '../../shared/components/icon/icon';
import { LineChart } from '../../shared/components/line-chart/line-chart';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { SegmentedControl } from '../../shared/components/segmented-control/segmented-control';
import { StatTile } from '../../shared/components/stat-tile/stat-tile';
import { TabBar } from '../../shared/components/tab-bar/tab-bar';
import { ToggleSwitch } from '../../shared/components/toggle-switch/toggle-switch';
import { dailySeries } from '../shared/mock';

@Component({
  selector: 'app-style-guide',
  imports: [
    Icon,
    SearchInput,
    SegmentedControl,
    FilterChips,
    TabBar,
    ToggleSwitch,
    StatTile,
    BarList,
    LineChart,
    Combobox,
    EmptyState,
    ErrorState,
    ConfirmDialog,
    FormDialog,
  ],
  templateUrl: './style-guide.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StyleGuide {
  protected readonly iconNames: IconName[] = [
    'menu',
    'close',
    'chevron-down',
    'chevron-left',
    'chevron-right',
    'search',
    'user',
    'logout',
    'sun',
    'moon',
    'edit',
    'trash',
    'eye',
    'eye-off',
    'restore',
    'clock',
    'bolt',
    'star',
    'grid',
    'plus',
    'arrow-right',
    'arrow-up',
    'arrow-down',
    'check',
    'alert',
    'document',
    'lock',
    'settings',
    'chart',
  ];

  protected readonly badges = ['neutral', 'brand', 'success', 'danger', 'warning', 'info'] as const;

  protected readonly search = signal('');
  protected readonly segment = signal<'grid' | 'list'>('grid');
  protected readonly segmentOptions = [
    { value: 'grid' as const, label: 'Grid' },
    { value: 'list' as const, label: 'List' },
  ];
  protected readonly chip = signal<'day' | 'week' | 'month'>('week');
  protected readonly chips = [
    { value: 'day' as const, label: 'Day' },
    { value: 'week' as const, label: 'Week' },
    { value: 'month' as const, label: 'Month' },
  ];
  protected readonly tab = signal<'one' | 'two' | 'three'>('one');
  protected readonly tabs = [
    { value: 'one' as const, label: 'Overview' },
    { value: 'two' as const, label: 'Activity', badge: 3 },
    { value: 'three' as const, label: 'Settings' },
  ];
  protected readonly switch1 = signal(true);
  protected readonly switch2 = signal(false);

  protected readonly comboOptions = [
    { id: 1, label: 'Option one' },
    { id: 2, label: 'Option two', badge: 'New' },
    { id: 3, label: 'Option three', hint: 'recommended' },
    { id: 4, label: 'Option four (disabled)', disabled: true },
  ];

  protected readonly series = dailySeries(30);

  protected readonly confirmOpen = signal(false);
  protected readonly dialogOpen = signal(false);
}
