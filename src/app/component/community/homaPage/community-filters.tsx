import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CategoryChip } from "./category-chips";

interface CommunityFiltersProps {
  activeTab: string;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
}

export function CommunityFilters({
  activeTab,
  activeCategory,
  onCategoryChange,
  onSearchChange,
}: CommunityFiltersProps) {
  const feedCategories = [
    "My Posts",
  ];
  const groupCategories = ["My Groups"];

  const categories = activeTab === "groups" ? groupCategories : feedCategories;
  const allLabel = activeTab === "groups" ? "All Groups" : "All";

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div className="flex flex-wrap gap-2.5">
        <CategoryChip
          label={allLabel}
          active={activeCategory === allLabel}
          onClick={() => onCategoryChange(allLabel)}
        />
        {categories.map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onClick={() => onCategoryChange(cat)}
          />
        ))}
      </div>

      <div className="relative w-full md:w-80 ml-auto md:ml-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9 h-11 rounded-xl border-border bg-white focus-visible:ring-primary shadow-sm"
          placeholder={`Search ${
            activeTab === "groups" ? "groups" : "posts"
          } by title or category...`}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {activeTab === "groups" ? "Filter by:" : "Sort by:"}
        </span>
        <Select
          defaultValue={activeTab === "groups" ? "most-active" : "newest"}
        >
          <SelectTrigger className="w-[150px] h-9 rounded-xl border-border bg-white font-semibold text-sm">
            <SelectValue
              placeholder={activeTab === "groups" ? "Filter by" : "Sort by"}
            />
          </SelectTrigger>
          <SelectContent>
            {activeTab === "groups" ? (
              <>
                <SelectItem value="most-active">Most Active</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
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
  );
}
