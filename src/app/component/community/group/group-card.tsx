import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GroupCardProps {
  id: string
  name: string
  description: string
  members: number
  onlineCount: number
  backgroundGradient: string
  icon: string
  avatars?: string[]
  extraAvatarCount?: number
  isJoined?: boolean
}

export function GroupCard({
  name,
  description,
  members,
  onlineCount,
  backgroundGradient,
  icon,
  avatars = [],
  extraAvatarCount,
  isJoined,
}: GroupCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Gradient Header with Icon */}
      <div className={cn("relative h-32 flex items-center justify-center", backgroundGradient)}>
        <span className="material-symbols-outlined text-white text-[56px] opacity-90">{icon}</span>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-bold text-[17px] text-foreground leading-tight">{name}</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">{description}</p>
        </div>

        {/* Members Info */}
        <div className="flex items-center gap-4 text-[13px] font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">group</span>
            <span>{members >= 1000 ? `${(members / 1000).toFixed(1)}k` : members} Members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>{onlineCount} Online</span>
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
                <span className="text-[11px] font-bold text-muted-foreground">+{extraAvatarCount}</span>
              </div>
            )}
          </div>

          <Button
            size="sm"
            variant={isJoined ? "outline" : "default"}
            className={cn(
              "h-8 px-4 rounded-full font-semibold text-[13px]",
              isJoined
                ? "bg-white border-border text-foreground hover:bg-muted"
                : "bg-primary hover:bg-[#b50d62] text-white",
            )}
          >
            {isJoined ? "Joined" : "Join Group"}
          </Button>
        </div>
      </div>
    </div>
  )
}
