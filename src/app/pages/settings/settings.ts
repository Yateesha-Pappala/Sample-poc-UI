import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Theme } from '../../core/theme';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { SegmentedControl } from '../../shared/components/segmented-control/segmented-control';
import { ToggleSwitch } from '../../shared/components/toggle-switch/toggle-switch';

@Component({
  selector: 'app-settings',
  imports: [SegmentedControl, ConfirmDialog, ToggleSwitch],
  templateUrl: './settings.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  protected readonly theme = inject(Theme);

  protected readonly themeOptions = [
    { value: 'light' as const, label: 'Light' },
    { value: 'dark' as const, label: 'Dark' },
  ];

  protected readonly notifyProduct = signal(true);
  protected readonly notifyWeekly = signal(false);
  protected readonly notifyMentions = signal(true);

  protected readonly confirmDelete = signal(false);
}
