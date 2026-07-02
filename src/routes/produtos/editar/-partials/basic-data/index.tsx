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
import type { ICategory, IProductWithCategory } from "@shared/models";
import { useMemo } from "react";
import { useProductsService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolver, type Form } from "../../../-shared/basic-data-form";

type Props = {
  product: IProductWithCategory;
  categories: ICategory[];
};

export const BasicData = ({ product, categories }: Props) => {
  const { getProductById, updateProduct } = useProductsService();
  const queryClient = useQueryClient();

  const form = useForm<Form>({
    values: {
      name: product.name,
      description: product.description || "",
      imageUrl: product.imageUrl,
      price: product.price,
      categoryId: product.categoryId,
      compareAtPrice: product.compareAtPrice ?? 0,
    },
    resolver,
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (updatedProduct) => {
      toast.success("Produto atualizado com sucesso!");
      queryClient.setQueryData(
        [getProductById.key, product.id],
        () => updatedProduct,
      );
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
        compareAtPrice: formData.compareAtPrice || null,
      },
    });
  };

  const categoriesWithDeactivated = useMemo(() => {
    if (product.category.isActive) return categories;
    return [...categories, product.category];
  }, [product, categories]);

  return (
    <Wrapper>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <h2 className="text-white text-lg font-bold">Dados básicos</h2>

        <hr className="border-white/10" />

        <div className="flex items-center gap-4">
          <ImagePreview src={product.imageUrl} className="size-24" />

          <div className="flex flex-col  gap-2">
            <h2 className="text-amber-500 text-lg font-bold">{product.name}</h2>
            <StatusBadge variant={product.isActive ? "active" : "inactive"}>
              {product.isActive ? "Ativo" : "Inativo"}
            </StatusBadge>

            {!product.stockQuantity && (
              <StatusBadge variant="alert">Esgotado</StatusBadge>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Input
            label="Imagem"
            placeholder="Insira a URL da imagem"
            {...form.register("imageUrl")}
            error={form.formState.errors.imageUrl?.message}
            disabled={updateProductMutation.isPending}
          />
        </div>

        <div className="grid grid-cols-10 gap-4">
          <div className="col-span-7">
            <Input
              label="Nome"
              placeholder="Insira o nome do produto"
              {...form.register("name")}
              error={form.formState.errors.name?.message}
              disabled={updateProductMutation.isPending}
            />
          </div>

          <div className="col-span-3">
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <Select
                  label="Categoria"
                  options={categoriesWithDeactivated.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  value={field.value}
                  clearable
                  error={fieldState.error?.message}
                  onChange={field.onChange}
                  disabled={updateProductMutation.isPending}
                />
              )}
            />
          </div>
        </div>

        <Textarea
          label="Descrição"
          rows={4}
          placeholder="Insira a descrição do produto"
          {...form.register("description")}
          disabled={updateProductMutation.isPending}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="compareAtPrice"
            render={({ field, fieldState }) => (
              <CurrencyInput
                label="Preço de comparação"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                disabled={updateProductMutation.isPending}
              />
            )}
          />

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
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              updateProductMutation.isPending || !form.formState.isDirty
            }
          >
            Salvar alterações
          </Button>
        </div>
      </form>
    </Wrapper>
  );
};
