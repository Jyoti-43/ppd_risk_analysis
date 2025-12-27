import { Button } from "@/components/ui/button"

export function CreateGroupCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-8 min-h-[280px] hover:border-primary/50 transition-colors">
      <div className="flex flex-col items-center gap-4 text-center max-w-[240px]">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[32px]">add</span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-[17px] text-foreground">Create a New Group</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Start a community around a specific topic, location, or shared interest.
          </p>
        </div>

        <Button
          variant="outline"
          className="h-9 px-5 rounded-full border-primary/30 text-primary hover:bg-primary/5 font-semibold text-[13px] mt-2"
        >
          Start Group
        </Button>
      </div>
    </div>
  )
}
