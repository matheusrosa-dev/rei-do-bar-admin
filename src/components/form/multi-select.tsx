import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "motion/react";
import { FiChevronDown, FiCheck, FiX } from "react-icons/fi";

type Option = {
  value: string;
  label: string;
};

type TriggerVariant = "default" | "active" | "error";

const TRIGGER_VARIANT_CLASSES: Record<TriggerVariant, string> = {
  default: "border-zinc-700 bg-zinc-800",
  active: "border-amber-500 bg-amber-500/10",
  error: "border-red-500 bg-red-500/5",
};

type Props = {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  active?: boolean;
  disabled?: boolean;
  error?: string;
  clearable?: boolean;
};

export function MultiSelect({
  label,
  placeholder = "Selecionar...",
  options,
  value,
  onChange,
  active,
  disabled,
  error,
  clearable,
}: Props) {
  const toggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
      return;
    }

    onChange([...value, optionValue]);
  };

  const triggerLabel = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      return (
        options.find((option) => option.value === value[0])?.label ??
        placeholder
      );
    }

    return `${value.length} selecionados`;
  };

  let triggerVariant: TriggerVariant = "default";
  if (error) triggerVariant = "error";
  if (active) triggerVariant = "active";

  return (
    <div className="flex flex-col gap-1.5 select-none w-full">
      {label && (
        <span
          className={`text-sm font-medium transition-colors ${active ? "text-amber-400" : "text-zinc-300"}`}
        >
          {label}
        </span>
      )}

      <div className="relative">
        <RadixDropdownMenu.Root>
          <RadixDropdownMenu.Trigger
            disabled={disabled}
            className={`
              w-full flex items-center justify-between gap-2
              border text-sm rounded-lg px-4 py-2.5
              text-white outline-none not-disabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
              focus:border-amber-500 focus:ring-1 focus:ring-amber-500
              transition
              ${TRIGGER_VARIANT_CLASSES[triggerVariant]}
            `}
          >
            <span
              className={`flex-1 min-w-0 text-start truncate ${value.length === 0 ? "text-zinc-500" : ""}`}
            >
              {triggerLabel()}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {clearable && value.length > 0 && !disabled && (
                <span
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange([]);
                  }}
                >
                  <FiX className="size-3.5" />
                </span>
              )}
              <FiChevronDown className="size-4 text-zinc-400" />
            </div>
          </RadixDropdownMenu.Trigger>

          <RadixDropdownMenu.Portal>
            <RadixDropdownMenu.Content
              align="start"
              sideOffset={6}
              className="
                z-50 min-w-(--radix-dropdown-menu-trigger-width)
                bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl
                max-h-72 overflow-y-auto p-1
                data-[state=open]:animate-in data-[state=closed]:animate-out
                data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0
                data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95
              "
            >
              {options.map((option) => (
                <RadixDropdownMenu.CheckboxItem
                  key={option.value}
                  checked={value.includes(option.value)}
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={() => toggle(option.value)}
                  className="
                    flex items-center justify-between gap-2
                    px-3 py-2 text-sm text-zinc-300 rounded-md cursor-pointer
                    outline-none select-none
                    hover:bg-zinc-700 hover:text-white
                    data-highlighted:bg-zinc-700 data-highlighted:text-white
                    data-[state=checked]:text-amber-400
                    transition-colors
                  "
                >
                  {option.label}
                  <RadixDropdownMenu.ItemIndicator>
                    <FiCheck className="size-3.5" />
                  </RadixDropdownMenu.ItemIndicator>
                </RadixDropdownMenu.CheckboxItem>
              ))}
            </RadixDropdownMenu.Content>
          </RadixDropdownMenu.Portal>
        </RadixDropdownMenu.Root>
      </div>

      <AnimatePresence>
        {!!(error && !disabled) && (
          <motion.span
            className="text-red-500 text-xs select-none overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
