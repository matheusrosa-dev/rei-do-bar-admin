export type DatePresetId =
  | "last-10-hours"
  | "last-7-days"
  | "last-30-days"
  | "last-month";

export type DatePresetRange = {
  startDate: Date;
  endDate?: Date;
};

export type DatePreset = {
  id: DatePresetId;
  label: string;
  toRange: (now: Date) => DatePresetRange;
};

export const DEFAULT_DATE_PRESET_ID: DatePresetId = "last-10-hours";

const hoursBefore = (now: Date, hours: number): Date => {
  const date = new Date(now);
  date.setHours(date.getHours() - hours);

  return date;
};

const daysBeforeAtDayStart = (now: Date, days: number): Date =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);

const toLastMonthRange = (now: Date): DatePresetRange => ({
  startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
  endDate: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59),
});

export const DATE_PRESETS: DatePreset[] = [
  {
    id: "last-10-hours",
    label: "Últimas 10 horas",
    toRange: (now) => ({ startDate: hoursBefore(now, 10) }),
  },
  {
    id: "last-7-days",
    label: "Últimos 7 dias",
    toRange: (now) => ({ startDate: daysBeforeAtDayStart(now, 7) }),
  },
  {
    id: "last-30-days",
    label: "Últimos 30 dias",
    toRange: (now) => ({ startDate: daysBeforeAtDayStart(now, 30) }),
  },
  {
    id: "last-month",
    label: "Mês passado",
    toRange: toLastMonthRange,
  },
];

export const findDatePreset = (id: DatePresetId): DatePreset =>
  DATE_PRESETS.find((preset) => preset.id === id) ?? DATE_PRESETS[0];

export const isDatePresetId = (value: unknown): value is DatePresetId =>
  DATE_PRESETS.some((preset) => preset.id === value);
