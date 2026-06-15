import type { ISetting } from "@shared/models";
import { api } from "../api";
import type {
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

  return {
    getSettings: {
      fn: getSettings,
      key: "get-settings",
    },
    updateSetting,
  };
};
