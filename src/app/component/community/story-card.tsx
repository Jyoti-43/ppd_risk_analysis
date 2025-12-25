// import Image from "next/image"
// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"

// interface StoryCardProps {
//   id: string
//   category: string
//   author: string
//   timeAgo: string
//   title: string
//   excerpt: string
//   imageUrl: string
//   likes: number
//   comments: number
//   isSensitive?: boolean
//   categoryColor?: string
// }

// export function StoryCard({
//   category,
//   author,
//   timeAgo,
//   title,
//   excerpt,
//   imageUrl,
//   likes,
//   comments,
//   isSensitive,
//   categoryColor = "bg-white/90",
// }: StoryCardProps) {
//   return (
//     <article className="flex flex-col md:flex-row gap-5 p-5 bg-white rounded-[18px] border border-border shadow-sm hover:shadow-md transition-shadow">
//       {/* Image Container */}
//       <div className="relative w-full md:w-[240px] shrink-0 aspect-video rounded-lg overflow-hidden bg-muted">
//         <Image
//           src={imageUrl || "/placeholder.svg"}
//           alt={title}
//           fill
//           className={cn("object-cover", isSensitive && "blur-2xl opacity-60")}
//         />
//         {/* Category Badge */}
//         <div className="absolute top-3 left-3">
//           <Badge
//             className={`${categoryColor} hover:${categoryColor} text-foreground/80 text-[11px] font-bold px-2 py-0.5 border-none shadow-sm backdrop-blur-sm rounded-md`}
//           >
//             {category}
//           </Badge>
//         </div>

//         {/* Sensitive Topic Icon */}
//         {isSensitive && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
//             <span className="material-symbols-outlined text-foreground/60 text-[28px]">visibility_off</span>
//             <p className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">Sensitive Topic</p>
//           </div>
//         )}
//       </div>

//       {/* Content Section */}
//       <div className="flex flex-col flex-1">
//         <div className="flex items-center gap-2.5 mb-2">
//           <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
//             <span className="material-symbols-outlined text-[16px] fill">account_circle</span>
//           </div>
//           <span className="text-[13px] font-semibold text-foreground/90">{author}</span>
//           <span className="text-[13px] text-muted-foreground">•</span>
//           <span className="text-[13px] text-muted-foreground">{timeAgo}</span>
//         </div>

//         <h3 className="text-[18px] font-extrabold text-foreground leading-snug mb-2.5">{title}</h3>

//         <div className="relative mb-4">
//           <p
//             className={cn(
//               "text-[14px] text-muted-foreground leading-relaxed line-clamp-2",
//               isSensitive && "blur-[5px] select-none",
//             )}
//           >
//             {excerpt}
//           </p>
//           {isSensitive && (
//             <div className="absolute inset-0 flex items-center justify-center -top-2">
//               <button className="h-8 px-4 bg-white/80 backdrop-blur-md border border-border rounded-full text-[12px] font-bold shadow-sm hover:bg-white transition-colors">
//                 Click to reveal
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Footer Actions */}
//         <div className="flex items-center justify-between mt-auto">
//           <div className="flex items-center gap-4">
//             <button className="flex items-center gap-2 group transition-colors">
//               <span className="material-symbols-outlined text-[18px] text-primary fill">favorite</span>
//               <span className="text-sm font-bold text-foreground/80">{likes}</span>
//             </button>
//             <button className="flex items-center gap-2 group transition-colors">
//               <span className="material-symbols-outlined text-[18px] text-muted-foreground">chat_bubble</span>
//               <span className="text-sm font-bold text-foreground/80">{comments}</span>
//             </button>
//           </div>

//           <Link
//             href="#"
//             className="text-primary hover:text-brand-primary-hover text-[13px] font-bold flex items-center gap-1.5 transition-colors"
//           >
//             Read Full Story
//             <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
//           </Link>
//         </div>
//       </div>
//     </article>
//   )
// }
