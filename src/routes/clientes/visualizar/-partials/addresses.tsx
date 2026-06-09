import { StatusBadge, Wrapper } from "@components";
import type { IAddress } from "@shared/models";
import { formatZipCode } from "@shared/helpers/string";

type Props = {
  addresses: IAddress[];
};

export const Addresses = ({ addresses }: Props) => {
  if (addresses.length === 0) {
    return (
      <Wrapper className="flex flex-col gap-4">
        <h2 className="text-white text-lg font-bold">Endereços</h2>
        <hr className="border-white/10" />
        <span className="text-gray-400 text-sm">
          Nenhum endereço cadastrado.
        </span>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="flex flex-col gap-4">
      <h2 className="text-white text-lg font-bold">
        Endereços ({addresses.length})
      </h2>

      <hr className="border-white/10" />

      <div className="flex flex-col gap-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="flex flex-col gap-1 p-3 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-1">
              {address.isMain && (
                <StatusBadge variant="active">Principal</StatusBadge>
              )}
            </div>
            <span className="text-gray-200 text-sm font-medium">
              {address.street}, {address.number}
              {address.complement ? ` - ${address.complement}` : ""}
            </span>
            <span className="text-gray-400 text-xs font-medium">
              {address.neighborhood} — CEP {formatZipCode(address.zipCode)}
            </span>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
