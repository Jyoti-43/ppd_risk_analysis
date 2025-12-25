import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategoryChip } from "./category-chips"


interface CommunityFiltersProps {
  activeTab: string
}

export function CommunityFilters({ activeTab }: CommunityFiltersProps) {
  const feedCategories = ["Anxiety", "Sleep Deprivation", "Support", "Recovery"]
  const groupCategories = ["My Groups", "New Mothers", "Wellness", "Local"]

  const categories = activeTab === "groups" ? groupCategories : feedCategories

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div className="flex flex-wrap gap-2.5">
        <CategoryChip label={activeTab === "groups" ? "All Groups" : "All"} active />
        {categories.map((cat) => (
          <CategoryChip key={cat} label={cat} />
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-sm font-medium text-muted-foreground">
          {activeTab === "groups" ? "Filter by:" : "Sort by:"}
        </span>
        <Select defaultValue={activeTab === "groups" ? "most-active" : "newest"}>
          <SelectTrigger className="w-[150px] h-9 rounded-xl border-border bg-white font-semibold text-sm">
            <SelectValue placeholder={activeTab === "groups" ? "Filter by" : "Sort by"} />
          </SelectTrigger>
          <SelectContent>
            {activeTab === "groups" ? (
              <>
                <SelectItem value="most-active">Most Active</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="largest">Largest</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
