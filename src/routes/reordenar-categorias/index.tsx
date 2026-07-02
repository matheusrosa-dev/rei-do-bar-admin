import { useCategoriesService } from "@services";
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
import { useEffect, useState } from "react";
import type { ICategory } from "@shared/models";
import { PageWrapper, PageError, PageLoading, Button } from "@components";
import { SortableItem } from "./-partials";
import { toast } from "sonner";

export const Route = createFileRoute("/reordenar-categorias/")({
  component: ReorderCategories,
});

function ReorderCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const { getCategoriesToSortOrder, updateCategoriesOrder } =
    useCategoriesService();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: [getCategoriesToSortOrder.key],
    queryFn: getCategoriesToSortOrder.fn,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const updateCategoriesOrderMutation = useMutation({
    mutationFn: () =>
      updateCategoriesOrder({
        orderedIds: categories.map((item) => item.id),
      }),
    onSuccess: (updatedCategories) => {
      queryClient.setQueryData(
        [getCategoriesToSortOrder.key],
        updatedCategories,
      );
      toast.success("Categorias reordenadas com sucesso!");
    },
  });

  const isDirty = !!data && JSON.stringify(data) !== JSON.stringify(categories);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setCategories((current) => {
      const oldIndex = current.findIndex((c) => c.id === active.id);
      const newIndex = current.findIndex((c) => c.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
  }

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setCategories(data);
    }
  }, [data, isLoading, isError]);

  if (isLoading) return <PageLoading title="Reordenar categorias" />;

  if (isError || !data) return <PageError title="Reordenar categorias" />;

  return (
    <PageWrapper title="Reordenar categorias">
      <div className="pb-48 w-[80%] max-w-200 mx-auto">
        <div className="flex justify-end items-center gap-4 mb-4">
          {isDirty && (
            <Button
              disabled={updateCategoriesOrderMutation.isPending}
              onClick={() => setCategories(data)}
              variant="secondary"
            >
              Voltar alterações
            </Button>
          )}
          <Button
            disabled={!isDirty || updateCategoriesOrderMutation.isPending}
            onClick={() => updateCategoriesOrderMutation.mutate()}
          >
            Salvar alterações
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            disabled={updateCategoriesOrderMutation.isPending}
            items={categories.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {categories.map((category, index) => (
                <SortableItem
                  key={category.id}
                  category={category}
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
