"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  isEnabled: boolean;
}

interface MenuCategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  enabledCategories: Set<string>;
  onToggleCategory: (categoryId: string) => void;
}

export function MenuCategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  enabledCategories,
  onToggleCategory,
}: MenuCategoryFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-white/50 backdrop-blur-sm">
      <div className="flex w-max space-x-4 p-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all duration-200 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm relative",
              activeCategory === category.id
                ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800"
                : "bg-white text-muted-foreground hover:text-teal-600",
              !enabledCategories.has(category.id) && "opacity-50"
            )}
          >
            {category.name}
            {category.id !== "all" && (
              <Switch
                className="ml-2 data-[state=checked]:bg-teal-600 data-[state=unchecked]:bg-muted"
                checked={enabledCategories.has(category.id)}
                onCheckedChange={() => onToggleCategory(category.id)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}