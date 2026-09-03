import { Select } from "@components";
import { useDeliveryPersonsService } from "@services";
import { useQuery } from "@tanstack/react-query";

type Props = {
  value: string | null;
  disabled: boolean;
  onChange: (deliveryPersonId: string | null) => void;
};

export const DeliveryPersonSelect = ({ value, disabled, onChange }: Props) => {
  const { getDeliveryPersonsSimple } = useDeliveryPersonsService();

  const {
    data: deliveryPersons,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [getDeliveryPersonsSimple.key],
    queryFn: getDeliveryPersonsSimple.fn,
    retry: false,
  });

  const selectableDeliveryPersons = (deliveryPersons ?? []).filter(
    (deliveryPerson) => deliveryPerson.isActive || deliveryPerson.id === value,
  );

  if (isLoading) {
    return (
      <span className="text-zinc-500 text-sm text-center block">
        Carregando entregadores...
      </span>
    );
  }

  if (isError) {
    return (
      <span className="text-zinc-500 text-sm text-center block">
        Não foi possível carregar os entregadores.
      </span>
    );
  }

  if (selectableDeliveryPersons.length === 0) {
    return (
      <span className="text-zinc-500 text-sm text-center block">
        Nenhum entregador ativo cadastrado.
      </span>
    );
  }

  return (
    <Select
      label="Entregador"
      placeholder="Selecione o entregador"
      options={selectableDeliveryPersons.map((deliveryPerson) => ({
        value: deliveryPerson.id,
        label: deliveryPerson.name,
      }))}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
};
