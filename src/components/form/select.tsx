import * as RadixSelect from "@radix-ui/react-select";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiChevronDown, FiCheck, FiX } from "react-icons/fi";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  active?: boolean;
  disabled?: boolean;
  error?: string;
  clearable?: boolean;
};

export function Select({
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
  const [clearKey, setClearKey] = useState(0);

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
        <RadixSelect.Root
          key={clearKey}
          value={value ?? ""}
          onValueChange={onChange}
        >
          <RadixSelect.Trigger
            disabled={disabled}
            className={`
              w-full flex items-center justify-between gap-2
              border text-sm rounded-lg px-4 py-2.5
              text-white outline-none not-disabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
              focus:border-amber-500 focus:ring-1 focus:ring-amber-500
              data-placeholder:text-zinc-500
              transition
              ${active ? "border-amber-500 bg-amber-500/10" : error ? "border-red-500 bg-red-500/5" : "border-zinc-700 bg-zinc-800"}
            `}
          >
            <RadixSelect.Value placeholder={placeholder} />
            <div className="flex items-center gap-1 shrink-0">
              {clearable && !!value && !disabled && (
                <span
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(null);
                    setClearKey((k) => k + 1);
                  }}
                >
                  <FiX className="size-3.5" />
                </span>
              )}
              <FiChevronDown className="size-4 text-zinc-400" />
            </div>
          </RadixSelect.Trigger>

          <RadixSelect.Portal>
            <RadixSelect.Content
              position="popper"
              sideOffset={6}
              className="
                z-50 min-w-(--radix-select-trigger-width)
                bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl
                overflow-hidden
                data-[state=open]:animate-in data-[state=closed]:animate-out
                data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0
                data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95
              "
            >
              <RadixSelect.Viewport className="p-1">
                {options.map((option) => (
                  <RadixSelect.Item
                    key={option.value}
                    value={option.value}
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
                    <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                    <RadixSelect.ItemIndicator>
                      <FiCheck className="size-3.5" />
                    </RadixSelect.ItemIndicator>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </RadixSelect.Root>
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
