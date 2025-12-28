"use client"

import type React from "react"

import { useState } from "react"

interface GuidanceCardProps {
  icon: string
  title: string
  content: React.ReactNode
  defaultOpen?: boolean
}

export function GuidanceCard({ icon, title, content, defaultOpen = false }: GuidanceCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-[24px]">{icon}</span>
          </div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
        </div>
        <span
          className={`material-symbols-outlined text-muted-foreground text-[24px] transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>

      {isOpen && <div className="px-6 pb-6 pt-2 space-y-4 border-t border-border/50">{content}</div>}
    </div>
  )
}
