"use client";

//

import { useState } from "react";
import { useAppSelector } from "@/src/app/Hooks/hook";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";
import { GroupCard } from "./group-card";
import {
  useDeleteGroupMutation,
  useGetGroupQuery,
} from "@/src/app/redux/services/communityGroupApi";
import { PostSkeleton } from "../homaPage/post/postSkeleton";

const group_PER_PAGE = 4;

// Normalize ID by removing "user_" prefix for comparison
const normalizeId = (id: string | number | null | undefined): string => {
  if (!id) return "";
  return String(id).replace("user_", "");
};

export const GroupList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const currentUser = useAppSelector(selectCurrentUser);
  const [deleteGroup] = useDeleteGroupMutation();

  const {
    data: groups,
    isLoading,
    isError,
    error,
  } = useGetGroupQuery(undefined, {
    // Only fetch on first load or browser refresh, not on component remount
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    // refetchOnReconnect: false,
  });

 

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      const numericId = groupId.startsWith("group_") ? groupId.replace("group_", "") : groupId;
 
        try {
        await deleteGroup(numericId).unwrap();
        alert("Group deleted successfully!");
      } catch (error: any) {
        console.error("Failed to delete group:", error);
        alert(error?.data?.message ?? "Failed to delete group");
      }
    }
  };

  if (isLoading) {
   
    return (
      <div className="flex flex-row gap-6 w-max mx-auto">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    console.log("error loading groups:", error);
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load groups
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return <div className="text-center py-10">No group yet</div>;
  }

  // Pagination calculations
  const totalgroup = groups.length;
  const totalPages = Math.ceil(totalgroup / group_PER_PAGE);
  const startIndex = (currentPage - 1) * group_PER_PAGE;
  const endIndex = startIndex + group_PER_PAGE;
  const currentgroup = groups.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* <CreateGroupCard /> */}

        {currentgroup.map((group: any, idx: number) => (
          <GroupCard
            key={group.groupId}
            id={group.groupId?.toString()}
            name={group.groupName}
            description={
              group.groupDescription ||
              "No description provided for this group."
            }
            imageUrl={group.image}
            category={group.category.name || "General"}
            members={group.members || 0}
            isOwner={
              normalizeId(group.createdBy?.id) ===
              normalizeId(currentUser?.userId)
            }
            onDelete={() => handleDeleteGroup(String(group.groupId))}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <span className="text-[13px] font-medium text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, totalgroup)} of{" "}
            {totalgroup} group
          </span>
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="h-10 px-4 rounded-lg border border-border bg-white font-medium text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`h-10 w-10 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "border border-border bg-white text-foreground hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="h-10 px-4 rounded-lg border border-border bg-white font-medium text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};
