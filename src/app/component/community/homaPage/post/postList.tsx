"use client";

import {
  useGetPostQuery,
  useDeletePostMutation,
} from "@/src/app/redux/services/communityPostApi";
import { PostCard } from "./post-card";
import { timeAgo } from "@/utills/timeAgo";
import { PostSkeleton } from "./postSkeleton";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "@/src/app/Hooks/hook";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";

const POSTS_PER_PAGE = 4;

// Normalize ID by removing "user_" prefix for comparison
const normalizeId = (id: string | number | null | undefined): string => {
  if (!id) return "";
  return String(id).replace("user_", "");
};

interface PostsListProps {
  searchQuery?: string;
  activeFilter?: string;
}

export const PostsList = ({
  searchQuery = "",
  activeFilter = "All",
}: PostsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const currentUser = useAppSelector(selectCurrentUser);
  const [deletePost] = useDeletePostMutation();

  const {
    data: posts,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetPostQuery(undefined, {
    refetchOnFocus: false,
    // refetchOnReconnect: false,
  });
  console.log("posts", posts);

  // Filter logic
  const filteredPosts = (posts || []).filter((post: any) => {
    // 1. Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      post.title?.toLowerCase().includes(searchLower) ||
      post.body?.toLowerCase().includes(searchLower) ||
      post.category?.name?.toLowerCase().includes(searchLower);

    // 2. Filter logic (Category or Ownership)
    let matchesFilter = true;
    if (activeFilter === "My Posts") {
      const pUserId = post.user?.id || post.user.userId || post.user_id;
      const cUserId = currentUser?.userId;
      matchesFilter = normalizeId(pUserId) === normalizeId(cUserId);
    } else if (activeFilter !== "All") {
      // Handle both object and string categories
      const postCatName =
        typeof post.category === "string"
          ? post.category
          : post.category?.name || post.categoryName;
      matchesFilter = postCatName === activeFilter;
    }

    return matchesSearch && matchesFilter;
  });

  console.log("current user id", currentUser?.userId);

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId).unwrap();
        toast.success("Post deleted successfully!");
      } catch (error: any) {
        console.error("Failed to delete post:", error);
        toast.error(error?.data?.message ?? "Failed to delete post");
      }
    }
  };

  if (isLoading) {
    console.log(posts);
    return (
      <div className="flex flex-col gap-6">
        {[...Array(4)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    console.log("error loading posts:", error);
    return (
      <div className="text-center py-10 text-red-500">Failed to load posts</div>
    );
  }

  if (!filteredPosts || filteredPosts.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground font-medium">
        {activeFilter === "My Posts"
          ? "You haven't created any posts yet."
          : searchQuery
          ? `No posts found matching "${searchQuery}"`
          : "No posts found."}
      </div>
    );
  }

  // Pagination calculations
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

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
    <div className="flex flex-col gap-6">
      {currentPosts.map((post: any) => {
        const pUserId = post.user?.userId || post.user.userId || post.user_id;
        const cUserId = currentUser?.userId;

        console.log("post user id", pUserId);
        console.log("current user id", cUserId);
        const isOwner = normalizeId(pUserId) === normalizeId(cUserId);

        return (
          <PostCard
            key={post.id}
            id={post.id.toString()}
            topic={
              typeof post.category === "string"
                ? post.category
                : post.category?.name || "General"
            }
            author={post.user?.name || post.userName || "Anonymous"}
            timeAgo={timeAgo(post.postedTime || post.createdAt)}
            title={post.title}
            excerpt={post.body.replace(/<[^>]*>/g, "")} // Strip HTML tags
            imageUrl={post.image || post.imageUrl}
            likeCount={post.likeCount}
            // isSensitive={post.post_type}
            isOwner={isOwner}
            onDelete={() => handleDeletePost(String(post.id))}
          />
        );
      })}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <span className="text-[13px] font-medium text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, totalPosts)} of{" "}
            {totalPosts} posts
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
    </div>
  );
};
