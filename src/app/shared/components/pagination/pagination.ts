import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/**
 * Table footer pagination: "N items · page X of Y" with Previous / Next.
 * Zero-based `page`. Emits `pageChange` with the requested page.
 *
 * ```html
 * <app-pagination
 *   [page]="page()"
 *   [totalPages]="data.totalPages"
 *   [totalItems]="data.totalElements"
 *   itemNoun="customer"
 *   (pageChange)="page.set($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 text-sm text-gray-500 dark:border-white/10 dark:text-gray-400"
    >
      <span>
        {{ totalItems() }} {{ totalItems() === 1 ? itemNoun() : itemNoun() + 's' }}
        <span aria-hidden="true">·</span>
        page {{ page() + 1 }} of {{ displayTotalPages() }}
      </span>
      <div class="flex gap-2">
        <button
          type="button"
          (click)="pageChange.emit(page() - 1)"
          [disabled]="page() === 0"
          class="rounded-lg px-3 py-1.5 font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-white/10"
        >
          Previous
        </button>
        <button
          type="button"
          (click)="pageChange.emit(page() + 1)"
          [disabled]="page() + 1 >= totalPages()"
          class="rounded-lg px-3 py-1.5 font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-white/10"
        >
          Next
        </button>
      </div>
    </div>
  `,
})
export class Pagination {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly totalItems = input.required<number>();
  readonly itemNoun = input('item');

  readonly pageChange = output<number>();

  protected readonly displayTotalPages = computed(() => this.totalPages() || 1);
}
