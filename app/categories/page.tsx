"use client";

import { useState, useEffect } from "react";
import { NavigationPanel } from "@/components/menu/NavigationPanel";
import { CategoryTree } from "@/components/categories/CategoryTree";
import { CategoryDetails } from "@/components/categories/CategoryDetails";
import { CategoryItemsList } from "@/components/categories/CategoryItemsList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, Search, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock menu items data
const menuItems = [
  {
    id: "1",
    name: "Classic Caesar Salad",
    category: "Salads",
    description: "Crisp romaine lettuce, parmesan cheese, croutons, and our house-made Caesar dressing",
    price: 12.99,
    foodCost: 4.50,
    isAvailable: true,
  },
  {
    id: "2",
    name: "Greek Salad",
    category: "Salads",
    description: "Fresh cucumbers, tomatoes, olives, and feta cheese with oregano vinaigrette",
    price: 11.99,
    foodCost: 4.25,
    isAvailable: true,
  },
  {
    id: "3",
    name: "Tomato Soup",
    category: "Soups",
    description: "Creamy tomato soup with fresh basil",
    price: 8.99,
    foodCost: 2.50,
    isAvailable: true,
  },
  {
    id: "4",
    name: "Grilled Salmon",
    category: "Seafood",
    description: "Fresh Atlantic salmon fillet with seasonal vegetables",
    price: 24.99,
    foodCost: 8.75,
    isAvailable: true,
  }
];

// Mock data - replace with actual data fetching
const initialCategories = [
  {
    id: "1",
    name: "Appetizers",
    description: "Start your meal right",
    sortOrder: 1,
    isEnabled: true,
    itemCount: 12,
    subCategories: [
      {
        id: "1-1",
        name: "Soups",
        description: "Warm and comforting soups",
        sortOrder: 1,
        isEnabled: true,
        itemCount: 4,
        parentId: "1"
      },
      {
        id: "1-2",
        name: "Salads",
        description: "Fresh and healthy salads",
        sortOrder: 2,
        isEnabled: true,
        itemCount: 8,
        parentId: "1"
      }
    ]
  },
  {
    id: "2",
    name: "Main Course",
    description: "Hearty main dishes",
    sortOrder: 2,
    isEnabled: true,
    itemCount: 24,
    subCategories: [
      {
        id: "2-1",
        name: "Pasta",
        description: "Italian pasta dishes",
        sortOrder: 1,
        isEnabled: true,
        itemCount: 8,
        parentId: "2"
      },
      {
        id: "2-2",
        name: "Steaks",
        description: "Premium cut steaks",
        sortOrder: 2,
        isEnabled: true,
        itemCount: 6,
        parentId: "2"
      },
      {
        id: "2-3",
        name: "Seafood",
        description: "Fresh seafood dishes",
        sortOrder: 3,
        isEnabled: true,
        itemCount: 10,
        parentId: "2"
      }
    ]
  }
];

export default function CategoriesPage() {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryItems, setCategoryItems] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Mock fetching items for selected category
    if (selectedCategory) {
      const items = menuItems.filter(item => 
        item.category.toLowerCase() === selectedCategory.name.toLowerCase()
      );
      setCategoryItems(items);
    } else {
      setCategoryItems([]);
    }
  }, [selectedCategory]);

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setIsEditing(true);
  };

  const handleAddCategory = () => {
    const newCategory = {
      id: crypto.randomUUID(),
      name: "New Category",
      description: "",
      sortOrder: categories.length + 1,
      isEnabled: true,
      itemCount: 0,
      subCategories: []
    };
    setCategories([...categories, newCategory]);
    setIsEditing(true);
    setSelectedCategory(newCategory);
  };

  const handleAddSubCategory = (parentId: string) => {
    const newSubCategory = {
      id: crypto.randomUUID(),
      name: "New Sub-category",
      description: "",
      sortOrder: 1,
      isEnabled: true,
      itemCount: 0,
      parentId
    };

    setCategories(prev => prev.map(cat => {
      if (cat.id === parentId) {
        return {
          ...cat,
          subCategories: [...(cat.subCategories || []), newSubCategory]
        };
      }
      return cat;
    }));
    setSelectedCategory(newSubCategory);
    setIsEditing(true);
  };

  const handleUpdateCategory = (updatedCategory: any) => {
    setCategories(prev => {
      if (updatedCategory.parentId) {
        // Update sub-category
        return prev.map(cat => ({
          ...cat,
          subCategories: cat.subCategories?.map(sub =>
            sub.id === updatedCategory.id ? updatedCategory : sub
          )
        }));
      }
      // Update main category
      return prev.map(cat =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      );
    });
  };

  const handleDeleteCategory = (categoryId: string, parentId?: string) => {
    if (parentId) {
      // Delete sub-category
      setCategories(prev => prev.map(cat => {
        if (cat.id === parentId) {
          return {
            ...cat,
            subCategories: cat.subCategories?.filter(sub => sub.id !== categoryId)
          };
        }
        return cat;
      }));
    } else {
      // Delete main category
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null);
      setIsEditing(false);
    }
  };

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
              Menu Categories
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your menu structure and organization
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={handleAddCategory}
            title="Add Main Category"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Category
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <CategoryTree
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onEditCategory={handleEditCategory}
              onAddSubCategory={handleAddSubCategory}
              onDeleteCategory={handleDeleteCategory}
              searchQuery={searchQuery}
            />
          </div>
          <div className="lg:col-span-7">
            {selectedCategory && (
              <CategoryItemsList
                items={categoryItems}
                onReorder={setCategoryItems}
              />
            )}
            {isEditing && (
              <CategoryDetails
                category={selectedCategory}
                onUpdate={handleUpdateCategory}
                onClose={() => {
                  setIsEditing(false);
                }}
                className="mt-8"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}