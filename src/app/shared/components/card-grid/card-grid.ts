import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Responsive grid wrapper for cards — 1 / 2 / 4 columns, matching the portal's
 * dashboard. Project cards straight in.
 *
 * ```html
 * <app-card-grid>
 *   @for (item of items(); track item.id) {
 *     <app-resource-card ... />
 *   }
 * </app-card-grid>
 * ```
 */
@Component({
  selector: 'app-card-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid grid-cols-1 gap-5 sm:grid-cols-2',
    '[class.xl:grid-cols-4]': 'columns() === 4',
    '[class.xl:grid-cols-3]': 'columns() === 3',
  },
  template: `<ng-content />`,
})
export class CardGrid {
  readonly columns = input<3 | 4>(4);
}
