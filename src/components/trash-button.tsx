import { LuTrash2 } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

type Props = {
  disabled?: boolean;
  className?: string;
  onClick: () => void;
};

export const TrashButton = ({ disabled, className, onClick }: Props) => {
  return (
    <button
      type="button"
      title="Remover"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={twMerge(
        "cursor-pointer p-2 rounded-md text-red-500 not-disabled:hover:bg-red-500/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      disabled={disabled}
    >
      <LuTrash2 className="w-full h-full" />
    </button>
  );
};
