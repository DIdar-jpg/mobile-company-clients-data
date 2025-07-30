import { useEffect } from "react";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog.tsx";

import useClientMutation from "@/hooks/useClientMutation";
import { Client } from "@/hooks/useClient";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage, 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DialogWrapperProps {
   dialogOpen: boolean;
   setDialogOpen: (arg: boolean) => void;
   selectedClient: Client | null; 
   setSelectedClient: (arg: Client | null) => void;
}

const formSchema = z.object({
   name: z.string().min(1, {
      message: "Имя не может быть короче 1 символа.",
   }),
   surname: z.string().min(1, {
      message: "Фамилия не может быть короче 1 символа.",
   }),
   dateOfBirth: z
      .string()
      .regex(/^\d{2}\.\d{2}\.\d{4}$/, {
         message:
            "Дата должна быть в формате ДД.ММ.ГГГГ (например, 28.04.2003).",
      })
      .refine(
         (val) => {
            const parts = val.split(".");
            if (parts.length !== 3) return false;

            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);

            // Проверяем на корректность дня, месяца и года
            if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
            if (
               day < 1 ||
               day > 31 ||
               month < 1 ||
               month > 12 ||
               year < 1900 ||
               year > new Date().getFullYear()
            )
               return false;

            // Проверка на корректность комбинации день-месяц-год
            const date = new Date(year, month - 1, day); // Month is 0-indexed in Date object
            return (
               date.getFullYear() === year &&
               date.getMonth() === month - 1 &&
               date.getDate() === day
            );
         },
         {
            message:
               "Некорректная или недопустимая дата (например, 31 февраля).",
         }
      ), // Преобразуем Date в YYYY-MM-DD строку для формы
   sex: z.enum(["male", "female", ""], {
      message: "Пол должен быть 'male' или 'female'.",
   }),
   email: z.string().email({ message: "Неверный формат email." }),
   number: z
      .string()
      .regex(/^\+?[0-9\s\-()]*$/, {
         message: "Неверный формат номера телефона.",
      }),
});

type FormInput = z.input<typeof formSchema>; 
type FormOutput = z.output<typeof formSchema>; 
const DialogWrapper = ({
   dialogOpen,
   setDialogOpen,
   selectedClient,
   setSelectedClient,
}: DialogWrapperProps) => {
   const { mutate } = useClientMutation();

   const form = useForm<FormInput>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: "",
         surname: "",
         dateOfBirth: "",
         sex: "",
         email: "",
         number: "",
      },
   });

   useEffect(() => {
      if (selectedClient) {
         form.reset({
            name: selectedClient.name,
            surname: selectedClient.surname,
            dateOfBirth: selectedClient.dateOfBirth,
            sex: selectedClient.sex as "" | "male" | "female",
            email: selectedClient.email,
            number: selectedClient.number,
         });
      } else {
         form.reset({
            name: "",
            surname: "",
            dateOfBirth: "",
            sex: "",
            email: "",
            number: "",
         });
      }
   }, [selectedClient, form.reset]);

   const closeEditDialog = () => {
      setDialogOpen(false);
      setSelectedClient(null);
      form.reset(); 
   };

   function onSubmit(values: FormOutput) {
      if(selectedClient){
         mutate({
            method: "put",
            url: `${selectedClient.id}`,
            data: {
               ...values,
            },
         });
      }
      closeEditDialog();
   }

   return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
         <DialogContent
            className="sm:max-w-[425px]"
            onOpenAutoFocus={(event) => event.preventDefault()}
         >
            <DialogHeader>
               <DialogTitle>Edit client profile</DialogTitle>
               <DialogDescription>
                  Make changes to the client's profile here. Click save when
                  you're done.
               </DialogDescription>
            </DialogHeader>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
               >
                  <div className="w-full flex items-start justify-between gap-3 mb-5">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                              <FormMessage />{" "}
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="surname"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Surname</FormLabel>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                              <FormMessage />{" "}
                           </FormItem>
                        )}
                     />
                  </div>

                  <FormField
                     control={form.control}
                     name="sex"
                     render={({ field }) => (
                        <FormItem className="mb-5">
                           <FormLabel>Sex</FormLabel>
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormDescription>
                              Enter male or female or leave input empty if there
                              is no information.
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="dateOfBirth"
                     render={({ field }) => (
                        <FormItem className="mb-5">
                           <FormLabel>Date of Birth</FormLabel>
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem className="mb-5">
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input {...field} type="email" />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="number"
                     render={({ field }) => (
                        <FormItem className="mb-5">
                           <FormLabel>Number</FormLabel>
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <DialogFooter>
                     <DialogClose asChild>
                        <Button
                           variant="outline"
                           type="button"
                           onClick={closeEditDialog}
                        >
                           Cancel
                        </Button>
                     </DialogClose>
                     <Button type="submit">Save changes</Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};
export default DialogWrapper;
