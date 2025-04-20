"use client";

import { useState, useEffect } from "react";
import { NavigationPanel } from "@/components/menu/NavigationPanel";
import { ModifierGroupList } from "@/components/modifiers/ModifierGroupList";
import { ModifierGroupSlider } from "@/components/modifiers/ModifierGroupSlider";
import { ModifierBulkOperations } from "@/components/modifiers/ModifierBulkOperations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Plus, Search, Settings2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for initial development
const initialModifierGroups = [
  {
    id: "1",
    name: "Size Options",
    description: "Choose your preferred size",
    type: "single",
    required: true,
    sortOrder: 1,
    isEnabled: true,
    modifiers: [
      { id: "1-1", name: "Small", price: 0, sortOrder: 1, isEnabled: true },
      { id: "1-2", name: "Medium", price: 2, sortOrder: 2, isEnabled: true },
      { id: "1-3", name: "Large", price: 4, sortOrder: 3, isEnabled: true }
    ],
    appliedTo: ["Pizza", "Beverages"]
  },
  {
    id: "2",
    name: "Extra Toppings",
    description: "Add extra toppings to your dish",
    type: "multiple",
    required: false,
    sortOrder: 2,
    isEnabled: true,
    modifiers: [
      { id: "2-1", name: "Cheese", price: 1.5, sortOrder: 1, isEnabled: true },
      { id: "2-2", name: "Mushrooms", price: 1, sortOrder: 2, isEnabled: true },
      { id: "2-3", name: "Pepperoni", price: 2, sortOrder: 3, isEnabled: true }
    ],
    appliedTo: ["Pizza", "Pasta"]
  }
];

export default function ModifiersPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ModifierGroup | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "single" | "multiple">("all");
  const [modifierGroups, setModifierGroups] = useState(initialModifierGroups);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddGroup = () => {
    setSelectedGroup({
      id: "new",
      name: "",
      description: "",
      type: "single",
      required: false,
      sortOrder: modifierGroups.length + 1,
      isEnabled: true,
      modifiers: [],
      appliedTo: []
    });
    setIsSliderOpen(true);
  };

  const handleEditGroup = (id: string) => {
    const group = modifierGroups.find(g => g.id === id);
    if (group) {
      setSelectedGroup(group);
      setIsSliderOpen(true);
    }
  };

  const handleSaveGroup = (group: ModifierGroup) => {
    setModifierGroups(prev => {
      if (group.id === "new") {
        const newId = (Math.max(...prev.map(g => parseInt(g.id))) + 1).toString();
        const newGroup = { ...group, id: newId };
        
        toast({
          title: "Group Created",
          description: `${group.name} has been created successfully.`,
          className: "bg-gradient-to-r from-teal-600 to-teal-700 text-white border-none",
        });
        
        return [...prev, newGroup];
      } else {
        toast({
          title: "Group Updated",
          description: `${group.name} has been updated successfully.`,
          className: "bg-gradient-to-r from-teal-600 to-teal-700 text-white border-none",
        });
        
        return prev.map(g => g.id === group.id ? group : g);
      }
    });
    setIsSliderOpen(false);
    setSelectedGroup(undefined);
  };

  const handleToggleGroup = (id: string, enabled: boolean) => {
    setModifierGroups(prev =>
      prev.map(group =>
        group.id === id ? { ...group, isEnabled: enabled } : group
      )
    );
    
    toast({
      title: enabled ? "Group Enabled" : "Group Disabled",
      description: `The modifier group has been ${enabled ? "enabled" : "disabled"}.`,
      className: enabled ? "bg-teal-600" : "bg-muted",
    });
  };

  const filteredGroups = modifierGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || group.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-b from-background to-muted/20 pl-64",
      !mounted && "opacity-0 transition-opacity",
      mounted && "opacity-100 transition-opacity duration-500"
    )}>
      <NavigationPanel />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
              Modifiers Management
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage modifier groups and their options
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <ModifierBulkOperations />
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Settings2 className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modifier Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button 
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl h-10 px-6"
              onClick={handleAddGroup}
            >
              <Plus className="mr-2 h-5 w-5" /> Add Modifier Group
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search modifier groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Select
            value={filterType}
            onValueChange={(value: "all" | "single" | "multiple") => setFilterType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="single">Single Selection</SelectItem>
              <SelectItem value="multiple">Multiple Selection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ModifierGroupList
          groups={filteredGroups}
          onEdit={handleEditGroup}
          onToggle={handleToggleGroup}
        />
      </div>

      <ModifierGroupSlider
        group={selectedGroup}
        isOpen={isSliderOpen}
        onClose={() => {
          setIsSliderOpen(false);
          setSelectedGroup(undefined);
        }}
        onSave={handleSaveGroup}
      />
    </div>
  );
}