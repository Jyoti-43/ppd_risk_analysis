"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Booking = {
  id: string;
  customer_name: string;
  guest_number: string;
  booking_date: string;
  event_date: string;
  event_time: string;
  event_end_time: string;
  email: string;
  phone_number: string;
};
import rawBookings from "./mypost.json";

const now = new Date();
const todayDate = now.toISOString().split("T")[0];
const currentTime = now.toTimeString().split(" ")[0]; // HH:MM:SS
const bookings: Booking[] = rawBookings;
const upcomingBookings = bookings.filter((b) => {
  // event_date must be exactly today
  if (b.event_date !== todayDate) return false;

  // booking_date can be today or any past date, so no filter needed here (or optionally check)
  // if you want to be strict, you can check:
  if (b.booking_date > todayDate) return false; // booking_date can't be in the future

  // event_time must be in the future or now
  const eventDateTime = new Date(`${b.event_date}T${b.event_time || "00:00"}`);
  if (eventDateTime.getTime() < now.getTime()) return false;

  return true;
});

// const recentBookings = bookings.filter(
//     (b) => b.booking_date === today && b.event_date >= today
//   );

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "customer_name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("customer_name")}</div>
    ),
  },
  {
    accessorKey: "guest_number",
    header: "Guests",
    cell: ({ row }) => row.getValue("guest_number"),
  },
  {
    accessorKey: "event_time",
    header: "Start Time",
    cell: ({ row }) => row.getValue("event_time"),
  },
  {
    accessorKey: "event_end_time",
    header: "End Time",
    cell: ({ row }) => row.getValue("event_end_time"),
  },
  {
    accessorKey: "booking_date",
    header: "Booked On",
    cell: ({ row }) => row.getValue("booking_date"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const booking = row.original;

      const handleAccept = () => {
        console.log("Accepted:", booking.id);
        // Add your logic (e.g., API call or status update)
      };

      const handleReject = () => {
        console.log("Deleted:", booking.id);
        // Add your logic
      };

      return (
        <div className="flex  gap-2">
          <Button
            variant="outline"
            className="bg-green-600 text-white hover:text-white hover:bg-green-700"
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering the row dialog
              handleAccept();
            }}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            className="bg-red-600 text-white hover:text-white hover:bg-red-700"
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering the row dialog
              handleReject();
            }}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];

const MyPostsTable = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Booking | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [customerFilter, setCustomerFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});

 
  const filteredData = React.useMemo(() => {
    if (!customerFilter) return upcomingBookings;
    const q = customerFilter.toLowerCase();
    return upcomingBookings.filter((b) =>
      (b.customer_name || "").toLowerCase().includes(q)
    );
  }, [customerFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="    ">
        <div className="p-2">
            <div className="absolute top-0 right-15 flex items-center justify-between gap-4 px-2 py-2">
              <input
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                placeholder="Filter by customer name"
                className="rounded-md border border-border px-3 py-2 text-sm w-full md:w-64"
              />
              {customerFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomerFilter("")}
                  className="ml-2"
                >
                  Clear
                </Button>
              )}
            </div>
          <Table className=" rounded-2xl ">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className=" w-1/6 text-lg font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      onClick={() => {
                        setSelectedRow(row.original);
                        setOpen(true);
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                       <TableCell key={cell.id} className="text-lg text-gray-500">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-4"
                  >
                    No upcoming bookings for today.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-end items-center space-x-2 px-2 py-4">
        <div className="text-sm text-muted-foreground ">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} selected.
        </div>
        <div className="space-x-2">
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
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              More about upcoming booking by{" "}
              <strong>{selectedRow?.customer_name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Customer Name:</strong> {selectedRow?.customer_name}
            </p>
            <p>
              <strong>Guests:</strong> {selectedRow?.guest_number}
            </p>
            <p>
              <strong>Event Time:</strong> {selectedRow?.event_time}
            </p>
            <p>
              <strong>Event End Time:</strong> {selectedRow?.event_end_time}
            </p>
            <p>
              <strong>Booked On:</strong> {selectedRow?.booking_date}
            </p>
            <p>
              <strong>Event On:</strong> {selectedRow?.event_date}
            </p>
            <p>
              <strong>Phone:</strong> {selectedRow?.phone_number}
            </p>
            <p>
              <strong>Email:</strong> {selectedRow?.email}
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="bg-green-700 text-white hover:bg-green-700 border-none"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPostsTable;
