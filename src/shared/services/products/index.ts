import type { IProduct } from "@shared/models";
import { api } from "../api";
import type {
  GetProductById,
  GetProducts,
  GetProdutsResponse,
  UseProductsService,
} from "./types";

export const useProductsService: UseProductsService = () => {
  const baseUrl = "/products";

  const getProducts: GetProducts = async (queries) => {
    const response = await api.get<GetProdutsResponse>(baseUrl, {
      params: queries,
    });

    return response.data.data;
  };

  const getProductById: GetProductById = async (productId) => {
    const response = await api.get<IProduct>(`${baseUrl}/${productId}`);

    return response.data.data;
  };

  return {
    getProducts: {
      fn: getProducts,
      key: "get-products",
    },
    getProductById: {
      fn: getProductById,
      key: "get-product-by-id",
    },
  };
};
