"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calculator, DollarSign } from "lucide-react";

export function ModifierBulkOperations() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="ml-4">
          <Calculator className="mr-2 h-4 w-4" />
          Bulk Operations
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[640px] p-0 border-l bg-gradient-to-b from-white to-gray-50/50">
        <SheetHeader>
          <SheetTitle className="px-6 py-4 text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
            Bulk Modifier Operations
          </SheetTitle>
          <SheetDescription>
            Make changes to multiple modifier groups at once
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1">
          <Tabs defaultValue="service" className="w-full">
            <TabsList className="w-full grid grid-cols-3 p-2 bg-white border-b">
              <TabsTrigger value="service">Service Sections</TabsTrigger>
              <TabsTrigger value="stores">Store Settings</TabsTrigger>
              <TabsTrigger value="pricing">Price Management</TabsTrigger>
            </TabsList>

            <div className="p-6 space-y-6">
              <TabsContent value="service" className="space-y-6 mt-0">
                <div className="rounded-lg border p-6 space-y-4 bg-white/50 backdrop-blur-sm">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-teal-700">Service Section Actions</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable modifiers across service sections
                    </p>
                  </div>
                  
                  <div className="grid gap-4">
                    {serviceSections.map(section => (
                      <div key={section.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <Label className="font-medium">{section.name}</Label>
                          <p className="text-sm text-muted-foreground">{section.description}</p>
                        </div>
                        <Switch className="data-[state=checked]:bg-teal-600" />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stores" className="space-y-6 mt-0">
                <div className="rounded-lg border p-6 space-y-4 bg-white/50 backdrop-blur-sm">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-teal-700">Store Availability</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage modifier availability per store
                    </p>
                  </div>

                  <div className="space-y-4">
                    {stores.map(store => (
                      <div key={store.id} className="space-y-2">
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                          <div>
                            <Label className="font-medium">{store.name}</Label>
                            <p className="text-sm text-muted-foreground">Configure store-specific settings</p>
                          </div>
                          <Switch className="data-[state=checked]:bg-teal-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6 mt-0">
                <div className="rounded-lg border p-6 space-y-6 bg-white/50 backdrop-blur-sm">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-teal-700">Price Adjustments</h3>
                    <p className="text-sm text-muted-foreground">
                      Update prices across multiple modifiers
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Adjustment Type</Label>
                      <Select>
                        <SelectTrigger className="border-teal-100 focus-visible:ring-teal-500/20">
                          <SelectValue placeholder="Select adjustment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                          <SelectItem value="increase">Increase by Amount</SelectItem>
                          <SelectItem value="decrease">Decrease by Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Value</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          placeholder="0.00"
                          className="pl-9 border-teal-100 focus-visible:ring-teal-500/20" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Apply To</Label>
                      <Select>
                        <SelectTrigger className="border-teal-100 focus-visible:ring-teal-500/20">
                          <SelectValue placeholder="Select scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Options</SelectItem>
                          <SelectItem value="enabled">Enabled Options Only</SelectItem>
                          <SelectItem value="disabled">Disabled Options Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="sticky bottom-0 flex justify-between p-6 bg-white border-t">
            <div className="flex items-center gap-2">
              <Switch id="preview" className="data-[state=checked]:bg-teal-600" />
              <Label htmlFor="preview">Preview changes before applying</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}
                className="border-teal-100 hover:border-teal-200 hover:bg-teal-50">
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800">
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const serviceSections = [
  { 
    id: "dining", 
    name: "Dining Room",
    description: "In-restaurant dining experience" 
  },
  { 
    id: "takeout", 
    name: "Takeout",
    description: "Order ahead and pickup" 
  },
  { 
    id: "delivery", 
    name: "Delivery",
    description: "Home delivery service" 
  },
  { 
    id: "catering", 
    name: "Catering",
    description: "Events and large orders" 
  }
];

const stores = [
  { id: "store1", name: "Downtown Location" },
  { id: "store2", name: "Uptown Location" },
  { id: "store3", name: "Mall Location" }
];