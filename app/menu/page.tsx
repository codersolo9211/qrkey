"use client";

import { useState, useEffect } from "react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetCuisineListMutation } from "@/features/cuisine/cuisineApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { MenuCategoryFilter } from "@/components/menu/MenuCategoryFilter";
import { MenuItemList } from "@/components/menu/MenuItemList";
import {
  Plus,
  Settings2,
  Search,
  Leaf,
  Drumstick,
  Egg,
  Wine,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationPanel } from "@/components/menu/NavigationPanel";
import { BulkOperationsWizard } from "@/components/menu/BulkOperationsWizard";
import { useToast } from "@/hooks/use-toast";
import { MenuItemSlider } from "@/components/menu/MenuItemSlider";
import { MenuItem } from "@/types/menu";
import { useGetProductListMutation } from "@/features/product/productApi";
// Mock data - replace with actual data fetching

interface Cuisine {
  entityCuisineId: string;
  entityCuisineName: string;
}

export default function MenuPage() {
  const [getProductList] = useGetProductListMutation();

  const [items, setItems] = useState<MenuItem[]>([]);
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>(
    undefined
  );
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [foodTypeFilter, setFoodTypeFilter] = useState<
    "all" | "veg" | "non-veg" | "egg" | "bar"
  >("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [categories, setCategories] = useState<
    { id: string; name: string; isEnabled: boolean }[]
  >([{ id: "all", name: "All Items", isEnabled: true }]);
  const [enabledCategories, setEnabledCategories] = useState(new Set(["all"]));
  // ✅ Keep this empty initially
  // Replace with actual data fetching

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    const jwt = localStorage.getItem("jwt");
    const entityId = localStorage.getItem("entityId");
    if (!jwt || !entityId) {
      console.warn("JWT or Entity ID missing");
      return;
    }
     

    console.log(" Calling getCuisineList with:", { entityId });

    getProductList({ entityId, isBar: false })
      .unwrap()
      .then((res) => {
        console.log("Products API success:", res);
        console.log(" Products:", res.data);
        setItems(res.data );
        console.log(
          " Items set:",
          res.data.map((item) => ({
            name: item.name,
            entityCuisineId: item.entityCuisineId,
          }))
        );
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, [mounted]);

  const [getCuisineList] = useGetCuisineListMutation();

  useEffect(() => {
    if (!mounted) return;

    const jwt = localStorage.getItem("jwt");
    const entityId = localStorage.getItem("entityId");

    if (!jwt || !entityId) {
      console.warn("JWT or Entity ID missing");
      return;
    }

    console.log(" Calling getCuisineList");

    getCuisineList({ entityId, isBar: false })
      .unwrap()
      .then((res) => {
        console.log(" Cuisine fetched:", res);
        console.table(res.data);
        const cuisineOptions = (res.data as Cuisine[]).map((c) => ({
          id: c.entityCuisineId,
          name: c.entityCuisineName,
          isEnabled: true,
        }));
        console.log(" Final categories:", cuisineOptions);
        setCategories([
          { id: "all", name: "All Items", isEnabled: true },
          ...cuisineOptions,
        ]);
        setEnabledCategories(
          new Set(["all", ...cuisineOptions.map((c) => c.id)])
        );
      })
      .catch((err) => {
        console.error(" Error fetching cuisines:", err);
      });
  }, [mounted]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    activeCategory,
    enabledCategories,
    priceRange,
    availabilityFilter,
    foodTypeFilter,
  ]);

  const handleEditItem = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      setSelectedItem({
        ...item,
        subCategory: item.subCategory || "",
        serviceSections: item.serviceSections || ["dining"],
        isCustomizable: item.isCustomizable || false,
        imageUrls: item.imageUrls || [],
        storeSettings: item.storeSettings || [],
        modifierGroups: item.modifierGroups || [],
      });
    }
    setIsSliderOpen(true);
  };

  const handleAddNewItem = () => {
    setSelectedItem({
      id: "new",
      name: "",
      displayName: "",
      description: "",
      category: "appetizers",
      subCategory: "",
      price: 0,
      foodCost: 0,
      itemCode: "",
      itemType: "veg",
      sortOrder: items.length + 1,
      isAvailable: true,
      isCustomizable: false,
      serviceSections: ["dining"],
      imageUrls: [],
      storeSettings: [],
      modifierGroups: [],
      entityCuisineId: "",
      nutritionalInfo: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    });
    setIsSliderOpen(true);
  };

  const handleSaveItem = (item: MenuItem) => {
    setItems((prevItems) => {
      if (item.id === "new") {
        // Generate a new ID
        const newId = (
          Math.max(...prevItems.map((i) => parseInt(i.id) || 0)) + 1
        ).toString();
        const newItem = {
          ...item,
          id: newId,
          sortOrder: prevItems.length + 1,
        };

        toast({
          title: "Item Created Successfully",
          description: `${item.name} has been added to the menu.`,
          className:
            "bg-gradient-to-r from-teal-600 to-teal-700 text-white border-none",
        });
        return [...prevItems, newItem];
      } else {
        const updatedItem = {
          ...item,
          sortOrder:
            prevItems.find((i) => i.id === item.id)?.sortOrder ||
            item.sortOrder,
        };

        toast({
          title: "Item Updated Successfully",
          description: `${item.name} has been updated.`,
          className:
            "bg-gradient-to-r from-teal-600 to-teal-700 text-white border-none",
        });
        return prevItems.map((i) => (i.id === item.id ? updatedItem : i));
      }
    });
    setIsSliderOpen(false);
    setSelectedItem(undefined);
  };

  const handleToggleAvailability = (id: string, value: boolean) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isAvailable: value } : item
      )
    );
  };

  const toggleCategory = (categoryId: string) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Memoized filtering logic
  const cuisineMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const filteredItems = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
      activeCategory === "all" || item.entityCuisineId === activeCategory;
      const categoryEnabled = item.entityCuisineId
      ? enabledCategories.has(item.entityCuisineId)
      : enabledCategories.has("all");
      if (!matchesCategory || !categoryEnabled) return false;
      
      // Category filter
      console.log("Filtering item:", {
  name: item.name,
  cuisineId: item.entityCuisineId,
  activeCategory,
  enabledCategories: Array.from(enabledCategories),
  matchesCategory: activeCategory === "all" || item.entityCuisineId === activeCategory,
  enabled: item.entityCuisineId
    ? enabledCategories.has(item.entityCuisineId)
    : enabledCategories.has("all"),
});

      if (!categoryEnabled) return false;

      // Search filter
      const matchesSearch =
        !searchQuery ||
        (item.name?.toLowerCase() || "").includes(searchLower) ||
        (item.description?.toLowerCase() || "").includes(searchLower) ||
        (item.itemCode?.toLowerCase() || "").includes(searchLower);
      if (!matchesSearch) return false;

      // Price range filter
      const matchesPrice =
        item.price >= priceRange[0] && item.price <= priceRange[1];
      if (!matchesPrice) return false;

      // Food type filter
      if (foodTypeFilter !== "all") {
        if (!item.itemType?.toLowerCase().includes(foodTypeFilter))
          return false;
      }

      // Availability filter
      if (availabilityFilter !== "all") {
        const isAvailable = availabilityFilter === "available";
        if (item.isAvailable !== isAvailable) return false;
      }

      return true;
    });
  }, [
    items,
    activeCategory,
    enabledCategories,
    searchQuery,
    priceRange,
    availabilityFilter,
    foodTypeFilter,
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(
    () =>
      filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredItems, currentPage, itemsPerPage]
  );

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-background to-muted/20 pl-64",
        !mounted && "opacity-0 transition-opacity",
        mounted && "opacity-100 transition-opacity duration-500"
      )}
    >
      <NavigationPanel />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
              Menu Management
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your restaurant's menu items and categories
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <BulkOperationsWizard />
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Settings2 className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Menu Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl h-10 px-6"
              onClick={handleAddNewItem}
            >
              <Plus className="mr-2 h-5 w-5" /> Add New Item
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Select
              value={foodTypeFilter}
              onValueChange={(
                value: "all" | "veg" | "non-veg" | "egg" | "bar"
              ) => setFoodTypeFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  All Types
                </SelectItem>
                <SelectItem value="veg" className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  Vegetarian
                </SelectItem>
                <SelectItem value="non-veg" className="flex items-center gap-2">
                  <Drumstick className="h-4 w-4 text-red-600" />
                  Non-Vegetarian
                </SelectItem>
                <SelectItem value="egg" className="flex items-center gap-2">
                  <Egg className="h-4 w-4 text-yellow-600" />
                  Contains Egg
                </SelectItem>
                <SelectItem value="bar" className="flex items-center gap-2">
                  <Wine className="h-4 w-4 text-purple-600" />
                  Bar Items
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={availabilityFilter}
              onValueChange={(value: "all" | "available" | "unavailable") =>
                setAvailabilityFilter(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-xl bg-white/50 backdrop-blur-sm shadow-sm border p-6 space-y-6">
        
         { categories.length > 0 ? ( <MenuCategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            enabledCategories={enabledCategories}
            onToggleCategory={toggleCategory}
          />
         ) : ( <div>Loading ...</div>)}
          <MenuItemList
            items={paginatedItems}
            cuisineMap={cuisineMap}
            onEdit={handleEditItem}
            onDelete={(id) => console.log("Delete item:", id)}
            onToggleAvailability={handleToggleAvailability}
            totalItems={filteredItems.length}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
      <MenuItemSlider
        item={selectedItem}
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
}
