import { FiRefreshCw } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

type Props = {
  isRefetching: boolean;
  className?: string;
  onRefetch: () => void;
};

export const RefetchButton = ({
  onRefetch,
  isRefetching,
  className,
}: Props) => {
  return (
    <button
      type="button"
      onClick={onRefetch}
      disabled={isRefetching}
      className={twMerge(
        `select-none flex items-center gap-1.5 px-3 py-2.5 text-sm text-zinc-400 hover:text-white 
         transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`,
        className,
      )}
    >
      <FiRefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
      Atualizar
    </button>
  );
};
