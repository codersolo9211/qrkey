"use client";

import { useState } from "react";
import * as React from "react";
import { useEffect } from "react";
import type { ModifierGroup } from "@/types/modifiers";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, GripVertical, Plus, Trash2, Settings, ListChecks, Store, Filter, Search, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ModifierGroupSliderProps {
  group?: ModifierGroup;
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: ModifierGroup) => void;
}

// Mock data for menu items and stores
const menuItems = [
  { id: "1", name: "Classic Caesar Salad", category: "Salads" },
  { id: "2", name: "Margherita Pizza", category: "Pizza" },
  { id: "3", name: "Grilled Salmon", category: "Main Course" }
];

const categories = [
  { id: "all", name: "All Categories" },
  { id: "Salads", name: "Salads" },
  { id: "Pizza", name: "Pizza" },
  { id: "Main Course", name: "Main Course" }
];

const stores = [
  { id: "store1", name: "Downtown Location" },
  { id: "store2", name: "Uptown Location" },
  { id: "store3", name: "Mall Location" },
];

const serviceSections = [
  { id: "dining", name: "Dining Room" },
  { id: "takeout", name: "Takeout" },
  { id: "delivery", name: "Delivery" },
  { id: "catering", name: "Catering" },
];

function SortableModifierItem({ 
  modifier, 
  onUpdate, 
  onDelete 
}: { 
  modifier: { id: string; name: string; price: number; isEnabled: boolean; }; 
  onUpdate: (id: string, updates: Partial<typeof modifier>) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: modifier.id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg border transition-all duration-200",
        "bg-white/50 backdrop-blur-sm hover:shadow-md",
        "group hover:border-teal-200 hover:bg-teal-50/50"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-4">
        <Input
          value={modifier.name}
          onChange={(e) => onUpdate(modifier.id, { name: e.target.value })}
          placeholder="Option name"
          className="border-teal-100 focus-visible:ring-teal-500/20"
        />
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            value={modifier.price}
            onChange={(e) => onUpdate(modifier.id, { price: parseFloat(e.target.value) })}
            className="pl-9 border-teal-100 focus-visible:ring-teal-500/20"
            placeholder="0.00"
          />
        </div>
      </div>

      <Switch
        checked={modifier.isEnabled}
        onCheckedChange={(checked) => onUpdate(modifier.id, { isEnabled: checked })}
        className="data-[state=checked]:bg-teal-600"
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(modifier.id)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ModifierGroupSlider({ group, isOpen, onClose, onSave }: ModifierGroupSliderProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"single" | "multiple">("single");
  const [required, setRequired] = useState(false);
  const [modifiers, setModifiers] = useState([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set());
  const [selectedServiceSections, setSelectedServiceSections] = useState<Set<string>>(new Set());
  const [storeServiceSections, setStoreServiceSections] = useState<Record<string, Set<string>>>(
    {}
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("stores");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Initialize or update state when group changes
  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description);
      setType(group.type);
      setRequired(group.required);
      setModifiers(group.modifiers);
      setSelectedItems(new Set(group.appliedTo));
      setSelectedStores(new Set(group.stores || []));
      setSelectedServiceSections(new Set(group.serviceSections || []));
      setStoreServiceSections(
        Object.fromEntries(
          Object.entries(group.storeServiceSections || {}).map(([store, sections]) => [
            store,
            new Set(sections)
          ])
        )
      );
    } else {
      // Reset to defaults for new group
      setName("");
      setDescription("");
      setType("single");
      setRequired(false);
      setModifiers([]);
      setSelectedItems(new Set());
      setSelectedStores(new Set());
      setSelectedServiceSections(new Set());
      setStoreServiceSections({});
    }
  }, [group]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setModifiers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddModifier = () => {
    const newModifier = {
      id: crypto.randomUUID(),
      name: "",
      price: 0,
      sortOrder: modifiers.length + 1,
      isEnabled: true
    };
    setModifiers([...modifiers, newModifier]);
  };

  const handleUpdateModifier = (id: string, updates: Partial<typeof modifiers[0]>) => {
    setModifiers(prev => 
      prev.map(mod => mod.id === id ? { ...mod, ...updates } : mod)
    );
  };

  const handleDeleteModifier = (id: string) => {
    setModifiers(prev => prev.filter(mod => mod.id !== id));
  };

  const handleSave = () => {
    if (!name) return;

    onSave({
      id: group?.id || "new",
      name,
      description,
      type,
      required,
      sortOrder: group?.sortOrder || 0,
      isEnabled: group?.isEnabled ?? true,
      modifiers: modifiers.map((mod, index) => ({
        ...mod,
        sortOrder: index + 1
      })),
      appliedTo: Array.from(selectedItems),
      serviceSections: Array.from(selectedServiceSections),
      stores: Array.from(selectedStores),
      storeServiceSections: Object.fromEntries(
        Object.entries(storeServiceSections).map(([store, sections]) => [
          store,
          Array.from(sections)
        ])
      )
    });
  };

  const toggleStoreServiceSection = (storeId: string, sectionId: string) => {
    setStoreServiceSections(prev => {
      const storeSections = prev[storeId] || new Set();
      const newSections = new Set(storeSections);
      
      if (newSections.has(sectionId)) {
        newSections.delete(sectionId);
      } else {
        newSections.add(sectionId);
      }

      return {
        ...prev,
        [storeId]: newSections
      };
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[640px] p-0 border-l bg-gradient-to-b from-white to-gray-50/50 flex flex-col">
        <SheetHeader className="px-6 py-6 border-b bg-white">
          <SheetTitle className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent tracking-tight">
            {group?.id ? "Edit Modifier Group" : "New Modifier Group"}
          </SheetTitle>
          <SheetDescription className="text-base text-muted-foreground mt-2">
            Configure modifier group settings and assignments
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="stores" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="bg-white border-b px-6 py-2">
            <TabsList className="w-full justify-start bg-white/50 backdrop-blur-sm p-1.5 rounded-lg border shadow-sm">
              <TabsTrigger value="stores" className="flex items-center gap-2.5 px-4 py-2">
                <Store className="h-4 w-4" />
                Stores & Services
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2.5 px-4 py-2">
                <Settings className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="items" className="flex items-center gap-2.5 px-4 py-2">
                <ListChecks className="h-4 w-4" />
                Menu Items
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-6 overflow-y-auto">
            <TabsContent value="stores" className="mt-0">
              <Card className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-teal-700">Service Sections</Label>
                    <p className="text-sm text-muted-foreground">
                      Select which service sections this modifier group applies to
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {serviceSections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedServiceSections.has(section.id)}
                          onCheckedChange={(checked) => {
                            const newSelected = new Set(selectedServiceSections);
                            if (checked) {
                              newSelected.add(section.id);
                            } else {
                              newSelected.delete(section.id);
                            }
                            setSelectedServiceSections(newSelected);
                          }}
                          className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                        />
                        <div>
                          <Label className="text-sm font-semibold leading-none">{section.name}</Label>
                          <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-teal-700">Store Availability</Label>
                    <p className="text-sm text-muted-foreground">
                      Configure which stores can use this modifier group
                    </p>
                  </div>
                  {stores.map((store) => (
                    <div key={store.id} className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedStores.has(store.id)}
                            onCheckedChange={(checked) => {
                              const newSelected = new Set(selectedStores);
                              if (checked) {
                                newSelected.add(store.id);
                              } else {
                                newSelected.delete(store.id);
                              }
                              setSelectedStores(newSelected);
                            }}
                          />
                          <div>
                            <Label className="font-medium">{store.name}</Label>
                            <p className="text-sm text-muted-foreground">Configure store-specific settings</p>
                          </div>
                        </div>
                      </div>

                      {selectedStores.has(store.id) && (
                        <div className="ml-6 grid grid-cols-2 gap-4">
                          {serviceSections.map((section) => (
                            <div
                              key={section.id}
                              className="flex items-center space-x-2 p-3 rounded-lg border"
                            >
                              <Checkbox
                                checked={storeServiceSections[store.id]?.has(section.id) || false}
                                onCheckedChange={() => toggleStoreServiceSection(store.id, section.id)}
                              />
                              <Label>{section.name}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="general" className="mt-0 space-y-6">
              <Card className="p-6 space-y-4 bg-white/50 backdrop-blur-sm border-teal-100">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-teal-700 mb-1.5 block">Group Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter group name"
                    className="border-teal-100 focus-visible:ring-teal-500/20 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-teal-700 mb-1.5 block">Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    className="min-h-[100px] border-teal-100 focus-visible:ring-teal-500/20 text-base leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-teal-700 mb-1.5 block">Selection Type</Label>
                    <Select value={type} onValueChange={(value: "single" | "multiple") => setType(value)}>
                      <SelectTrigger className="border-teal-100 focus-visible:ring-teal-500/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Selection</SelectItem>
                        <SelectItem value="multiple">Multiple Selection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between space-x-2 pt-8">
                    <Label className="text-base font-semibold text-teal-700">Required</Label>
                    <Switch
                      checked={required}
                      onCheckedChange={setRequired}
                      className="data-[state=checked]:bg-teal-600"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-4 bg-white/50 backdrop-blur-sm border-teal-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-lg font-semibold text-teal-700">Modifier Options</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add and arrange options for this modifier group
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddModifier}
                    className="border-teal-100 hover:border-teal-200 hover:bg-teal-50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>

                <Separator className="my-4" />

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={modifiers} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {modifiers.map((modifier) => (
                        <SortableModifierItem
                          key={modifier.id}
                          modifier={modifier}
                          onUpdate={handleUpdateModifier}
                          onDelete={handleDeleteModifier}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="mt-0">
              <Card className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-teal-700">Menu Items</Label>
                    <p className="text-sm text-muted-foreground">
                      Select which menu items this modifier group applies to
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.size > 0 && (
                      <Badge variant="outline" className="bg-teal-50 text-teal-700">
                        {selectedCategories.size} categories selected
                      </Badge>
                    )}
                    {selectedItems.size > 0 && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {selectedItems.size} items selected
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Categories</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCategories(new Set(categories.map(c => c.id)))}
                          className="text-xs"
                        >
                          Select All Categories
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCategories(new Set())}
                          className="text-xs"
                        >
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {categories.filter(cat => cat.id !== "all").map(category => (
                      <div
                        key={category.id}
                        className={cn(
                          "rounded-lg border transition-all duration-200",
                          selectedCategories.has(category.id) && "border-teal-200 bg-teal-50"
                        )}
                      >
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedCategories.has(category.id)}
                              onCheckedChange={(checked) => {
                                const newSelected = new Set(selectedCategories);
                                if (checked) {
                                  newSelected.add(category.id);
                                } else {
                                  newSelected.delete(category.id);
                                }
                                setSelectedCategories(newSelected);
                              }}
                            />
                            <Label className="font-medium">{category.name}</Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setExpandedCategories(prev => {
                                const next = new Set(prev);
                                if (next.has(category.id)) {
                                  next.delete(category.id);
                                } else {
                                  next.add(category.id);
                                }
                                return next;
                              });
                            }}
                          >
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {expandedCategories.has(category.id) && (
                          <div className="border-t bg-white/50 p-4 space-y-2">
                            {menuItems
                              .filter(item => 
                                item.category === category.name &&
                                (searchQuery === "" || 
                                  item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                              )
                              .map(item => (
                                <div
                                  key={item.id}
                                  className="flex items-center space-x-2 p-2 rounded-lg border bg-white hover:bg-muted/50 transition-colors"
                                >
                                  <Checkbox
                                    checked={selectedItems.has(item.id)}
                                    onCheckedChange={(checked) => {
                                      const newSelected = new Set(selectedItems);
                                      if (checked) {
                                        newSelected.add(item.id);
                                      } else {
                                        newSelected.delete(item.id);
                                      }
                                      setSelectedItems(newSelected);
                                    }}
                                  />
                                  <span className="text-sm">{item.name}</span>
                                </div>
                              ))}
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full mt-2 text-xs"
                              onClick={() => {
                                const categoryItems = menuItems
                                  .filter(item => item.category === category.name)
                                  .map(item => item.id);
                                setSelectedItems(new Set([...selectedItems, ...categoryItems]));
                              }}
                            >
                              Select All Items in {category.name}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </ScrollArea>

          <div className="flex justify-end gap-2 p-6 border-t bg-white/50 backdrop-blur-sm mt-auto">
            <Button variant="outline" onClick={onClose} className="border-teal-100 hover:border-teal-200 hover:bg-teal-50 font-medium">
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className={cn(
                "bg-gradient-to-r from-teal-600 to-teal-700",
                "hover:from-teal-700 hover:to-teal-800",
                "text-white shadow-sm hover:shadow-md transition-all duration-200",
                "font-medium px-6"
              )}
            >
              Save Changes
            </Button>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}