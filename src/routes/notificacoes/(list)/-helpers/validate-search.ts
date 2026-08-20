import { NotificationStatus, NotificationTarget } from "@shared/models";

type Search = {
  page?: number;
  target?: NotificationTarget[];
  status?: NotificationStatus[];
};

export const validateSearch = (search: Record<string, unknown>): Search => {
  const page = Number(search.page) > 1 ? Number(search.page) : undefined;

  const target = formatTarget(search.target);

  const status = formatStatus(search.status);

  return {
    page,
    target,
    status,
  };
};

const formatTarget = (value: unknown): NotificationTarget[] | undefined => {
  if (!Array.isArray(value)) return undefined;

  const targets = value.filter(
    (item): item is NotificationTarget =>
      typeof item === "string" &&
      Object.values(NotificationTarget).includes(item as NotificationTarget),
  );

  return targets.length > 0 ? targets : undefined;
};

const formatStatus = (value: unknown): NotificationStatus[] | undefined => {
  if (!Array.isArray(value)) return undefined;

  const statuses = value.filter(
    (item): item is NotificationStatus =>
      typeof item === "string" &&
      Object.values(NotificationStatus).includes(item as NotificationStatus),
  );

  return statuses.length > 0 ? statuses : undefined;
};
