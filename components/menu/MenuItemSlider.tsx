"use client";

import { useState, useEffect } from "react";
import type { MenuItem } from "@/types/menu";
import type { SectionPrice } from "@/types/menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Tag, Ruler } from "lucide-react";

interface MenuItemSliderProps {
  item?: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}

const defaultSectionPrices: SectionPrice[] = [
  { section: "dining", enabled: true, price: 0, available: true, tax: true, discount: 0 },
  { section: "takeout", enabled: true, price: 0, available: true, tax: true, discount: 0 },
  { section: "delivery", enabled: true, price: 0, available: true, tax: true, discount: 0 },
  { section: "catering", enabled: true, price: 0, available: true, tax: true, discount: 0 },
];

const sizes = [
  { id: "small", name: "Small" },
  { id: "medium", name: "Medium" },
  { id: "large", name: "Large" },
];

export function MenuItemSlider({ item, isOpen, onClose, onSave }: MenuItemSliderProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("appetizers");
  const [itemCode, setItemCode] = useState("");
  const [price, setPrice] = useState(0);
  const [foodCost, setFoodCost] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [hasSizePricing, setHasSizePricing] = useState(false);
  const [hasMRP, setHasMRP] = useState(false);
  const [mrp, setMRP] = useState(0);
  const [sizePrices, setSizePrices] = useState<Record<string, number>>({
    small: 0,
    medium: 0,
    large: 0
  });
  const [sectionPrices, setSectionPrices] = useState<SectionPrice[]>(defaultSectionPrices);
  const [activeTab, setActiveTab] = useState("pricing");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setCategory(item.category);
      setItemCode(item.itemCode);
      setPrice(item.price);
      setFoodCost(item.foodCost);
      setIsAvailable(item.isAvailable);
      setHasSizePricing(item.hasSizePricing || false);
      setHasMRP(item.hasMRP || false);
      setMRP(item.mrp || 0);
      setSizePrices(item.sizePrices || { small: 0, medium: 0, large: 0 });
      setSectionPrices(item.sectionPrices || defaultSectionPrices);
    }
  }, [item]);

  const handleSave = () => {
    if (!item) return;

    onSave({
      ...item,
      name,
      description,
      category,
      itemCode,
      price,
      foodCost,
      isAvailable,
      hasSizePricing,
      hasMRP,
      mrp,
      sizePrices,
      sectionPrices
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[640px] p-0 border-l bg-gradient-to-b from-white to-gray-50/50">
        <SheetHeader className="px-6 py-4 border-b bg-white">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
            {item?.id ? "Edit Menu Item" : "New Menu Item"}
          </SheetTitle>
          <SheetDescription>
            Configure item details and pricing
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full p-0 bg-transparent border-b">
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 p-6">
            <TabsContent value="pricing" className="mt-0 space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/10">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold">Size-based Pricing</Label>
                      <p className="text-sm text-muted-foreground">Enable different prices for different sizes</p>
                    </div>
                    <Switch
                      checked={hasSizePricing}
                      onCheckedChange={setHasSizePricing}
                      className="data-[state=checked]:bg-teal-600"
                    />
                  </div>

                  {hasSizePricing ? (
                    <div className="space-y-4 p-4 rounded-lg border bg-muted/5">
                      {sizes.map((size) => (
                        <div key={size.id} className="grid grid-cols-2 gap-4 items-center">
                          <div className="flex items-center gap-2">
                            <Ruler className="h-4 w-4 text-muted-foreground" />
                            <Label>{size.name}</Label>
                          </div>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              value={sizePrices[size.id]}
                              onChange={(e) => setSizePrices({ ...sizePrices, [size.id]: parseFloat(e.target.value) })}
                              className="pl-9 border-teal-100 focus-visible:ring-teal-500/20"
                              placeholder="0.00"
                              step="0.01"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Base Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(parseFloat(e.target.value))}
                          className="pl-9 border-teal-100 focus-visible:ring-teal-500/20"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/10">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold">MRP Product</Label>
                      <p className="text-sm text-muted-foreground">Enable MRP pricing for this item</p>
                    </div>
                    <Switch
                      checked={hasMRP}
                      onCheckedChange={setHasMRP}
                      className="data-[state=checked]:bg-teal-600"
                    />
                  </div>

                  {hasMRP && (
                    <div className="space-y-2">
                      <Label>MRP Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={mrp}
                          onChange={(e) => setMRP(parseFloat(e.target.value))}
                          className="pl-9 border-teal-100 focus-visible:ring-teal-500/20"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Section Pricing</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const basePrice = hasSizePricing ? sizePrices.medium : price;
                          setSectionPrices(prev =>
                            prev.map(p => ({ ...p, price: basePrice }))
                          );
                        }}
                        className="text-xs"
                      >
                        Apply Base Price to All
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {sectionPrices.map((section, index) => (
                        <div key={section.section} className="p-4 rounded-lg border bg-muted/5">
                          <div className="flex items-center justify-between mb-4">
                            <Label className="text-base capitalize">{section.section}</Label>
                            <Switch
                              checked={section.enabled}
                              onCheckedChange={(enabled) => {
                                const newPrices = [...sectionPrices];
                                newPrices[index] = { ...section, enabled };
                                setSectionPrices(newPrices);
                              }}
                              className="data-[state=checked]:bg-teal-600"
                            />
                          </div>

                          {section.enabled && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Price</Label>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      type="number"
                                      value={section.price}
                                      onChange={(e) => {
                                        const newPrices = [...sectionPrices];
                                        newPrices[index] = { ...section, price: parseFloat(e.target.value) };
                                        setSectionPrices(newPrices);
                                      }}
                                      className="pl-9 border-teal-100 focus-visible:ring-teal-500/20"
                                      placeholder="0.00"
                                      step="0.01"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Discount (%)</Label>
                                  <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      type="number"
                                      value={section.discount}
                                      onChange={(e) => {
                                        const newPrices = [...sectionPrices];
                                        newPrices[index] = { ...section, discount: parseFloat(e.target.value) };
                                        setSectionPrices(newPrices);
                                      }}
                                      className="pl-9 border-teal-100 focus-visible:ring-teal-500/20"
                                      placeholder="0"
                                      min="0"
                                      max="100"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={section.available}
                                    onCheckedChange={(available) => {
                                      const newPrices = [...sectionPrices];
                                      newPrices[index] = { ...section, available: !!available };
                                      setSectionPrices(newPrices);
                                    }}
                                    className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                                  />
                                  <Label>Available</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={section.tax}
                                    onCheckedChange={(tax) => {
                                      const newPrices = [...sectionPrices];
                                      newPrices[index] = { ...section, tax: !!tax };
                                      setSectionPrices(newPrices);
                                    }}
                                    className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                                  />
                                  <Label>Apply Tax (SGST/CGST)</Label>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <SheetFooter className="p-6 border-t bg-white">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800"
          >
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}