import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface SecondaryStoryCardProps {
  id: string
  category: string
  title: string
  excerpt: string
  imageUrl: string
  likes: number
  categoryColor?: string
}

export function SecondaryStoryCard({
  category,
  title,
  excerpt,
  imageUrl,
  likes,
  categoryColor = "bg-primary/90",
}: SecondaryStoryCardProps) {
  return (
    <article className="flex gap-4 bg-white rounded-[16px] border border-border shadow-sm p-4 hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative w-[120px] shrink-0 aspect-square rounded-lg overflow-hidden bg-muted">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge
            className={`${categoryColor} hover:${categoryColor} text-white text-[10px] font-bold px-2 py-0.5 border-none shadow-sm backdrop-blur-sm rounded-md`}
          >
            {category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <h4 className="text-[15px] font-bold text-foreground leading-tight mb-2 line-clamp-2">{title}</h4>
        <p className="text-[13px] text-muted-foreground leading-snug line-clamp-2 mb-3">{excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary fill">favorite</span>
            <span className="text-xs font-bold text-foreground/80">{likes}</span>
          </div>

          <Link
            href="#"
            className="text-primary hover:text-brand-primary-hover text-[12px] font-bold flex items-center gap-1 transition-colors"
          >
            Read More
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
