import {
  Button,
  CurrencyInput,
  ImagePreview,
  Input,
  NumberInput,
  PageWrapper,
  Select,
  Textarea,
  Toggle,
} from "@components";
import { useCategoriesService, useProductsService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { defaultValues, resolver, type Form } from "./-helpers";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/produtos/editar/$productId")({
  component: RouteComponent,
});

function RouteComponent() {
  const [formReady, setFormReady] = useState(false);

  const { productId } = Route.useParams();
  const { getProductById } = useProductsService();
  const { getCategories } = useCategoriesService();

  const { data: product, ...productQuery } = useQuery({
    queryKey: [getProductById.key, productId],
    queryFn: () => getProductById.fn(productId),
    retry: false,
  });

  const { data: categories, ...categoriesQuery } = useQuery({
    queryKey: [getCategories.key],
    queryFn: () => getCategories.fn(),
    retry: false,
  });

  const isLoading = productQuery.isLoading || categoriesQuery.isLoading;
  const isError = productQuery.isError || categoriesQuery.isError;

  const form = useForm<Form>({
    defaultValues,
    resolver,
  });

  const onSubmit = (formData: Form) => {
    console.log(formData);
  };

  useEffect(
    function fillForm() {
      if (!isLoading && !isError && product) {
        form.reset({
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
          isActive: product.isActive,
        });
        setFormReady(true);
      }
    },
    [isLoading, isError, product, form.reset],
  );

  if (isLoading || isError || !product || !categories || !formReady)
    return null;

  return (
    <PageWrapper title="Editar produto" goBackTo="/produtos">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-5 rounded-xl border border-white/10 bg-white/5 w-full max-w-5xl"
      >
        <ImagePreview
          src={product.imageUrl}
          className="size-24 rounded-md object-contain bg-white/5"
        />

        <Input
          label="Url da imagem"
          {...form.register("imageUrl")}
          error={form.formState.errors.imageUrl?.message}
        />

        <div className="flex gap-4">
          <Input
            label="Nome"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
          />
        </div>

        <Textarea
          label="Descrição"
          rows={4}
          {...form.register("description")}
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
              />
            )}
          />

          <NumberInput
            label="Estoque"
            placeholder="0"
            {...form.register("stock")}
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
                onValueChange={field.onChange}
              />
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <Toggle
              checked={field.value}
              onCheckedChange={field.onChange}
              label="Ativo?"
            />
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </PageWrapper>
  );
}
