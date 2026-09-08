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
 * Generic replacement for the browser's `confirm()` — a yes/no gate before a
 * destructive or consequential action. Built on the native `<dialog>` element
 * with focus management and background-scroll lock.
 *
 * ```html
 * @if (pendingDelete()) {
 *   <app-confirm-dialog
 *     message="Delete this item? This cannot be undone."
 *     confirmLabel="Delete"
 *     tone="danger"
 *     (confirmed)="doDelete()"
 *     (cancelled)="pendingDelete.set(false)"
 *   />
 * }
 * ```
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  readonly message = input.required<string>();
  readonly confirmLabel = input('OK');
  readonly cancelLabel = input('Cancel');
  readonly tone = input<'default' | 'danger'>('default');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');
  protected readonly cancelButton = viewChild<ElementRef<HTMLButtonElement>>('cancelButtonEl');

  private resolved = false;

  constructor() {
    effect(() => {
      this.dialog().nativeElement.showModal?.();
      lockBackgroundScroll();
      this.cancelButton()?.nativeElement.focus();
    });

    inject(DestroyRef).onDestroy(() => unlockBackgroundScroll());
  }

  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.dialog().nativeElement.close?.();
    }
  }

  protected onCancel(): void {
    this.dialog().nativeElement.close?.();
  }

  protected onConfirm(): void {
    this.resolved = true;
    this.confirmed.emit();
    this.dialog().nativeElement.close?.();
  }

  protected onDialogClose(): void {
    unlockBackgroundScroll();
    if (!this.resolved) {
      this.cancelled.emit();
    }
  }
}
