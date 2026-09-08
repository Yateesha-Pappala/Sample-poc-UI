import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { Tour } from '../../../core/tour/tour';

interface TourRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/** How long to keep retrying for a step's target before giving up and skipping it. */
const FIND_TARGET_RETRY_MS = 100;
const FIND_TARGET_MAX_ATTEMPTS = 10;

/**
 * Renders the active {@link Tour}: a spotlight cut-out over the step's target
 * element, a positioned coach-mark dialog, keyboard focus-trapping, and
 * cross-route hand-off for `advanceOnClick` steps. Mount once at the app root.
 */
@Component({
  selector: 'app-tour-overlay',
  templateUrl: './tour-overlay.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class TourOverlay {
  protected readonly tour = inject(Tour);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  private lastStepNumber = 0;

  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');

  protected readonly targetRect = signal<TourRect | null>(null);

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    ),
  );

  protected readonly showNextButton = computed(() => {
    const step = this.tour.currentStep();
    return !(step?.advanceOnClick && !this.tour.isLastStep());
  });

  protected readonly stepIndices = computed(() =>
    Array.from({ length: this.tour.totalSteps() }, (_, i) => i),
  );

  protected dotClass(index: number): string {
    const current = this.tour.stepNumber() - 1;
    if (index === current) {
      return 'h-1.5 w-4 rounded-full bg-brand-accent';
    }
    return index < current
      ? 'h-1.5 w-1.5 rounded-full bg-brand-accent'
      : 'h-1.5 w-1.5 rounded-full bg-white/25';
  }

  protected readonly cardStyle = computed(() => {
    const rect = this.targetRect();
    if (!rect) {
      return null;
    }
    const cardWidth = 360;
    const margin = 16;
    const left = Math.min(
      Math.max(rect.left + rect.width / 2 - cardWidth / 2, margin),
      window.innerWidth - cardWidth - margin,
    );
    const placeAbove = window.innerHeight - rect.bottom < 240;
    return {
      left,
      top: placeAbove ? null : rect.bottom + 18,
      bottom: placeAbove ? window.innerHeight - rect.top + 18 : null,
    };
  });

  protected readonly backdropPanels = computed(() => {
    const rect = this.targetRect();
    if (!rect) {
      return null;
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return {
      top: { top: 0, left: 0, width: vw, height: Math.max(rect.top, 0) },
      bottom: { top: rect.bottom, left: 0, width: vw, height: Math.max(vh - rect.bottom, 0) },
      left: { top: rect.top, left: 0, width: Math.max(rect.left, 0), height: rect.height },
      right: {
        top: rect.top,
        left: rect.right,
        width: Math.max(vw - rect.right, 0),
        height: rect.height,
      },
    };
  });

  constructor() {
    effect((onCleanup) => {
      const step = this.tour.currentStep();
      const stepNumber = this.tour.stepNumber();
      const movingBackward = stepNumber > 0 && stepNumber < this.lastStepNumber;
      this.lastStepNumber = stepNumber;
      this.navigationEnd(); // re-run after every completed navigation

      if (!step) {
        this.targetRect.set(null);
        return;
      }

      let cancelled = false;
      let attempts = 0;
      let retryId: ReturnType<typeof setTimeout> | undefined;
      let attachedElement: Element | null = null;
      let onAdvanceClick: ((event: Event) => void) | null = null;

      const update = () => {
        if (attachedElement) {
          this.targetRect.set(attachedElement.getBoundingClientRect());
        }
      };

      const attach = (element: Element) => {
        attachedElement = element;
        element.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
        update();
        this.dialog()?.nativeElement.focus();

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);

        if (step.advanceOnClick) {
          onAdvanceClick = (rawEvent) => {
            const event = rawEvent as MouseEvent;
            if (
              event.button !== 0 ||
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey ||
              event.altKey
            ) {
              return;
            }
            this.tour.next();
          };
          element.addEventListener('click', onAdvanceClick);
        }
      };

      const tryFind = () => {
        if (cancelled) {
          return;
        }
        const element = document.querySelector(step.target);
        if (element) {
          attach(element);
          return;
        }
        if (attempts++ < FIND_TARGET_MAX_ATTEMPTS) {
          retryId = setTimeout(tryFind, FIND_TARGET_RETRY_MS);
        } else if (movingBackward) {
          this.targetRect.set(null);
          this.location.back();
        } else {
          this.targetRect.set(null);
          this.tour.next();
        }
      };

      tryFind();

      onCleanup(() => {
        cancelled = true;
        clearTimeout(retryId);
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
        if (attachedElement && onAdvanceClick) {
          attachedElement.removeEventListener('click', onAdvanceClick);
        }
      });
    });

    effect(() => {
      if (this.tour.currentStep()) {
        this.dialog()?.nativeElement.focus();
      }
    });

    effect((onCleanup) => {
      if (!this.tour.active()) {
        return;
      }
      document.addEventListener('keydown', this.onGlobalKeydown);
      onCleanup(() => document.removeEventListener('keydown', this.onGlobalKeydown));
    });
  }

  private readonly onGlobalKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.tour.skip();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }

    const dialogEl = this.dialog()?.nativeElement;
    if (!dialogEl) {
      return;
    }

    const step = this.tour.currentStep();
    const targetEl = step ? document.querySelector<HTMLElement>(step.target) : null;
    const focusableTarget = targetEl && targetEl.tabIndex >= 0 ? targetEl : null;

    const loop: HTMLElement[] = [
      ...(focusableTarget ? [focusableTarget] : []),
      ...Array.from(dialogEl.querySelectorAll<HTMLElement>('button')),
    ];
    if (loop.length === 0) {
      return;
    }

    const activeEl = document.activeElement as HTMLElement | null;
    let activeIndex = loop.indexOf(activeEl as HTMLElement);

    if (activeIndex === -1) {
      if (activeEl !== dialogEl) {
        return;
      }
      activeIndex = event.shiftKey ? 0 : -1;
    }

    event.preventDefault();
    const nextIndex = event.shiftKey
      ? (activeIndex - 1 + loop.length) % loop.length
      : (activeIndex + 1) % loop.length;
    loop[nextIndex].focus();
  };
}
