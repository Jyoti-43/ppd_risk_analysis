import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface FeaturedStoryCardProps {
  id: string
  category: string
  author: string
  timeAgo: string
  title: string
  quote: string
  imageUrl: string
  likes: number
  comments: number
}

export function FeaturedStoryCard({
  category,
  author,
  timeAgo,
  title,
  quote,
  imageUrl,
  likes,
  comments,
}: FeaturedStoryCardProps) {
  return (
    <article className="flex flex-col h-full bg-white rounded-[20px] border border-border shadow-sm overflow-hidden">
      {/* Image Header */}
      <div className="relative w-full h-[240px] bg-muted">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 border-none shadow-sm backdrop-blur-sm rounded-md">
            {category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
            <span className="material-symbols-outlined text-[16px] fill">account_circle</span>
          </div>
          <span className="text-[13px] font-semibold text-foreground/90">{author}</span>
          <span className="text-[13px] text-muted-foreground">•</span>
          <span className="text-[13px] text-muted-foreground">{timeAgo}</span>
        </div>

        <h3 className="text-[22px] font-extrabold text-foreground leading-snug mb-4">{title}</h3>

        <blockquote className="text-[15px] text-muted-foreground leading-relaxed mb-6 italic border-l-2 border-primary/20 pl-4">
          {quote}
        </blockquote>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 group transition-colors">
              <span className="material-symbols-outlined text-[20px] text-primary fill">favorite</span>
              <span className="text-sm font-bold text-foreground/80">{likes}</span>
            </button>
            <button className="flex items-center gap-2 group transition-colors">
              <span className="material-symbols-outlined text-[20px] text-muted-foreground">chat_bubble</span>
              <span className="text-sm font-bold text-foreground/80">{comments}</span>
            </button>
          </div>

          <Button className="rounded-full h-10 px-6 bg-primary hover:bg-[#b50d62] text-white font-semibold shadow-sm">
            Read Full Story
          </Button>
        </div>
      </div>
    </article>
  )
}
