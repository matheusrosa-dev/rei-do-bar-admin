import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

export interface IApiResponse<T> {
  data: T;
}

export type TypedAxiosInstance = Omit<
  AxiosInstance,
  "get" | "post" | "put" | "delete" | "patch" | "request"
> & {
  get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<IApiResponse<T>>>;
  post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<IApiResponse<T>>>;
  put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<IApiResponse<T>>>;
  delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<IApiResponse<T>>>;
  patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<IApiResponse<T>>>;
  request<T>(
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse<IApiResponse<T>>>;
};

export interface IApiError
  extends AxiosError<{
    code: string;
    message: string;
  }> {}
