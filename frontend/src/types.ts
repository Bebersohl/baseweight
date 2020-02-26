export interface GearItem {
  id: string;
  catId: string;
  name: string;
  description: string;
  hyperlink: string;
  weight: string;
  price: string;
  worn: boolean;
  consumable: boolean;
  starred: Starred;
  checked: boolean;
  unit: Unit;
  quantity: string;
}

export type Alert = {
  severity: Severity;
  message: string;
};

export type PaletteType = 'light' | 'dark'

export type Severity = 'error' | 'success' | 'info' | 'warning' | undefined;

export type Starred = 'red' | 'green' | 'blue' | 'none';

export type SortBy = 'name' | 'price' | 'weight';

export type SortDirection = 'asc' | 'desc' | 'custom';

export interface GearList {
  id: string;
  name: string;
  userId: string;
  description: string;
  lastUpdated: number;
  categoryIds: string[];
  categories: { [key: string]: GearListCategory };
  showCheckboxes: boolean;
  showPrices: boolean;
  showDescriptions: boolean;
  showQuantities: boolean;
  sortCategoriesBy: SortBy;
  sortCategoriesDirection: SortDirection;
  sortItemsBy: SortBy;
  sortItemsDirection: SortDirection;
  currencyCharacter: string;
  unitType: UnitType;
  hasUnsavedData: boolean;
  ownerDisplayName?: string;
}

export interface GearLists {
  gearLists: { [key: string]: GearList };
  gearListIds: string[];
}

export interface GearListCategory {
  id: string;
  name: string;
  gearItems: { [key: string]: GearItem };
  gearIds: string[];
  color: string;
}

export interface User {
  id: string;
  displayName: string;
  providerId: string;
}

export type UnitType = 'metric' | 'imperial';

export type Unit = 'oz' | 'kg' | 'g' | 'lb';

export interface GearSuggestion {
  weight: string;
  price: string;
  hyperlink: string;
  label: string;
  serverSuggestion: boolean;
  unit: Unit;
  description: string;
  worn: boolean;
  consumable: boolean;
  starred: Starred;
  timestamp?: number;
}
