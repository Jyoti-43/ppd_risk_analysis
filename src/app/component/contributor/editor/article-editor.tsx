"use client"

import { useState } from "react"

export function ArticleEditor() {
  const [title, setTitle] = useState("")

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm min-h-[800px] flex flex-col">
      <div className="p-8 pb-4 space-y-4">
        <textarea
          placeholder="Enter article title..."
          className="w-full bg-transparent border-0 outline-none text-4xl font-black placeholder:text-muted-foreground/20 resize-none overflow-hidden h-auto"
          rows={1}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            e.target.style.height = "auto"
            e.target.style.height = e.target.scrollHeight + "px"
          }}
        />

        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/40 border border-border/50 rounded-full w-fit group hover:border-primary/20 transition-colors">
          <span className="material-symbols-outlined text-[16px] text-muted-foreground">link</span>
          <span className="text-[12px] text-muted-foreground">ppdsupport.com/blog/</span>
          <span className="text-[12px] font-medium text-foreground">
            {title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "understanding-postpartum-..."}
          </span>
        </div>
      </div>

      <div className="sticky top-[61px] z-40 bg-white border-y border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <ToolbarButton icon="format_h1" label="H1" />
          <ToolbarButton icon="format_h2" label="H2" />
          <div className="w-px h-5 bg-border mx-2" />
          <ToolbarButton icon="format_bold" />
          <ToolbarButton icon="format_italic" />
          <ToolbarButton icon="format_underlined" />
          <div className="w-px h-5 bg-border mx-2" />
          <ToolbarButton icon="format_quote" />
          <ToolbarButton icon="format_list_bulleted" />
          <ToolbarButton icon="format_list_numbered" />
        </div>
        <div className="flex items-center gap-1">
          <ToolbarButton icon="link" />
          <ToolbarButton icon="image" />
        </div>
      </div>

      <div className="flex-1 p-8 pt-6">
        <div
          className="min-h-full outline-none text-[15px] leading-relaxed text-foreground/80 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40"
          contentEditable
          data-placeholder="Start writing your story here... Share your insights and experiences regarding PPD recovery."
        />
      </div>
    </div>
  )
}

function ToolbarButton({ icon, label }: { icon: string; label?: string }) {
  return (
    <button className="h-8 w-8 lg:w-auto lg:px-2 rounded flex items-center justify-center gap-1 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
      {label && <span className="text-[11px] font-bold">{label}</span>}
      {!label && <span className="material-symbols-outlined text-[20px]">{icon}</span>}
    </button>
  )
}
