type Props = {
  limit: number;
  colCount: number;
};

export const LoadingBody = ({ limit, colCount }: Props) => {
  return (
    <tbody className="divide-y divide-white/5">
      {Array.from({ length: limit }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no identity
        <tr key={i} className="animate-pulse">
          {Array.from({ length: colCount }).map((_, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells have no identity
            <td key={j} className="px-5 py-8">
              <div className="h-4 w-24 rounded bg-white/10" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
