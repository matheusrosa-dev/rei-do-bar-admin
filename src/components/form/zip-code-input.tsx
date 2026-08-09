import { format, unformat, useMask } from "@react-input/mask";
import { Input } from "./input";

type Props = {
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  value: string;
  onChange: (value: string) => void;
};

const REPLACEMENT = { _: /\d/ };
const MASK = "_____-___";

export function ZipCodeInput({ value, onChange, isLoading, ...props }: Props) {
  const ref = useMask({ mask: MASK, replacement: REPLACEMENT });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(
      unformat(event.target.value, { mask: MASK, replacement: REPLACEMENT }),
    );
  };

  return (
    <Input
      {...props}
      ref={ref}
      inputMode="numeric"
      placeholder={props.placeholder ?? "00000-000"}
      value={format(value, { mask: MASK, replacement: REPLACEMENT })}
      onChange={handleChange}
      rightIcon={
        isLoading ? (
          <span className="block size-4 rounded-full border-2 border-zinc-700 border-t-amber-500 animate-spin" />
        ) : undefined
      }
    />
  );
}
