export interface MenuItem {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  category: string;
  subCategory?: string;
  price: number;
  foodCost: number;
  itemCode: string;
  itemType: string;
  sortOrder: number;
  isAvailable: boolean;
  isCustomizable?: boolean;
  serviceSections?: string[];
  imageUrls?: string[];
  storeSettings?: StoreSettings[];
  modifierGroups?: ModifierGroup[];
  allergens?: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  preparationTime?: number;
  tags?: string[];
  portionSize?: string;
  spiceLevel?: number;
}

export interface StoreSettings {
  storeId: string;
  isEnabled: boolean;
  price: number;
  isAvailable: boolean;
  serviceSections: string[];
  preparationTime?: number;
  customInstructions?: string;
}

export interface ModifierGroup {
  id: string;
  name: string;
  type: "single" | "multiple";
  required: boolean;
  options: ModifierOption[];
  minSelections?: number;
  maxSelections?: number;
  displayOrder: number;
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  isDefault?: boolean;
  maxQuantity?: number;
}