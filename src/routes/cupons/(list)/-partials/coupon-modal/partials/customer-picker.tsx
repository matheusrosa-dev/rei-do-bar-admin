import { Input } from "@components";
import { formatPhone } from "@shared/helpers/string";
import type { ICustomer } from "@shared/models";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FiCheck, FiSearch } from "react-icons/fi";

type ItemState = "default" | "selected";

const ITEM_CLASSES: Record<ItemState, string> = {
  default:
    "text-zinc-300 not-disabled:hover:bg-zinc-700 not-disabled:hover:text-white",
  selected: "bg-amber-500/10 text-amber-400",
};

const CHECKBOX_CLASSES: Record<ItemState, string> = {
  default: "border-zinc-700",
  selected: "border-amber-500 bg-amber-500 text-black",
};

type Props = {
  customers: ICustomer[];
  value: string[];
  onChange: (value: string[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
};

export const CustomerPicker = ({
  customers,
  value,
  onChange,
  isLoading,
  disabled,
  error,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const search = searchTerm.trim().toLowerCase();
  const searchDigits = search.replace(/\D/g, "");

  const filteredCustomers = customers.filter((customer) => {
    if (!search) return true;
    if (customer.name?.toLowerCase().includes(search)) return true;

    return !!searchDigits && customer.phone.includes(searchDigits);
  });

  const isEmpty = !isLoading && filteredCustomers.length === 0;

  const toggle = (customerId: string) => {
    if (value.includes(customerId)) {
      onChange(value.filter((item) => item !== customerId));
      return;
    }

    onChange([...value, customerId]);
  };

  return (
    <div className="flex flex-col gap-2 select-none">
      <Input
        placeholder="Buscar por nome ou telefone"
        leftIcon={<FiSearch className="size-4" />}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        disabled={disabled}
      />

      <div className="border border-zinc-700 bg-zinc-800 rounded-lg overflow-hidden">
        <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto p-1">
          {isLoading && (
            <p className="px-3 py-6 text-center text-sm text-zinc-400">
              Carregando clientes...
            </p>
          )}

          {isEmpty && (
            <p className="px-3 py-6 text-center text-sm text-zinc-400">
              Nenhum cliente encontrado
            </p>
          )}

          {filteredCustomers.map((customer) => {
            const itemState: ItemState = value.includes(customer.id)
              ? "selected"
              : "default";

            return (
              <button
                key={customer.id}
                type="button"
                aria-pressed={itemState === "selected"}
                disabled={disabled}
                onClick={() => toggle(customer.id)}
                className={`
                  flex items-center gap-3 rounded-md px-3 py-2 text-start
                  outline-none transition-colors
                  not-disabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                  focus-visible:ring-1 focus-visible:ring-amber-500
                  ${ITEM_CLASSES[itemState]}
                `}
              >
                <span
                  className={`flex items-center justify-center size-4 shrink-0 border rounded-md transition-colors duration-150 ${CHECKBOX_CLASSES[itemState]}`}
                >
                  {itemState === "selected" && <FiCheck className="size-3" />}
                </span>

                <span className="flex-1 min-w-0 truncate text-sm">
                  {customer.name ?? "Sem nome"}
                </span>

                <span className="shrink-0 text-xs text-zinc-400">
                  {formatPhone(customer.phone)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-3 py-2">
          <span className="text-xs text-zinc-400">
            {value.length} de {customers.length} selecionados
          </span>

          {value.length > 0 && !disabled && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              Limpar seleção
            </button>
          )}
        </div>
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
};
