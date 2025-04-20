"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Utensils, Leaf, Flame, GripVertical, Power, PowerOff } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  foodCost: number;
  itemCode: string;
  itemType: string;
  sortOrder: number;
  isAvailable: boolean;
}

interface MenuItemListProps {
  items: MenuItem[];
  totalItems: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, value: boolean) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

interface SortableItemProps {
  item: MenuItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, value: boolean) => void;
}

function SortableItem({ item, isSelected, onSelect, onEdit, onDelete, onToggleAvailability }: SortableItemProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  const handleRowClick = (e: React.MouseEvent) => {
    // Only open the edit slider if clicking on the row itself
    const isActionButton = (e.target as HTMLElement).closest('button');
    if (!isActionButton) {
      e.stopPropagation();
      onEdit(item.id);
    }
  };

  return (
    <TableRow 
      ref={setNodeRef}
      style={style}
      className={cn(
        "group transition-colors hover:bg-muted/30 cursor-pointer",
        isDragging && "bg-muted/50"
      )}
      onClick={handleRowClick}
    >
      <TableCell className="w-[50px]">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(item.id)}
            className="translate-y-[2px]"
          />
        </div>
      </TableCell>
      <TableCell className="font-mono text-sm">
        {item.itemCode}
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div>
                <div className="font-medium line-clamp-1">{item.name}</div>
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {item.description}
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-base">{item.name}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </TableCell>
      <TableCell>
        <HoverCard>
          <HoverCardTrigger asChild>
            <div>
              <Badge className={getCategoryColor(item.category)}>
                {item.category.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Badge>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-60">
            <div className="text-sm">
              View all items in {item.category.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </div>
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {getItemTypeIcon(item.itemType)}
          <span className="text-sm">{item.itemType}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="font-medium cursor-help">
                ${item.price.toFixed(2)}
                <div className="text-xs text-muted-foreground">
                  Cost: ${item.foodCost.toFixed(2)} ({((item.foodCost / item.price) * 100).toFixed(1)}%)
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-0">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium text-sm">Section Pricing</span>
                  <span className="text-xs text-muted-foreground">Base Price: ${item.price.toFixed(2)}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                      <span className="text-sm">Dining Room</span>
                    </div>
                    <div className="text-sm font-medium">${item.price.toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span className="text-sm">Takeout</span>
                    </div>
                    <div className="text-sm font-medium">${(item.price * 0.95).toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-sm">Delivery</span>
                    </div>
                    <div className="text-sm font-medium">${(item.price * 1.1).toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                      <span className="text-sm">Catering</span>
                    </div>
                    <div className="text-sm font-medium">${(item.price * 1.2).toFixed(2)}</div>
                  </div>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Additional Charges</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Service Fee (10%)</span>
                      <span>${(item.price * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8.5%)</span>
                      <span>${(item.price * 0.085).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>$3.99</span>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Switch
            className="data-[state=checked]:bg-teal-600 data-[state=unchecked]:bg-muted"
            checked={item.isAvailable}
            onCheckedChange={(checked) => onToggleAvailability(item.id, checked)}
            onClick={(e) => e.stopPropagation()}
          />
          <Badge variant="outline" className={item.isAvailable ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-muted/50 text-muted-foreground border-muted"}>
            {item.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2 opacity-100">
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleAvailability(item.id, !item.isAvailable);
            }}
            className={cn(
              "h-8 w-8 transition-all duration-200",
              item.isAvailable
                ? "border-teal-100 hover:border-teal-200 hover:bg-teal-50 text-teal-600"
                : "border-red-100 hover:border-red-200 hover:bg-red-50 text-red-600"
            )}
          >
            {item.isAvailable ? (
              <Power className="h-4 w-4" />
            ) : (
              <PowerOff className="h-4 w-4" />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

const getItemTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'vegetarian':
      return <Leaf className="h-4 w-4 text-teal-600" />;
    case 'spicy':
      return <Flame className="h-4 w-4 text-red-600" />;
    default:
      return <Utensils className="h-4 w-4 text-muted-foreground" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'appetizers':
      return 'bg-teal-100 text-teal-800';
    case 'main-course':
      return 'bg-blue-100 text-blue-800';
    case 'desserts':
      return 'bg-pink-100 text-pink-800';
    case 'beverages':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function MenuItemList({
  items,
  totalItems,
  onEdit,
  onDelete,
  onToggleAvailability,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
}: MenuItemListProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      console.log("Reordering items:", {
        itemId: active.id,
        oldIndex,
        newIndex,
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  return (
    <div className="rounded-lg border bg-white/50 backdrop-blur-sm overflow-hidden">
      {selectedItems.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
          <span className="text-sm font-medium">
            {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedItems(new Set())}>
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
        onDragStart={handleDragStart}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedItems.size === items.length}
                    onCheckedChange={toggleSelectAll}
                    className="translate-y-[2px]"
                  />
                </TableHead>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[120px]">Category</TableHead>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead className="w-[150px]">Price</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onSelect={toggleItemSelection}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleAvailability={onToggleAvailability}
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <Table>
              <TableBody>
                <TableRow className="bg-white shadow-lg">
                  {/* Render overlay content similar to SortableItem */}
                </TableRow>
              </TableBody>
            </Table>
          ) : null}
        </DragOverlay>
      </DndContext>
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 p-4 border-t">
          <span className="text-sm text-muted-foreground mr-4">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}