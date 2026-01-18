"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SidebarCard } from "./sidebar-card";
import { useGetCategoryQuery } from "../../../redux/services/communityPostApi";
import { useArticleUploadImageMutation } from "../../../redux/services/articleApi";
import { Loader2, X } from "lucide-react";

interface EditorSidebarProps {
  preview: string;
  setPreview: (val: string) => void;
  categoryId: string;
  setCategoryId: (val: string) => void;
  tags: string[];
  setTags: (val: string[]) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
}

export function EditorSidebar({
  preview,
  setPreview,
  categoryId,
  setCategoryId,
  tags,
  setTags,
  imageUrl,
  setImageUrl,
}: EditorSidebarProps) {
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoryQuery();
  const [uploadImage, { isLoading: isUploading }] =
    useArticleUploadImageMutation();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await uploadImage(formData).unwrap();
        setImageUrl(res.url);
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Image upload failed");
      }
    }
  };

  return (
    <aside className="space-y-6">
      <SidebarCard
        title="Status"
        action={
          <Badge
            variant="secondary"
            className="bg-muted text-[10px] uppercase font-bold px-2 py-0.5"
          >
            Draft
          </Badge>
        }
      >
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          This article is currently in draft mode and is not visible to the
          public.
        </p>
      </SidebarCard>

      <SidebarCard title="Cover Image" icon="image">
        <label className="border-2 border-dashed border-primary/20 bg-primary/[0.02] rounded-lg p-4 flex flex-col items-center justify-center gap-3 text-center transition-colors hover:bg-primary/[0.04] cursor-pointer group relative min-h-[160px]">
          {imageUrl ? (
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
              <img
                src={imageUrl}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setImageUrl("");
                }}
                className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {isUploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-[24px]">
                    add_photo_alternate
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-medium">
                  {isUploading ? "Uploading..." : "Click to upload"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Recommended: 1200x630px
                </p>
              </div>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </label>
      </SidebarCard>

      <SidebarCard title="Organization" icon="category">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase">
              Category
            </label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-10 text-[13px] bg-secondary/50">
                <SelectValue
                  placeholder={
                    categoriesLoading ? "Loading..." : "Select a category..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase">
              Tags ({tags.length}/4)
            </label>
            <div className="flex flex-wrap gap-2 p-2 min-h-[42px] rounded-md bg-secondary/50 border border-input focus-within:ring-1 focus-within:ring-primary/20">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-white border-border text-foreground font-medium flex items-center gap-1 hover:bg-white pr-1"
                >
                  #{tag}
                  <button
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="material-symbols-outlined text-[14px] hover:text-primary"
                    type="button"
                  >
                    close
                  </button>
                </Badge>
              ))}
              {tags.length < 4 && (
                <input
                  className="bg-transparent border-0 outline-none text-[13px] flex-1 min-w-[60px] placeholder:text-muted-foreground/60"
                  placeholder="Add tag..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      e.preventDefault();
                      const newTag = e.currentTarget.value
                        .replace("#", "")
                        .trim();
                      if (newTag && !tags.includes(newTag)) {
                        setTags([...tags, newTag]);
                      }
                      e.currentTarget.value = "";
                    }
                  }}
                />
              )}
            </div>
            <p className="text-[11px] text-muted-foreground italic">
              {tags.length >= 4
                ? "Maximum 4 tags reached"
                : "Press Enter to add tags"}
            </p>
          </div>
        </div>
      </SidebarCard>

      <SidebarCard title="SEO & Meta" icon="search">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase">
              Short Description
            </label>
            <Textarea
              placeholder="Brief summary for article cards (max 160 chars)"
              className="bg-secondary/50 resize-none text-[13px] h-20"
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              maxLength={160}
            />
            <p className="text-[10px] text-right text-muted-foreground">
              {preview.length}/160
            </p>
          </div>
        </div>
      </SidebarCard>
    </aside>
  );
}
