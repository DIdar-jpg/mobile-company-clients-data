import { useQuery } from "@tanstack/react-query";
import axios, { type AxiosResponse } from "axios";

export type Client = {
   id: string,
   name: string,
   surname: string,
   dateOfBirth: string;
   sex: "" | "male" | "female"; 
   email: string,
   number: string
}

export function useClient(): { status: string, data: Client[], error: object | null } {

   const formatDate = (res: AxiosResponse) => { 
      const result = res.data.map((client: Client) => {
         const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        const date = new Date(client.dateOfBirth)
        return {
         ...client,
         dateOfBirth: date.toLocaleDateString('ru-RU', options)
        }
      })
      return result
   }

   const { status, data = [], error } = useQuery<Client[]>({
      queryKey: ["clients"],
      queryFn: function () {
         return axios({
            method: "get",
            baseURL: "https://67891f1e2c874e66b7d7ac43.mockapi.io",
            url: "clients",
         })
         .then((res) => formatDate(res) )
      },
   });

   return { status, data, error };
}
