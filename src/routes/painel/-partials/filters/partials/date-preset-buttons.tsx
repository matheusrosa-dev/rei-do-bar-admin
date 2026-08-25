import { Button } from "@components";
import {
  DATE_PRESETS,
  type DatePreset,
  type DatePresetId,
} from "../../../-helpers";

type Variant = "default" | "active";

const VARIANT_CLASSES: Record<Variant, string> = {
  default: "",
  active:
    "border-amber-500 bg-amber-500/10 text-amber-400 not-disabled:hover:bg-amber-500/10",
};

type Props = {
  value?: DatePresetId;
  onSelect: (preset: DatePreset) => void;
};

export const DatePresetButtons = ({ value, onSelect }: Props) => (
  <div className="flex flex-wrap gap-2">
    {DATE_PRESETS.map((preset) => {
      const isActive = value === preset.id;

      return (
        <Button
          key={preset.id}
          variant="secondary"
          onClick={() => onSelect(preset)}
          aria-pressed={isActive}
          className={VARIANT_CLASSES[isActive ? "active" : "default"]}
        >
          {preset.label}
        </Button>
      );
    })}
  </div>
);
