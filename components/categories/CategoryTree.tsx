"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  Plus,
  Trash2,
  FolderTree,
  Package
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

interface CategoryTreeProps {
  categories: any[];
  selectedCategory: any;
  onSelectCategory: (category: any) => void;
  onAddSubCategory: (parentId: string) => void;
  onEditCategory: (category: any) => void;
  onDeleteCategory: (id: string, parentId?: string) => void;
  searchQuery: string;
}

function SortableCategory({
  category,
  isSelected,
  onSelect,
  onEdit,
  onAddSub,
  onDelete,
  depth = 0,
  parentId,
}: {
  category: any;
  isSelected: boolean;
  onSelect: (category: any) => void;
  onEdit: (category: any) => void;
  onAddSub: (parentId: string) => void;
  onDelete: (id: string, parentId?: string) => void;
  depth?: number;
  parentId?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubCategories = category.subCategories?.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
    zIndex: isDragging ? 1 : 0
  } : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          "flex items-center gap-2 p-2 sm:p-3 rounded-lg border transition-all duration-200",
          "hover:shadow-md cursor-pointer group relative",
          isSelected ? "border-teal-600 bg-teal-50" : "bg-white hover:border-teal-200",
          isDragging && "opacity-50",
          !category.isEnabled && "opacity-75"
        )}
        style={{ marginLeft: `${depth * (window.innerWidth < 640 ? 1 : 1.5)}rem` }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(category);
        }}
      >
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        </div>

        {hasSubCategories ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 sm:h-5 sm:w-5"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            ) : (
              <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            )}
          </Button>
        ) : (
          <div className="w-4 sm:w-5" />
        )}

        {depth === 0 ? (
          <FolderTree className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />
        ) : (
          <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
        )}

        <div className="flex-1">
          <div className="font-medium text-xs sm:text-sm">{category.name}</div>
          <div className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
            {category.description}
          </div>
        </div>

        <Badge variant="outline" className="bg-muted/30 text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 whitespace-nowrap">
          {category.itemCount} items
        </Badge>

        <Switch
          checked={category.isEnabled}
          onCheckedChange={(checked) => {
            onSelect({ ...category, isEnabled: checked });
          }}
          onClick={(e) => e.stopPropagation()}
          className="data-[state=checked]:bg-teal-600 scale-[0.65] sm:scale-75"
        />

        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(category);
                  }}
                >
                  <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Edit {depth === 0 ? 'Category' : 'Subcategory'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSub(category.id);
                  }}
                >
                  <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Add Subcategory</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(category.id, parentId);
                  }}
                >
                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Delete {depth === 0 ? 'Category' : 'Subcategory'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {hasSubCategories && isExpanded && (
        <div className="mt-2 transition-all duration-300">
          <DndContext
            sensors={useSensors(
              useSensor(PointerSensor),
              useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
              })
            )}
            collisionDetection={closestCenter}
          >
            <SortableContext
              items={category.subCategories}
              strategy={verticalListSortingStrategy}
            >
              {category.subCategories.map((subCategory: any) => (
                <SortableCategory
                  key={subCategory.id}
                  category={subCategory}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  onAddSub={onAddSub}
                  onDelete={onDelete}
                  depth={depth + 1}
                  parentId={category.id}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}

export function CategoryTree({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddSubCategory,
  onDeleteCategory,
  searchQuery
}: CategoryTreeProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const hasMatchingSubCategories = category.subCategories?.some((sub: any) =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return matchesSearch || hasMatchingSubCategories;
  });

  return (
    <Card className="p-2 sm:p-4 space-y-2 sm:space-y-3 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm sm:text-base font-semibold text-teal-700">Category Structure</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddSubCategory("root")}
                className="border-teal-100 hover:border-teal-200 hover:bg-teal-50 transition-colors text-xs sm:text-sm px-2 sm:px-3"
              >
                <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Add Category
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Add Main Category</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Drag and drop to reorder categories and sub-categories
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={filteredCategories}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {filteredCategories.map((category) => (
              <SortableCategory
                key={category.id}
                category={category}
                isSelected={selectedCategory?.id === category.id}
                onSelect={onSelectCategory}
                onAddSub={onAddSubCategory}
                onDelete={onDeleteCategory}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Card>
  );
}