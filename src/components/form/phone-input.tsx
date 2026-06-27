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
const MASK = "(__) _____-____";

export function PhoneInput({ value, onChange, ...props }: Props) {
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
      inputMode="tel"
      placeholder={props.placeholder ?? "(00) 00000-0000"}
      value={format(value, { mask: MASK, replacement: REPLACEMENT })}
      onChange={handleChange}
    />
  );
}
