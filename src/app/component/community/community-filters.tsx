import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategoryChip } from "./category-chips"

export function CommunityFilters() {
  const categories = ["Anxiety", "Sleep Deprivation", "Support", "Recovery"]

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div className="flex flex-wrap gap-2.5">
        <CategoryChip label="All" active />
        {categories.map((cat) => (
          <CategoryChip key={cat} label={cat} />
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[150px] h-9 rounded-xl border-border bg-white font-semibold text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
