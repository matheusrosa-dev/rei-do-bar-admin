import { EMPTY_VALUE, formatPrice } from "@shared/helpers/number";
import { formatPhone } from "@shared/helpers/string";
import { type ISetting, SettingKey, SettingType } from "@shared/models";
import type { StorePauseKey } from "@shared/helpers/setting";
import type { IconType } from "react-icons";
import {
  FiAward,
  FiClock,
  FiInfo,
  FiPauseCircle,
  FiPhone,
  FiShoppingCart,
  FiTag,
  FiTruck,
} from "react-icons/fi";

type SettingMetadata = {
  label: string;
  description: string;
  icon: IconType;
};

export const SETTING_METADATA: Record<SettingKey, SettingMetadata> = {
  [SettingKey.ON_BREAK]: {
    label: "Loja pausada",
    description: "Bloqueia novos pedidos no app do cliente.",
    icon: FiPauseCircle,
  },
  [SettingKey.OUTSIDE_BUSINESS_HOURS]: {
    label: "Fora do horário de serviço",
    description: "Fecha a loja por estar fora do horário de serviço.",
    icon: FiClock,
  },
  [SettingKey.DELIVERY_FEE]: {
    label: "Taxa de entrega",
    description: "Cobrada do cliente em cada pedido.",
    icon: FiTruck,
  },
  [SettingKey.DELIVERY_PERSON_BONUS]: {
    label: "Bônus do entregador",
    description: "Pago ao entregador por pedido entregue.",
    icon: FiAward,
  },
  [SettingKey.MIN_ORDER_VALUE]: {
    label: "Valor mínimo do pedido (inclui frete)",
    description: "Valor mínimo para finalizar um pedido.",
    icon: FiShoppingCart,
  },
  [SettingKey.ALERT_MESSAGE]: {
    label: "Mensagem de alerta",
    description: "Aviso exibido para o cliente no app.",
    icon: FiInfo,
  },
  [SettingKey.WHATSAPP_CONTACT]: {
    label: "Contato Whatsapp",
    description: "Número usado pelo cliente para falar com a loja.",
    icon: FiPhone,
  },
  [SettingKey.WELCOME_COUPON]: {
    label: "Cupom de boas vindas",
    description: "Cupom aplicado no primeiro pedido do cliente.",
    icon: FiTag,
  },
};

export const formatSettingValue = (setting: ISetting): string => {
  if (!setting.value) return EMPTY_VALUE;

  if (setting.type === SettingType.CURRENCY) {
    return formatPrice(Number(setting.value));
  }

  if (setting.type === SettingType.PHONE) {
    return formatPhone(setting.value);
  }

  return setting.value;
};

type StoreStatusBadge = {
  label: string;
  variant: "active" | "inactive" | "alert";
};

export const STORE_STATUS_BADGE: Record<
  StorePauseKey,
  { active: StoreStatusBadge; inactive: StoreStatusBadge }
> = {
  [SettingKey.ON_BREAK]: {
    active: { label: "Loja pausada", variant: "inactive" },
    inactive: { label: "Loja aberta", variant: "active" },
  },
  [SettingKey.OUTSIDE_BUSINESS_HOURS]: {
    active: { label: "Fora do horário", variant: "alert" },
    inactive: { label: "Dentro do horário", variant: "active" },
  },
};
