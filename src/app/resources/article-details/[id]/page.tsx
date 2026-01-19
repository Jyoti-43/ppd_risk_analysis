"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useGetSingleArticleQuery,
  useGetArticleQuery,
  Article,
  useGetPublishedArticleQuery,
} from "@/src/app/redux/services/articleApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";
import { useAppSelector } from "@/src/app/Hooks/hook";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // Fetch article list to find the specific article
  const {
    data: allArticles,
    isLoading,
    isError,
  } = useGetPublishedArticleQuery();
  const currentUser = useAppSelector(selectCurrentUser)?.userName;

  const article = (allArticles as any[])?.find(
    (a: any) => String(a.id || a._id) === String(id),
  );

  console.log("Article Detail Debug:", { id, article, allArticles });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f7]">
        <Loader2 className="animate-spin text-primary size-10" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf8f7] gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          {isError ? "Error Loading Article" : "Article Not Found"}
        </h2>
        <p className="text-muted-foreground text-sm max-w-md text-center">
          We couldn't find the article you're looking for.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const articleContent =
    article.content ||
    article.body ||
    article.desc ||
    article.description ||
    "";
  const categoryName =
    typeof article.category === "object"
      ? (article.category as any).name
      : article.category;
  const imageUrl = (() => {
    const imgPath = article.image || article.imageUrl;
    if (!imgPath) return null;
    if (imgPath.startsWith("http")) return imgPath;
    return `${process.env.NEXT_PUBLIC_API_URL}${
      imgPath.startsWith("/") ? "" : "/"
    }${imgPath}`;
  })();

  return (
    <div className="min-h-screen bg-[#fdf8f7] py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Main Content Card */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-border/40">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-2 text-[13px] font-bold uppercase tracking-wider">
            {/* <span className="text-primary/60">|</span> */}
            <span className="text-primary bg-secondary/50 rounded-md p-1">
              {categoryName || "General"}
            </span>
            |
            <div className="flex flex-wrap gap-2">
              {article.tags?.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/20 text-[12px] text-primary px-3 font-semibold rounded-xl"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={16} />
              <span>
                Published :{" "}
                {article.createdAt
                  ? new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Oct 24, 2023"}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-[#2d3a3a]  mb-10">
            {article.title}
          </h1>

          {/* Featured Image */}
          {imageUrl && (
            <div className="relative aspect-[16/9] w-full rounded-[24px] overflow-hidden mb-12 shadow-sm">
              <img
                src={imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div
            className="max-w-none text-[#4a5555] leading-relaxed
            [&_p]:mb-6 [&_p]:text-[18px]
            [&>div>p:first-of-type]:first-letter:text-6xl [&>div>p:first-of-type]:first-letter:font-bold [&>div>p:first-of-type]:first-letter:text-primary [&>div>p:first-of-type]:first-letter:float-left [&>div>p:first-of-type]:first-letter:mr-3 [&>div>p:first-of-type]:first-letter:mt-1 [&>div>p:first-of-type]:first-letter:leading-none
            [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-[#2d3a3a] [&_h1]:mt-10 [&_h1]:mb-6
            [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-[#2d3a3a] [&_h2]:mt-10 [&_h2]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_li]:mb-2
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2
            [&_blockquote]:bg-[#fff1f0] [&_blockquote]:border-l-[6px] [&_blockquote]:border-l-[#ff8172] [&_blockquote]:rounded-[16px] [&_blockquote]:p-8 [&_blockquote]:my-10 [&_blockquote]:italic [&_blockquote]:text-[#2d3a3a] [&_blockquote]:font-medium [&_blockquote]:not-italic [&_blockquote]:relative
          "
          >
            <div dangerouslySetInnerHTML={{ __html: articleContent }} />
          </div>

          {/* Tags & Stats Footer */}
          <div className="mt-16 pt-8 border-t border-border/60 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-[13px] font-bold text-muted-foreground mr-2">
                Tags:
              </span>
              {article.tags?.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/20 text-[12px] text-primary px-3 font-semibold rounded-xl"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* <div className="flex items-center gap-6 text-muted-foreground font-semibold text-[14px]">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-muted-foreground/60" />
                <span>1,240 Views</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-[#ff8172]" />
                <span>42 Likes</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                <Share2 size={18} />
              </div>
            </div> */}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Card */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-border/40 text-center flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="size-24 border-4 border-[#fff1f0] shadow-sm">
                <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=200&auto=format&fit=crop" />
                <AvatarFallback>
                  {(
                    article.contributor?.name ||
                    article.userName ||
                    "U"
                  ).charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 border border-border/40">
                <UserCheck size={14} className="text-primary fill-primary/10" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#2d3a3a] mb-1">
              {article.contributor?.name ||
                article.userName ||
                "Dr. Sarah Jenkins"}
            </h3>
            <p className="text-[13px] font-bold text-destructive/80 mb-4 uppercase tracking-tighter">
              Clinical Psychologist
            </p>
            <Badge
              variant="outline"
              className="text-[11px] font-bold border-primary/20 bg-primary/[0.03] text-primary/70 mb-5 px-3"
            >
              Contributor since 2021
            </Badge>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-8 px-2 lowercase">
              Specializing in perinatal mental health and family dynamics.
              Passionate about destigmatizing maternal mental health struggles.
            </p>
            <div className="grid grid-cols-2 w-full pt-6 border-t border-border/40 mb-8">
              <div className="border-r border-border/40 px-2 lg:px-4">
                <div className="text-xl font-black text-[#2d3a3a]">12</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Articles
                </div>
              </div>
              <div className="px-2 lg:px-4">
                <div className="text-xl font-black text-[#2d3a3a]">4.2k</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Reads
                </div>
              </div>
            </div>
            {/* <Button
              variant="outline"
              className="w-full rounded-full border-primary/20 text-[12px] font-bold uppercase py-6 hover:bg-primary/5 transition-all text-primary/80"
            >
              View Public Profile
            </Button> */}
          </div>

          {/* Editorial Guidelines Card */}
          <div className="bg-primary/10 rounded-[32px] shadow-sm p-10 relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
            <div className="absolute -right-4 -top-4 size-32 bg-[#ff8172]/5 rounded-full blur-2xl group-hover:bg-[#ff8172]/10 transition-colors" />
            <h4 className="text-xl font-extrabold text-[#2d3a3a] mb-3 leading-tight">
              Editorial Guidelines
            </h4>
            <p className="text-[13px] text-[#4a5555]/80 leading-relaxed mb-6">
              Ensure your content meets our clinical standards. Check the latest
              updates.
            </p>
            <Button className="bg-white text-[#ff8172] hover:bg-white hover:shadow-sm rounded-full px-6 py-2 text-[12px] font-bold border-none shadow-none">
              Read Guidelines
            </Button>
            <div className="absolute right-6 bottom-6 text-[#ff8172]/10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <ChevronRight size={80} strokeWidth={4} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Contributor Notes */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-border/40">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-border/40">
            <h4 className="text-sm font-bold text-[#2d3a3a]">
              Contributor Notes
            </h4>
            <button className="text-xs font-bold text-destructive uppercase tracking-widest">
              + Add Note
            </button>
          </div>
          <div className="bg-[#fff1f0] rounded-[24px] py-16 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-[#ff8172]/10">
            <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Clock size={24} className="text-[#ff8172]" />
            </div>
            <p className="text-[13px] text-muted-foreground font-medium">
              No internal notes for this article yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
