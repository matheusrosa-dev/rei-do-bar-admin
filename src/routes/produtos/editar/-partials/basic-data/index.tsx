import {
  Button,
  CurrencyInput,
  ImagePreview,
  Input,
  Select,
  StatusBadge,
  Textarea,
  Wrapper,
} from "@components";
import { Controller, useForm } from "react-hook-form";
import { defaultValues, resolver, type Form } from "./helpers";
import type { ICategory, IProduct } from "@shared/models";
import { useEffect, useState } from "react";
import { useProductsService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  product: IProduct;
  categories: ICategory[];
};

export const BasicData = ({ product, categories }: Props) => {
  const [formReady, setFormReady] = useState(false);

  const { getProductById, updateProduct } = useProductsService();
  const queryClient = useQueryClient();

  const form = useForm<Form>({
    defaultValues,
    resolver,
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (updateProduct) => {
      toast.success("Produto atualizado com sucesso!");
      queryClient.setQueryData(
        [getProductById.key, product.id],
        () => updateProduct,
      );
    },
    onError: () => {
      toast.error("Ocorreu um erro ao editar o produto.");
    },
  });

  const onSubmit = (formData: Form) => {
    updateProductMutation.mutate({
      productId: product.id,
      body: {
        name: formData.name,
        description: formData.description || null,
        imageUrl: formData.imageUrl,
        price: formData.price,
        categoryId: formData.categoryId,
      },
    });
  };

  useEffect(function fillForm() {
    form.reset({
      name: product.name,
      description: product.description || "",
      imageUrl: product.imageUrl,
      price: product.price,
      categoryId: product.categoryId,
    });
    setFormReady(true);
  }, []);

  if (!formReady) return null;

  return (
    <Wrapper>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <h2 className="text-white text-lg font-bold">Dados básicos</h2>

        <hr className="border-white/10" />

        <div className="flex items-center gap-4">
          <ImagePreview
            src={product.imageUrl}
            className="size-24 rounded-md object-contain bg-white/5"
          />

          <div className="flex flex-col  gap-2">
            <h2 className="text-amber-500 text-lg font-bold text-center">
              {product.name}
            </h2>
            <StatusBadge variant={product.isActive ? "active" : "inactive"}>
              {product.isActive ? "Ativo" : "Inativo"}
            </StatusBadge>

            {!product.stock && (
              <StatusBadge variant="alert">Esgotado</StatusBadge>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Input
            label="Imagem"
            {...form.register("imageUrl")}
            error={form.formState.errors.imageUrl?.message}
            disabled={updateProductMutation.isPending}
          />
        </div>

        <div className="flex gap-4">
          <Input
            label="Nome"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
            disabled={updateProductMutation.isPending}
          />
        </div>

        <Textarea
          label="Descrição"
          rows={4}
          {...form.register("description")}
          disabled={updateProductMutation.isPending}
        />

        <div className="flex gap-4">
          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <CurrencyInput
                label="Preço"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                disabled={updateProductMutation.isPending}
              />
            )}
          />

          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <Select
                label="Categoria"
                options={categories.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={field.value}
                onChange={field.onChange}
                disabled={updateProductMutation.isPending}
              />
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              updateProductMutation.isPending || !form.formState.isDirty
            }
          >
            Salvar
          </Button>
        </div>
      </form>
    </Wrapper>
  );
};
