import { useSettingsService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { ISetting } from "@shared/models";
import { groupSettings } from "../-helpers";
import { EditModal } from "./edit-modal";
import { SettingCard } from "./setting-card";
import { SettingSection } from "./setting-section";
import { StatusModal } from "./status-modal";

type Props = {
  settings: ISetting[];
};

type ModalOpen =
  | { mode: "edit"; setting: ISetting }
  | { mode: "toggle-status"; setting: ISetting };

export const SettingsPanel = ({ settings }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const queryClient = useQueryClient();
  const { getSettings, activateSetting, deactivateSetting } =
    useSettingsService();

  const toggleSettingMutation = useMutation({
    mutationFn: (setting: ISetting) => {
      if (setting.isActive) {
        return deactivateSetting({ settingKey: setting.key });
      }

      return activateSetting({ settingKey: setting.key });
    },
    onSuccess: (_, setting) => {
      toast.success(
        `Configuração ${setting.isActive ? "desativada" : "ativada"} com sucesso!`,
      );
      queryClient.invalidateQueries({ queryKey: [getSettings.key] });
      setModalOpen(null);
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {groupSettings(settings).map((group) => (
        <SettingSection key={group.id} title={group.title}>
          {group.settings.map((setting) => (
            <SettingCard
              key={setting.id}
              setting={setting}
              isPending={
                toggleSettingMutation.isPending &&
                modalOpen?.mode === "toggle-status" &&
                modalOpen.setting.id === setting.id
              }
              onToggle={() => setModalOpen({ mode: "toggle-status", setting })}
              onEdit={
                group.editable
                  ? () => setModalOpen({ mode: "edit", setting })
                  : undefined
              }
            />
          ))}
        </SettingSection>
      ))}

      <EditModal
        setting={modalOpen?.mode === "edit" ? modalOpen.setting : null}
        onClose={() => setModalOpen(null)}
      />

      <StatusModal
        isOpen={modalOpen?.mode === "toggle-status"}
        mode={
          modalOpen?.mode === "toggle-status" && modalOpen.setting.isActive
            ? "deactivate"
            : "activate"
        }
        canClose={!toggleSettingMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          if (modalOpen?.mode === "toggle-status") {
            toggleSettingMutation.mutate(modalOpen.setting);
          }
        }}
      />
    </div>
  );
};
