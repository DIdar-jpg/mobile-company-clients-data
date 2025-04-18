import React from "react";
import { useMemo } from "react";
import { useClient, Client} from '@/hooks/useClient'
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
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
import { UserRoundPen } from 'lucide-react';
import { Trash } from 'lucide-react';
import ClientsTable from "./ClientsTable";

const ClientsTableWrapper: React.FC = () => {

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
                  aria-label="Select all"
               />
            ),
            cell: ({ row }) => (
               <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
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
               const payment = row.original;

               return (
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                           <span className="sr-only">Open menu</span>
                           <MoreHorizontal className="h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuItem
                           className="bg-warning"
                           onClick={() =>
                              navigator.clipboard.writeText(payment.id)
                           }
                        >
                           Change <UserRoundPen className="text-popover-foreground"/>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="bg-destructive">
                           Delete <Trash className="text-popover-foreground"/>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               );
            },
            header: 'Actions'
         },
      ];
   }, []);

   const { status, data } = useClient();


   return (
      <div className="py-10">
         {/* data! — это non-null assertion. Ты говоришь TypeScript: "я точно знаю, что это не undefined". */}
         { status === 'success' && <ClientsTable columns={columns} data={data!} filterPlaceholder="Filter emails..." filterKey="email"/> }
      </div>
   );
};

export default ClientsTableWrapper;
