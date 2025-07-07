import React from "react";
import { useMemo, useState } from "react";
import { useClient, Client } from "@/hooks/useClient";
import useMediaQuery from "@/hooks/useMediaQuery";
import useClientMutation from '@/hooks/useClientMutation';
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
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { UserRoundPen } from "lucide-react";
import { Trash } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import ClientsTable from "./ClientsTable";

const ClientsTableWrapper: React.FC = () => {
   const { mutate } = useClientMutation()
   const isMobile = useMediaQuery("(max-width: 1024px)");
   const [selectedClient, setSelectedClient] = useState<Client | null>(null);
   const [drawerOpen, setDrawerOpen] = useState(false);

   const handleRowClick = (client: Client) => {
      if (isMobile) {
         setSelectedClient(client);
         setDrawerOpen(true);
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
                        <DropdownMenuItem className="bg-warning">
                           Change{" "}
                           <UserRoundPen className="text-popover-foreground" />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           className="bg-destructive"
                           onClick={() => mutate({ method: "delete", url: `${row.original.id}`})}
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
   }, []);

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

         <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent>
               <DrawerHeader>
                  <DrawerTitle className="font-bold">Client Info</DrawerTitle>
               </DrawerHeader>
               {selectedClient && (
                  <div className="p-4 space-y-2">
                     <p><strong>Name:</strong> {selectedClient.name}</p>
                     <p><strong>Surname:</strong> {selectedClient.surname}</p>
                     <p><strong>Date of Birth:</strong> {selectedClient.dateOfBirth}</p>
                     <p><strong>Sex:</strong> {selectedClient.sex}</p>
                     <p><strong>Email:</strong> {selectedClient.email}</p>
                     <p><strong>Number:</strong> {selectedClient.number}</p>
                     <div className="flex justify-between pt-4 border-t">
                        <strong>Actions</strong>
                        <div className="flex gap-3">
                           <Button className="bg-warning text-popover-foreground hover:bg-warning">
                              Change
                           </Button>
                           <Button
                              variant="destructive"
                              className="text-popover-foreground hover:bg-destructive"
                              onClick={() => {
                                 mutate({ method: "delete", url: `${selectedClient.id}` });
                                 setDrawerOpen(false);
                              }}
                           >
                              Delete
                           </Button>
                        </div>
                     </div>
                  </div>
               )}
            </DrawerContent>
         </Drawer>
         
      </div>
   );
};

export default ClientsTableWrapper;
