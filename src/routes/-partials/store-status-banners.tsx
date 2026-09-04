import { Button } from "@components";
import { useSettingsService } from "@services";
import { type ISetting, SettingKey } from "@shared/models";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";

type AlertVariant = "paused" | "outside-hours";
type BannerVariant = AlertVariant | "custom-alert" | "open" | "unknown";

type Banner = {
  variant: BannerVariant;
  message: string;
  label?: string;
};

const ALERT_BANNER_BY_KEY: Record<
  typeof SettingKey.ON_BREAK | typeof SettingKey.OUTSIDE_BUSINESS_HOURS,
  Banner & { variant: AlertVariant }
> = {
  [SettingKey.ON_BREAK]: {
    variant: "paused",
    message: "A loja está pausada e não está recebendo pedidos.",
  },
  [SettingKey.OUTSIDE_BUSINESS_HOURS]: {
    variant: "outside-hours",
    message: "A loja está fora do horário de serviço.",
  },
};

const ALERT_KEYS_BY_PRIORITY = [
  SettingKey.ON_BREAK,
  SettingKey.OUTSIDE_BUSINESS_HOURS,
] as const;

const OPEN_BANNER: Banner = {
  variant: "open",
  message: "A loja está aberta e recebendo pedidos.",
};

const UNKNOWN_BANNER: Banner = {
  variant: "unknown",
  message: "Não foi possível carregar o status da loja.",
};

const VARIANT_CLASSES: Record<BannerVariant, string> = {
  paused: "bg-red-500/15 text-red-400",
  "outside-hours": "bg-orange-500/15 text-orange-400",
  "custom-alert": "bg-sky-500/15 text-sky-400",
  open: "bg-green-500/15 text-green-400",
  unknown: "bg-white/10 text-gray-300",
};

const VARIANT_ICONS: Record<BannerVariant, IconType> = {
  paused: FiAlertTriangle,
  "outside-hours": FiAlertTriangle,
  "custom-alert": FiInfo,
  open: FiCheckCircle,
  unknown: FiAlertCircle,
};

const buildBanners = (settings: ISetting[] | undefined): Banner[] => {
  if (!settings) {
    return [UNKNOWN_BANNER];
  }

  const activeAlertKey = ALERT_KEYS_BY_PRIORITY.find((key) =>
    settings.some((setting) => setting.key === key && setting.isActive),
  );

  if (activeAlertKey) {
    return [ALERT_BANNER_BY_KEY[activeAlertKey]];
  }

  const customAlert = settings.find(
    (setting) => setting.key === SettingKey.ALERT_MESSAGE && setting.isActive,
  );

  if (customAlert?.value) {
    return [
      OPEN_BANNER,
      {
        variant: "custom-alert",
        label: "Mensagem visível para o cliente",
        message: customAlert.value,
      },
    ];
  }

  return [OPEN_BANNER];
};

export const StoreStatusBanners = () => {
  const { getSettings } = useSettingsService();

  const { data: settings, isLoading } = useQuery({
    queryKey: [getSettings.key],
    queryFn: () => getSettings.fn(),
    retry: false,
  });

  if (isLoading) {
    return null;
  }

  return (
    <div className="shrink-0 flex flex-col" role="status">
      {buildBanners(settings).map(({ variant, message, label }) => {
        const Icon = VARIANT_ICONS[variant];

        return (
          <div
            key={variant}
            className={`flex min-h-10 items-center justify-between gap-3 border-b border-white/10 px-4 py-1.5 md:px-5 ${VARIANT_CLASSES[variant]}`}
          >
            <span className="flex flex-1 flex-wrap items-center justify-center gap-x-2 text-center text-xs font-medium md:text-sm">
              <Icon className="shrink-0" size={16} aria-hidden />
              {label && <span className="font-semibold">{label}:</span>}
              {message}
            </span>

            <Link to="/configuracoes" className="shrink-0">
              <Button variant="secondary" className="px-3 py-1 text-xs">
                Configurações
              </Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
