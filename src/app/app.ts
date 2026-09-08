import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Theme } from './core/theme';
import { LoadingOverlay } from './shared/components/loading-overlay/loading-overlay';
import { TourOverlay } from './shared/components/tour-overlay/tour-overlay';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingOverlay, TourOverlay],
  template: `
    <router-outlet />
    <app-loading-overlay />
    <app-tour-overlay />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Injected so the dark-mode class is applied at boot, before the first view renders.
  private readonly theme = inject(Theme);
}
