import axios from "axios";
import type { TypedAxiosInstance } from "./types";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  auth: {
    username: import.meta.env.VITE_API_USERNAME,
    password: import.meta.env.VITE_API_PASSWORD,
  },
  paramsSerializer: { indexes: null },
}) as TypedAxiosInstance;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message, {
        description: error.response.data.code,
      });
    } else {
      toast.error("Erro desconhecido.");
    }

    return Promise.reject(error);
  },
);

export { api };
