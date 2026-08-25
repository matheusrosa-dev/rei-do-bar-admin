import { DatePicker, RefetchButton } from "@components";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FiX } from "react-icons/fi";
import {
  DEFAULT_DATE_PRESET_ID,
  type DatePreset,
  findDatePreset,
  fromDateTimeParam,
  toDateTimeParam,
  toDayStart,
} from "../../-helpers";
import { DatePresetButtons } from "./partials";

type Props = {
  onRefetch: () => void;
  isRefetching: boolean;
};

export const Filters = ({ onRefetch, isRefetching }: Props) => {
  const { startDate, endDate, preset } = useSearch({ from: "/painel/" });

  const navigate = useNavigate({ from: "/painel/" });

  const onSelectPreset = (selected: DatePreset) => {
    const range = selected.toRange(new Date());

    navigate({
      search: () => ({
        startDate: toDateTimeParam(range.startDate),
        endDate: range.endDate ? toDateTimeParam(range.endDate) : undefined,
        preset: selected.id,
      }),
    });
  };

  const onChangeStartDateFilter = (date: Date | undefined) => {
    const nextStartDate = date ? toDateTimeParam(date) : undefined;

    navigate({
      search: (prev) => ({
        ...prev,
        preset: undefined,
        startDate: nextStartDate,
        endDate:
          nextStartDate && prev.endDate && prev.endDate < nextStartDate
            ? undefined
            : prev.endDate,
      }),
    });
  };

  const onChangeEndDateFilter = (date: Date | undefined) => {
    const nextEndDate = date ? toDateTimeParam(date) : undefined;

    navigate({
      search: (prev) => ({
        ...prev,
        preset: undefined,
        endDate: nextEndDate,
        startDate:
          nextEndDate && prev.startDate && nextEndDate < prev.startDate
            ? undefined
            : prev.startDate,
      }),
    });
  };

  const startDateValue = fromDateTimeParam(startDate);
  const endDateValue = fromDateTimeParam(endDate);

  const isDefaultRange = preset === DEFAULT_DATE_PRESET_ID;

  return (
    <div className="flex flex-col gap-3">
      <DatePresetButtons value={preset} onSelect={onSelectPreset} />

      <div className="flex items-end gap-3">
        <div className="flex gap-3 flex-wrap">
          <div className="w-48">
            <DatePicker
              label="Data inicial"
              placeholder="Início"
              value={startDateValue}
              onChange={onChangeStartDateFilter}
              active={Boolean(startDate)}
              withTime
            />
          </div>

          <div className="w-48">
            <DatePicker
              label="Data final"
              placeholder="Fim"
              value={endDateValue}
              onChange={onChangeEndDateFilter}
              active={Boolean(endDate)}
              withTime
              disabledBefore={toDayStart(startDateValue)}
              clearable
            />
          </div>
        </div>

        {!isDefaultRange && (
          <button
            type="button"
            onClick={() =>
              onSelectPreset(findDatePreset(DEFAULT_DATE_PRESET_ID))
            }
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <FiX className="size-4" />
            Limpar filtros
          </button>
        )}

        <RefetchButton
          onRefetch={onRefetch}
          isRefetching={isRefetching}
          className="ml-auto"
        />
      </div>
    </div>
  );
};
