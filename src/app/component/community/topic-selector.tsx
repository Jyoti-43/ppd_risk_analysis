"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TopicSelectorProps {
  selectedTopics: string[]
  onTopicsChange: (topics: string[]) => void
}

const AVAILABLE_TOPICS = [
  "Anxiety",
  "Sleep Deprivation",
  "Postpartum Recovery",
  "Partner Support",
  "Breastfeeding",
  "Self-Care",
  "Local Groups",
]

export function TopicSelector({ selectedTopics, onTopicsChange }: TopicSelectorProps) {
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      onTopicsChange(selectedTopics.filter((t) => t !== topic))
    } else {
      onTopicsChange([...selectedTopics, topic])
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Topics</label>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_TOPICS.map((topic) => {
          const isSelected = selectedTopics.includes(topic)
          return (
            <Badge
              key={topic}
              variant={isSelected ? "default" : "outline"}
              className={`h-8 px-4 rounded-full cursor-pointer transition-all text-[13px] font-medium ${
                isSelected ? "bg-primary hover:bg-primary/90" : "hover:border-primary/50 hover:bg-primary/5"
              }`}
              onClick={() => toggleTopic(topic)}
            >
              {topic}
              {isSelected && <span className="material-symbols-outlined text-[14px] ml-1.5">close</span>}
            </Badge>
          )
        })}
        <Button variant="ghost" size="sm" className="h-8 rounded-full text-primary font-bold px-3 hover:bg-primary/10">
          <span className="material-symbols-outlined text-[18px] mr-1">add</span>
          Add Topic
        </Button>
      </div>
    </div>
  )
}
