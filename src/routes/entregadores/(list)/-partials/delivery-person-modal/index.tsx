import {
  Button,
  CpfInput,
  Input,
  Modal,
  PhoneInput,
  ZipCodeInput,
} from "@components";
import { useDeliveryPersonsService, useViaCepService } from "@services";
import type { IDeliveryPerson } from "@shared/models";
import * as RadixDialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  deliveryPersonToForm,
  defaultValues,
  resolver,
  type Form,
} from "./form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  deliveryPerson?: IDeliveryPerson;
};

const getSubmitLabel = (isEditing: boolean, isPending: boolean) => {
  if (isPending) return "Salvando...";
  return isEditing ? "Salvar alterações" : "Criar entregador";
};

export const DeliveryPersonModal = ({
  isOpen,
  onClose,
  deliveryPerson,
}: Props) => {
  const queryClient = useQueryClient();
  const { createDeliveryPerson, updateDeliveryPerson, getDeliveryPersons } =
    useDeliveryPersonsService();
  const { lookupZipCode } = useViaCepService();

  const isEditing = !!deliveryPerson;

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<Form>({
    defaultValues,
    resolver,
    values: deliveryPerson ? deliveryPersonToForm(deliveryPerson) : undefined,
  });

  const { mutate: triggerZipCodeLookup, isPending: isLookingUpZipCode } =
    useMutation({
      mutationFn: lookupZipCode,
      onSuccess: (result) => {
        if (!result) return;
        setValue("address.street", result.street, { shouldDirty: true });
        setValue("address.neighborhood", result.neighborhood, {
          shouldDirty: true,
        });
      },
    });

  const onCloseHandler = () => {
    reset();
    onClose();
  };

  const createMutation = useMutation({
    mutationFn: createDeliveryPerson,
    onSuccess: () => {
      toast.success("Entregador criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getDeliveryPersons.key] });
      onCloseHandler();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables: {
      deliveryPersonId: string;
      body: Parameters<typeof updateDeliveryPerson>[1];
    }) => updateDeliveryPerson(variables.deliveryPersonId, variables.body),
    onSuccess: () => {
      toast.success("Entregador atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getDeliveryPersons.key] });
      onCloseHandler();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: Form) => {
    if (deliveryPerson) {
      updateMutation.mutate({
        deliveryPersonId: deliveryPerson.id,
        body: {
          name: data.name,
          phone: data.phone,
          cpf: data.cpf,
          address: {
            street: data.address.street,
            number: data.address.number,
            neighborhood: data.address.neighborhood,
            zipCode: data.address.zipCode,
          },
        },
      });
      return;
    }

    createMutation.mutate({
      name: data.name,
      phone: data.phone,
      cpf: data.cpf,
      address: {
        street: data.address.street,
        number: data.address.number,
        neighborhood: data.address.neighborhood,
        zipCode: data.address.zipCode,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} canClose={!isPending} onClose={onCloseHandler}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <RadixDialog.Title className="text-white font-bold text-lg">
            {isEditing ? "Editar entregador" : "Criar entregador"}
          </RadixDialog.Title>

          <RadixDialog.Description className="text-zinc-400 text-sm">
            {isEditing
              ? "Atualize os dados do entregador."
              : "Preencha os dados do entregador."}
          </RadixDialog.Description>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nome"
            placeholder="Nome do entregador"
            error={errors.name?.message}
            disabled={isPending}
            {...register("name")}
          />

          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <PhoneInput
                  label="Telefone"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  disabled={isPending}
                />
              )}
            />

            <Controller
              control={control}
              name="cpf"
              render={({ field, fieldState }) => (
                <CpfInput
                  label="CPF"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  disabled={isPending}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-zinc-300 text-sm font-medium">Endereço</span>

            <hr className="border-white/10" />
          </div>

          <Controller
            control={control}
            name="address.zipCode"
            render={({ field, fieldState }) => (
              <ZipCodeInput
                label="CEP"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  if (value.length === 8) {
                    triggerZipCodeLookup(value);
                  }
                }}
                error={fieldState.error?.message}
                disabled={isPending || isLookingUpZipCode}
                isLoading={isLookingUpZipCode}
              />
            )}
          />

          <div className="grid grid-cols-10 gap-3">
            <div className="col-span-7">
              <Input
                label="Rua"
                placeholder="Nome da rua"
                error={errors.address?.street?.message}
                disabled={isPending || isLookingUpZipCode}
                {...register("address.street")}
              />
            </div>

            <div className="col-span-3">
              <Input
                label="Número"
                placeholder="Nº"
                error={errors.address?.number?.message}
                disabled={isPending || isLookingUpZipCode}
                {...register("address.number")}
              />
            </div>
          </div>

          <Input
            label="Bairro"
            placeholder="Bairro"
            error={errors.address?.neighborhood?.message}
            disabled={isPending || isLookingUpZipCode}
            {...register("address.neighborhood")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCloseHandler}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || (!isDirty && isEditing)}
            >
              {getSubmitLabel(isEditing, isPending)}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
