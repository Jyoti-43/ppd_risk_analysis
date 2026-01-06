"use client";

import { useGetPostQuery } from "@/src/app/redux/services/communityPostApi";
import { PostCard } from "./post-card";
import { timeAgo } from "@/utills/timeAgo";
import { PostSkeleton } from "./postSkeleton";
import { useEffect, useRef, useState } from "react";

export const PostsList = () => {
   const [page, setPage] = useState(1);
  const { data: posts, isLoading, isError, error, isFetching } = useGetPostQuery();

  const observerRef = useRef<HTMLDivElement>(null);

  console.log('Posts:', posts); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          setPage((prev:any) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [isFetching]);


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

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post: any) => (
        <PostCard
          key={post.id}
          id={String(post.id)}
          topic={post.category?.name || "General"}
          author={post.user?.name || "Anonymous"}
          timeAgo={timeAgo(post.postedTime)}
          title={post.title}
          excerpt={post.body.replace(/<[^>]*>/g, "")} // Strip HTML tags
          imageUrl={post.image}
          // isSensitive={post.post_type}
        />
      ))}

       {/* Load more trigger */}
      <div ref={observerRef}>
        {isFetching && <PostSkeleton />}
      </div>
    </div>
  );
};
