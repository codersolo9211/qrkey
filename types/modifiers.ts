export interface Modifier {
  id: string;
  name: string;
  price: number;
  sortOrder: number;
  isEnabled: boolean;
  description?: string;
  maxQuantity?: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  description: string;
  type: "single" | "multiple";
  required: boolean;
  sortOrder: number;
  isEnabled: boolean;
  modifiers: Modifier[];
  appliedTo: string[];
  serviceSections?: string[];
  stores?: string[];
  storeServiceSections?: Record<string, string[]>;
  minSelections?: number;
  maxSelections?: number;
}