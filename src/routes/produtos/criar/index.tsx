import {
  Button,
  CurrencyInput,
  Input,
  PageError,
  PageLoading,
  PageWrapper,
  Select,
  Textarea,
  Wrapper,
} from "@components";
import { createFileRoute } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { defaultValues, resolver, type Form } from "../-shared/basic-data-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCategoriesService, useProductsService } from "@services";
import { toast } from "sonner";

export const Route = createFileRoute("/produtos/criar/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { getCategories } = useCategoriesService();
  const { createProduct, getProductById } = useProductsService();

  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [getCategories.key, "active"],
    queryFn: () => getCategories.fn({ isActive: true }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (createdProduct) => {
      toast.success("Produto criado com sucesso!");
      queryClient.setQueryData(
        [getProductById.key, createdProduct.id],
        () => createdProduct,
      );

      navigate({
        to: "/produtos/editar/$productId",
        params: { productId: createdProduct.id },
      });
    },
  });

  const form = useForm({
    defaultValues,
    resolver,
  });

  const onSubmit = (formData: Form) => {
    createProductMutation.mutate({
      name: formData.name,
      description: formData.description || null,
      imageUrl: formData.imageUrl,
      price: formData.price,
      categoryId: formData.categoryId,
    });
  };

  if (isLoading) {
    return <PageLoading title="Criar produto" goBackTo="/produtos" />;
  }

  if (isError || !categories) {
    return <PageError title="Criar produto" goBackTo="/produtos" />;
  }

  return (
    <PageWrapper title="Criar produto" goBackTo="/produtos">
      <Wrapper className="max-w-4xl">
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2 className="text-white text-lg font-bold">Dados básicos</h2>

          <hr className="border-white/10" />

          <div className="flex gap-4">
            <Input
              label="Imagem"
              placeholder="Insira a URL da imagem"
              {...form.register("imageUrl")}
              error={form.formState.errors.imageUrl?.message}
              disabled={createProductMutation.isPending}
            />
          </div>

          <div className="flex gap-4">
            <Input
              label="Nome"
              placeholder="Insira o nome do produto"
              {...form.register("name")}
              error={form.formState.errors.name?.message}
              disabled={createProductMutation.isPending}
            />
          </div>

          <Textarea
            label="Descrição"
            placeholder="Insira a descrição do produto"
            rows={4}
            {...form.register("description")}
            disabled={createProductMutation.isPending}
          />

          <div className="flex gap-4 flex-wrap">
            <Controller
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <CurrencyInput
                  label="Preço"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  disabled={createProductMutation.isPending}
                />
              )}
            />

            <Controller
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <Select
                  label="Categoria"
                  options={categories.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  clearable
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  disabled={createProductMutation.isPending}
                />
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={createProductMutation.isPending}>
              Salvar
            </Button>
          </div>
        </form>
      </Wrapper>
    </PageWrapper>
  );
}
