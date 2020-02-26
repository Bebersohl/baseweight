import { auth } from './firebase';
import { CATEGORY_COLORS } from './constants';
import {
  GearItem,
  GearList,
  GearListCategory,
  Starred,
  SortDirection,
  Unit,
  UnitType,
  SortBy,
} from './types';

import cloneDeep from 'clone-deep';
import grey from '@material-ui/core/colors/grey';
import papa from 'papaparse';
import insane from 'insane';
import marked from 'marked';

export function createMarkup(description) {
  return {
    __html: insane(marked(description)),
  };
}

export function trimZeros(value) {
  return value.replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1');
}

export function toFixed(value: number, numOfZeros = 2) {
  return trimZeros(value.toFixed(numOfZeros))
}

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export interface ListTotals {
  totalPrice: number;
  totalWeight: number;
  consumableWeight: number;
  wornWeight: number;
  baseWeight: number;
}

export function getAllGearItems(
  categories: { [key: string]: GearListCategory },
  categoryIds: string[] = []
): { [key: string]: GearItem } {
  return categoryIds.reduce((currGearItems, accCategoryId) => {
    const category = categories[accCategoryId];

    return {
      ...currGearItems,
      ...category.gearItems,
    };
  }, {});
}

export function getListTotals(
  categories: {
    [key: string]: GearListCategory;
  },
  categoryIds: string[]
): ListTotals {
  const init: any = {
    totalPrice: 0,
    totalWeight: 0,
    consumableWeight: 0,
    wornWeight: 0,
    baseWeight: 0,
  };

  const allGearItems = getAllGearItems(categories, categoryIds);

  return Object.keys(allGearItems).reduce((acc, currKey) => {
    const item: GearItem = allGearItems[currKey];

    const itemWeight = toGrams(item.weight, item.unit);

    const quantity = item.quantity || 1;

    const weightWithQuantity = itemWeight * quantity;

    const consumableWeight = item.consumable ? weightWithQuantity : 0;

    const wornWeight = item.worn ? weightWithQuantity : 0;

    const baseWeight = !item.worn && !item.consumable ? weightWithQuantity : 0;

    return {
      totalPrice: acc.totalPrice + (toCents(item.price) * quantity),
      totalWeight: acc.totalWeight + weightWithQuantity,
      consumableWeight: acc.consumableWeight + consumableWeight,
      wornWeight: acc.wornWeight + wornWeight,
      baseWeight: acc.baseWeight + baseWeight,
    };
  }, init);
}

export function getDragStyle(isDragging, draggableStyle) {
  return {
    ...draggableStyle,
    userSelect: 'none',
    ...(isDragging && {
      border: '2px solid black',
      backgroundColor: grey[900],
    }),
  };
}

export interface CategoryTotal {
  totalPrice: number;
  totalWeight: number;
  totalConsumable: number;
  totalWorn: number;
}

export function getCategoryTotals(
  categories: { [key: string]: GearListCategory },
  categoryIds: string[]
): { [key: string]: CategoryTotal } {
  const categoryTotals = categoryIds.reduce((acc, currCatId) => {
    const cat = categories[currCatId];

    let totalPrice = 0;
    let totalWeight = 0;
    let totalConsumable = 0;
    let totalWorn = 0;

    cat.gearIds.forEach(gearId => {
      const item = cat.gearItems[gearId];

      const weightInGrams = toGrams(item.weight, item.unit);

      const quantity = item.quantity || 1;

      const weightWithQuantity = weightInGrams * quantity;

      totalPrice = totalPrice + toCents(item.price);
      totalWeight = totalWeight + weightWithQuantity;
      if (item.consumable) {
        totalConsumable = totalConsumable + weightWithQuantity;
      }
      if (item.worn) {
        totalWorn = totalWorn + weightWithQuantity;
      }
    });

    return {
      ...acc,
      [cat.id]: { totalPrice, totalWeight, totalConsumable, totalWorn },
    };
  }, {});

  return categoryTotals;
}

export function getNextStar(star: Starred): Starred {
  if (star === 'red') {
    return 'green';
  }

  if (star === 'green') {
    return 'blue';
  }

  if (star === 'blue') {
    return 'none';
  }

  return 'red';
}

