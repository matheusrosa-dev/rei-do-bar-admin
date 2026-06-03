import { MdError } from "react-icons/md";

type Props = {
  colCount: number;
};

export const ErrorBody = ({ colCount }: Props) => {
  return (
    <tbody>
      <tr>
        <td colSpan={colCount}>
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-400">
            <MdError size={32} />
            <span className="text-sm">
              Erro ao carregar dados. Tente novamente.
            </span>
          </div>
        </td>
      </tr>
    </tbody>
  );
};
