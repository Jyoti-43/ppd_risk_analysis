import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Heart } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  usePostGroupCommentMutation,
  useGetGroupPostsCommentsQuery,
  useGroupCommentLikeMutation,
  useGroupPostLikeMutation,
} from "@/src/app/redux/services/groupPostApi";
import { timeAgo } from "@/utills/timeAgo";

interface CreateCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

const CreateCommentModal = ({ isOpen, onClose, postId }: CreateCommentModalProps) => {
  if (!isOpen) return null;

  const [commentBody, setCommentBody] = useState("");
  const [replyingTo, setReplyingTo] = useState<null | { id: string; name?: string }>(null);

  const { data: comments, isLoading: isCommentsLoading } =
    useGetGroupPostsCommentsQuery({ postId });

  const [postComment, { isLoading: isPostingComment }] = usePostGroupCommentMutation();
  const [commentLike] = useGroupCommentLikeMutation();
  const [postLike] = useGroupPostLikeMutation();

  
  const handlePostComment = async () => {
    if (!commentBody.trim()) return;
    if (!postId) {
      console.error("Missing postId when attempting to post comment", { postId, commentBody, replyingTo });
      toast.error("Unable to post comment: missing post identifier.");
      return;
    }

    const payload = {
      postId: String(postId),
      body: commentBody,
      parentCommentId: replyingTo?.id ?? undefined,
    };

    try {
      console.log("Posting comment payload:", payload);
      await postComment(payload).unwrap();
      setCommentBody("");
      setReplyingTo(null);
      toast.success("Comment posted successfully");
    } catch (err: any) {
      console.error("postComment error:", err);
      const serverMsg = err?.data?.message || err?.data || err?.error || err?.message;
      toast.error(serverMsg || "Failed to post comment");
    }
  };

 // ...existing code...
  const handleCommentLike = async (comment: { id?: string; _id?: string; hasLiked: boolean; likeCount?: number }) => {
    const rawId = comment.id ?? comment._id;
    if (!rawId) return;

    // Normalize and extract numeric id expected by backend (e.g. "comment_21" -> 21)
    let clean = String(rawId).replace(/^comment_/, "");
    const digits = clean.match(/\d+/);
    clean = digits ? digits[0] : clean;
    const commentIdNum = parseInt(clean, 10);

    if (isNaN(commentIdNum)) {
      console.error("Invalid comment id for like:", rawId);
      toast.error("Unable to like this comment (invalid id)");
      return;
    }

    const current = comment.likeCount ?? 0;
    const newHasLiked = !comment.hasLiked;
    const newLikeCount = newHasLiked ? current + 1 : Math.max(0, current - 1);

    try {
      await commentLike({ commentId: clean, hasLiked: newHasLiked }).unwrap();
    } catch (err: any) {
      console.error("commentLike error:", err);
      const serverMsg = err?.data?.message || err?.data || err?.error || err?.message;
      toast.error(serverMsg || "Failed to like comment");
    }
    // optionally update local cache/state with newLikeCount if needed
  };

  const handlePostLike = async (post: { id?: string; _id?: string; hasLiked: boolean; likeCount?: number }) => {
    const id = post.id ?? post._id;
    if (!id) return;
    const current = post.likeCount ?? 0;
    const newHasLiked = !post.hasLiked;
    const newLikeCount = newHasLiked ? current + 1 : Math.max(0, current - 1);

    // mutation expects { postId, hasLiked } (no `id`)
    await postLike({ id: id, hasLiked: newHasLiked }).unwrap();
    // optionally update local cache/state with newLikeCount if needed
  };
// ...existing code...

  return (
    <>
      {/* Overlay (adds backdrop blur for depth) */}
      <div className="fixed inset-0 bg-gray-100/20 bg-opacity-40 backdrop-blur-sm z-40" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
          {/* ...existing modal content... */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Supportive Comments ({comments ? comments.length : 0})
              </h2>
            </div>

            {/* Comment Input */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex gap-3">
                <Avatar className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>Me</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    type="text"
                    placeholder="Share your thoughts about the post..."
                    className="w-full bg-gray-50 placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-100 focus:outline-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handlePostComment}
                      disabled={isPostingComment || !commentBody.trim()}
                      className="px-5 py-2 bg-pink-600 text-white rounded-full font-medium hover:bg-pink-700 disabled:opacity-50"
                    >
                      {isPostingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List (fetched) */}
            <div className="space-y-4">
              {isCommentsLoading && !comments ? (
                <div className="py-6 text-center text-sm text-gray-500">Loading comments...</div>
              ) : comments && comments.length > 0 ? (
                comments.map((comment: any) => (
                  <div key={comment.id || comment._id} className="bg-white rounded-lg p-4 border border-gray-100">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-100">
                        <AvatarImage src={comment.user?.avatar || "https://github.com/shadcn.png"} />
                        <AvatarFallback>{comment.user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-bold text-gray-900 text-[15px]">{comment.user?.name || "Anonymous"}</span>
                          <span className="text-sm text-gray-500">{timeAgo(comment.createdAt || comment.postedTime) || "just now"}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-3 text-[15px]">{comment.text || comment.body}</p>

                        <div className="flex items-center gap-6 mb-4">
                          <button
                            type="button"
                            onClick={() => handleCommentLike(comment)}
                            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${comment.hasLiked ? "text-pink-600" : "text-gray-400 hover:text-pink-600"}`}
                          >
                            <Heart size={14} className={comment.hasLiked ? "fill-pink-600" : ""} />
                            <span>Like</span>
                            <span className="ml-1 text-xs">{comment.likeCount || 0}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setReplyingTo({ id: comment.id || comment._id, name: comment.user?.name })}
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-pink-600"
                          >
                            <span>Reply</span>
                          </button>
                        </div>

                        {/* Render replies (if any) */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="relative mt-4">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-pink-100 rounded-full"></div>
                            <div className="pl-6 space-y-4">
                              {comment.replies.map((reply: any) => (
                                <div key={reply.id || reply._id} className="flex gap-4">
                                  <Avatar className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-gray-100">
                                    <AvatarImage src={reply.user?.avatar || "https://github.com/shadcn.png"} />
                                    <AvatarFallback>{reply.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-bold text-gray-900 text-[14px]">{reply.user?.name || "Anonymous"}</span>
                                      {reply.isAuthor && <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-[10px] rounded-full uppercase tracking-wider font-bold">AUTHOR</span>}
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">{reply.text || reply.body}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Heart className="text-gray-200 w-8 h-8" />
                  </div>
                  <h3 className="text-gray-900 font-bold mb-1">No comments yet</h3>
                  <p className="text-gray-500 text-sm">Be the first to share a supportive message.</p>
                </div>
              )}
            </div>

            {/* <div className="text-center mt-6">
              <button className="text-pink-600 hover:text-pink-700 font-medium">
                Load more comments
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCommentModal;
