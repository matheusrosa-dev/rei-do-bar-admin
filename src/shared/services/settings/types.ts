import type { ISetting, SettingKey } from "@shared/models";

export type GetSettings = () => Promise<ISetting[]>;

export type UpdateSetting = (props: {
  settingKey: SettingKey;
  body: {
    value: string;
  };
}) => Promise<ISetting>;

export type UseSettingsService = () => {
  getSettings: {
    fn: GetSettings;
    key: string;
  };
  updateSetting: UpdateSetting;
};
