import { Modal, StatusBadge } from "@components";
import * as RadixDialog from "@radix-ui/react-dialog";
import { formatDateTime } from "@shared/helpers/string";
import type { INotification } from "@shared/models";
import {
  NOTIFICATION_ACTION_LABEL,
  NOTIFICATION_STATUS_LABEL,
  NOTIFICATION_STATUS_VARIANT,
  NOTIFICATION_TARGET_LABEL,
} from "../-helpers";

type Props = {
  notification: INotification | null;
  onClose: () => void;
};

export const NotificationDetailModal = ({ notification, onClose }: Props) => {
  return (
    <Modal isOpen={!!notification} onClose={onClose}>
      {notification && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <RadixDialog.Title className="text-white font-bold text-lg">
                {notification.title}
              </RadixDialog.Title>

              <StatusBadge
                variant={NOTIFICATION_STATUS_VARIANT[notification.status]}
              >
                {NOTIFICATION_STATUS_LABEL[notification.status]}
              </StatusBadge>
            </div>

            <RadixDialog.Description className="text-gray-400 text-sm flex flex-col gap-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  Segmento:{" "}
                  <span className="text-gray-300 font-bold">
                    {NOTIFICATION_TARGET_LABEL[notification.target]}
                  </span>
                </div>

                <div>
                  Enviada em:{" "}
                  <span className="text-gray-300 font-bold">
                    {formatDateTime(notification.createdAt)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  Ação ao pressionar:{" "}
                  {notification.action ? (
                    <span className="text-gray-300 font-bold">
                      {NOTIFICATION_ACTION_LABEL[notification.action]}
                    </span>
                  ) : (
                    <span className="text-gray-500 font-bold">Sem ação</span>
                  )}
                </div>

                <div>
                  Alcance:{" "}
                  <span className="text-gray-300 font-bold">
                    {notification.customersCount} cliente
                    {notification.customersCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </RadixDialog.Description>
          </div>

          <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
            <span className="text-gray-500 text-sm">Descrição</span>

            <span className="text-gray-200 text-sm whitespace-pre-wrap">
              {notification.description}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
};
