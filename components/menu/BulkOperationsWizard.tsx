"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import {
  Calculator,
  Clock,
  DollarSign,
  Percent,
  Tag,
  Receipt,
  Truck,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Calendar as CalendarIcon,
  Store,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
}

interface BulkOperationStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: BulkOperationStep[] = [
  {
    title: "Select Operation",
    description: "Choose what you want to modify",
    icon: <Calculator className="h-6 w-6" />,
  },
  {
    title: "Select Scope",
    description: "Choose locations and brands",
    icon: <Store className="h-6 w-6" />,
  },
  {
    title: "Configure Changes",
    description: "Set up your modifications",
    icon: <Percent className="h-6 w-6" />,
  },
  {
    title: "Review & Schedule",
    description: "Preview and schedule changes",
    icon: <Clock className="h-6 w-6" />,
  },
];

const operationTypes = [
  {
    id: "price",
    title: "Price Management",
    description: "Update prices and manage costs",
    icon: <DollarSign className="h-6 w-6 text-teal-600" />,
  },
  {
    id: "discounts",
    title: "Discounts & Promotions",
    description: "Configure discounts and special offers",
    icon: <Tag className="h-6 w-6 text-purple-600" />,
  },
  {
    id: "availability",
    title: "Update Availability",
    description: "Enable or disable multiple items",
    icon: <Clock className="h-6 w-6 text-blue-600" />,
  },
  {
    id: "charges",
    title: "Additional Charges",
    description: "Manage taxes and service fees",
    icon: <Receipt className="h-6 w-6 text-orange-600" />,
  },
  {
    id: "delivery",
    title: "Delivery Settings",
    description: "Configure delivery fees and zones",
    icon: <Truck className="h-6 w-6 text-green-600" />,
  },
];

const sections = [
  { id: "all", name: "All Sections" },
  { id: "dining", name: "Dining Room" },
  { id: "takeout", name: "Takeout" },
  { id: "delivery", name: "Delivery" },
  { id: "catering", name: "Catering" },
];

const brands = [
  { id: "brand1", name: "Main Brand" },
  { id: "brand2", name: "Secondary Brand" },
  { id: "brand3", name: "Premium Brand" },
];

const locations = [
  { id: "loc1", name: "Downtown", brand: "brand1" },
  { id: "loc2", name: "Uptown", brand: "brand1" },
  { id: "loc3", name: "Mall Location", brand: "brand2" },
  { id: "loc4", name: "Airport", brand: "brand3" },
];

