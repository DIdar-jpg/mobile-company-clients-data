import React from "react";
import { useMemo, useState } from "react";
import { useClient, Client } from "@/hooks/useClient";
import useMediaQuery from "@/hooks/useMediaQuery";
import useClientMutation from "@/hooks/useClientMutation";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox";

import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRoundPen } from "lucide-react";
import { Trash } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import ClientsTable from "./ClientsTable";
import DrawerWrapper from "./DrawerWrapper";

// const formSchema = z.object({
//    name: z.string().min(1, {
//        message: "Name can not be less than 1 symbol.",
//    }),
//    surname: z.string().min(1, {
//        message: "Surname can not be less than 1 symbol.",
//    }),
//    dateOfBirth: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
//       message: "Invalid date format.", // Базовая проверка на валидность даты
//   }).transform((val) => new Date(val)),
//   sex: z.enum(["male", "female"], {
//    errorMap: (issue, ctx) => {
//        if (issue.code === z.ZodIssueCode.invalid_enum_value) {
//            return { message: "Sex must be only 'male' or 'female'." };
//        }
//        return { message: ctx.defaultError };
//    }}),
//    email: z.string().email({ message: "Invalid email format." }),
//    number: z.string().regex(/^\+?[0-9\s\-()]*$/, { message: "Invalid number format." }),
// });

const ClientsTableWrapper: React.FC = () => {
   const { mutate } = useClientMutation();
   const isMobile = useMediaQuery("(max-width: 1024px)");
   const [selectedClient, setSelectedClient] = useState<Client | null>(null);
   const [drawerOpen, setDrawerOpen] = useState(false);
   const [dialogOpen, setDialogOpen] = useState(false);

   const [editClientName, setEditClientName] = useState("");
   const [editClientUsername, setEditClientUsername] = useState("");

   //    const form = useForm<FormValues>({
   //       resolver: zodResolver(formSchema),
   //       defaultValues: {
   //           name: "",
   //           surname: "",
   //           dateOfBirth: "",
   //           sex: "",
   //           email: "",
   //           number: "",
   //       },
   //   });

   const handleRowClick = (client: Client) => {
      if (isMobile) {
         setSelectedClient(client);
         setDrawerOpen(true);
      }
   };

   const openEditDialog = (client: Client) => {
      if (client) { 
      setSelectedClient(client);
      setEditClientName(client.name); // Инициализация формы данными выбранного клиента
      // setEditClientUsername(client.username); // Если есть поле username в Client
      setDialogOpen(true);
      }
   };

   // Функция для закрытия Dialog и сброса выбранного клиента
   const closeEditDialog = () => {
      setDialogOpen(false);
      setSelectedClient(null);
      setEditClientName(""); // Сброс полей формы
      setEditClientUsername("");
   };

   const handleDelete = (client: Client,  action: (arg: boolean) => void = (_arg: boolean) => { }) => {
      if (client){
         mutate({
            method: "delete",
            url: `${client.id}`,
         });
         action(false)
      }
   };
   const handleSaveChanges = () => {
      console.log(selectedClient);
      if (selectedClient) {
         // Здесь вы будете отправлять изменения на сервер
         // Например:
         mutate({
            method: "put", // Или "put"
            url: `${selectedClient.id}`,
            data: {
               ...selectedClient, // Сохраняем все оригинальные данные
               name: editClientName,
               // username: editClientUsername, // Обновляем из полей формы
               // ... другие обновленные поля
            },
         });
         closeEditDialog(); // Закрываем модальное окно после сохранения
      }
   };

   const columns = useMemo<ColumnDef<Client>[]>(() => {
      return [
         {
            id: "select",
            header: ({ table }) => (
               <Checkbox
                  checked={
                     table.getIsAllPageRowsSelected() ||
                     (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                     table.toggleAllPageRowsSelected(!!value)
                  }
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Select all"
               />
            ),
            cell: ({ row }) => (
               <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Select row"
               />
            ),
         },
         {
            accessorKey: "name",
            header: "Name",
         },
         {
            accessorKey: "surname",
            header: "Surname",
         },
         {
            accessorKey: "dateOfBirth",
            header: "Date of Birth",
         },
         {
            accessorKey: "sex",
            header: "Sex",
         },
         {
            accessorKey: "email",
            header: ({ column }) => {
               return (
                  <Button
                     variant="ghost"
                     onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                     }
                  >
                     Email
                     <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
               );
            },
         },
         {
            accessorKey: "number",
            header: "Number",
         },
         {
            id: "actions",
            cell: ({ row }) => {
               const client = row.original;

               return (
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant="ghost"
                           className="h-8 w-8 p-0"
                           onClick={(e) => e.stopPropagation()} // <--- ВАЖНО
                        >
                           <span className="sr-only">Open menu</span>
                           <MoreHorizontal className="h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuItem
                           className="bg-warning"
                           onSelect={() => { openEditDialog(client) }}
                        >
                           Change
                           <UserRoundPen className="text-popover-foreground" />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           className="bg-destructive"
                           onSelect={() => { handleDelete(client) }}
                        >
                           Delete <Trash className="text-popover-foreground" />
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               );
            },
            header: "Actions",
         },
      ];
   }, [mutate, openEditDialog]);

   const { status, data } = useClient();

   return (
      <div className="py-10">
         {/* data! — это non-null assertion. Ты говоришь TypeScript: "я точно знаю, что это не undefined". */}
         {status === "success" && (
            <ClientsTable
               columns={columns}
               data={data!}
               filterPlaceholder="Filter emails..."
               filterKey="email"
               onRowClick={handleRowClick}
            />
         )}

         <DrawerWrapper
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            selectedClient={selectedClient}
            openEditDialog={openEditDialog}
            handleDelete={handleDelete}
         />

         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveChanges();
               }}
            >
               <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                     <DialogTitle>Edit client profile</DialogTitle>
                     <DialogDescription>
                        Make changes to the client's profile here. Click save
                        when you're done.
                     </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                     <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                           id="name"
                           name="name"
                           value={editClientName}
                           onChange={(e) => setEditClientName(e.target.value)}
                        />
                     </div>
                     {/* Пример добавления других полей, например, Surname */}
                     <div className="grid gap-3">
                        <Label htmlFor="surname">Surname</Label>
                        <Input
                           id="surname"
                           name="surname"
                           value={selectedClient?.surname || ""} // Используем optional chaining и пустую строку как fallback
                           // Обычно здесь будет отдельное состояние для каждого поля или форма с useForm
                           onChange={(e) => {
                              if (selectedClient) {
                                 setSelectedClient({
                                    ...selectedClient,
                                    surname: e.target.value,
                                 });
                              }
                           }}
                        />
                     </div>
                     {/* Замените эти инпуты на ваши реальные поля Client */}
                     {/* <div className="grid gap-3">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={editClientUsername}
                                    onChange={(e) => setEditClientUsername(e.target.value)}
                                />
                            </div> */}
                  </div>
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
               </DialogContent>
            </form>
         </Dialog>
      </div>
   );
};

export default ClientsTableWrapper;
