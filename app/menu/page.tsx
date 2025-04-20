"use client";

import { useState, useEffect } from "react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { MenuCategoryFilter } from "@/components/menu/MenuCategoryFilter";
import { MenuItemList } from "@/components/menu/MenuItemList";
import { Plus, Settings2, Search, Leaf, Drumstick, Egg, Wine, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationPanel } from "@/components/menu/NavigationPanel";
import { BulkOperationsWizard } from "@/components/menu/BulkOperationsWizard";
import { useToast } from "@/hooks/use-toast";
import { MenuItemSlider } from "@/components/menu/MenuItemSlider";

// Mock data - replace with actual data fetching
const categories = [{
  id: "all",
  name: "All Items",
  isEnabled: true
}, { 
  id: "appetizers",
  name: "Appetizers",
  isEnabled: true
}, { 
  id: "main-course",
  name: "Main Course",
  isEnabled: true
}, { 
  id: "desserts",
  name: "Desserts",
  isEnabled: true
}, { 
  id: "beverages",
  name: "Beverages",
  isEnabled: true
}, {
  id: "pizza",
  name: "Pizza",
  isEnabled: true
}, {
  id: "pasta",
  name: "Pasta",
  isEnabled: true
}, {
  id: "salads",
  name: "Salads",
  isEnabled: true
}, {
  id: "sandwiches",
  name: "Sandwiches",
  isEnabled: true
}, {
  id: "seafood",
  name: "Seafood",
  isEnabled: true
}, {
  id: "sides",
  name: "Sides",
  isEnabled: true
}];

const allMenuItems = [
  { id: "all", name: "All Items" },
  { id: "appetizers", name: "Appetizers" },
  { id: "main-course", name: "Main Course" },
  { id: "desserts", name: "Desserts" },
  { id: "beverages", name: "Beverages" },
  { id: "pizza", name: "Pizza" },
  { id: "pasta", name: "Pasta" },
  { id: "salads", name: "Salads" },
  { id: "sandwiches", name: "Sandwiches" },
  { id: "seafood", name: "Seafood" },
  { id: "sides", name: "Sides" },
];

