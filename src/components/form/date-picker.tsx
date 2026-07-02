import * as RadixPopover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Props = {
  label?: string;
  value?: Date;
  onChange: (value: Date | undefined) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  disabledBefore?: Date;
};

const calendarClassNames = {
  months: "relative",
  month: "flex flex-col gap-3",
  month_caption: "flex items-center justify-center h-9 px-9",
  nav: "absolute inset-x-0 top-0 z-10 flex items-center justify-between h-9",
  caption_label: "text-sm font-medium text-white capitalize",
  button_previous:
    "size-7 inline-flex items-center justify-center rounded-md text-zinc-400 not-disabled:cursor-pointer not-disabled:hover:text-white not-disabled:hover:bg-zinc-700 transition-colors disabled:opacity-30",
  button_next:
    "size-7 inline-flex items-center justify-center rounded-md text-zinc-400 not-disabled:cursor-pointer not-disabled:hover:text-white not-disabled:hover:bg-zinc-700 transition-colors disabled:opacity-30",
  month_grid: "w-full border-collapse",
  weekdays: "flex",
  weekday:
    "size-9 flex items-center justify-center text-xs font-medium text-zinc-500",
  week: "flex w-full",
  day: "size-9 p-0 text-center",
  day_button:
    "size-9 inline-flex items-center justify-center rounded-md text-sm text-zinc-200 cursor-pointer not-disabled:hover:bg-zinc-700 transition-colors",
  selected:
    "[&>button]:bg-amber-500 [&>button]:text-black [&>button]:not-disabled:hover:bg-amber-400",
  today: "[&>button]:text-amber-400 [&>button]:font-semibold",
  outside: "[&>button]:text-zinc-600",
  disabled: "[&>button]:opacity-30 [&>button]:cursor-not-allowed",
  hidden: "invisible",
};

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Selecionar data",
  error,
  disabled,
  disabledBefore,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const triggerStateClass = error
    ? "border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-red-500"
    : "border-zinc-700 bg-zinc-800 focus:border-amber-500 focus:ring-amber-500";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <span className="text-zinc-300 text-sm font-medium">{label}</span>
      )}

      <RadixPopover.Root open={isOpen} onOpenChange={setIsOpen}>
        <RadixPopover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`flex items-center justify-between gap-2 border text-sm rounded-lg px-4 py-2.5 text-left text-white outline-none not-disabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus:ring-1 transition ${triggerStateClass}`}
          >
            <span className={value ? "text-white" : "text-zinc-500"}>
              {value ? value.toLocaleDateString("pt-BR") : placeholder}
            </span>
            <FiCalendar className="size-4 text-zinc-400 shrink-0" />
          </button>
        </RadixPopover.Trigger>

        <RadixPopover.Content
          align="start"
          sideOffset={6}
          className="z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl p-3 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
        >
          <DayPicker
            mode="single"
            locale={ptBR}
            selected={value}
            defaultMonth={value}
            disabled={disabledBefore ? { before: disabledBefore } : undefined}
            onSelect={(date) => {
              onChange(date);
              setIsOpen(false);
            }}
            showOutsideDays
            classNames={calendarClassNames}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? (
                  <FiChevronLeft className="size-4" />
                ) : (
                  <FiChevronRight className="size-4" />
                ),
            }}
          />
        </RadixPopover.Content>
      </RadixPopover.Root>

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
