"use client";

//

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/app/Hooks/hook";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";
import { GroupCard } from "./group-card";
import {
  useDeleteGroupMutation,
  useGetGroupQuery,
  useGetMyJoinedgroupQuery,
} from "@/src/app/redux/services/communityGroupApi";
import { PostSkeleton } from "../homaPage/post/postSkeleton";
import { CreateGroupCard } from "./create-group-card";

const FIRST_PAGE_SIZE = 5;
const SUBSEQUENT_PAGE_SIZE = 6;

// Normalize ID by removing "user_" prefix for comparison
const normalizeId = (id: string | number | null | undefined): string => {
  if (!id) return "";
  return String(id).replace("user_", "");
};

interface GroupListProps {
  activeFilter?: string;
  searchQuery?: string;
}

export const GroupList = ({
  activeFilter,
  searchQuery = "",
}: GroupListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const currentUser = useAppSelector(selectCurrentUser);
  const [deleteGroup] = useDeleteGroupMutation();

  const isMyGroups = activeFilter === "My Groups";

  const {
    data: allGroups,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
  } = useGetGroupQuery(currentUser?.userId, {
    skip: isMyGroups,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: myJoinedGroups,
    isLoading: isLoadingMy,
    isError: isErrorMy,
    error: errorMy,
  } = useGetMyJoinedgroupQuery(currentUser?.userId, {
    skip: !currentUser?.userId,
    refetchOnMountOrArgChange: true,
  });

  const initialgroups = isMyGroups ? myJoinedGroups : allGroups;
  const isLoading = isMyGroups ? isLoadingMy : isLoadingAll;
  const isError = isMyGroups ? isErrorMy : isErrorAll;
  const error = isMyGroups ? errorMy : errorAll;

  // Search filtering
  const groups = initialgroups?.filter((group: any) => {
    const searchTerm = searchQuery.toLowerCase();
    const groupName = (group.groupName || "").toLowerCase();
    const groupCategory = (
      group.category?.name ||
      group.categoryName ||
      ""
    ).toLowerCase();
    return groupName.includes(searchTerm) || groupCategory.includes(searchTerm);
  });

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      const numericId = groupId.startsWith("group_")
        ? groupId.replace("group_", "")
        : groupId;

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
    return (
      <div className="text-center py-10 text-muted-foreground font-medium">
        {isMyGroups
          ? "You haven't joined or created any groups yet."
          : "No groups found."}
      </div>
    );
  }

  // Pagination calculations
  const totalgroup = groups.length;
  const totalPages =
    1 +
    Math.ceil(Math.max(0, totalgroup - FIRST_PAGE_SIZE) / SUBSEQUENT_PAGE_SIZE);

  let startIndex, endIndex;
  if (currentPage === 1) {
    startIndex = 0;
    endIndex = FIRST_PAGE_SIZE;
  } else {
    startIndex = FIRST_PAGE_SIZE + (currentPage - 2) * SUBSEQUENT_PAGE_SIZE;
    endIndex = startIndex + SUBSEQUENT_PAGE_SIZE;
  }

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
        {currentPage === 1 && <CreateGroupCard />}

        {currentgroup.map((group: any, idx: number) => {
          const gId = String(group.groupId || group.id || "");
          return (
            <GroupCard
              key={gId}
              id={gId}
              name={group.groupName}
              description={
                group.groupDescription ||
                "No description provided for this group."
              }
              imageUrl={group.image}
              category={group.category?.name || group.categoryName || "General"}
              members={group.members || 0}
              isOwner={
                group.isOwner ||
                normalizeId(group.createdBy?.id) ===
                  normalizeId(currentUser?.userId)
              }
              isJoined={
                isMyGroups ||
                group.isJoined ||
                group.is_joined ||
                group.is_member ||
                group.isMember ||
                myJoinedGroups?.some(
                  (g: any) => String(g.groupId || g.id || "") === gId,
                )
              }
              onDelete={() => handleDeleteGroup(gId)}
            />
          );
        })}
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
                ),
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
