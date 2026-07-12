export enum SettingKey {
  DELIVERY_FEE = "DELIVERY_FEE",
  ALERT_MESSAGE = "ALERT_MESSAGE",
  MIN_ORDER_VALUE = "MIN_ORDER_VALUE",
  OUTSIDE_BUSINESS_HOURS = "OUTSIDE_BUSINESS_HOURS",
  ON_BREAK = "ON_BREAK",
  WHATSAPP_CONTACT = "WHATSAPP_CONTACT",
  WELCOME_COUPON = "WELCOME_COUPON",
}

export enum SettingType {
  CURRENCY = "CURRENCY",
  TEXT = "TEXT",
  PHONE = "PHONE",
}

export interface ISetting {
  id: string;
  key: SettingKey;
  type: SettingType;
  value: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
