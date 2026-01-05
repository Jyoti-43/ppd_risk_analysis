import type { ReactNode } from "react"

interface SidebarCardProps {
  title: string
  icon?: string
  action?: ReactNode
  children: ReactNode
}

export function SidebarCard({ title, icon, action, children }: SidebarCardProps) {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="px-5 py-4 flex items-center justify-between border-b border-border/50 bg-white/50">
        <div className="flex items-center gap-2.5">
          {icon && <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>}
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground/80">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}
