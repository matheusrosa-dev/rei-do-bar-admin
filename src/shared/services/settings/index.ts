import type { ISetting } from "@shared/models";
import { api } from "../api";
import type {
  ActivateSetting,
  DeactivateSetting,
  GetSettings,
  UpdateSetting,
  UseSettingsService,
} from "../settings/types";

export const useSettingsService: UseSettingsService = () => {
  const baseUrl = "/settings";

  const getSettings: GetSettings = async () => {
    const response = await api.get<ISetting[]>(baseUrl);

    return response.data.data;
  };

  const updateSetting: UpdateSetting = async ({ settingKey, body }) => {
    const response = await api.put<ISetting>(`${baseUrl}/${settingKey}`, body);

    return response.data.data;
  };

  const activateSetting: ActivateSetting = async ({ settingKey }) => {
    await api.patch(`${baseUrl}/${settingKey}/activate`);
  };

  const deactivateSetting: DeactivateSetting = async ({ settingKey }) => {
    await api.patch(`${baseUrl}/${settingKey}/deactivate`);
  };

  return {
    getSettings: {
      fn: getSettings,
      key: "get-settings",
    },
    updateSetting,
    activateSetting,
    deactivateSetting,
  };
};
