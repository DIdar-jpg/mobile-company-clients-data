import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Client = {
   id: string,
   name: string,
   surname: string,
   dateOfBirth: string,
   sex: string,
   email: string,
   number: string
}

export function useClient(): { status: string, data: Client[], error: object | null } {
   // To subscribe to a query in your components or custom hooks, call the useQuery hook with at least:
   // A unique key for the query
   // A function that returns a promise that:
   // Resolves the data, or
   // Throws an error
   // The unique key you provide is used internally for refetching, caching, and sharing your queries throughout your application.
   const { status, data = [], error } = useQuery<Client[]>({
      queryKey: ["clients"],
      queryFn: function () {
         return axios({
            method: "get",
            baseURL: "https://67891f1e2c874e66b7d7ac43.mockapi.io",
            url: "clients",
         }).then((res) => res.data); // нужно возвращать res.data, а не undefined
      },
   });

   // Для примера: можно возвращать data, статус и ошибку
   return { status, data, error };
}
