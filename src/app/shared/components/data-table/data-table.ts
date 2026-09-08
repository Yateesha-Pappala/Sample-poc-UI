import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  TemplateRef,
} from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';

/**
 * The table chrome from the portal's Customers screen, made generic: the
 * horizontal-scroll wrapper, the tinted uppercase header, `divide-y` rows, and
 * the loading / error / empty states. You supply the cells.
 *
 * ```html
 * <app-data-table [rows]="people()" [loading]="loading()" [error]="error()" [minWidth]="720">
 *   <ng-container header>
 *     <th class="px-4 py-3">Name</th>
 *     <th class="px-4 py-3">Role</th>
 *   </ng-container>
 *
 *   <ng-template #body let-person>
 *     <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">{{ person.name }}</td>
 *     <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ person.role }}</td>
 *   </ng-template>
 *
 *   <ng-container empty>No people match this filter.</ng-container>
 * </app-data-table>
 * ```
 *
 * Pagination is a separate concern — put `<app-pagination>` right after this.
 */
@Component({
  selector: 'app-data-table',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
      @if (loading()) {
        <p class="p-6 text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      } @else if (error()) {
        <p class="p-6 text-sm text-red-600" role="alert">{{ error() }}</p>
      } @else if (rows().length === 0) {
        <p class="p-6 text-sm text-gray-500 dark:text-gray-400">
          <ng-content select="[empty]">Nothing to show.</ng-content>
        </p>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm" [style.min-width.px]="minWidth() || null">
            <thead
              class="bg-gray-50 text-xs font-semibold uppercase text-gray-500 dark:bg-white/5 dark:text-gray-400"
            >
              <tr>
                <ng-content select="[header]" />
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-white/10">
              @for (row of rows(); track trackFn()(row); let i = $index) {
                <tr class="transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
                  <ng-container
                    [ngTemplateOutlet]="bodyTemplate() ?? null"
                    [ngTemplateOutletContext]="{ $implicit: row, index: i }"
                  />
                </tr>
              }
            </tbody>
          </table>
        </div>
        <ng-content select="[footer]" />
      }
    </div>
  `,
})
export class DataTable<T> {
  readonly rows = input.required<readonly T[]>();
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  /** Force a min table width so columns don't crush before the wrapper scrolls. */
  readonly minWidth = input<number | null>(null);
  /** Row identity for `@for` tracking. Defaults to identity. */
  readonly trackFn = input<(row: T) => unknown>((row) => row);

  protected readonly bodyTemplate =
    contentChild<TemplateRef<{ $implicit: T; index: number }>>('body');
}
