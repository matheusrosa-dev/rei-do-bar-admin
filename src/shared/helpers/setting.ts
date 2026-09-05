import { type ISetting, SettingKey } from "@shared/models";

export const STORE_PAUSE_KEYS_BY_PRIORITY = [
  SettingKey.ON_BREAK,
  SettingKey.OUTSIDE_BUSINESS_HOURS,
] as const;

export type StorePauseKey = (typeof STORE_PAUSE_KEYS_BY_PRIORITY)[number];

export const findActiveStorePauseKey = (settings: ISetting[] | undefined) =>
  STORE_PAUSE_KEYS_BY_PRIORITY.find((key) =>
    settings?.some((setting) => setting.key === key && setting.isActive),
  );

export const isStorePaused = (settings: ISetting[] | undefined) =>
  Boolean(findActiveStorePauseKey(settings));
