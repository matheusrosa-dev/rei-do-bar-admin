import { MdInbox } from "react-icons/md";

type Props = {
  colCount: number;
};

export const EmptyBody = ({ colCount }: Props) => {
  return (
    <tbody>
      <tr>
        <td colSpan={colCount}>
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
            <MdInbox size={32} />
            <span className="text-sm">Nenhum dado encontrado.</span>
          </div>
        </td>
      </tr>
    </tbody>
  );
};
