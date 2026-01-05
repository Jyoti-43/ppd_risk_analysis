"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { SidebarCard } from "./sidebar-card"

export function EditorSidebar() {
  const [tags, setTags] = useState(["anxiety"])

  return (
    <aside className="space-y-6">
      <SidebarCard
        title="Status"
        action={
          <Badge variant="secondary" className="bg-muted text-[10px] uppercase font-bold px-2 py-0.5">
            Draft
          </Badge>
        }
      >
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          This article is currently in draft mode and is not visible to the public.
        </p>
      </SidebarCard>

      <SidebarCard title="Cover Image" icon="image">
        <div className="border-2 border-dashed border-primary/20 bg-primary/[0.02] rounded-lg p-8 flex flex-col items-center justify-center gap-3 text-center transition-colors hover:bg-primary/[0.04] cursor-pointer group">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
          </div>
          <div className="space-y-1">
            <p className="text-[13px] font-medium">Click to upload or drag & drop</p>
            <p className="text-[11px] text-muted-foreground">Recommended: 1200x630px</p>
          </div>
        </div>
      </SidebarCard>

      <SidebarCard title="Organization" icon="category">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase">Category</label>
            <Select>
              <SelectTrigger className="h-10 text-[13px] bg-secondary/50">
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emotional">Emotional Health</SelectItem>
                <SelectItem value="sleep">Sleep & Rest</SelectItem>
                <SelectItem value="community">Community Stories</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase">Tags</label>
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
                  >
                    close
                  </button>
                </Badge>
              ))}
              <input
                className="bg-transparent border-0 outline-none text-[13px] flex-1 min-w-[60px] placeholder:text-muted-foreground/60"
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    setTags([...tags, e.currentTarget.value.replace("#", "")])
                    e.currentTarget.value = ""
                  }
                }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground italic">Press Enter to add tags</p>
          </div>
        </div>
      </SidebarCard>

      <SidebarCard title="SEO & Meta" icon="search">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase">Short Description</label>
            <Textarea
              placeholder="Brief summary for article cards (max 160 chars)"
              className="bg-secondary/50 resize-none text-[13px] h-20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-muted-foreground uppercase">Meta Description</label>
            <Textarea
              placeholder="SEO description for search engines"
              className="bg-secondary/50 resize-none text-[13px] h-24"
            />
          </div>
        </div>
      </SidebarCard>

      <SidebarCard
        title="Table of Contents"
        icon="format_list_bulleted"
        action={<span className="text-[10px] font-bold text-primary/60 uppercase">Auto-generate</span>}
      >
        <div className="space-y-3">
          {[
            { id: 1, text: "Understanding PPD", anchor: "understanding-ppd" },
            { id: 2, text: "Signs & Symptoms", anchor: "signs-symptoms" },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50 group hover:border-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined text-muted-foreground/40 text-[18px] cursor-grab active:cursor-grabbing">
                drag_indicator
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold truncate">{item.text}</p>
                <p className="text-[11px] text-muted-foreground truncate italic"># {item.anchor}</p>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full border-dashed border-primary/20 hover:border-primary/40 hover:bg-primary/[0.02] text-primary h-10 gap-2 bg-transparent"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="text-[12px] font-bold uppercase tracking-tight">Add Item</span>
          </Button>
        </div>
      </SidebarCard>
    </aside>
  )
}
