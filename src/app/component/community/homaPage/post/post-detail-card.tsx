"use client";
import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Loader2, Reply } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";
import {
  useGetPostQuery,
  usePostCommentMutation,
  useGetPostsCommentsQuery,
  useCommentLikeMutation,
  usePostLikeMutation,
} from "@/src/app/redux/services/communityPostApi";
import { timeAgo } from "@/utills/timeAgo";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/src/app/Hooks/hook";
import { setPostLikes } from "@/src/app/redux/feature/community/createPostSlice";

interface PostDetailCardProps {
  postId: string;
}

const PostDetailCard: React.FC<PostDetailCardProps> = ({ postId }) => {
  const { data: posts, isLoading, isError } = useGetPostQuery(undefined);
  const { data: comments, isLoading: isCommentsLoading } =
    useGetPostsCommentsQuery({ postId });
  const [postComment, { isLoading: isPostingComment }] =
    usePostCommentMutation();
  const [postLike] = usePostLikeMutation();
  const [commentLike] = useCommentLikeMutation();
  const dispatch = useAppDispatch();
  const [commentBody, setCommentBody] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Derive initial values safe for hooks
  const post = posts?.find((p) => String(p.id) === String(postId));
  const serverLikeCount = post
    ? (post as any).likeCount !== undefined
      ? parseInt((post as any).likeCount)
      : post.likeCount || 0
    : 0;
  const serverHasLiked = post
    ? (post as any).hasLiked || post.hasLiked || false
    : false;

  // Local state for immediate UI feedback
  const [localLikeCount, setLocalLikeCount] = useState<number>(0);
  const [localHasLiked, setLocalHasLiked] = useState<boolean>(false);

  // Sync with server data when available, but only if we haven't touched it locally yet
  // Initialize from localStorage or Server Data
  useEffect(() => {
    if (post) {
      const storedCount = localStorage.getItem(`post_likeCount_${postId}`);
      const storedHasLiked = localStorage.getItem(`post_hasLiked_${postId}`);

      if (storedCount !== null) {
        setLocalLikeCount(parseInt(storedCount));
      } else {
        setLocalLikeCount(serverLikeCount);
      }

      if (storedHasLiked !== null) {
        setLocalHasLiked(storedHasLiked === "true");
      } else {
        setLocalHasLiked(serverHasLiked);
      }
    }
  }, [post, postId, serverLikeCount, serverHasLiked]);

  const handlePostLike = async (postId: string, currentHasLiked: boolean) => {
    // Optimistic Update
    const newHasLiked = !currentHasLiked;
    const newLikeCount = newHasLiked
      ? localLikeCount + 1
      : Math.max(0, localLikeCount - 1);

    setLocalHasLiked(newHasLiked);
    setLocalLikeCount(newLikeCount);

    // Persist to local storage
    localStorage.setItem(`post_likeCount_${postId}`, newLikeCount.toString());
    localStorage.setItem(`post_hasLiked_${postId}`, newHasLiked.toString());

    try {
      console.log("from handle post like fnc", postId);
      const postID = postId.replace(/^post_/, "");

      const response = await postLike({
        id: postID.replace(/^post_/, ""),
        likeCount: newLikeCount,
        hasLiked: newHasLiked, // Pass the NEW state
      }).unwrap();
      dispatch(
        setPostLikes({
          id: response.id,
          likeCount: response.likeCount.toString(),
          hasLiked: response.hasLiked,
        }),
      );
    } catch (err) {
      toast.error("Failed to like post");
      // Revert on error
      setLocalHasLiked(!newHasLiked);
      setLocalLikeCount(localLikeCount); // Reset to old count
    }
  };

  const handlePostComment = async () => {
    if (!commentBody.trim()) return;
    try {
      console.log(postId, commentBody);
      // Pass parentCommentId if replyingTo is set
      const res = await postComment({
        postId,
        body: commentBody,
        parentCommentId: replyingTo ? replyingTo.id : undefined,
      }).unwrap();

      setCommentBody("");
      setReplyingTo(null); // Clear reply state
      console.log(res);
      console.log("Comment posted successfully", res.message);
      toast.success("Comment posted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to post comment");
    }
  };

  const handleCommentLike = async (
    commentId: string,
    currentHasLiked: boolean,
  ) => {
    try {
      const cleanCommentId = commentId.replace(/^comment_/, "");
      await commentLike({
        commentId: cleanCommentId,
        hasLiked: !currentHasLiked,
      }).unwrap();

      // dispatch(hasLiked(true)); // Removed undefined dispatch
    } catch (err) {
      toast.error("Failed to like comment");
    }
  };

  if (isLoading && !posts)
    return (
      <div className="flex items-center justify-center min-h-screen font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  if (isError || !posts)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-sans">
        Error loading post.
      </div>
    );

  if (!post)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 font-sans">
        Post not found.
      </div>
    );

  console.log(comments);
  const paragraphs = post.body.split("\n").filter(Boolean);

  // Remove derived variables here, use local state in render instead

  return (
    <div className="relative flex min-h-screen flex-col bg-background py-16 font-sans">
      <div className="max-w-4xl mx-auto my-5 px-6 w-full">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags &&
            post.tags.map((tag, idx) => (
              <span
                key={tag + idx}
                className="px-3 py-1 bg-pink-50 text-primary rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
        </div>

        {/* Post Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-[10px] font-bold">
              {post.user?.name?.charAt(0) || "U"}
            </div>
            <span className="font-medium text-gray-900">
              {post.user?.name || "Anonymous"}
            </span>
          </div>
          <span className="text-gray-300">•</span>
          <span>{timeAgo(post.postedTime || post.createdAt || "")}</span>
          <span className="text-gray-300">•</span>
        </div>

        {/* Cover Image (if available) */}
        {(post.imageUrl || post.image) && (
          <div className="mb-8">
            <img
              src={post.imageUrl || post.image || ""}
              alt={post.title || "Post cover image"}
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-pink prose-lg max-w-none mb-12">
          {paragraphs.map((para, idx) => {
            const trimmed = para.trim();
            if (/^>+\s?/.test(trimmed)) {
              return (
                <blockquote
                  key={idx}
                  className="border-l-4 border-primary pl-6 my-8 italic text-gray-700 bg-pink-50/50 py-4 rounded-r-lg"
                >
                  {trimmed.replace(/^>+\s?/, "")}
                </blockquote>
              );
            }
            return (
              <p key={idx} className="text-gray-800 leading-relaxed mb-6">
                {para}
              </p>
            );
          })}
        </article>

        {/* Like Actions */}
        <div className="flex items-center justify-between py-6 border-t border-b border-gray-100 my-8">
          <button
            type="button"
            onClick={() => handlePostLike(postId, localHasLiked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              localHasLiked
                ? " text-pink-600  ring-pink-100"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Heart size={20} className={localHasLiked ? "fill-pink-600" : ""} />
            <span className="font-semibold">
              {localLikeCount} Found Helpful
            </span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Supportive Community
          </h2>

          {/* Comment Input */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-10 ring-1 ring-gray-50">
            {replyingTo && (
              <div className="flex items-center justify-between mb-2 text-sm text-pink-600 bg-pink-50 px-3 py-1.5 rounded-lg">
                <span>
                  Replying to <b>{replyingTo.name}</b>
                </span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="hover:text-pink-800 font-bold"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>Me</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Input
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder={
                    replyingTo
                      ? "Write a reply..."
                      : "Share your encouragement or experience..."
                  }
                  className="w-full border-gray-100 bg-gray-50/50 focus:bg-white transition-all rounded-xl py-6"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handlePostComment}
                    disabled={isPostingComment || !commentBody.trim()}
                    className="px-8 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                  >
                    {isPostingComment ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-8">
            {isCommentsLoading && !comments ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary/30" />
              </div>
            ) : comments && comments.length > 0 ? (
              (() => {
                // Group comments by parent
                const rootComments = comments.filter(
                  (c: any) => !c.parentCommentId,
                );
                const getReplies = (parentId: string) =>
                  comments.filter((c: any) => c.parentCommentId === parentId);

                const CommentItem = ({ comment, isReply = false }: any) => {
                  const isAuthor =
                    post.user?.id &&
                    comment.user?.id &&
                    String(post.user.id) === String(comment.user.id);
                  const replies = getReplies(comment.id || comment._id);

                  return (
                    <div className={`flex gap-4 ${isReply ? "mt-6" : ""}`}>
                      <Avatar className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-100">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>
                          {comment.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-bold text-gray-900 text-[15px]">
                            {comment.user?.name || "Supportive Mother"}
                          </span>
                          {isAuthor && (
                            <span className="bg-pink-100 text-pink-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                              AUTHOR
                            </span>
                          )}
                          <span className="text-xs font-medium text-pink-400">
                            {timeAgo(comment.createdAt || comment.postedTime)}
                          </span>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-3 text-[15px]">
                          {comment.text || comment.body}
                        </p>

                        <div className="flex items-center gap-6 mb-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleCommentLike(comment.id, comment.hasLiked)
                            }
                            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                              comment.hasLiked
                                ? "text-pink-600"
                                : "text-gray-400 hover:text-pink-600"
                            }`}
                          >
                            <Heart
                              size={14}
                              className={
                                comment.hasLiked ? "fill-pink-600" : ""
                              }
                            />
                            <span>Like</span>
                            <span className="ml-1 text-xs">
                              {comment.likeCount || 0}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo({
                                id: comment.id || comment._id,
                                name: comment.user?.name,
                              });
                            }}
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-pink-600 transition-colors"
                          >
                            <Reply size={14} />
                            <span>Reply</span>
                          </button>
                        </div>

                        {/* Nested Replies Container */}
                        {replies.length > 0 && (
                          <div className="relative mt-4">
                            {/* Vertical Line */}
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-pink-100 rounded-full"></div>
                            <div className="pl-6 space-y-6">
                              {replies.map((reply: any) => (
                                <CommentItem
                                  key={reply.id || reply._id}
                                  comment={reply}
                                  isReply={true}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                };

                return (
                  <div>
                    <div className="space-y-10">
                      {rootComments.map((comment: any) => (
                        <CommentItem
                          key={comment.id || comment._id}
                          comment={comment}
                        />
                      ))}
                    </div>

                    <div className="text-center mt-12">
                      <button
                        type="button"
                        className="text-pink-500 font-bold hover:text-pink-600 transition-colors"
                      >
                        Load more comments
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-16 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Heart className="text-gray-200 w-8 h-8" />
                </div>
                <h3 className="text-gray-900 font-bold mb-1">
                  No comments yet
                </h3>
                <p className="text-gray-500 text-sm">
                  Be the first to share a supportive message.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailCard;
