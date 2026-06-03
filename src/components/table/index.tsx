import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ErrorBody, LoadingBody, Pagination } from "./partials";

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  isError?: boolean;
  limit: number;
};

export function Table<T>({
  data,
  columns,
  isLoading,
  isError,
  limit,
}: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const headers = table.getHeaderGroups();
  const colCount = table.getAllLeafColumns().length;

  const showError = !!isError && !isLoading;
  const showContent = !isError && !isLoading;

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <table className="w-full text-sm text-left">
        <thead className="border-b border-white/10">
          {headers.map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {isLoading && <LoadingBody limit={limit} colCount={colCount} />}

        {showError && <ErrorBody colCount={colCount} />}

        {showContent && (
          <tbody className="divide-y divide-white/5">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-white/5">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-3.5 text-gray-200">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}

Table.Pagination = Pagination;
