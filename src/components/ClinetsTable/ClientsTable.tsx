import * as React from "react";
import { Client } from '@/hooks/useClient'
import {
   ColumnDef,
   ColumnFiltersState,
   SortingState,
   VisibilityState,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getSortedRowModel,
   useReactTable,
   RowSelectionState
} from "@tanstack/react-table";

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'

 // This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// Описываем интерфейс объекта проспса.
interface ClientsTableProps<TValue,> {
   columns: ColumnDef<Client, TValue>[];
   data: Client[];
   filterPlaceholder: string,
   filterKey: keyof Client,
}
const ClientsTable = <TValue,>({ columns, data, filterPlaceholder, filterKey }: ClientsTableProps<TValue>): React.ReactElement => {
   // sorting — хранит информацию о сортировке колонок.
   const [sorting, setSorting] = React.useState<SortingState>([]);
   // columnFilters — фильтры (например, по email).
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
   );
   // columnVisibility — видимость колонок.
   const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({});
   // rowSelection — выбранные строки.
   const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
   // useReactTable — главный хук @tanstack/react-table, который возвращает API для построения таблицы.
   //  data: массив объектов (данные таблицы)
   // columns: описание колонок (с accessorKey, header, cell)
   // getCoreRowModel: базовая логика отображения строк
   // getSortedRowModel: сортировка
   // getFilteredRowModel: фильтрация
   // state: текущее состояние сортировки, фильтров, видимости колонок, выбранных строк
   // onXChange: функции, которые будут вызываться при изменении соответствующего состояния
   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),

      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),

      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),

      onColumnVisibilityChange: setColumnVisibility,

      onRowSelectionChange: setRowSelection,
      state: {
         sorting,
         columnFilters,
         columnVisibility,
         rowSelection,
      },
   });
   return (
      <div className="px-2 sm:px-4">
         {/* table.getColumn("email") — достаёт колонку с accessorKey = "email" из таблицы. 
         ?. — защищает от ошибок, если такой колонки нет (optional chaining). 
         ?? "" — если значение undefined или null, подставляем пустую строку как fallback.
         если фильтра нет — значение по умолчанию будет "", и Input не упадёт с ошибкой.*/}

         <div className="flex justify-between flex-wrap items-center gap-4 pb-4 sm:flex-nowrap">
            <Input
               placeholder={filterPlaceholder}
               value={
                  (table.getColumn(filterKey)?.getFilterValue() as string) ?? ""
               }
               onChange={(event) =>
                  table.getColumn(filterKey)?.setFilterValue(event.target.value)
               }
               className="w-full order-2 sm:max-w-sm sm:order-none"
            />
            {/* value = true | false | "indeterminate"` в зависимости от того, какое состояние чекбокса сейчас(checked). 
            !!value превращает это в булево значение (true или false) — это нужно toggleVisibility(), чтобы включить или выключить видимость колонки.*/}
            <div className="w-full flex justify-between gap-3 items-center">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button className="">
                        Columns
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                           return (
                              <DropdownMenuCheckboxItem
                                 key={column.id}
                                 className="capitalize"
                                 checked={column.getIsVisible()}
                                 onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                 }
                              >
                                 {column.id}
                              </DropdownMenuCheckboxItem>
                           );
                        })}
                  </DropdownMenuContent>
               </DropdownMenu>

               <div className="text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
               </div>
            </div>
         </div>

         {/* flexRender позволяет использовать как текст, так и JSX в header. 
         header.isPlaceholder === true означает, что в этой ячейке заголовка ничего рендерить не нужно, она существует только чтобы сохранить структуру при многоуровневых заголовках.*/}
         <div className="rounded-md border">
            <Table>
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                           return (
                              <TableHead key={header.id}>
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                         header.column.columnDef.header,
                                         header.getContext()
                                      )}
                              </TableHead>
                           );
                        })}
                     </TableRow>
                  ))}
               </TableHeader>
               {/* ?? null или undefined undefined ?? "fallback" → "fallback" 
               && true — возвращает второе значение true && "fallback" → "fallback"
               false — возвращает false false && "fallback" → false */}
               <TableBody>
                  {table.getRowModel().rows?.length ? (
                     table.getRowModel().rows.map((row) => (
                        <TableRow
                           key={row.id}
                           data-state={row.getIsSelected() && "selected"}
                        >
                           {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                 {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                 )}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell
                           colSpan={columns.length}
                           className="h-24 text-center"
                        >
                           No results.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   );
};

export default ClientsTable;
