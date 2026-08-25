import * as RadixPopover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { Button } from "./button";
import { Select } from "./select";

type TriggerVariant = "default" | "active" | "error";

const TRIGGER_VARIANT_CLASSES: Record<TriggerVariant, string> = {
  default: "border-zinc-700 bg-zinc-800",
  active: "border-amber-500 bg-amber-500/10",
  error: "border-red-500 bg-red-500/5",
};

type Props = {
  label?: string;
  value?: Date;
  onChange: (value: Date | undefined) => void;
  placeholder?: string;
  error?: string;
  active?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  withTime?: boolean;
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
  active,
  disabled,
  clearable,
  withTime,
  disabledBefore,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isTimeSelectOpen = useRef(false);
  const timeSelectClosedAt = useRef(0);
  const [openTimeSelect, setOpenTimeSelect] = useState<"hour" | "minute">();
  const [draftDay, setDraftDay] = useState(value);
  const [draftHour, setDraftHour] = useState(toHourValue(value));
  const [draftMinute, setDraftMinute] = useState(toMinuteValue(value));

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDraftDay(value);
      setDraftHour(toHourValue(value));
      setDraftMinute(toMinuteValue(value));
    }

    setIsOpen(open);
  };

  const apply = () => {
    if (!draftDay || !draftHour || !draftMinute) return;

    onChange(
      new Date(
        draftDay.getFullYear(),
        draftDay.getMonth(),
        draftDay.getDate(),
        Number(draftHour),
        Number(draftMinute),
      ),
    );
    setIsOpen(false);
  };

  const onTimeSelectOpenChange = (field: "hour" | "minute", open: boolean) => {
    isTimeSelectOpen.current = open;
    setOpenTimeSelect(open ? field : undefined);

    if (!open) timeSelectClosedAt.current = Date.now();
  };

  const closeTimeSelect = () => {
    isTimeSelectOpen.current = false;
    timeSelectClosedAt.current = Date.now();
    setOpenTimeSelect(undefined);
  };

  // Fechar um select do proprio popover chega ao calendario como dispensa
  // (o Radix o renderiza em portal e defere o evento), o que o fecharia junto.
  const isClosingTimeSelect = () =>
    isTimeSelectOpen.current || Date.now() - timeSelectClosedAt.current < 250;

  const onSelectDay = (day: Date | undefined) => {
    if (!withTime) {
      onChange(day);
      setIsOpen(false);
      return;
    }

    setDraftDay(day);

    if (!day) {
      setDraftHour(null);
      setDraftMinute(null);
    }
  };

  const clear = () => {
    setDraftDay(undefined);
    setDraftHour(null);
    setDraftMinute(null);
    onChange(undefined);
  };

  const isTimeIncomplete = !!draftDay && (!draftHour || !draftMinute);

  let triggerVariant: TriggerVariant = "default";
  if (error) triggerVariant = "error";
  if (active) triggerVariant = "active";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <span
          className={`text-sm font-medium transition-colors ${active ? "text-amber-400" : "text-zinc-300"}`}
        >
          {label}
        </span>
      )}

      <RadixPopover.Root open={isOpen} onOpenChange={onOpenChange}>
        <RadixPopover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`flex items-center justify-between gap-2 border text-sm rounded-lg px-4 py-2.5 text-left text-white outline-none not-disabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition ${TRIGGER_VARIANT_CLASSES[triggerVariant]}`}
          >
            <span
              className={`truncate ${value ? "text-white" : "text-zinc-500"}`}
            >
              {value ? formatTrigger(value, withTime) : placeholder}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {clearable && !!value && !disabled && (
                <span
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clear();
                  }}
                >
                  <FiX className="size-3.5" />
                </span>
              )}
              <FiCalendar className="size-4 text-zinc-400" />
            </div>
          </button>
        </RadixPopover.Trigger>

        <RadixPopover.Content
          align="start"
          sideOffset={6}
          onEscapeKeyDown={(event) => {
            // Barrar o Escape aqui tambem impede o select de se fechar (os dois
            // layers compartilham o evento nativo), entao o fechamos na mao.
            if (!isClosingTimeSelect()) return;

            event.preventDefault();
            closeTimeSelect();
          }}
          onInteractOutside={(event) => {
            if (isClosingTimeSelect()) {
              event.preventDefault();
            }
          }}
          className="z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl p-3 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
        >
          <DayPicker
            mode="single"
            locale={ptBR}
            selected={withTime ? draftDay : value}
            defaultMonth={withTime ? draftDay : value}
            disabled={disabledBefore ? { before: disabledBefore } : undefined}
            onSelect={onSelectDay}
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

          {withTime && (
            <div className="border-t border-zinc-700 pt-3 mt-3 flex flex-col gap-1.5">
              <div className="flex items-end gap-2">
                <Select
                  label="Hora"
                  placeholder="--"
                  options={HOUR_OPTIONS}
                  value={draftHour}
                  onChange={setDraftHour}
                  open={openTimeSelect === "hour"}
                  onOpenChange={(open) => onTimeSelectOpenChange("hour", open)}
                />

                <Select
                  label="Minuto"
                  placeholder="--"
                  options={buildMinuteOptions(draftMinute)}
                  value={draftMinute}
                  onChange={setDraftMinute}
                  open={openTimeSelect === "minute"}
                  onOpenChange={(open) =>
                    onTimeSelectOpenChange("minute", open)
                  }
                />
              </div>

              <AnimatePresence>
                {isTimeIncomplete && (
                  <motion.span
                    className="text-red-500 text-xs select-none overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    Informe a hora
                  </motion.span>
                )}
              </AnimatePresence>

              <Button
                onClick={apply}
                disabled={!draftDay || !draftHour || !draftMinute}
                className="w-full mt-1.5"
              >
                Aplicar
              </Button>
            </div>
          )}
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

const toHourValue = (date?: Date) =>
  date ? String(date.getHours()).padStart(2, "0") : null;

const toMinuteValue = (date?: Date) =>
  date ? String(date.getMinutes()).padStart(2, "0") : null;

const formatTrigger = (date: Date, withTime?: boolean) => {
  const day = date.toLocaleDateString("pt-BR");

  if (!withTime) return day;

  return `${day} ${date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
  const value = String(hour).padStart(2, "0");

  return { value, label: value };
});

const MINUTE_STEP = 5;

const MINUTE_OPTIONS = Array.from({ length: 60 / MINUTE_STEP }, (_, index) => {
  const value = String(index * MINUTE_STEP).padStart(2, "0");

  return { value, label: value };
});

const buildMinuteOptions = (selected: string | null) => {
  if (!selected || MINUTE_OPTIONS.some((option) => option.value === selected)) {
    return MINUTE_OPTIONS;
  }

  return [...MINUTE_OPTIONS, { value: selected, label: selected }].sort(
    (a, b) => a.value.localeCompare(b.value),
  );
};
