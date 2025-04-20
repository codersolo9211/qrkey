"use client";

import { useState } from "react";
import { ModifierGroup } from "@/types/modifiers";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { Edit, GripVertical, ListChecks, ListPlus } from "lucide-react";

// Mock data for stores
const stores = [
  { id: "store1", name: "Downtown Location" },
  { id: "store2", name: "Uptown Location" },
  { id: "store3", name: "Mall Location" },
];

interface ModifierGroupListProps {
  groups: ModifierGroup[];
  onEdit: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

const SortableGroupCard = ({ group, onEdit, onToggle }: { 
  group: ModifierGroup; 
  onEdit: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
    zIndex: isDragging ? 1 : 0,
  } : undefined;

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "relative group transition-all duration-200 bg-white/50 backdrop-blur-sm",
        isDragging ? "shadow-lg" : "hover:shadow-md",
        !group.isEnabled && "opacity-75"
      )}
    >
      <div {...attributes} {...listeners} className="absolute top-4 left-4 cursor-grab active:cursor-grabbing">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <CardHeader className="pl-14 pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {group.name}
              <Badge variant="outline" className={
                group.type === "single" 
                  ? "border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5"
                  : "border-purple-200 bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5"
              }>
                {group.type === "single" ? (
                  <ListChecks className="mr-1 h-3 w-3" />
                ) : (
                  <ListPlus className="mr-1 h-3 w-3" />
                )}
                {group.type === "single" ? "Single" : "Multiple"}
              </Badge>
              {group.required && (
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 text-xs font-medium px-2 py-0.5">
                  Required
                </Badge>
              )}
            </CardTitle>
          </div>
          <Switch
            checked={group.isEnabled}
            onCheckedChange={(checked) => onToggle(group.id, checked)}
            className="data-[state=checked]:bg-teal-600"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Badge
                  variant="outline"
                  className="bg-teal-50 text-teal-700 border-teal-200 font-medium text-xs px-2 py-0.5 cursor-help"
                >
                  {group.serviceSections?.length || 0} Service Sections
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <div className="space-y-2">
                  <h4 className="font-semibold text-base">Service Sections</h4>
                  <div className="flex flex-wrap gap-1">
                    {group.serviceSections?.map((section) => (
                      <Badge
                        key={section}
                        variant="outline"
                        className="text-xs"
                      >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </Badge>
                    )) || (
                      <span className="text-sm text-muted-foreground">No service sections selected</span>
                    )}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div className="flex flex-wrap gap-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 cursor-help font-medium text-xs px-2 py-0.5"
                >
                  {group.stores?.length || 0} Locations
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-semibold text-base">Store Locations</h4>
                  {group.stores?.map((storeId) => {
                    const store = stores.find(s => s.id === storeId);
                    const storeSections = group.storeServiceSections?.[storeId] || [];
                    
                    return store && (
                      <div key={storeId} className="space-y-2 pb-2 border-b last:border-0">
                        <h5 className="font-medium text-sm">{store.name}</h5>
                        <div className="flex flex-wrap gap-1">
                          {storeSections.length > 0 ? storeSections.map((section) => (
                            <Badge key={section} variant="outline" className="text-xs">
                              {section.charAt(0).toUpperCase() + section.slice(1)}
                            </Badge>
                          )) : (
                            <span className="text-xs text-muted-foreground">All sections enabled</span>
                          )}
                        </div>
                      </div>
                    );
                  }) || (
                    <span className="text-sm text-muted-foreground">No locations selected</span>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {group.modifiers.slice(0, 3).map((modifier) => (
              <div
                key={modifier.id}
                className={cn(
                  "p-2 rounded-lg border text-xs",
                  modifier.isEnabled
                    ? "bg-white shadow-sm"
                    : "bg-muted/50 text-muted-foreground"
                )}
              >
                <div className="font-medium mb-1">{modifier.name}</div>
                <div className="text-muted-foreground font-medium">
                  ${modifier.price.toFixed(2)}
                </div>
              </div>
            ))}
            {group.modifiers.length > 3 && (
              <div className="p-2 rounded-lg border bg-muted/30 text-xs flex items-center justify-center font-medium">
                +{group.modifiers.length - 3} more
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-muted-foreground font-medium">
              Applied to {group.appliedTo.length} items
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(group.id)}
              className="border-teal-100 hover:border-teal-200 hover:bg-teal-50 text-teal-600 font-medium"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Group
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function ModifierGroupList({ groups, onEdit, onToggle }: ModifierGroupListProps) {
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = groups.findIndex((group) => group.id === active.id);
      const newIndex = groups.findIndex((group) => group.id === over.id);

      console.log("Reordering groups:", {
        groupId: active.id,
        oldIndex,
        newIndex,
      });
    }
  };

  return (
    <div className="space-y-4">
      {selectedGroups.size > 0 && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
          <span className="text-sm font-medium">
            {selectedGroups.size} group{selectedGroups.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedGroups(new Set())}>
              Clear Selection
            </Button>
            <Button variant="default" size="sm">
              Bulk Edit
            </Button>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={groups} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {groups.map((group) => (
              <SortableGroupCard
                key={group.id}
                group={group}
                onEdit={onEdit}
                onToggle={onToggle}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}