export function BulkOperationsWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  const [adjustmentType, setAdjustmentType] = useState<string>("percentage");
  const [effectiveDate, setEffectiveDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [effectiveTime, setEffectiveTime] = useState<string>("00:00");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [expiryTime, setExpiryTime] = useState<string>("");

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Here you would implement the actual changes
    console.log("Applying changes:", {
      operation: selectedOperation,
      value: adjustmentValue,
      effectiveDate,
    });
    setIsOpen(false);
    setCurrentStep(0);
    setSelectedOperation(null);
    setAdjustmentValue(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid gap-4">
            {operationTypes.map((op) => (
              <Card
                key={op.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedOperation === op.id
                    ? "border-teal-600 bg-teal-50"
                    : "hover:border-teal-200"
                }`}
                onClick={() => setSelectedOperation(op.id)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  {op.icon}
                  <div className="flex-1">
                    <h3 className="font-medium">{op.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {op.description}
                    </p>
                  </div>
                  {selectedOperation === op.id && (
                    <Check className="h-5 w-5 text-teal-600" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-teal-700">Brands</Label>
                <p className="text-sm text-muted-foreground">Select brands to apply changes</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={selectedBrands.has(brand.id)}
                      onCheckedChange={(checked) => {
                        const newSelected = new Set(selectedBrands);
                        if (checked) {
                          newSelected.add(brand.id);
                        } else {
                          newSelected.delete(brand.id);
                        }
                        setSelectedBrands(newSelected);
                      }}
                    />
                    <Label>{brand.name}</Label>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-teal-700">Locations</Label>
                <p className="text-sm text-muted-foreground">Select locations to apply changes</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {locations
                  .filter(loc => selectedBrands.size === 0 || selectedBrands.has(loc.brand))
                  .map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={selectedLocations.has(location.id)}
                        onCheckedChange={(checked) => {
                          const newSelected = new Set(selectedLocations);
                          if (checked) {
                            newSelected.add(location.id);
                          } else {
                            newSelected.delete(location.id);
                          }
                          setSelectedLocations(newSelected);
                        }}
                      />
                      <Label>{location.name}</Label>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Service Sections</Label>
              <div className="grid grid-cols-2 gap-4">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedSections.has(section.id)}
                      onCheckedChange={(checked) => {
                        const newSelected = new Set(selectedSections);
                        if (checked) {
                          newSelected.add(section.id);
                        } else {
                          newSelected.delete(section.id);
                        }
                        setSelectedSections(newSelected);
                      }}
                      className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                    />
                    <Label>{section.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Adjustment Value</Label>
              <div className="flex gap-4">
                <Select value={adjustmentType} onValueChange={setAdjustmentType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={adjustmentValue}
                  onChange={(e) => setAdjustmentValue(Number(e.target.value))}
                  className="w-[150px]"
                  placeholder={adjustmentType === "percentage" ? "10" : "5.99"}
                />
              </div>
            </div>

            {selectedOperation === "discounts" && (
              <div className="space-y-2">
                <Label>Promotion Period</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Start</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                      />
                      <Input
                        type="time"
                        value={effectiveTime}
                        onChange={(e) => setEffectiveTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">End</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                      <Input
                        type="time"
                        value={expiryTime}
                        onChange={(e) => setExpiryTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedOperation === "availability" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Items</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Apply Time Restrictions</Label>
                  <Switch />
                </div>
              </div>
            )}

            {selectedOperation === "charges" && (
              <div className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select charge type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tax">Tax Rate</SelectItem>
                    <SelectItem value="service">Service Fee</SelectItem>
                    <SelectItem value="handling">Handling Fee</SelectItem>
                    <SelectItem value="surcharge">Seasonal Surcharge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedOperation === "delivery" && (
              <div className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zone1">Zone 1 (0-5 miles)</SelectItem>
                    <SelectItem value="zone2">Zone 2 (5-10 miles)</SelectItem>
                    <SelectItem value="zone3">Zone 3 (10+ miles)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Switch defaultChecked />
              <Label>Preview changes before applying</Label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium">Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Operation
                    </span>
                    <Badge variant="outline">
                      {operationTypes.find(op => op.id === selectedOperation)?.title}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Section
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(selectedSections).map(sectionId => (
                        <Badge key={sectionId} variant="outline">
                          {sections.find(s => s.id === sectionId)?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Value
                    </span>
                    <Badge variant="outline">
                      {adjustmentType === "percentage" ? `${adjustmentValue}%` : `$${adjustmentValue}`}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium mb-2">Preview Changes</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items affected</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories affected</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-4 text-yellow-800">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm">
                Changes will be applied to all selected items in the selected sections.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="ml-4">
          <Calculator className="mr-2 h-4 w-4 text-muted-foreground" />
          Bulk Operations
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[100vw] md:w-[40vw] border-l">
        <SheetHeader>
          <SheetTitle>Bulk Operations</SheetTitle>
          <SheetDescription>
            Make changes to multiple menu items at once
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-[calc(100vh-120px)]">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`flex flex-col items-center ${
                  index === currentStep
                    ? "text-teal-600"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`rounded-full p-2 mb-2 ${
                    index === currentStep
                      ? "bg-teal-100"
                      : "bg-muted"
                  }`}
                >
                  {step.icon}
                </div>
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>

          <ScrollArea className="flex-1">
            <div className="py-6 px-6">{renderStepContent()}</div>
          </ScrollArea>

          <SheetFooter>
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleComplete}
                  disabled={!selectedOperation}
                  className="bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Apply Changes
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!selectedOperation}
                  className="bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}