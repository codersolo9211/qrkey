"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Clock, Printer } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock data for dropdowns
const kitchens = [
  { id: "k1", name: "Main Kitchen" },
  { id: "k2", name: "Prep Kitchen" },
  { id: "k3", name: "Dessert Kitchen" }
];

const printers = [
  { id: "p1", name: "Kitchen Printer 1" },
  { id: "p2", name: "Kitchen Printer 2" },
  { id: "p3", name: "Bar Printer" }
];

const timingGroups = [
  { id: "t1", name: "All Day" },
  { id: "t2", name: "Breakfast" },
  { id: "t3", name: "Lunch" },
  { id: "t4", name: "Dinner" }
];

interface CategoryDetailsProps {
  category: any;
  onUpdate: (category: any) => void;
  onClose: () => void;
  className?: string;
}

export function CategoryDetails({ category, onUpdate, onClose, className }: CategoryDetailsProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [categoryType, setCategoryType] = useState("master");
  const [parentCategory, setParentCategory] = useState("");
  const [tax, setTax] = useState(0);
  const [printer, setPrinter] = useState("");
  const [timingGroup, setTimingGroup] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [serviceStartTime, setServiceStartTime] = useState("09:00");
  const [serviceEndTime, setServiceEndTime] = useState("22:00");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
      setKitchen(category.kitchen || "");
      setCategoryType(category.categoryType || "master");
      setParentCategory(category.parentCategory || "");
      setTax(category.tax || 0);
      setPrinter(category.printer || "");
      setTimingGroup(category.timingGroup || "");
      setIsEnabled(category.isEnabled);
      setServiceStartTime(category.serviceStartTime || "09:00");
      setServiceEndTime(category.serviceEndTime || "22:00");
    }
  }, [category]);

  if (!category) {
    return (
      <Card className={cn("p-6 space-y-4 bg-white/50 backdrop-blur-sm h-full flex items-center justify-center text-center", className)}>
        <div className="text-muted-foreground">
          Select a category to view and edit its details
        </div>
      </Card>
    );
  }

  const handleSave = () => {
    onUpdate({
      ...category,
      name,
      description,
      kitchen,
      categoryType,
      parentCategory,
      tax,
      printer,
      timingGroup,
      isEnabled,
      serviceStartTime,
      serviceEndTime
    });
  };

  return (
    <Card className={cn("p-4 space-y-4 bg-white/50 backdrop-blur-sm relative", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-teal-700">Category Details</h2>
          <p className="text-xs text-muted-foreground">
            Edit category information and settings
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
       <div className="space-y-4">
         <div className="space-y-1.5">
           <Label className="text-sm font-semibold">Category Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-teal-100 focus-visible:ring-teal-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-teal-700 mb-1.5 block">Category Type</Label>
            <Select value={categoryType} onValueChange={setCategoryType}>
              <SelectTrigger className="border-teal-100 focus-visible:ring-teal-500/20">
                <SelectValue placeholder="Select category type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="master">Master Category</SelectItem>
                <SelectItem value="sub">Sub Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {categoryType === "sub" && (
            <div className="space-y-2">
              <Label className="text-base font-semibold text-teal-700 mb-1.5 block">Parent Category</Label>
              <Select value={parentCategory} onValueChange={setParentCategory}>
                <SelectTrigger className="border-teal-100 focus-visible:ring-teal-500/20">
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  {category?.parentCategories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-base font-semibold text-teal-700 mb-1.5 block">Kitchen Assignment</Label>
            <Select value={kitchen} onValueChange={setKitchen}>
              <SelectTrigger className="border-teal-100 focus-visible:ring-teal-500/20">
                <SelectValue placeholder="Select kitchen" />
              </SelectTrigger>
              <SelectContent>
                {kitchens.map(k => (
                  <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-teal-700 mb-1.5 block">Tax Rate (%)</Label>
            <Input
              type="number"
              value={tax}
              onChange={(e) => setTax(parseFloat(e.target.value))}
              className="border-teal-100 focus-visible:ring-teal-500/20"
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-teal-700 mb-1.5 block">Kitchen Printer</Label>
            <Select value={printer} onValueChange={setPrinter}>
              <SelectTrigger className="border-teal-100 focus-visible:ring-teal-500/20">
                <SelectValue placeholder="Select printer" />
              </SelectTrigger>
              <SelectContent>
                {printers.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-teal-700 mb-1.5 block">Timing Group</Label>
            <Select value={timingGroup} onValueChange={setTimingGroup}>
              <SelectTrigger className="border-teal-100 focus-visible:ring-teal-500/20">
                <SelectValue placeholder="Select timing group" />
              </SelectTrigger>
              <SelectContent>
                {timingGroups.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-teal-700 mb-1.5 block">Service Timing</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Start Time</Label>
                <Input
                  type="time"
                  value={serviceStartTime}
                  onChange={(e) => setServiceStartTime(e.target.value)}
                  className="border-teal-100 focus-visible:ring-teal-500/20"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">End Time</Label>
                <Input
                  type="time"
                  value={serviceEndTime}
                  onChange={(e) => setServiceEndTime(e.target.value)}
                  className="border-teal-100 focus-visible:ring-teal-500/20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-teal-700 mb-1.5 block">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] border-teal-100 focus-visible:ring-teal-500/20"
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
           <Label className="text-sm font-semibold">Status</Label>
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
             className="data-[state=checked]:bg-teal-600 scale-90"
            />
          </div>

          <Separator />

          <div className="space-y-4">
           <Label className="text-sm font-semibold">Statistics</Label>
            <div className="grid grid-cols-2 gap-4">
             <div className="p-3 rounded-lg border bg-muted/10">
               <div className="text-xs text-muted-foreground">Total Items</div>
               <div className="text-xl font-semibold mt-1">{category.itemCount}</div>
              </div>
              {category.subCategories && (
               <div className="p-3 rounded-lg border bg-muted/10">
                 <div className="text-xs text-muted-foreground">Sub-categories</div>
                 <div className="text-xl font-semibold mt-1">
                    {category.subCategories.length}
                  </div>
                </div>
              )}
            </div>
          </div>

          {category.parentId && (
           <div className="space-y-1.5">
             <Label className="text-sm font-semibold">Parent Category</Label>
             <div className="p-2 rounded-lg border bg-muted/10">
                <Badge variant="outline" className="bg-teal-50 text-teal-700">
                  {category.parentName || "Main Category"}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-teal-100 hover:border-teal-200 hover:bg-teal-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800"
        >
          Save Changes
        </Button>
      </div>
    </Card>
  );
}