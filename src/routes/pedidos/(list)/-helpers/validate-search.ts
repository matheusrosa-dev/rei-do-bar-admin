import type { SortDirection } from "@shared/interfaces";
import { OrderStatus, PaymentType } from "@shared/models";
import type { GetOrdersSortKey } from "@shared/services/orders/types";

type Search = {
  page?: number;
  searchTerm?: string;
  status?: OrderStatus;
  paymentType?: PaymentType;
  sortKey?: GetOrdersSortKey;
  sortDirection?: SortDirection;
};

export const validateSearch = (search: Record<string, unknown>): Search => {
  const page = Number(search.page) > 1 ? Number(search.page) : undefined;

  const searchTerm =
    typeof search.searchTerm === "string" ? search.searchTerm : undefined;

  return {
    page,
    searchTerm,
    status: formatStatus(search.status),
    paymentType: formatPaymentType(search.paymentType),

    ...formatSort(search),
  };
};

const formatStatus = (status: unknown): OrderStatus | undefined => {
  const isValidStatus =
    typeof status === "string" &&
    (Object.values(OrderStatus) as string[]).includes(status);

  return isValidStatus ? (status as OrderStatus) : undefined;
};

const formatPaymentType = (paymentType: unknown): PaymentType | undefined => {
  const isValidPaymentType =
    typeof paymentType === "string" &&
    (Object.values(PaymentType) as string[]).includes(paymentType);

  return isValidPaymentType ? (paymentType as PaymentType) : undefined;
};

const formatSort = (search: Record<string, unknown>) => {
  const sortKey =
    typeof search.sortKey === "string"
      ? (search.sortKey as GetOrdersSortKey)
      : undefined;

  let sortDirection: SortDirection | undefined;

  if (sortKey) {
    sortDirection = search.sortDirection as SortDirection;
  }

  return {
    sortKey,
    sortDirection,
  };
};
