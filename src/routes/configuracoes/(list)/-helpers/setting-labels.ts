import { SettingKey } from "@shared/models";

export const SETTING_KEY_LABEL: Record<SettingKey, string> = {
  [SettingKey.DELIVERY_FEE]: "Taxa de entrega",
  [SettingKey.ALERT_MESSAGE]: "Mensagem de alerta",
  [SettingKey.MIN_ORDER_VALUE]: "Valor mínimo do pedido (inclui frete)",
  [SettingKey.ON_BREAK]: "Loja pausada",
  [SettingKey.OUTSIDE_BUSINESS_HOURS]: "Fora do horário de serviço",
  [SettingKey.WHATSAPP_CONTACT]: "Contato Whatsapp",
  [SettingKey.WELCOME_COUPON]: "Cupom de boas vindas",
};
