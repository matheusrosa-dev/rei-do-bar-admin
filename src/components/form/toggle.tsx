/** biome-ignore-all lint/a11y/noLabelWithoutControl: <> */
import * as RadixSwitch from "@radix-ui/react-switch";

type Props = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function Toggle({ label, checked, onCheckedChange, disabled }: Props) {
  return (
    <label
      className={`flex flex-col gap-1.5 w-fit ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span className="text-zinc-300 text-sm font-medium select-none">
        {label}
      </span>

      <RadixSwitch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="
          relative inline-flex h-6 w-11 shrink-0 items-center rounded-full
          border-2 border-transparent outline-none
          transition-colors duration-200 not-disabled:cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          data-[state=checked]:bg-amber-500
          data-[state=unchecked]:bg-zinc-700
          focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
        "
      >
        <RadixSwitch.Thumb
          className="
            block size-4 rounded-full bg-white shadow
            transition-transform duration-200
            data-[state=checked]:translate-x-5
            data-[state=unchecked]:translate-x-0.5
          "
        />
      </RadixSwitch.Root>
    </label>
  );
}
