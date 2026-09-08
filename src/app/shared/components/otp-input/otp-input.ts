import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  model,
  output,
  viewChildren,
} from '@angular/core';

/**
 * A row of single-character boxes for one-time codes. Handles auto-advance,
 * backspace-to-previous, and pasted / autofilled multi-digit codes.
 *
 * ```html
 * <app-otp-input [(value)]="code" [length]="6" [invalid]="!!error()" (completed)="verify($event)" />
 * ```
 * `value` is the joined string and the single source of truth; `completed` fires
 * once every box is filled. Set `value` back to `''` to clear.
 */
@Component({
  selector: 'app-otp-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-center gap-2">
      @for (digit of digits(); track $index) {
        <input
          #box
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="h-12 w-10 rounded-lg border border-gray-300 text-center text-lg font-semibold text-gray-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-100 aria-[invalid=true]:border-red-600 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-accent dark:focus:ring-brand-accent/20"
          [value]="digit"
          [attr.autocomplete]="$index === 0 ? 'one-time-code' : 'off'"
          [attr.aria-label]="'Digit ' + ($index + 1) + ' of ' + length()"
          [attr.aria-invalid]="invalid() ? true : null"
          (input)="onInput($event, $index)"
          (paste)="onPaste($event, $index)"
          (keydown)="onKeydown($event, $index)"
        />
      }
    </div>
  `,
})
export class OtpInput {
  readonly length = input(6);
  readonly value = model('');
  readonly invalid = input(false);
  readonly completed = output<string>();

  private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  protected readonly digits = computed(() => {
    const chars = this.value().slice(0, this.length()).split('');
    return Array.from({ length: this.length() }, (_, i) => chars[i] ?? '');
  });

  protected onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const typed = input.value.replace(/\D/g, '');

    if (typed.length > 1) {
      this.fillFrom(index, typed);
      return;
    }

    const digit = typed.slice(-1);
    if (digit !== input.value) {
      input.value = digit;
    }
    this.writeAt(index, digit);

    if (digit && index < this.length() - 1) {
      this.focusBox(index + 1);
    }
  }

  protected onPaste(event: ClipboardEvent, index: number): void {
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '') ?? '';
    if (!pasted) {
      return;
    }
    event.preventDefault();
    this.fillFrom(index, pasted);
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      this.focusBox(index - 1);
    }
  }

  private fillFrom(startIndex: number, digits: string): void {
    const chars = [...this.digits()];
    digits
      .slice(0, this.length() - startIndex)
      .split('')
      .forEach((digit, offset) => (chars[startIndex + offset] = digit));
    this.commit(chars);
    this.focusBox(Math.min(startIndex + digits.length, this.length()) - 1);
  }

  private writeAt(index: number, char: string): void {
    const chars = [...this.digits()];
    chars[index] = char;
    this.commit(chars);
  }

  private commit(chars: string[]): void {
    const joined = chars.join('').replace(/\s/g, '');
    this.value.set(joined);
    if (joined.length === this.length()) {
      this.completed.emit(joined);
    }
  }

  private focusBox(index: number): void {
    this.boxes()[index]?.nativeElement.focus();
  }
}