const menuItems = [
  {
    id: "1",
    name: "Classic Caesar Salad",
    category: "appetizers",
    description: "Crisp romaine lettuce, parmesan cheese, croutons, and our house-made Caesar dressing",
    price: 12.99,
    foodCost: 4.50,
    itemCode: "APP001",
    itemType: "Vegetarian",
    sortOrder: 1,
    isAvailable: true,
  },
  {
    id: "2",
    name: "Grilled Salmon",
    category: "main-course",
    description: "Fresh Atlantic salmon fillet, grilled to perfection, served with seasonal vegetables",
    price: 24.99,
    foodCost: 8.75,
    itemCode: "MAIN001",
    itemType: "Seafood",
    sortOrder: 2,
    isAvailable: true,
  },
  {
    id: "3",
    name: "Chocolate Lava Cake",
    category: "desserts",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    price: 8.99,
    foodCost: 2.50,
    itemCode: "DES001",
    itemType: "Dessert",
    sortOrder: 3,
    isAvailable: true,
  },
  {
    id: "4",
    name: "Craft Mojito",
    category: "beverages",
    description: "Fresh mint, lime juice, premium rum, and soda water",
    price: 10.99,
    foodCost: 3.25,
    itemCode: "BEV001",
    itemType: "Cocktail",
    sortOrder: 4,
    isAvailable: false,
  },
  {
    id: "5",
    name: "Margherita Pizza",
    category: "main-course",
    description: "Fresh mozzarella, tomatoes, and basil on our house-made crust",
    price: 16.99,
    foodCost: 5.50,
    itemCode: "MAIN002",
    itemType: "Vegetarian",
    sortOrder: 5,
    isAvailable: true,
  },
  {
    id: "6",
    name: "Bruschetta",
    category: "appetizers",
    description: "Grilled bread rubbed with garlic and topped with diced tomatoes, fresh basil, and olive oil",
    price: 9.99,
    foodCost: 3.25,
    itemCode: "APP002",
    itemType: "Vegetarian",
    sortOrder: 6,
    isAvailable: true,
  },
  {
    id: "7",
    name: "Tiramisu",
    category: "desserts",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
    price: 8.99,
    foodCost: 3.50,
    itemCode: "DES002",
    itemType: "Dessert",
    sortOrder: 7,
    isAvailable: true,
  },
  {
    id: "8",
    name: "Espresso Martini",
    category: "beverages",
    description: "Premium vodka, coffee liqueur, and fresh espresso",
    price: 12.99,
    foodCost: 4.25,
    itemCode: "BEV002",
    itemType: "Cocktail",
    sortOrder: 8,
    isAvailable: true,
  },
  {
    id: "9",
    name: "Caprese Salad",
    category: "salads",
    description: "Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze",
    price: 11.99,
    foodCost: 4.25,
    itemCode: "SAL001",
    itemType: "Vegetarian",
    sortOrder: 9,
    isAvailable: true,
  },
  {
    id: "10",
    name: "Fettuccine Alfredo",
    category: "pasta",
    description: "Homemade fettuccine in a rich, creamy parmesan sauce",
    price: 18.99,
    foodCost: 5.75,
    itemCode: "PAS001",
    itemType: "Vegetarian",
    sortOrder: 10,
    isAvailable: true,
  },
  {
    id: "11",
    name: "BBQ Chicken Pizza",
    category: "pizza",
    description: "Grilled chicken, red onions, and BBQ sauce on our signature crust",
    price: 19.99,
    foodCost: 6.50,
    itemCode: "PIZ001",
    itemType: "Specialty",
    sortOrder: 11,
    isAvailable: true,
  },
  {
    id: "12",
    name: "Club Sandwich",
    category: "sandwiches",
    description: "Triple-decker with turkey, bacon, lettuce, and tomato",
    price: 14.99,
    foodCost: 4.75,
    itemCode: "SAN001",
    itemType: "Sandwich",
    sortOrder: 12,
    isAvailable: true,
  },
  {
    id: "13",
    name: "Grilled Sea Bass",
    category: "seafood",
    description: "Fresh sea bass with herbs and lemon butter sauce",
    price: 28.99,
    foodCost: 10.50,
    itemCode: "SEA001",
    itemType: "Seafood",
    sortOrder: 13,
    isAvailable: true,
  },
  {
    id: "14",
    name: "Truffle Fries",
    category: "sides",
    description: "Hand-cut fries tossed with truffle oil and parmesan",
    price: 8.99,
    foodCost: 2.75,
    itemCode: "SID001",
    itemType: "Vegetarian",
    sortOrder: 14,
    isAvailable: true,
  },
  {
    id: "15",
    name: "Spicy Buffalo Wings",
    category: "appetizers",
    description: "Crispy chicken wings tossed in our signature buffalo sauce, served with blue cheese dip",
    price: 13.99,
    foodCost: 4.75,
    itemCode: "APP003",
    itemType: "Spicy",
    sortOrder: 15,
    isAvailable: true,
  },
  {
    id: "16",
    name: "Quattro Formaggi Pizza",
    category: "pizza",
    description: "Four cheese blend of mozzarella, gorgonzola, parmesan, and fontina",
    price: 21.99,
    foodCost: 7.50,
    itemCode: "PIZ002",
    itemType: "Vegetarian",
    sortOrder: 16,
    isAvailable: true,
  },
  {
    id: "17",
    name: "Lobster Ravioli",
    category: "pasta",
    description: "Handmade ravioli filled with fresh lobster in a champagne cream sauce",
    price: 26.99,
    foodCost: 9.75,
    itemCode: "PAS002",
    itemType: "Seafood",
    sortOrder: 17,
    isAvailable: true,
  },
  {
    id: "18",
    name: "Greek Salad",
    category: "salads",
    description: "Fresh cucumbers, tomatoes, olives, and feta cheese with oregano vinaigrette",
    price: 12.99,
    foodCost: 4.25,
    itemCode: "SAL002",
    itemType: "Vegetarian",
    sortOrder: 18,
    isAvailable: true,
  },
  {
    id: "19",
    name: "Craft Gin & Tonic",
    category: "beverages",
    description: "Premium gin with artisanal tonic water, garnished with botanicals",
    price: 13.99,
    foodCost: 4.50,
    itemCode: "BEV003",
    itemType: "Cocktail",
    sortOrder: 19,
    isAvailable: true,
  },
  {
    id: "20",
    name: "New York Cheesecake",
    category: "desserts",
    description: "Classic creamy cheesecake with berry compote",
    price: 9.99,
    foodCost: 3.75,
    itemCode: "DES003",
    itemType: "Dessert",
    sortOrder: 20,
    isAvailable: true,
  },
  {
    id: "21",
    name: "Grilled Octopus",
    category: "seafood",
    description: "Tender octopus with olive oil, lemon, and Mediterranean herbs",
    price: 24.99,
    foodCost: 8.75,
    itemCode: "SEA002",
    itemType: "Seafood",
    sortOrder: 21,
    isAvailable: true,
  }
];