export function getNextSortDirection(direction: SortDirection): SortDirection {
  if (direction === 'custom') {
    return 'asc';
  }

  if (direction === 'asc') {
    return 'desc';
  }

  return 'custom';
}

export function sortCategories(
  categoryTotals: { [key: string]: CategoryTotal },
  categoryIds: string[],
  sortCategoriesDirection: SortDirection,
  sortCategoriesBy: SortBy,
  categories: { [key: string]: GearListCategory }
) {
  const deepClonedList = cloneDeep(categoryIds);

  if (sortCategoriesDirection === 'custom') {
    return categoryIds;
  }

  return deepClonedList.sort((catIdA, catIdB) => {
    let valueA;
    let valueB;

    if (sortCategoriesBy === 'name') {
      valueA = categories[catIdA].name.toUpperCase();
      valueB = categories[catIdB].name.toUpperCase();
      return compareStrings(valueA, valueB, sortCategoriesDirection);
    }

    if (sortCategoriesBy === 'weight') {
      valueA = categoryTotals[catIdA].totalWeight;
      valueB = categoryTotals[catIdB].totalWeight;
      return compareBigs(valueA, valueB, sortCategoriesDirection);
    }

    if (sortCategoriesBy === 'price') {
      valueA = categoryTotals[catIdA].totalPrice;
      valueB = categoryTotals[catIdB].totalPrice;
      return compareBigs(valueA, valueB, sortCategoriesDirection);
    }

    return 0;
  });
}

function compareBigs(
  valueA,
  valueB,
  direction: SortDirection,
  unitA?: Unit,
  unitB?: Unit
) {
  const a = unitA ? toGrams(valueA, unitA) : valueA;
  const b = unitB ? toGrams(valueB, unitB) : valueB;

  if (direction === 'asc') {
    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }

    return 0;
  }

  // desc
  if (a > b) {
    return -1;
  }

  if (a < b) {
    return 1;
  }

  return 0;
}

function compareStrings(valueA, valueB, direction: SortDirection) {
  if (direction === 'asc') {
    if (valueA < valueB) {
      return -1;
    }

    if (valueA > valueB) {
      return 1;
    }

    return 0;
  }

  // desc
  if (valueA > valueB) {
    return -1;
  }

  if (valueA < valueB) {
    return 1;
  }

  return 0;
}

export function sortItems(
  category: GearListCategory,
  sortItemsDirection: SortDirection,
  sortItemsBy: SortBy
) {
  const gearIdClones = cloneDeep(category.gearIds);

  if (sortItemsDirection === 'custom') {
    return category.gearIds;
  }

  return gearIdClones.sort((gearIdA, gearIdB) => {
    let valueA;
    let valueB;
    const itemA = category.gearItems[gearIdA];
    const itemB = category.gearItems[gearIdB];

    if (sortItemsBy === 'name') {
      valueA = itemA.name.toUpperCase();
      valueB = itemB.name.toUpperCase();
      return compareStrings(valueA, valueB, sortItemsDirection);
    }

    if (sortItemsBy === 'weight') {
      valueA = Number(itemA.weight) * (itemA.quantity || 1);
      valueB = Number(itemB.weight) * (itemB.quantity || 1);
      const unitA = itemA.unit;
      const unitB = itemB.unit;
      return compareBigs(valueA, valueB, sortItemsDirection, unitA, unitB);
    }

    if (sortItemsBy === 'price') {
      valueA = toCents(itemA.price) * (itemA.quantity || 1);
      valueB = toCents(itemB.price) * (itemB.quantity || 1);
      return compareBigs(valueA, valueB, sortItemsDirection);
    }

    return 0;
  });
}

export function fromGrams(value: string | number, unit: Unit) {
  const num = Number(value);

  if (unit === 'oz') {
    return num / 28.34952;
  }

  if (unit === 'lb') {
    return num / 453.59237;
  }

  if (unit === 'kg') {
    return num / 1000;
  }

  return num;
}

export function toGrams(value: string, unit: Unit) {
  const num = Number(value);

  if (unit === 'oz') {
    return num * 28.34952;
  }

  if (unit === 'lb') {
    return num * 453.59237;
  }

  if (unit === 'kg') {
    return num * 1000;
  }

  return num;
}

