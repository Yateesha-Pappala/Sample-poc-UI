import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface LineChartPoint {
  /** X-axis label (already formatted, e.g. "Sep 3"). */
  label: string;
  value: number;
}

interface Coord {
  x: number;
  y: number;
  label: string;
  value: number;
}

const WIDTH = 600;
const HEIGHT = 180;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;
const PAD_TOP = 10;
const PAD_BOTTOM = 24;
const PLOT_WIDTH = WIDTH - PAD_LEFT - PAD_RIGHT;
const PLOT_HEIGHT = HEIGHT - PAD_TOP - PAD_BOTTOM;
const BASELINE_Y = PAD_TOP + PLOT_HEIGHT;
const TARGET_LABEL_COUNT = 6;

/**
 * Self-contained single-series line + area chart with a hover tooltip. Plain SVG,
 * no charting library. Line colour follows the `brand-700` token.
 *
 * ```html
 * <app-line-chart [points]="dailyPoints()" [valueFormat]="formatDuration" />
 * ```
 */
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChart {
  readonly points = input.required<LineChartPoint[]>();
  readonly valueFormat = input<(value: number) => string>((value) => String(value));
  readonly emptyMessage = input('No data in this range.');

  protected readonly width = WIDTH;
  protected readonly height = HEIGHT;
  protected readonly baselineY = BASELINE_Y;

  protected readonly hoverIndex = signal<number | null>(null);

  private readonly maxValue = computed(
    () => Math.max(...this.points().map((p) => p.value), 1) * 1.15,
  );

  private readonly step = computed(() => {
    const count = this.points().length;
    return count > 1 ? PLOT_WIDTH / (count - 1) : 0;
  });

  protected readonly coords = computed<Coord[]>(() =>
    this.points().map((p, i) => ({
      x: PAD_LEFT + i * this.step(),
      y: PAD_TOP + PLOT_HEIGHT - (p.value / this.maxValue()) * PLOT_HEIGHT,
      label: p.label,
      value: p.value,
    })),
  );

  protected readonly linePath = computed(() =>
    this.coords()
      .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
      .join(' '),
  );

  protected readonly areaPath = computed(() => {
    const coords = this.coords();
    if (coords.length === 0) {
      return '';
    }
    const first = coords[0];
    const last = coords[coords.length - 1];
    return `${this.linePath()} L${last.x.toFixed(1)},${BASELINE_Y} L${first.x.toFixed(1)},${BASELINE_Y} Z`;
  });

  protected readonly axisLabels = computed(() => {
    const coords = this.coords();
    if (coords.length === 0) {
      return [];
    }
    const stride = Math.max(1, Math.ceil(coords.length / TARGET_LABEL_COUNT));
    return coords.filter((_, i) => i % stride === 0 || i === coords.length - 1);
  });

  protected readonly hoverPoint = computed(() => {
    const index = this.hoverIndex();
    return index === null ? null : (this.coords()[index] ?? null);
  });

  protected onMouseMove(event: MouseEvent): void {
    const coords = this.coords();
    if (coords.length === 0) {
      return;
    }
    const svg = event.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) {
      return;
    }
    const x = ((event.clientX - rect.left) / rect.width) * WIDTH;
    const step = this.step();
    const rawIndex = step > 0 ? Math.round((x - PAD_LEFT) / step) : 0;
    this.hoverIndex.set(Math.max(0, Math.min(coords.length - 1, rawIndex)));
  }

  protected onMouseLeave(): void {
    this.hoverIndex.set(null);
  }
}
