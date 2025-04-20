"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  UtensilsCrossed,
  Coffee,
  Pizza,
  Soup,
  Salad,
  Sandwich,
  Fish,
  Beef,
  Settings2,
  ChefHat,
  Menu as MenuIcon,
} from "lucide-react";

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive?: boolean;
}

const navigationItems: NavigationItem[] = [
  { icon: <MenuIcon className="h-5 w-5" />, label: "Menu Items", path: "/menu" },
  { icon: <UtensilsCrossed className="h-5 w-5" />, label: "Categories", path: "/categories" },
  { icon: <ChefHat className="h-5 w-5" />, label: "Modifiers", path: "/modifiers" },
  { icon: <Settings2 className="h-5 w-5" />, label: "Settings", path: "/settings" },
];

export function NavigationPanel() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
          QRkey
        </h2>
      </div>
      
      <div className="flex-1 px-3 py-2 space-y-6">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant={pathname === item.path ? "default" : "ghost"}
              onClick={() => router.push(item.path)}
              className={cn(
                "w-full justify-start gap-3 h-10",
                pathname === item.path && "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800"
              )}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}