import { STORE_PAUSE_KEYS_BY_PRIORITY } from "@shared/helpers/setting";
import { type ISetting, SettingKey } from "@shared/models";

type SettingGroupDefinition = {
  id: string;
  title: string;
  editable: boolean;
  keys: SettingKey[];
};

const SETTING_GROUPS: SettingGroupDefinition[] = [
  {
    id: "store-status",
    title: "Status da loja",
    editable: false,
    keys: [...STORE_PAUSE_KEYS_BY_PRIORITY],
  },
  {
    id: "values",
    title: "Valores",
    editable: true,
    keys: [
      SettingKey.DELIVERY_FEE,
      SettingKey.DELIVERY_PERSON_BONUS,
      SettingKey.MIN_ORDER_VALUE,
    ],
  },
  {
    id: "communication",
    title: "Comunicação",
    editable: true,
    keys: [
      SettingKey.ALERT_MESSAGE,
      SettingKey.WHATSAPP_CONTACT,
      SettingKey.WELCOME_COUPON,
    ],
  },
];

export type SettingGroup = {
  id: string;
  title: string;
  editable: boolean;
  settings: ISetting[];
};

export const groupSettings = (settings: ISetting[]): SettingGroup[] => {
  const groupedKeys = new Set(SETTING_GROUPS.flatMap((group) => group.keys));

  const groups: SettingGroup[] = SETTING_GROUPS.map((group) => ({
    id: group.id,
    title: group.title,
    editable: group.editable,
    settings: group.keys
      .map((key) => settings.find((setting) => setting.key === key))
      .filter((setting): setting is ISetting => !!setting),
  }));

  const otherSettings = settings.filter(
    (setting) => !groupedKeys.has(setting.key),
  );

  if (otherSettings.length > 0) {
    groups.push({
      id: "other",
      title: "Outras configurações",
      editable: true,
      settings: otherSettings,
    });
  }

  return groups.filter((group) => group.settings.length > 0);
};
