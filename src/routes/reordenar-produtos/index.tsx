import { useProductsService } from "@services";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { IProduct } from "@shared/models";
import { PageWrapper, PageError, PageLoading, Button } from "@components";
import { SortableItem } from "./-partials";
import { toast } from "sonner";

export const Route = createFileRoute("/reordenar-produtos/")({
  component: ReorderProducts,
});

function ReorderProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);

  const { getProductsToSortOrder, updateProductsOrder } = useProductsService();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: [getProductsToSortOrder.key],
    queryFn: getProductsToSortOrder.fn,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const updateProductsOrderMutation = useMutation({
    mutationFn: () =>
      updateProductsOrder({
        orderedIds: products.map((item) => item.id),
      }),
    onSuccess: (updatedProducts) => {
      queryClient.setQueryData([getProductsToSortOrder.key], updatedProducts);
      toast.success("Produtos reordenados com sucesso!");
    },
  });

  const isDirty = useMemo(() => {
    if (!data || !products) return false;

    return JSON.stringify(data) !== JSON.stringify(products);
  }, [data, products]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setProducts((current) => {
      const oldIndex = current.findIndex((p) => p.id === active.id);
      const newIndex = current.findIndex((p) => p.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
  }

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setProducts(data);
    }
  }, [data, isLoading, isError]);

  if (isLoading) return <PageLoading title="Reordenar produtos" />;

  if (isError || !data) return <PageError title="Reordenar produtos" />;

  return (
    <PageWrapper title="Reordenar produtos">
      <div className="pb-48 w-1/2 mx-auto">
        <div className="flex justify-end items-center gap-4 mb-4">
          {isDirty && (
            <Button
              disabled={updateProductsOrderMutation.isPending}
              onClick={() => setProducts(data)}
              variant="secondary"
            >
              Voltar alterações
            </Button>
          )}
          <Button
            disabled={!isDirty || updateProductsOrderMutation.isPending}
            onClick={() => updateProductsOrderMutation.mutate()}
          >
            Salvar
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            disabled={updateProductsOrderMutation.isPending}
            items={products.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {products.map((product, index) => (
                <SortableItem
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </PageWrapper>
  );
}
