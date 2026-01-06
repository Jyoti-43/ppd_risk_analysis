"use client"
import { cn } from "@/lib/utils"

interface CommunityTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function CommunityTabs({ activeTab, onTabChange }: CommunityTabsProps) {
  const tabs = [
    { id: "feed", label: "Feed", icon: "dynamic_feed" },
    { id: "groups", label: "Groups", icon: "groups" },
    // { id: "stories", label: "Stories", icon: "auto_stories" },
  ]

  return (
    <div className="flex items-center border-b border-border mt-8 mb-6">
      <div className="flex items-center gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
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
