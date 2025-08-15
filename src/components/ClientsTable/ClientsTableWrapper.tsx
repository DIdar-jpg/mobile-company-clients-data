import React from "react";

import { useMemo, useState, useContext } from "react";

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

import { Checkbox } from "@/components/ui/checkbox";


import { UserRoundPen } from "lucide-react";

import { Trash } from "lucide-react";

import { ArrowUpDown } from "lucide-react";

import { MoreHorizontal } from "lucide-react";

import ClientsTable from "./ClientsTable";

import DrawerWrapper from "../DrawerWrapper.tsx";

import DialogWrapper from "../DialogWrapper.tsx";


import { useDialog } from '@/context/DialogContext.tsx';

import { useTableSelection } from '@/context/TableSelectionContext.tsx';


const ClientsTableWrapper: React.FC = () => {

   const { mutate } = useClientMutation();

   const isMobile = useMediaQuery("(max-width: 1024px)");

   const [drawerOpen, setDrawerOpen] = useState(false);

   const { status, data } = useClient();


   const { setDialogOpen, selectedClient, setSelectedClient } = useDialog();

   const { selectedClients, setSelectedClients } = useTableSelection();


   const handleRowClick = (client: Client) => {

      if (isMobile) {

         setSelectedClient(client);

         setDrawerOpen(true);

      }

   };


   const openEditDialog = (client: Client) => {

      if (client) {

         setSelectedClient(client);

         setDialogOpen(true);

      }

   };


   const handleDelete = (

      client: Client,

      action: (arg: boolean) => void = (_arg: boolean) => {}

   ) => {

      if (client) {

         mutate({

            method: "delete",

            url: `${client.id}`,

         });

         action(false);

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

                    onCheckedChange={(value) => {

                        table.toggleAllPageRowsSelected(!!value);

                        const allClientsIds = new Set(data?.map(client => client.id) || []);

                        setSelectedClients(!!value ? allClientsIds : new Set());

                    }}

                    onClick={(e) => e.stopPropagation()}

                    aria-label="Select all"

                />

            ),

            cell: ({ row }) => (

               <Checkbox

                   checked={selectedClients.has(row.original.id)}

                   onCheckedChange={(value) => {

                       row.toggleSelected(!!value);

                       // Указываем тип для prev

                       setSelectedClients((prev: Set<string>) => {

                           const newSet = new Set(prev);

                           if (!!value) {

                               newSet.add(row.original.id);

                           } else {

                               newSet.delete(row.original.id);

                           }

                           return newSet;

                       });

                   }}

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

                           onClick={(e) => e.stopPropagation()}

                        >

                           <span className="sr-only">Open menu</span>

                           <MoreHorizontal className="h-4 w-4" />

                        </Button>

                     </DropdownMenuTrigger>

                     <DropdownMenuContent align="end">

                        <div>

                           <DropdownMenuItem

                              className="bg-warning"

                              onClick={(e) => e.stopPropagation()}

                              onSelect={() => {

                                 openEditDialog(client);

                              }}

                           >

                              Change

                              <UserRoundPen className="text-popover-foreground" />

                           </DropdownMenuItem>

                        </div>


                        <DropdownMenuSeparator />

                        <div>

                           <DropdownMenuItem

                              className="bg-destructive"

                              onClick={(e) => e.stopPropagation()}

                              onSelect={() => {

                                 handleDelete(client);

                              }}

                           >

                              Delete <Trash className="text-popover-foreground" />

                           </DropdownMenuItem>

                        </div>

                     </DropdownMenuContent>

                  </DropdownMenu>

               );

            },

            header: "Actions",

         },

      ];

   }, [mutate, openEditDialog, setSelectedClients, selectedClients]);


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


         <DialogWrapper/>


         <DrawerWrapper

            drawerOpen={drawerOpen}

            setDrawerOpen={setDrawerOpen}

            selectedClient={selectedClient}

            openEditDialog={openEditDialog}

            handleDelete={handleDelete}

         />

      </div>

   );

};


export default ClientsTableWrapper; 