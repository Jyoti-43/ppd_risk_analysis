"use client"

import { cn } from "@/lib/utils"

interface CategoryChipProps {
  label: string
  active?: boolean
  onClick?: () => void
}

export function CategoryChip({ label, active, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-9 shrink-0 items-center justify-center rounded-full px-5 transition-all active:scale-95 text-sm font-medium",
        active
          ? "bg-primary text-white shadow-sm font-semibold"
          : "bg-white border border-border text-foreground hover:bg-muted/50",
      )}
    >
      {label}
    </button>
  )
}
