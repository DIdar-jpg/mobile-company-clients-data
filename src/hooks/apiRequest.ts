// apiRequest.ts
import axios, { AxiosRequestConfig, Method } from "axios";

const BASE_URL = "https://67891f1e2c874e66b7d7ac43.mockapi.io/clients";

// method: "get" | "post" | "put" | "delete" и т.д.
// T - Тело запроса (например, для POST или PUT)
// config доп настройки для запросов, по типу header
interface ApiRequestParams<T> {
  url: string;
  method: Method;
  data?: T;
  config?: AxiosRequestConfig;
}
// Это обобщённая (generic) функция, где:
// TRequest — тип отправляемых данных (например, Partial<Client>)
// TResponse — тип ожидаемого ответа (например, Client[])
// Ты можешь указать эти типы при вызове, и TypeScript будет их проверять.
export const apiRequest = async <TRequest = unknown, TResponse = unknown>({
  url,
  method,
  data,
  config,
}: ApiRequestParams<TRequest>): Promise<TResponse> => {
  const response = await axios({
    baseURL: BASE_URL,
    url,
    method,
    data,
    ...config,
  });

  return response.data;
};
