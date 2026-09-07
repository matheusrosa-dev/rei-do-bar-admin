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
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { defaultValues, resolver, type Form } from "../-shared/basic-data-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useCategoriesService,
  useCategoryGroupsService,
  useProductsService,
} from "@services";
import { toast } from "sonner";
import { validateSearch } from "./-helpers";

export const Route = createFileRoute("/produtos/criar/")({
  component: RouteComponent,
  validateSearch,
});

function RouteComponent() {
  const { getCategories } = useCategoriesService();
  const { getCategoryGroupById } = useCategoryGroupsService();
  const { createProduct, getProductById, getProducts } = useProductsService();

  const { grupo } = Route.useSearch();
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();

  const { data: categories, ...categoriesQuery } = useQuery({
    queryKey: [getCategories.key],
    queryFn: () => getCategories.fn(),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !grupo,
  });

  const { data: categoryGroup, ...categoryGroupQuery } = useQuery({
    queryKey: [getCategoryGroupById.key, grupo],
    queryFn: () => getCategoryGroupById.fn(grupo ?? ""),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!grupo,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (createdProduct) => {
      toast.success("Produto criado com sucesso!");
      queryClient.setQueryData(
        [getProductById.key, createdProduct.id],
        () => createdProduct,
      );
      queryClient.invalidateQueries({ queryKey: [getProducts.key] });

      navigate({
        to: "/produtos/editar/$productId",
        params: { productId: createdProduct.id },
        replace: true,
      });
    },
  });

  const form = useForm({
    defaultValues,
    resolver,
  });

  const groupCategories = grupo
    ? (categoryGroup?.categories ?? [])
    : (categories ?? []);

  const onSubmit = (formData: Form) => {
    createProductMutation.mutate({
      name: formData.name,
      description: formData.description || null,
      imageUrl: formData.imageUrl,
      price: formData.price,
      categoryId: formData.categoryId,
      compareAtPrice: formData.compareAtPrice || null,
    });
  };

  if (categoriesQuery.isLoading || categoryGroupQuery.isLoading) {
    return <PageLoading title="Criar produto" goBack />;
  }

  if (categoryGroupQuery.isError) {
    return <Navigate to="/produtos" replace />;
  }

  if (categoriesQuery.isError) {
    return <PageError title="Criar produto" goBack />;
  }

  if (categoryGroup && groupCategories.length === 0) {
    return (
      <PageWrapper title="Criar produto" goBack>
        <Wrapper className="max-w-4xl">
          <span className="text-sm text-gray-400">
            O grupo {categoryGroup.name} ainda não possui categorias. Cadastre
            uma categoria para ele em Categorias antes de criar um produto.
          </span>
        </Wrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Criar produto" goBack>
      <Wrapper className="max-w-4xl">
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2 className="text-white text-lg font-bold">Dados básicos</h2>

          <hr className="border-white/10" />

          {categoryGroup && (
            <div className="flex gap-1.5 items-center">
              <span className="text-zinc-300 text-sm font-medium">Grupo:</span>

              <span className="text-amber-500 font-medium">
                {categoryGroup.name}
              </span>
            </div>
          )}

          <div className="flex gap-4">
            <Input
              label="Imagem"
              placeholder="Insira a URL da imagem"
              {...form.register("imageUrl")}
              error={form.formState.errors.imageUrl?.message}
              disabled={createProductMutation.isPending}
            />
          </div>

          <div className="grid grid-cols-10 gap-4">
            <div className="col-span-7">
              <Input
                label="Nome"
                placeholder="Insira o nome do produto"
                {...form.register("name")}
                error={form.formState.errors.name?.message}
                disabled={createProductMutation.isPending}
              />
            </div>

            <div className="col-span-3">
              <Controller
                control={form.control}
                name="categoryId"
                render={({ field, fieldState }) => (
                  <Select
                    label="Categoria"
                    options={groupCategories.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    value={field.value}
                    clearable
                    error={fieldState.error?.message}
                    onChange={field.onChange}
                    disabled={createProductMutation.isPending}
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
            disabled={createProductMutation.isPending}
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
                  disabled={createProductMutation.isPending}
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
