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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Loader2, MessageSquare, Heart } from "lucide-react";
import { useDeletePostMutation } from "@/src/app/redux/services/communityPostApi";
import { useDeleteGroupPostMutation } from "@/src/app/redux/services/groupPostApi";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import ArticleDetailPage from "@/src/app/resources/article-details/[id]/page";

export interface Post {
  id: string;
  postTitle: string;
  postBody: string;
  type: string;
  postedTime: string;
  category: {
    id: string;
    name: string;
  };
  groupId?: string;
  groupName?: string;
  likeCount: number;
  commentCount: number;
  tags: string[];
  isAnonymous: boolean;
  image?: string;
}

interface MyPostsTableProps {
  data?: Post[];
  isLoading?: boolean;
}

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "postTitle",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("postTitle") as string;
      const body = row.original.postBody;
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 line-clamp-1">
            {title || "Untitled Post"}
          </span>
          <span className="text-xs text-slate-500 line-clamp-1">
            {body
              ? body.length > 50
                ? `${body.substring(0, 50)}...`
                : body
              : "No content"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none"
        >
          {category?.name || "Uncategorized"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge
          variant="outline"
          className="capitalize border-slate-200 text-slate-600"
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "postedTime",
    header: "Posted Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("postedTime"));
      return (
        <div className="text-sm text-slate-500">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell post={row.original} />,
  },
];

function ActionCell({ post }: { post: Post }) {
  const [deleteCommunityPost] = useDeletePostMutation();
  const [deleteGroupPost] = useDeleteGroupPostMutation();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
      try {
      if (post.type === "group") {
        await deleteGroupPost(post.id.replace("post_", "")).unwrap();
      } else {
        await deleteCommunityPost(post.id.replace("post_", "")).unwrap();
      }
      toast("Post deleted successfully");
    } catch (err) {
      toast("Failed to delete post");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    post.type === "group"
      ? router.push(`/community/group/edit-post/${post.id}`)
      :router.push(`/community/edit-post/${post.id}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
        onClick={handleEdit}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

const MyPostsTable = ({ data = [], isLoading }: MyPostsTableProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Post | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="px-4 bg-white">
        <div className="absolute top-10 right-8  flex items-center justify-between mb-4">
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search posts..."
            className="rounded-md border border-slate-200  bg-white px-3 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>


        <div className="rounded-lg border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-slate-100"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-slate-600 font-bold py-4"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-slate-50 transition-colors border-slate-50"
                    onClick={() => {
                      setSelectedRow(row.original);
                      router.push(`/community/post/${row.original.id}`);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
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
                    className="text-center py-12 text-slate-400 font-medium"
                  >
                    No posts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-500 font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 border-slate-200"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 border-slate-200"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none rounded-2xl">
          <DialogHeader className="p-6 bg-primary/5">
            <DialogTitle className="text-xl font-bold text-slate-800">
              Post Details
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Full overview of your community contribution
            </DialogDescription>
          </DialogHeader>

          

          <DialogFooter className="p-4 bg-slate-50">
            <DialogClose asChild>
              <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold h-11 rounded-xl">
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
