const EMPTY_VALUE = "-";
const MINUTES_IN_HOUR = 60;

export function formatMinutes(value: number | null): string {
  if (value === null || !Number.isFinite(value) || value < 0) {
    return EMPTY_VALUE;
  }

  const totalMinutes = Math.round(value);

  if (totalMinutes < MINUTES_IN_HOUR) return `${totalMinutes} min`;

  const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_HOUR;

  if (minutes === 0) return `${hours}h`;

  return `${hours}h ${String(minutes).padStart(2, "0")}min`;
}
