const DATE_TIME_PARAM_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const toDateTimeParam = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const fromDateTimeParam = (value?: string): Date | undefined => {
  if (!value || !DATE_TIME_PARAM_PATTERN.test(value)) return undefined;

  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hours, minutes);

  const isRealDateTime =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hours &&
    date.getMinutes() === minutes;

  return isRealDateTime ? date : undefined;
};

export const toDayStart = (date?: Date): Date | undefined => {
  if (!date) return undefined;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
