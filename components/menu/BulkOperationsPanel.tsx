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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Calculator,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Download,
  History,
  Percent,
  RefreshCw,
  Upload,
} from "lucide-react";

interface BulkOperation {
  type: string;
  value: number;
  adjustmentType: "percentage" | "fixed";
  effectiveDate?: Date;
  categories: string[];
  previewMode: boolean;
}

export function BulkOperationsPanel() {
  const [operation, setOperation] = useState<BulkOperation>({
    type: "price",
    value: 0,
    adjustmentType: "percentage",
    categories: [],
    previewMode: true,
  });

  const handlePreview = () => {
    console.log("Preview changes:", operation);
  };

  const handleApply = () => {
    console.log("Apply changes:", operation);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="ml-4">
          <Calculator className="mr-2 h-4 w-4" />
          Bulk Operations
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Bulk Operations</SheetTitle>
          <SheetDescription>
            Make changes to multiple menu items at once
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="price" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="price">
              <DollarSign className="mr-2 h-4 w-4" />
              Price
            </TabsTrigger>
            <TabsTrigger value="availability">
              <Clock className="mr-2 h-4 w-4" />
              Availability
            </TabsTrigger>
            <TabsTrigger value="discounts">
              <Percent className="mr-2 h-4 w-4" />
              Discounts
            </TabsTrigger>
            <TabsTrigger value="charges">
              <Calculator className="mr-2 h-4 w-4" />
              Charges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="price" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Adjustment Type</Label>
                <Select
                  value={operation.adjustmentType}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setOperation({ ...operation, adjustmentType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Value</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={operation.value}
                    onChange={(e) =>
                      setOperation({
                        ...operation,
                        value: parseFloat(e.target.value),
                      })
                    }
                    placeholder={
                      operation.adjustmentType === "percentage" ? "10" : "5.99"
                    }
                  />
                  <span className="text-muted-foreground">
                    {operation.adjustmentType === "percentage" ? "%" : "$"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Effective Date</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="date"
                    value={
                      operation.effectiveDate
                        ? format(operation.effectiveDate, "yyyy-MM-dd")
                        : ""
                    }
                    onChange={(e) =>
                      setOperation({
                        ...operation,
                        effectiveDate: e.target.valueAsDate || undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={operation.previewMode}
                  onCheckedChange={(checked) =>
                    setOperation({ ...operation, previewMode: checked })
                  }
                />
                <Label>Preview changes before applying</Label>
              </div>
            </div>
          </TabsContent>

          <div className="flex justify-between mt-6">
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Revert
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={handlePreview}>
              Preview Changes
            </Button>
            <Button
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800"
              onClick={handleApply}
            >
              Apply Changes
            </Button>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}