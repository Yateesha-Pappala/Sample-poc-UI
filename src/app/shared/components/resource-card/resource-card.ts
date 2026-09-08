import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Icon, IconName } from '../icon/icon';

/**
 * The catalog card from the portal's dashboard, generalised: hover-lift,
 * focus-within ring, an icon tile, title + description, an optional primary
 * action, and an optional "details" footer link. A `[badge]` slot sits top-left
 * and an `[actions]` slot top-right (e.g. edit / delete icon buttons).
 *
 * ```html
 * <app-resource-card
 *   icon="bolt"
 *   title="Contract Analyzer"
 *   description="Extracts key terms from uploaded contracts."
 *   primaryLabel="Open"
 *   [detailLink]="['/detail', item.id]"
 *   (primaryAction)="open(item)"
 * />
 * ```
 */
@Component({
  selector: 'app-resource-card',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="sui-card relative flex h-full flex-col p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus-within:border-brand-700 focus-within:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:hover:border-white/20 dark:hover:bg-brand-dark-panel-hover dark:focus-within:border-brand-accent"
      [class.opacity-60]="dimmed()"
    >
      <div class="mb-3 flex items-start justify-between gap-2 empty:hidden">
        <div><ng-content select="[badge]" /></div>
        <div class="flex items-center gap-1"><ng-content select="[actions]" /></div>
      </div>

      <div
        class="mb-4 inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-accent"
        aria-hidden="true"
      >
        @if (iconUrl(); as url) {
          <img [src]="url" alt="" class="size-full object-cover" />
        } @else {
          <app-icon [name]="icon()" [size]="22" />
        }
      </div>

      <h3 class="mb-1.5 text-base font-semibold text-slate-900 dark:text-white">{{ title() }}</h3>
      <p class="mb-5 flex-1 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
        {{ description() }}
      </p>

      @if (primaryLabel(); as label) {
        <button
          type="button"
          class="sui-btn sui-btn--primary sui-btn--block text-[13px]"
          (click)="primaryAction.emit()"
        >
          {{ label }}
        </button>
      }

      @if (detailLink(); as link) {
        <a
          [routerLink]="link"
          class="mt-3 inline-flex items-center justify-center gap-1 self-center rounded text-xs font-medium text-gray-500 hover:text-brand-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 dark:text-gray-400 dark:hover:text-brand-accent dark:focus-visible:outline-brand-accent"
        >
          {{ detailLabel() }}
          <span aria-hidden="true">→</span>
        </a>
      }
    </article>
  `,
})
export class ResourceCard {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly icon = input<IconName>('grid');
  readonly iconUrl = input('');
  readonly primaryLabel = input('');
  readonly detailLink = input<unknown[] | string | null>(null);
  readonly detailLabel = input('View details');
  readonly dimmed = input(false);

  readonly primaryAction = output<void>();
}
