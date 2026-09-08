import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

export interface ComboboxOption {
  id: string | number;
  label: string;
  /** Muted text on the right of the row. */
  hint?: string;
  /** Small pill on the right of the row. */
  badge?: string;
  disabled?: boolean;
}

/**
 * Searchable single-select dropdown — type to filter, ↑/↓ to move, Enter to
 * pick, Esc to close. Full ARIA combobox/listbox semantics.
 *
 * ```html
 * <app-combobox
 *   [options]="versions()"
 *   placeholder="Select a version…"
 *   (selected)="onPick($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Combobox {
  readonly options = input.required<ComboboxOption[]>();
  readonly placeholder = input('Select or type…');

  readonly selected = output<ComboboxOption>();

  protected readonly hostEl = viewChild.required<ElementRef<HTMLElement>>('hostEl');

  protected readonly query = signal('');
  protected readonly open = signal(false);
  protected readonly highlightedIndex = signal(-1);

  protected readonly filtered = computed(() => {
    const term = this.query().trim().toLowerCase();
    const list = this.options();
    return term ? list.filter((option) => option.label.toLowerCase().includes(term)) : list;
  });

  constructor() {
    const onDocumentClick = (event: MouseEvent) => {
      if (this.open() && !this.hostEl().nativeElement.contains(event.target as Node)) {
        this.open.set(false);
      }
    };
    document.addEventListener('click', onDocumentClick, true);
    inject(DestroyRef).onDestroy(() =>
      document.removeEventListener('click', onDocumentClick, true),
    );
  }

  protected onFocus(): void {
    this.open.set(true);
    this.highlightedIndex.set(-1);
  }

  protected onInput(value: string): void {
    this.query.set(value);
    this.open.set(true);
    this.highlightedIndex.set(-1);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const list = this.filtered();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.open.set(true);
      this.highlightedIndex.set(Math.min(this.highlightedIndex() + 1, list.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex.set(Math.max(this.highlightedIndex() - 1, 0));
    } else if (event.key === 'Enter') {
      const option = list[this.highlightedIndex()];
      if (option && !option.disabled) {
        event.preventDefault();
        this.select(option);
      }
    } else if (event.key === 'Escape') {
      this.open.set(false);
    }
  }

  protected select(option: ComboboxOption): void {
    if (option.disabled) {
      return;
    }
    this.query.set(option.label);
    this.open.set(false);
    this.selected.emit(option);
  }
}
