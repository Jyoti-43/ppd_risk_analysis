"use client";
import { useGetGroupPostQuery } from "@/src/app/redux/services/groupPostApi";
import { DiscussionPost } from "./discussion-post";
import { timeAgo } from "@/utills/timeAgo";
import { useAppDispatch, useAppSelector } from "@/src/app/Hooks/hook";
import { setCurrentGroupId } from "@/src/app/redux/feature/community/groupSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export function DiscussionsSection() {
  const dispatch = useAppDispatch();
  const selectedGroupId = useAppSelector(
    (state) => state.createGroup.currentGroupId,
  );
  const { data: posts = [], isLoading, error } = useGetGroupPostQuery();
  const likeByPostId = useAppSelector(
    (state) => state.createGroupPost.likeByPostId,
  );

  const params = useParams();
  const groupIdFromUrl = params?.id as string;

  // Set currentGroupId in Redux based on URL parameter
  useEffect(() => {
    if (groupIdFromUrl) {
      dispatch(setCurrentGroupId(groupIdFromUrl));
    }
  }, [groupIdFromUrl, dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts.</div>;

  const filteredPosts = posts.filter((post) => {
    // Standardize IDs by removing any prefix like 'group_'
    const postGroupId = post.groupId?.toString().replace(/^group_/, "");
    const urlGroupId = groupIdFromUrl?.toString().replace(/^group_/, "");
    return postGroupId === urlGroupId;
  });

  if (filteredPosts.length === 0) {
    console.log("No matching posts found.");
    console.log("URL Group ID:", groupIdFromUrl);
    console.log(
      "All Posts Group IDs:",
      posts.map((p) => p.groupId),
    );
    return <div>No discussions available for this group.</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recent Discussions</h2>
        {/* <div className="flex gap-4">
          <button className="text-primary font-semibold hover:underline">
            Newest
          </button>
          <button className="text-muted-foreground hover:text-primary transition">
            Popular
          </button>
        </div> */}
      </div>

      {/* Posts */}
      {filteredPosts.map((post) => {
        const like = likeByPostId[post.id];
        const likeCount = like
          ? parseInt(like.likeCount)
          : post.like
            ? parseInt(post.like.likeCount)
            : 0;
        const hasLiked = like
          ? like.hasLiked
          : post.like && typeof post.like.hasLiked === "boolean"
            ? post.like.hasLiked
            : false;

        return (
          <DiscussionPost
            key={post.id}
            id={post.id}
            author={post.user.name}
            badge={post.category.name}
            timeAgo={timeAgo(post.postedTime)}
            content={post.postBody}
            tags={
              post.tags ? post.tags.map((tag) => `#${tag.toLowerCase()}`) : []
            }
            hasLiked={hasLiked}
            likeCount={likeCount}
            hasImage={!!post.image}
            imageUrl={post.image}
          />
        );
      })}
    </div>
  );
}
