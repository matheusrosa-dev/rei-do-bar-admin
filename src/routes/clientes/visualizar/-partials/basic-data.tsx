import { StatusBadge, Wrapper } from "@components";
import type { ICustomerWithRelations } from "@shared/models";
import { formatDate, formatPhone } from "@shared/helpers/string";

type Props = {
  customer: ICustomerWithRelations;
};

export const BasicData = ({ customer }: Props) => {
  return (
    <Wrapper className="flex flex-col gap-4">
      <h2 className="text-white text-lg font-bold">Dados do cliente</h2>

      <hr className="border-white/10" />

      <div className="flex items-center gap-3">
        <h2 className="text-amber-500 text-xl font-bold">
          {customer.deletedAt ? "Cliente removido" : (customer.name ?? "-")}
        </h2>

        {!customer.deletedAt && (
          <StatusBadge variant={customer.isActive ? "active" : "inactive"}>
            {customer.isActive ? "Ativo" : "Inativo"}
          </StatusBadge>
        )}
      </div>

      {!customer.deletedAt && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Telefone" value={formatPhone(customer.phone)} />
          <Field label="Cliente desde" value={formatDate(customer.createdAt)} />
        </div>
      )}
    </Wrapper>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
      {label}
    </span>
    <span className="text-gray-200 text-sm">{value}</span>
  </div>
);