export default function MenuPage() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>(undefined);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [foodTypeFilter, setFoodTypeFilter] = useState<"all" | "veg" | "non-veg" | "egg" | "bar">("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all");
  const [enabledCategories, setEnabledCategories] = useState(
    new Set(categories.map(cat => cat.id))
  );
  const [items, setItems] = useState<MenuItem[]>(menuItems);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, enabledCategories, priceRange, availabilityFilter, foodTypeFilter]);

  const handleEditItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      setSelectedItem({
        ...item,
        subCategory: item.subCategory || "",
        serviceSections: item.serviceSections || ["dining"],
        isCustomizable: item.isCustomizable || false,
        imageUrls: item.imageUrls || [],
        storeSettings: item.storeSettings || [],
        modifierGroups: item.modifierGroups || []
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
      sortOrder: menuItems.length + 1,
      isAvailable: true,
      isCustomizable: false,
      serviceSections: ["dining"],
      imageUrls: [],
      storeSettings: [],
      modifierGroups: []
    });
    setIsSliderOpen(true);
  };

  const handleSaveItem = (item: MenuItem) => {
    setItems(prevItems => {
      if (item.id === "new") {
        // Generate a new ID
        const newId = (Math.max(...prevItems.map(i => parseInt(i.id) || 0)) + 1).toString();
        const newItem = {
          ...item,
          id: newId,
          sortOrder: prevItems.length + 1
        };

        toast({
          title: "Item Created Successfully",
          description: `${item.name} has been added to the menu.`,
          className: "bg-gradient-to-r from-teal-600 to-teal-700 text-white border-none",
        });
        return [...prevItems, newItem];
      } else {
        const updatedItem = {
          ...item,
          sortOrder: prevItems.find(i => i.id === item.id)?.sortOrder || item.sortOrder
        };

        toast({
          title: "Item Updated Successfully",
          description: `${item.name} has been updated.`,
          className: "bg-gradient-to-r from-teal-600 to-teal-700 text-white border-none",
        });
        return prevItems.map(i => i.id === item.id ? updatedItem : i);
      }
    });
    setIsSliderOpen(false);
    setSelectedItem(undefined);
  };

  const handleToggleAvailability = (id: string, value: boolean) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, isAvailable: value } : item
      )
    );
  };

  const toggleCategory = (categoryId: string) => {
    setEnabledCategories(prev => {
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
  const filteredItems = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return items.filter(item => {
      // Category filter
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      if (!matchesCategory) return false;

      // Category enabled check
      const categoryEnabled = enabledCategories.has(item.category);
      if (!categoryEnabled) return false;

      // Search filter
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.itemCode.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;

      // Price range filter
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      if (!matchesPrice) return false;

      // Food type filter
      if (foodTypeFilter !== "all") {
        if (!item.itemType?.toLowerCase().includes(foodTypeFilter)) return false;
      }

      // Availability filter
      if (availabilityFilter !== "all") {
        const isAvailable = availabilityFilter === "available";
        if (item.isAvailable !== isAvailable) return false;
      }

      return true;
    });
  }, [items, activeCategory, enabledCategories, searchQuery, priceRange, availabilityFilter, foodTypeFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ), [filteredItems, currentPage, itemsPerPage]);

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
              onValueChange={(value: "all" | "veg" | "non-veg" | "egg" | "bar") => 
                setFoodTypeFilter(value)
              }
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
          <MenuCategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            enabledCategories={enabledCategories}
            onToggleCategory={toggleCategory}
          />

          <MenuItemList 
            items={paginatedItems}
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