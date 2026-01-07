"use client";

import { useGetPostQuery, useDeletePostMutation } from "@/src/app/redux/services/communityPostApi";
import { PostCard } from "./post-card";
import { timeAgo } from "@/utills/timeAgo";
import { PostSkeleton } from "./postSkeleton";
import { useState } from "react";
import { useAppSelector } from "@/src/app/Hooks/hook";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";

const POSTS_PER_PAGE = 4;

// Normalize ID by removing "user_" prefix for comparison
const normalizeId = (id: string | number | null | undefined): string => {
  if (!id) return "";
  return String(id).replace("user_", "");
};

export const PostsList = () => {
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
    // Only fetch on first load or browser refresh, not on component remount
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    // refetchOnReconnect: false,
  });


  console.log("current user id", currentUser?.userId);

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId).unwrap();
        alert("Post deleted successfully!");
      } catch (error: any) {
        console.error("Failed to delete post:", error);
        alert(error?.data?.message ?? "Failed to delete post");
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

  if (!posts || posts.length === 0) {
    return <div className="text-center py-10">No posts yet</div>;
  }

  // Pagination calculations
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

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
      {currentPosts.map((post: any) => (
        <PostCard
          key={post.id}
          id={(post.id).toString()}
          topic={post.category?.name || "General"}
          author={post.user?.name || "Anonymous"}
          timeAgo={timeAgo(post.postedTime)}
          title={post.title}
          excerpt={post.body.replace(/<[^>]*>/g, "")} // Strip HTML tags
          imageUrl={post.image}
          // isSensitive={post.post_type}
          isOwner={normalizeId(post.user?.id) === normalizeId(currentUser?.userId)}
          onDelete={() => handleDeletePost(String(post.id))}
        />
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <span className="text-[13px] font-medium text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, totalPosts)} of {totalPosts} posts
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}
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
