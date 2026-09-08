import { TestBed } from '@angular/core/testing';

import { Pagination } from './pagination';

describe('Pagination', () => {
  function make(page: number, totalPages: number, totalItems: number) {
    const fixture = TestBed.createComponent(Pagination);
    fixture.componentRef.setInput('page', page);
    fixture.componentRef.setInput('totalPages', totalPages);
    fixture.componentRef.setInput('totalItems', totalItems);
    fixture.componentRef.setInput('itemNoun', 'member');
    fixture.detectChanges();
    return fixture;
  }

  it('shows a human summary with 1-based page numbers', () => {
    const text = (make(0, 5, 47).nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('47 members');
    expect(text).toContain('page 1 of 5');
  });

  it('singularises the noun for a single item', () => {
    const text = (make(0, 1, 1).nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('1 member');
    expect(text).not.toContain('1 members');
  });

  it('disables Previous on the first page and Next on the last', () => {
    const first = make(0, 3, 30).nativeElement as HTMLElement;
    const [prev, next] = Array.from(first.querySelectorAll('button'));
    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    const last = make(2, 3, 30).nativeElement as HTMLElement;
    const [lprev, lnext] = Array.from(last.querySelectorAll('button'));
    expect(lprev.disabled).toBe(false);
    expect(lnext.disabled).toBe(true);
  });

  it('emits the target page on Previous / Next', () => {
    const fixture = make(1, 3, 30);
    const emitted: number[] = [];
    fixture.componentInstance.pageChange.subscribe((p) => emitted.push(p));

    const [prev, next] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    );
    prev.click();
    next.click();

    expect(emitted).toEqual([0, 2]);
  });
});
