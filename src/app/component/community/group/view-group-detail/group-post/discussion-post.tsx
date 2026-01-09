import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/src/app/Hooks/hook";
import { setGroupPostLikes } from "@/src/app/redux/feature/community/groupPostSlice";
import { use, useEffect, useState } from "react";
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
  const dispatch = useAppDispatch();
  const [selectedLikedPostId, setSelectedLikedPostId] = useState("");
  const like = useAppSelector(
    (state) => state.createGroupPost.likeByPostId[id]
  );

  const currentLikeCount = like ? parseInt(like.likeCount) : likeCount;

  useEffect(() => {
    dispatch(
      setGroupPostLikes({ id, likeCount: likeCount.toString(), hasLiked: true })
    );
  }, [hasLiked, id, selectedLikedPostId, dispatch]);

  console.log(tags, imageUrl);
  const handleLike = () => {
    if (hasLiked && likeCount>0) {
      // Unlike: decrement like count and set hasLiked to false
      dispatch(
        setGroupPostLikes({
          id,
          likeCount: (likeCount - 1).toString(),
          hasLiked: false,
        })
      );
    } else  {
      // Like: increment like count and set hasLiked to true
      dispatch(
        setGroupPostLikes({
          id,
          likeCount: (likeCount + 1).toString(),
          hasLiked: true,
        })
      );
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
              {currentLikeCount > 0 ? currentLikeCount : ""} Like
            </span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">5 Comments</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition ml-auto">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
