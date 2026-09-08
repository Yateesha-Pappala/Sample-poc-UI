import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

import { lockBackgroundScroll, unlockBackgroundScroll } from '../../../core/scroll-lock';

/**
 * Modal shell on the native `<dialog>` + the `.sui-dialog` look: titled header
 * with a close button, a projected body, and a footer with Cancel + a primary
 * action. You own the form inside; this owns the chrome, focus, scroll-lock and
 * dismissal.
 *
 * ```html
 * @if (open()) {
 *   <app-form-dialog title="Edit item" [busy]="saving()" confirmLabel="Save"
 *                    (confirmed)="save()" (closed)="open.set(false)">
 *     <label class="sui-label" for="name">Name</label>
 *     <input id="name" class="sui-input" [formControl]="name" />
 *   </app-form-dialog>
 * }
 * ```
 */
@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDialog {
  readonly title = input.required<string>();
  readonly confirmLabel = input('Save');
  readonly cancelLabel = input('Cancel');
  readonly busy = input(false);
  /** Widen for larger forms, e.g. "w-[90vw] max-w-3xl". */
  readonly widthClass = input('w-full max-w-md');

  readonly confirmed = output<void>();
  readonly closed = output<void>();

  protected readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  private resolved = false;

  constructor() {
    effect(() => {
      this.dialog().nativeElement.showModal?.();
      lockBackgroundScroll();
    });
    inject(DestroyRef).onDestroy(() => unlockBackgroundScroll());
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.dialog().nativeElement.close?.();
    }
  }

  protected close(): void {
    this.dialog().nativeElement.close?.();
  }

  protected onSubmit(): void {
    this.resolved = true;
    this.confirmed.emit();
  }

  protected onDialogClose(): void {
    unlockBackgroundScroll();
    this.closed.emit();
    this.resolved = false;
  }
}
