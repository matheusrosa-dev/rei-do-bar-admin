import { format, unformat, useMask } from "@react-input/mask";
import { Input } from "./input";

type Props = {
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
};

const REPLACEMENT = { _: /\d/ };
const MASK = "___.___.___-__";

export function CpfInput({ value, onChange, ...props }: Props) {
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
      placeholder={props.placeholder ?? "000.000.000-00"}
      value={format(value, { mask: MASK, replacement: REPLACEMENT })}
      onChange={handleChange}
    />
  );
}
