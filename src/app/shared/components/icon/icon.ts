import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Small stroked-line icon set, drawn from the icons used across the template.
 * All glyphs share one 24×24 stroke grid so they line up at any size.
 *
 * ```html
 * <app-icon name="search" [size]="16" />
 * <app-icon name="trash" class="text-red-600" />
 * ```
 *
 * Decorative by default (`aria-hidden`). Pass a `label` to expose it to
 * assistive tech (rare — usually the surrounding button carries the label).
 */
export type IconName =
  | 'menu'
  | 'close'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'search'
  | 'user'
  | 'logout'
  | 'sun'
  | 'moon'
  | 'edit'
  | 'trash'
  | 'eye'
  | 'eye-off'
  | 'restore'
  | 'clock'
  | 'bolt'
  | 'star'
  | 'grid'
  | 'plus'
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'check'
  | 'alert'
  | 'document'
  | 'lock'
  | 'settings'
  | 'chart';

const PATHS: Record<IconName, string> = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6 6 18',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-left': 'M15 6l-6 6 6 6',
  'chevron-right': 'M9 6l6 6-6 6',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-3.5-3.5',
  user: 'M12 4.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4ZM5 20c1.2-3.5 4-5.3 7-5.3s5.8 1.8 7 5.3',
  logout: 'M15 17l5-5-5-5M20 12H9M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3',
  sun: 'M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  'eye-off':
    'M3 3l18 18M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a13.2 13.2 0 0 1-3.1 4M6.6 6.6C3.9 8.3 2 12 2 12s3.5 7 10 7a10.4 10.4 0 0 0 4.4-.9M9.9 9.9a3 3 0 0 0 4.2 4.2',
  restore: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7v5l3 3',
  bolt: 'M13 3L4 14h6l-1 7 9-11h-6l1-7z',
  star: 'M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.5l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9z',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  plus: 'M12 5v14M5 12h14',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-up': 'M12 19V5M5 12l7-7 7 7',
  'arrow-down': 'M12 5v14M5 12l7 7 7-7',
  check: 'M5 13l4 4L19 7',
  alert: 'M12 3l9 16H3zM12 10v4M12 17h.01',
  document: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8ZM14 3v5h5M9 13h6M9 17h6',
  lock: 'M6 11V8a6 6 0 1 1 12 0v3M5 11h14v10H5zM12 15v3',
  settings:
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  chart: 'M4 4v16h16M8 16v-4M12 16V8M16 16v-6',
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.aria-hidden]="label() ? null : true"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() || null"
      focusable="false"
    >
      <path [attr.d]="d()" />
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
  readonly label = input('');

  protected readonly d = computed(() => PATHS[this.name()]);
}
