import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Theme } from '../../../core/theme';

/** Round icon button that flips light / dark mode. */
@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ThemeToggle {
  protected readonly theme = inject(Theme);
}
