"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ArrowUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ScreeningHistory<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  return (
    <div className=" space-y-4">
      <Card className="border-none shadow-sm overflow-hidden pt-0 gap-0">
        <CardHeader className="bg-primary/10 pt-3 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between ">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">
                Screening History
              </CardTitle>
              <CardDescription className="text-slate-500">
                Track your well-being progress over time
              </CardDescription>
            </div>
            <div className="flex  items-center gap-3">
              {/* Search Box */}
              <div className="relative max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-3 text-slate-400" />
                <Input
                  placeholder="Search method or risk..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="pl-9 w-[250px] bg-slate-50 border-slate-200 focus:bg-white transition-all"
                />
              </div>

              {/* Risk Filter */}
              {/* <Select
                value={
                  (table.getColumn("risk")?.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) =>
                  table
                    .getColumn("risk")
                    ?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200">
                  <Filter className="mr-2 h-4 w-4 text-slate-400" />
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="High">High Risk</SelectItem>
                  <SelectItem value="Moderate">Moderate Risk</SelectItem>
                  <SelectItem value="Low">Low Risk</SelectItem>
                </SelectContent>
              </Select> */}

              {/* Date Sort Toggle - Handled by column header, but adding a shortcut here could be nice */}
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-50 border-slate-200 text-slate-600"
                onClick={() => {
                  const isDesc =
                    table.getColumn("date")?.getIsSorted() === "desc";
                  table.getColumn("date")?.toggleSorting(!isDesc);
                }}
              >
                <ArrowUpDown className="mr-1 h-4 w-4" />
                {table.getColumn("date")?.getIsSorted() === "asc"
                  ? "Oldest First"
                  : "Recent First"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-0 border-t border-slate-100 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent border-slate-100"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="font-semibold text-slate-600 h-12"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-slate-100 hover:bg-background transition-colors"
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Search className="h-8 w-8 text-slate-200" />
                        <p>No screenings found matching your criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
