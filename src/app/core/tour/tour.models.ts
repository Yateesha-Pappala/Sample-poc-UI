export interface TourStep {
  /** CSS selector for the element this step points at. */
  target: string;
  title: string;
  body: string;
  /** Clicking the real target (not just the dialog's Next button) advances the tour too. */
  advanceOnClick?: boolean;
}
