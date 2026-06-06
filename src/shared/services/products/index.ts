import type { IProduct } from "@shared/models";
import { api } from "../api";
import type {
  ActivateProduct,
  CreateProduct,
  DeactivateProduct,
  DecrementStock,
  GetProductById,
  GetProducts,
  GetProdutsResponse,
  IncrementStock,
  RemoveProduct,
  UpdateProduct,
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

  const updateProduct: UpdateProduct = async ({ productId, body }) => {
    const response = await api.put<IProduct>(`${baseUrl}/${productId}`, body);

    return response.data.data;
  };

  const activateProduct: ActivateProduct = async (productId) => {
    const response = await api.patch<IProduct>(
      `${baseUrl}/${productId}/activate`,
    );

    return response.data.data;
  };

  const removeProduct: RemoveProduct = async (productId) => {
    await api.delete(`${baseUrl}/${productId}`);
  };

  const deactivateProduct: DeactivateProduct = async (productId) => {
    const response = await api.patch<IProduct>(
      `${baseUrl}/${productId}/deactivate`,
    );

    return response.data.data;
  };

  const incrementStock: IncrementStock = async ({ productId, body }) => {
    const response = await api.patch<IProduct>(
      `${baseUrl}/${productId}/increment-stock`,
      body,
    );

    return response.data.data;
  };

  const decrementStock: DecrementStock = async ({ productId, body }) => {
    const response = await api.patch<IProduct>(
      `${baseUrl}/${productId}/decrement-stock`,
      body,
    );

    return response.data.data;
  };

  const createProduct: CreateProduct = async (body) => {
    const response = await api.post<IProduct>(`${baseUrl}`, body);

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
    updateProduct,
    activateProduct,
    deactivateProduct,
    incrementStock,
    decrementStock,
    removeProduct,
    createProduct,
  };
};
