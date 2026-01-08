import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/src/app/Hooks/hook";
import { setCurrentGroupId } from "@/src/app/redux/feature/community/groupSlice";

interface GroupCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  members: number;
  // onlineCount: number | null;
  // backgroundGradient: string;
  // icon: string;
  avatars?: string[];
  extraAvatarCount?: number;
  isJoined?: boolean;
  isOwner?: boolean;
  onDelete?: () => void;
  onClick?: () => void;
}

export function GroupCard({
  id,
  name,
  description,
  members,
  category,
  imageUrl,
  avatars = [],
  extraAvatarCount,
  isJoined,
  isOwner = false,

  onDelete,
}: GroupCardProps) {

   const dispatch = useAppDispatch();
  
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image Header */}
      <div className="relative h-32 flex items-center justify-center bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="material-symbols-outlined text-muted text-[56px] opacity-90">
            group
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-bold text-[17px] text-foreground leading-tight">
            {name}
          </h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Members Info */}
        <div className="flex items-center gap-4 text-[13px] font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">group</span>
            <span>
              {members >= 1000 ? `${(members / 1000).toFixed(1)}k` : members}{" "}
              Members
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">
              category
            </span>
            <span>{category}</span>
          </div>
        </div>

        {/* Avatars and Action */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center -space-x-2">
            {avatars.slice(0, 3).map((avatar, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-pink-400 to-purple-400"
              />
            ))}
            {extraAvatarCount && extraAvatarCount > 0 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-muted flex items-center justify-center">
                <span className="text-[11px] font-bold text-muted-foreground">
                  +{extraAvatarCount}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center w-full gap-4  ">
            <div className="flex flex-1 items-start justify-items-start gap-3">
              {/* Edit/Delete buttons - only show if user owns this post */}
              {isOwner && (
                <>
                  <Link
                    href={`/community/group/edit-group/${id}`}
                    className="flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      edit
                    </span>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete?.();
                    }}
                    className="flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      delete
                    </span>
                  </button>
                </>
              )}
            </div>

            <Link href={`/community/group/${id}/view-group`}>
              <Button
               onClick={() => dispatch(setCurrentGroupId(id))}
                size="sm"
                variant={isJoined ? "outline" : "default"}
                className={cn(
                  "h-8 px-4 rounded-full font-semibold text-[13px]",
                  isJoined
                    ? "bg-white border-border text-foreground hover:bg-muted"
                    : "bg-primary hover:bg-[#b50d62] text-white"
                )}
              >
                {isJoined ? "Joined" : "Join Group"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
