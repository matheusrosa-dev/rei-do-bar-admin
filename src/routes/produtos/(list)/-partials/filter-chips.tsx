import { twMerge } from "tailwind-merge";

type Option = {
  value: string;
  label: string;
};

type Props = {
  legend: string;
  options: Option[];
  selected: string | null;
  onSelect: (value: string) => void;
};

type Variant = "default" | "selected";

const VARIANT_CLASSES: Record<Variant, string> = {
  default:
    "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white",
  selected:
    "border-amber-500 bg-amber-500/10 text-amber-400 hover:bg-amber-500/10 hover:text-amber-400",
};

export const FilterChips = ({ legend, options, selected, onSelect }: Props) => {
  return (
    <fieldset className="select-none">
      <legend className="text-zinc-300 text-sm font-medium mb-1.5">
        {legend}
      </legend>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.value)}
              className={twMerge(
                "px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-colors duration-150 outline-none focus-visible:ring-1 focus-visible:ring-amber-500",
                VARIANT_CLASSES[isSelected ? "selected" : "default"],
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};
