import { SortDirection } from "@shared/interfaces";
import { Select } from "./form/select";

type Props = {
  label: string;
  value: SortDirection | undefined;
  onChange: (direction: SortDirection | undefined) => void;
};

const SORT_OPTIONS = [
  { value: "all", label: "Padrão" },
  { value: SortDirection.ASC, label: "Menor -> Maior" },
  { value: SortDirection.DESC, label: "Maior -> Menor" },
];

export const SortSelect = ({ label, value, onChange }: Props) => {
  return (
    <Select
      label={label}
      placeholder="Padrão"
      options={SORT_OPTIONS}
      value={value ?? "all"}
      onValueChange={(value: "all" | SortDirection) =>
        onChange(value === "all" ? undefined : value)
      }
      active={!!value}
    />
  );
};
