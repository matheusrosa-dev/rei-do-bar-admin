import axios from "axios";
import type { TypedAxiosInstance } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  auth: {
    username: import.meta.env.VITE_API_USERNAME,
    password: import.meta.env.VITE_API_PASSWORD,
  },
}) as TypedAxiosInstance;

export { api };
