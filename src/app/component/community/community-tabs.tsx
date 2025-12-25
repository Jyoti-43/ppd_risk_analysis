"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { BookOpenCheck, ListPlus, UsersRound } from "lucide-react"

export function CommunityTabs() {
  const [activeTab, setActiveTab] = useState("feed")

  const tabs = [
    { id: "feed", label: "Feed", icon: <ListPlus strokeWidth={3} size={18} /> },
    { id: "groups", label: "Groups", icon:  <UsersRound  strokeWidth={3} size={18} /> },
    { id: "stories", label: "Stories", icon:  <BookOpenCheck strokeWidth={3} size={18} /> },
  ]

  return (
    <div className="flex items-center border-b border-border mt-8 mb-6">
      <div className="flex items-center gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 pb-3.5 border-b-2 transition-all font-semibold text-[15px]",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <span className={cn("material-symbols-outlined text-[20px]", activeTab === tab.id && "fill")}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
