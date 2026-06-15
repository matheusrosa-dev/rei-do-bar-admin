export enum SettingKey {
  DELIVERY_FEE = "DELIVERY_FEE",
  DANGER_MESSAGE = "DANGER_MESSAGE",
  ALERT_MESSAGE = "ALERT_MESSAGE",
  MIN_ORDER_VALUE = "MIN_ORDER_VALUE",
  CONTACT_PHONE = "CONTACT_PHONE",
  CONTACT_EMAIL = "CONTACT_EMAIL",
}

export interface ISetting {
  id: string;
  key: SettingKey;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}
