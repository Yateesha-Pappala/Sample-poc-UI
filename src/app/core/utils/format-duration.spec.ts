import { formatDuration } from './format-duration';

describe('formatDuration', () => {
  it('renders sub-minute durations in seconds', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(45)).toBe('45s');
  });

  it('renders sub-hour durations in whole minutes', () => {
    expect(formatDuration(60)).toBe('1m');
    expect(formatDuration(3599)).toBe('59m');
  });

  it('renders hours, omitting a zero minutes part', () => {
    expect(formatDuration(3600)).toBe('1h');
    expect(formatDuration(8100)).toBe('2h 15m');
  });
});
