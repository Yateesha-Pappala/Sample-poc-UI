/** Formats a duration in seconds as "2h 15m" / "15m" / "45s". */
export function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${Math.max(0, Math.round(totalSeconds))}s`;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  }
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}
