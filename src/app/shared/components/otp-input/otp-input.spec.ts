import { TestBed } from '@angular/core/testing';

import { OtpInput } from './otp-input';

function boxes(host: HTMLElement): HTMLInputElement[] {
  return Array.from(host.querySelectorAll('input'));
}

function type(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

describe('OtpInput', () => {
  function setup(length = 6) {
    const fixture = TestBed.createComponent(OtpInput);
    fixture.componentRef.setInput('length', length);
    fixture.detectChanges();
    return fixture;
  }

  it('renders one box per digit', () => {
    const fixture = setup(6);
    expect(boxes(fixture.nativeElement).length).toBe(6);
  });

  it('builds the value as digits are typed and emits completed on the last', () => {
    const fixture = setup(4);
    const completed: string[] = [];
    fixture.componentInstance.completed.subscribe((code) => completed.push(code));

    const inputs = boxes(fixture.nativeElement);
    type(inputs[0], '1');
    type(inputs[1], '2');
    type(inputs[2], '3');
    type(inputs[3], '4');

    expect(fixture.componentInstance.value()).toBe('1234');
    expect(completed).toEqual(['1234']);
  });

  it('spreads a pasted / autofilled multi-digit string across boxes', () => {
    const fixture = setup(6);
    const completed: string[] = [];
    fixture.componentInstance.completed.subscribe((code) => completed.push(code));

    type(boxes(fixture.nativeElement)[0], '482913');

    expect(fixture.componentInstance.value()).toBe('482913');
    expect(completed).toEqual(['482913']);
  });

  it('ignores non-numeric characters', () => {
    const fixture = setup(4);
    type(boxes(fixture.nativeElement)[0], 'a');
    expect(fixture.componentInstance.value()).toBe('');
  });

  it('reflects an external value reset in the rendered boxes', () => {
    const fixture = setup(4);
    type(boxes(fixture.nativeElement)[0], '1');
    expect(fixture.componentInstance.value()).toBe('1');

    fixture.componentRef.setInput('value', '');
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('');
    expect(fixture.componentInstance['digits']()).toEqual(['', '', '', '']);
  });
});