export function fromCents(value) {
  return value / 100;
}

export function toCents(value: string) {
  return Number(value) * 100;
}

export function toggleUnit(unit: Unit, unitType: UnitType) {
  if (unit === 'oz' && unitType === 'metric') return 'g';

  if (unit === 'lb' && unitType === 'metric') return 'kg';

  if (unit === 'g' && unitType === 'imperial') return 'oz';

  if (unit === 'kg' && unitType === 'imperial') return 'lb';

  return unit;
}

export function getNextColor(categories: { [key: string]: GearListCategory }) {
  const catIds = Object.keys(categories);

  const existingColors = catIds.reduce((accColors, currCatId) => {
    const color = categories[currCatId].color;

    return {
      ...accColors,
      [color]: color,
    };
  }, {});

  return (
    CATEGORY_COLORS.find(color => !existingColors.hasOwnProperty(color)) ||
    getRandomColor()
  );
}

export function getRandomColor() {
  return CATEGORY_COLORS[(CATEGORY_COLORS.length * Math.random()) | 0];
}

export function convertUnitToListType(unit: Unit, unitType: UnitType) {
  if (unit === 'oz' && unitType === 'metric') {
    return 'g';
  }

  if (unit === 'lb' && unitType === 'metric') {
    return 'kg';
  }

  if (unit === 'g' && unitType === 'imperial') {
    return 'oz';
  }

  if (unit === 'kg' && unitType === 'imperial') {
    return 'lb';
  }

  return unit;
}

export function packList(list: GearList) {
  const clonedList = cloneDeep(list);

  delete clonedList.hasUnsavedData;

  clonedList.lastUpdated = Date.now();

  clonedList.userId =
    auth.currentUser?.uid || sessionStorage.getItem('userId') || 'unauthorized';

  return clonedList;
}

export function validateForm(formData) {
  const updatedFormData = { ...formData };
  updatedFormData.errorsFound = false;

  if (formData.hasOwnProperty('email') && formData.email.length === 0) {
    updatedFormData.emailHelpText = 'Required';
    updatedFormData.errorsFound = true;
  }

  if (
    formData.hasOwnProperty('email') &&
    !RegExp(/\S+@\S+\.\S+/).test(formData.email)
  ) {
    updatedFormData.emailHelpText = 'Invalid email';
    updatedFormData.errorsFound = true;
  }

  if (formData.hasOwnProperty('password') && formData.password.length === 0) {
    updatedFormData.passwordHelpText = 'Required';
    updatedFormData.errorsFound = true;
  }

  if (formData.hasOwnProperty('password') && formData.password.length < 8) {
    updatedFormData.passwordHelpText =
      'Password must be at least 8 character long';
    updatedFormData.errorsFound = true;
  }

  if (
    formData.hasOwnProperty('displayName') &&
    formData.displayName.length === 0
  ) {
    updatedFormData.displayNameHelpText = 'Required';
    updatedFormData.errorsFound = true;
  }

  return updatedFormData;
}

export function downloadFile(filename, text) {
  var element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:.csv;charset=utf-8,' + encodeURIComponent(text)
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function convertListToCsvString(list: GearList) {
  const clonedList = cloneDeep(list);

  const rows: any[] = [];

  clonedList.categoryIds.forEach(catId => {
    const category = clonedList.categories[catId];

    category.gearIds.forEach(gearId => {
      const gearItem = category.gearItems[gearId] as any;

      gearItem.category = category.name;

      delete gearItem.catId;

      delete gearItem.id;

      rows.push(gearItem);
    });
  });

  return papa.unparse(rows);
}

export function getDisplayWeight(valueInGrams: number, unitType: UnitType): [number, Unit] {

  if (valueInGrams >= 1000 && unitType === 'metric') {
    return [fromGrams(valueInGrams, 'kg'), 'kg'];
  }

  if (valueInGrams >= 453.592 && unitType === 'imperial') {
    return [fromGrams(valueInGrams, 'lb'), 'lb'];
  }

  if (unitType === 'imperial') {
    return [fromGrams(valueInGrams, 'oz'), 'oz'];
  }

  return [valueInGrams, 'g'];
}