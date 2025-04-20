"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GripVertical, DollarSign } from "lucide-react";
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

interface CategoryItemsListProps {
  items: any[];
  onReorder: (items: any[]) => void;
}

function SortableItem({ item }: { item: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
    zIndex: isDragging ? 1 : 0,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-200",
        "bg-white hover:shadow-md group",
        isDragging ? "opacity-50" : "hover:border-teal-200",
        !item.isAvailable && "opacity-75"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{item.name}</div>
        <div className="text-xs text-muted-foreground line-clamp-1">
          {item.description}
        </div>
      </div>

     <div className="flex items-center gap-3">
        <div className="text-right">
         <div className="font-medium text-sm flex items-center gap-0.5">
           <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
            {item.price.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">
            Cost: ${item.foodCost.toFixed(2)}
          </div>
        </div>

        <Badge 
          variant="outline" 
          className={cn(
           "min-w-[90px] justify-center text-xs px-1.5 py-0.5",
            item.isAvailable 
              ? "bg-teal-50 text-teal-700 border-teal-200" 
              : "bg-muted text-muted-foreground"
          )}
        >
          {item.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </div>
    </div>
  );
}

export function CategoryItemsList({ items, onReorder }: CategoryItemsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
    }
  };

  return (
    <Card className="p-4 space-y-3 bg-white/50 backdrop-blur-sm">
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-teal-700">Category Items</h2>
        <p className="text-xs text-muted-foreground">
          Drag and drop to reorder items within this category
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Card>
  );
}