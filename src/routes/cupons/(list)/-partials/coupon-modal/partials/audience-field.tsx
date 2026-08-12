import type { CouponAudience } from "../form";

type Option = {
  value: CouponAudience;
  label: string;
  description: string;
};

const OPTIONS: Option[] = [
  {
    value: "all",
    label: "Todos os clientes",
    description: "Qualquer cliente pode usar",
  },
  {
    value: "customers",
    label: "Clientes específicos",
    description: "Somente os selecionados",
  },
];

type OptionState = "default" | "selected";

const OPTION_CLASSES: Record<OptionState, string> = {
  default:
    "border-zinc-700 bg-zinc-800 text-zinc-300 not-disabled:hover:border-zinc-600 not-disabled:hover:text-white",
  selected: "border-amber-500 bg-amber-500/10 text-amber-400",
};

type Props = {
  value: CouponAudience;
  onChange: (value: CouponAudience) => void;
  disabled?: boolean;
};

export const AudienceField = ({ value, onChange, disabled }: Props) => (
  <fieldset className="select-none">
    <legend className="text-zinc-300 text-sm font-medium mb-1.5">
      Restrição de uso
    </legend>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {OPTIONS.map((option) => {
        const optionState: OptionState =
          option.value === value ? "selected" : "default";

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={optionState === "selected"}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`
              flex flex-col gap-0.5 border rounded-lg px-4 py-2.5 text-start
              outline-none transition-colors duration-150
              not-disabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
              focus-visible:ring-1 focus-visible:ring-amber-500
              ${OPTION_CLASSES[optionState]}
            `}
          >
            <span className="text-sm font-medium">{option.label}</span>
            <span className="text-xs text-zinc-400">{option.description}</span>
          </button>
        );
      })}
    </div>
  </fieldset>
);
