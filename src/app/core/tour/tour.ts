import { Injectable, computed, signal } from '@angular/core';

import { TourStep } from './tour.models';

/**
 * Drives a guided product tour / coach-marks. Feed it a `TourStep[]` via
 * `start()`; `<app-tour-overlay>` (mounted once at the app root) renders the
 * spotlight + dialog and calls `next()` / `back()` / `skip()`.
 *
 * Callers decide *whether* a tour should run — e.g. only on a user's first
 * visit, gated on a flag you persist yourself.
 */
@Injectable({ providedIn: 'root' })
export class Tour {
  private readonly steps = signal<TourStep[]>([]);
  private readonly stepIndex = signal(-1);

  readonly active = computed(() => this.stepIndex() >= 0);
  readonly currentStep = computed<TourStep | null>(() => this.steps()[this.stepIndex()] ?? null);
  readonly stepNumber = computed(() => this.stepIndex() + 1);
  readonly totalSteps = computed(() => this.steps().length);
  readonly isLastStep = computed(() => this.stepNumber() === this.totalSteps());

  start(steps: TourStep[]): void {
    if (steps.length === 0) {
      return;
    }
    this.steps.set(steps);
    this.stepIndex.set(0);
  }

  next(): void {
    if (this.isLastStep()) {
      this.end();
      return;
    }
    this.stepIndex.update((index) => index + 1);
  }

  back(): void {
    if (this.stepIndex() > 0) {
      this.stepIndex.update((index) => index - 1);
    }
  }

  skip(): void {
    this.end();
  }

  private end(): void {
    this.stepIndex.set(-1);
    this.steps.set([]);
  }
}
