import { Button, StatusBadge, Toggle, Wrapper } from "@components";
import { STORE_PAUSE_KEYS_BY_PRIORITY } from "@shared/helpers/setting";
import { type ISetting, type SettingKey, SettingType } from "@shared/models";
import { twMerge } from "tailwind-merge";
import {
  formatSettingValue,
  SETTING_METADATA,
  STORE_STATUS_BADGE,
} from "../-helpers";

type Props = {
  setting: ISetting;
  isPending: boolean;
  onToggle: () => void;
  onEdit?: () => void;
};

const VALUE_CLASSES: Record<SettingType, string> = {
  [SettingType.CURRENCY]: "text-2xl font-bold text-white",
  [SettingType.TEXT]: "text-sm text-gray-200 line-clamp-2 break-words",
  [SettingType.PHONE]: "text-sm text-gray-200 line-clamp-2 break-words",
};

const isStorePauseKey = (
  key: SettingKey,
): key is (typeof STORE_PAUSE_KEYS_BY_PRIORITY)[number] =>
  (STORE_PAUSE_KEYS_BY_PRIORITY as readonly SettingKey[]).includes(key);

export const SettingCard = ({
  setting,
  isPending,
  onToggle,
  onEdit,
}: Props) => {
  const { label, description, icon: Icon } = SETTING_METADATA[setting.key];

  const statusBadge = isStorePauseKey(setting.key)
    ? STORE_STATUS_BADGE[setting.key][setting.isActive ? "active" : "inactive"]
    : null;

  return (
    <Wrapper className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-zinc-400">
            <Icon size={18} aria-hidden />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-white text-sm font-medium">{label}</span>
            <span className="text-xs text-zinc-500">{description}</span>
          </div>
        </div>

        <Toggle
          checked={setting.isActive}
          onCheckedChange={onToggle}
          disabled={isPending}
        />
      </div>

      {statusBadge && (
        <StatusBadge variant={statusBadge.variant}>
          {statusBadge.label}
        </StatusBadge>
      )}

      {onEdit && (
        <span
          className={twMerge(
            VALUE_CLASSES[setting.type],
            !setting.isActive && "opacity-50",
          )}
        >
          {formatSettingValue(setting)}
        </span>
      )}

      {onEdit && (
        <div className="mt-auto flex justify-end">
          <Button variant="secondary" disabled={isPending} onClick={onEdit}>
            Editar
          </Button>
        </div>
      )}
    </Wrapper>
  );
};
