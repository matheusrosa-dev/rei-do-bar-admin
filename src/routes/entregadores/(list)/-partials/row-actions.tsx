import { Tooltip, TrashButton } from "@components";
import { LuKeyRound, LuLogOut } from "react-icons/lu";

type Props = {
  ordersCount: number;
  hasSession: boolean;
  disabled?: boolean;
  onSetPassword: () => void;
  onRevokeAccess: () => void;
  onRemove: () => void;
};

const ICON_BUTTON_CLASSES =
  "cursor-pointer p-2 rounded-md text-zinc-400 not-disabled:hover:bg-white/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const RowActions = ({
  ordersCount,
  hasSession,
  disabled,
  onSetPassword,
  onRevokeAccess,
  onRemove,
}: Props) => {
  return (
    <div className="flex justify-end gap-1">
      <Tooltip
        disabled={!hasSession}
        content={
          <>
            Este entregador está com sessão ativa.
            <br /> Remova o acesso antes de definir uma nova senha.
          </>
        }
      >
        <span>
          <button
            type="button"
            title="Definir senha"
            aria-label="Definir senha"
            disabled={disabled || hasSession}
            onClick={(e) => {
              e.stopPropagation();
              onSetPassword();
            }}
            className={ICON_BUTTON_CLASSES}
          >
            <LuKeyRound size={16} />
          </button>
        </span>
      </Tooltip>

      <Tooltip
        disabled={hasSession}
        content="Este entregador não tem sessão ativa."
      >
        <span>
          <button
            type="button"
            title="Remover acesso"
            aria-label="Remover acesso"
            disabled={disabled || !hasSession}
            onClick={(e) => {
              e.stopPropagation();
              onRevokeAccess();
            }}
            className={ICON_BUTTON_CLASSES}
          >
            <LuLogOut size={16} />
          </button>
        </span>
      </Tooltip>

      <Tooltip
        disabled={ordersCount === 0}
        content={
          <>
            Não é possível remover esse entregador
            <br /> pois ele possui pedidos vinculados.
          </>
        }
      >
        <span>
          <TrashButton
            disabled={disabled || ordersCount > 0}
            onClick={onRemove}
          />
        </span>
      </Tooltip>
    </div>
  );
};
