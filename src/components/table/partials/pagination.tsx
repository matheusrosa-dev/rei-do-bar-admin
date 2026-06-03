import type { IPagination } from "@shared/interfaces";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

type Props = {
  meta: IPagination<unknown>["meta"];
  onChangePage: (page: number) => void;
};

export const Pagination = ({ meta, onChangePage }: Props) => {
  return (
    <div className="flex items-center justify-end gap-2 text-sm text-gray-400 select-none">
      <button
        type="button"
        onClick={() => onChangePage(meta.page - 1)}
        disabled={meta.page <= 1}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 not-disabled:hover:bg-white/5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <MdChevronLeft size={18} />
      </button>

      <span className="px-2">
        {meta.page} / {meta.totalPages}
      </span>

      <button
        type="button"
        onClick={() => onChangePage(meta.page + 1)}
        disabled={meta.page >= meta.totalPages}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 not-disabled:hover:bg-white/5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <MdChevronRight size={18} />
      </button>
    </div>
  );
};
