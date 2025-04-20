"use client";

import { NavigationPanel } from "@/components/menu/NavigationPanel";
import { ModifierFlowchart } from "@/components/modifiers/ModifierFlowchart";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function ModifierFlowchartPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-b from-background to-muted/20 pl-64",
      !mounted && "opacity-0 transition-opacity",
      mounted && "opacity-100 transition-opacity duration-500"
    )}>
      <NavigationPanel />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
            Modifier System Flow
          </h1>
          <p className="text-muted-foreground text-lg">
            Detailed flowchart of the modifier bulk operations system
          </p>
        </div>

        <ModifierFlowchart />
      </div>
    </div>
  );
}