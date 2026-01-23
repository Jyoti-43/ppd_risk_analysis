import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PostCardProps {
  id: string;
  topic: string;
  author: string;
  timeAgo: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  isSensitive?: boolean;
  likeCount?: number;
  isOwner?: boolean;
  onDelete?: () => void;
}

export function PostCard({
  id,
  topic,
  author,
  timeAgo,
  title,
  excerpt,
  imageUrl,
  isSensitive,
  likeCount,
  isOwner = false,
  onDelete,
}: PostCardProps) {
  return (
    <article className="flex flex-col md:flex-row gap-6 p-5 bg-white rounded-[20px] border border-border shadow-sm hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative w-full md:w-[280px] shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-muted">
        {imageUrl && (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            // fill
            className={cn("object-cover", isSensitive && "blur-2xl opacity-60")}
          />
        )}
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 hover:bg-white text-foreground/80 text-[11px] font-bold px-2 py-0.5 border-none shadow-sm backdrop-blur-sm rounded-md">
            {topic}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 py-1">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
            <span className="material-symbols-outlined text-[16px] fill">
              account_circle
            </span>
          </div>
          <span className="text-[13px] font-semibold text-foreground/90">
            {author}
          </span>
          <span className="text-[13px] text-muted-foreground">•</span>
          <span className="text-[13px] text-muted-foreground">{timeAgo}</span>
        </div>

        <h3 className="text-[20px] font-extrabold text-foreground leading-snug mb-3">
          {title}
        </h3>

        <div className="relative">
          <p
            className={cn(
              "text-[15px] text-muted-foreground leading-relaxed line-clamp-3 mb-6",
              isSensitive && "blur-[5px] select-none",
            )}
          >
            {excerpt}
          </p>
          {/* {isSensitive && (
            <div className="absolute inset-0 flex items-center justify-center -top-4">
              <button className="h-9 px-5 bg-white/80 backdrop-blur-md border border-border rounded-full text-[13px] font-bold shadow-sm hover:bg-white transition-colors">
                Click to reveal content
              </button>
            </div>
          )} */}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-1.5 text-muted-foreground"
              title="Likes"
            >
              <span className="material-symbols-outlined text-[18px]">
                favorite
              </span>
              <span className="text-[13px] font-medium">{likeCount || 0}</span>
            </div>
            {/* Edit/Delete buttons - only show if user owns this post */}
            {isOwner && (
              <>
                <Link
                  href={`/community/edit-post/${id}`}
                  className="flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    edit
                  </span>
                  Edit
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete?.();
                  }}
                  className="flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    delete
                  </span>
                  Delete
                </button>
              </>
            )}
          </div>
          <Link
            href={`/community/post/${id}`}
            className="text-primary hover:text-brand-primary-hover text-[13px] font-bold flex items-center gap-1.5 transition-colors"
          >
            Read Full Story
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
