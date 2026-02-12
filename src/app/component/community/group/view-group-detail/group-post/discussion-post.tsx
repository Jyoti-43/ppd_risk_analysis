import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/src/app/Hooks/hook";
import { setGroupPostLikes } from "@/src/app/redux/feature/community/groupPostSlice";
import { useEffect, useState } from "react";
import CreateCommentModal from "../../create-comment-modal";
import {
  useGroupPostLikeMutation,
  useGetGroupPostsCommentsQuery,
} from "@/src/app/redux/services/groupPostApi";
interface DiscussionPostProps {
  id: string;
  author: string;
  badge?: string;
  timeAgo: string;
  content: string;
  tags?: string[];
  likeCount: number;
  hasLiked?: boolean;
  // comments: number;
  hasImage?: boolean;
  imageUrl?: string;
}

export function DiscussionPost({
  id,
  author,
  badge,
  timeAgo,
  content,
  tags,
  likeCount,
  hasLiked,
  // comments,
  hasImage,
  imageUrl,
}: DiscussionPostProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [selectedLikedPostId, setSelectedLikedPostId] = useState("");
  const like = useAppSelector(
    (state) => state.createGroupPost.likeByPostId[id],
  );

  // Use Redux state if available, otherwise use props
  const currentLikeCount = like?.likeCount
    ? parseInt(like.likeCount)
    : likeCount;
  const currentHasLiked =
    like?.hasLiked !== undefined ? like.hasLiked : hasLiked;

  // 1. Initialize from localStorage or prop
  const [localLikeCount, setLocalLikeCount] = useState(() => {
    const stored = localStorage.getItem(`likeCount_${id}`);
    return stored ? parseInt(stored) : likeCount;
  });

  // 2. Update localStorage whenever localLikeCount changes
  useEffect(() => {
    localStorage.setItem(`likeCount_${id}`, localLikeCount.toString());
  }, [localLikeCount, id]);
  useEffect(() => {
    // Only initialize Redux like state if not already set
    if (!like) {
      dispatch(
        setGroupPostLikes({
          id: id.replace(/^post_/, ""),
          likeCount: likeCount.toString(),
          hasLiked: typeof hasLiked === "boolean" ? hasLiked : false,
        }),
      );
    }
  }, [id, dispatch, like, likeCount, hasLiked]);

  const [groupPostLike] = useGroupPostLikeMutation();
  const { data: comments } = useGetGroupPostsCommentsQuery({ postId: id });

  // 3. In handleLike, update localLikeCount after successful like/unlike
  const handleLike = async () => {
    try {
      const response = await groupPostLike({
        id: id.replace(/^post_/, ""),
        hasLiked: !currentHasLiked,
        likeCount: localLikeCount,
      }).unwrap();

      dispatch(
        setGroupPostLikes({
          id: response.id,
          likeCount: response.likeCount,
          hasLiked: response.hasLiked,
        }),
      );
      console.log("Like/unlike response:", response);
      setLocalLikeCount(parseInt(response.likeCount));
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg p-6 mb-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex-shrink-0">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{author}</span>
                {badge && (
                  <span className="text-xs font-bold bg-secondary text-muted-foreground px-2 py-1 rounded-xl">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{timeAgo}</span>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-foreground mb-4 leading-relaxed">{content}</p>
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-sm text-primary hover:underline cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {/* Image */}
        {hasImage && imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden bg-secondary h-64">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Post image"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-6 pt-4 border-t border-border">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition"
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm">
              {localLikeCount > 0 ? localLikeCount : ""} Like
            </span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">
              {(comments ? comments.length : 0) +
                ` Comment${comments && comments.length === 1 ? "" : "s"}`}
            </span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition ml-auto">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <CreateCommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        postId={id}
      />
    </>
  );
}
