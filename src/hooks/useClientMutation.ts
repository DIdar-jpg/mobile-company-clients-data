// useClientMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./apiRequest";
import type { Client } from "./useClient";

// useMutation — хук React Query, чтобы отправлять POST/PUT/DELETE-запросы.
// useQueryClient — нужен, чтобы обновить кэш после успешной мутации (например, перезагрузить список клиентов).\
// Partial Это встроенный утилитный тип TypeScript, который делает все поля типа Client необязательными.
type MutationParams = {
   method: "post" | "put" | "delete";
   url: string;
   data?: Partial<Client>;
};

const useClientMutation = () => {
   // получаем доступ к кэшу (queryClient)
   const queryClient = useQueryClient();

   // функция получает на вход объект params, и он должен соответствовать типу MutationParams
   return useMutation({
      mutationFn: (params: MutationParams) =>
         // Partial<Client> — тип тела запроса (что мы отправляем на сервер)
         // any — тип ответа от сервера (что мы получим обратно)
         apiRequest<Partial<Client>, any>({
            url: params.url,
            method: params.method,
            data: params.data,
         }),
      // Обновляем кеш или делаем новый GET чтобы данные в таблице изменились.
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["clients"] });
      },

      onError: (error) => {
         console.error("Ошибка в useClientMutation:", error);
      },
   });
};
export default useClientMutation
