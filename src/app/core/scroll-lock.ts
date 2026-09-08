/**
 * Locks / unlocks background scrolling while a modal is open.
 *
 * Prefers the app shell's internally-scrolling `<main>` (the document itself
 * doesn't scroll there); falls back to `<body>` for routes rendered outside the
 * shell. Uses an inline style so it always wins regardless of utility ordering.
 */
export function lockBackgroundScroll(): void {
  scrollContainer().style.overflow = 'hidden';
}

export function unlockBackgroundScroll(): void {
  scrollContainer().style.overflow = '';
}

function scrollContainer(): HTMLElement {
  return document.querySelector('main') ?? document.body;
}
