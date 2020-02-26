import {
  GearList,
  GearSuggestion,
  UnitType,
  Starred,
  Unit,
  SortBy,
  SortDirection,
  Severity,
} from '../types';
import { navigate } from '@reach/router';
import cloneDeep from 'clone-deep';
import {
  getNextSortDirection,
  getNextStar,
  getNextColor,
  toggleUnit,
  packList,
  toGrams,
  fromGrams,
  toFixed,
} from '../utils';

import { db } from '../firebase';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';

interface GearLists {
  gearListsMap: { [key: string]: GearList };
  gearListIds: string[];
}

const initialState = {
  gearListsMap: {},
  gearListIds: [],
};

export const createBlankList = ({
  listId,
  userId,
  preferredUnitType,
}): GearList => ({
  id: listId,
  name: '',
  userId: userId,
  description: '',
  lastUpdated: Date.now(),
  categoryIds: [],
  categories: {},
  showCheckboxes: false,
  showPrices: true,
  showDescriptions: true,
  showQuantities: true,
  sortCategoriesBy: 'name',
  sortCategoriesDirection: 'custom',
  sortItemsBy: 'name',
  sortItemsDirection: 'custom',
  currencyCharacter: '$',
  unitType: preferredUnitType,
  hasUnsavedData: true,
});

export const gearListsSlice = createSlice({
  name: 'gearLists',
  initialState: initialState as GearLists,
  extraReducers: {
    'user/getUserStarted': (state, action: PayloadAction<string>) => {
      state.gearListIds.forEach(listId => {
        state.gearListsMap[listId].userId = action.payload;
      });
    },
    'editMode/setEditMode': (
      state,
      action: PayloadAction<{ editMode: boolean; listId?: string }>
    ) => {
      const { listId, editMode } = action.payload;

      if (listId && !editMode) {
        state.gearListsMap[listId].sortCategoriesDirection = 'custom';
        state.gearListsMap[listId].sortItemsDirection = 'custom';
      }
    },
    'user/clearUser': state => {
      const demo = state.gearListsMap.demo;
      state.gearListsMap = {};
      state.gearListIds = [];

      if (demo) {
        state.gearListsMap.demo = demo;
      }
    },
  },
  reducers: {
    copyList: (
      state,
      action: PayloadAction<{
        list: GearList;
        newListId: string;
        userId: string;
      }>
    ) => {
      const { newListId, list } = action.payload;

      const clonedList = cloneDeep(list);

      clonedList.id = newListId;
      clonedList.name += ' (Copy)';
      clonedList.hasUnsavedData = true;
      clonedList.userId = action.payload.userId;

      state.gearListsMap[newListId] = clonedList;
      state.gearListIds.push(newListId);
    },
    createList: (
      state,
      action: PayloadAction<{ listId: string; userId: string }>
    ) => {
      let numOfImperial = 0;
      let numOfMetric = 0;
      const { listId, userId } = action.payload;

      state.gearListIds.forEach(listId => {
        const list = state.gearListsMap[listId];

        if (list.unitType === 'metric') {
          return numOfMetric++;
        }

        numOfImperial++;
      });

      const preferredUnitType =
        numOfImperial >= numOfMetric ? 'imperial' : 'metric';

      const newList = createBlankList({ listId, userId, preferredUnitType });

      state.gearListsMap[listId] = newList;
      state.gearListIds.push(listId);
    },
    addItem: (
      state,
      action: PayloadAction<{ listId: string; catId: string; gearId: string }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];

      list.hasUnsavedData = true;

      const newItem = {
        id: action.payload.gearId,
        catId: action.payload.catId,
        name: '',
        description: '',
        hyperlink: '',
        weight: '0',
        price: '0',
        worn: false,
        consumable: false,
        starred: 'none' as Starred,
        checked: false,
        unit: list.unitType === 'imperial' ? 'oz' : ('g' as Unit),
        quantity: '1',
      };

      list.categories[action.payload.catId].gearItems[
        action.payload.gearId
      ] = newItem;

      list.categories[action.payload.catId].gearIds.push(action.payload.gearId);
    },
    toggleCategoryCheckboxes: (
      state,
      action: PayloadAction<{ listId: string; catId: string; value: boolean }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];

      list.hasUnsavedData = true;

      const gearIds = list.categories[action.payload.catId].gearIds;

      gearIds.forEach(
        gearId =>
          (list.categories[action.payload.catId].gearItems[gearId].checked =
            action.payload.value)
      );
    },
    toggleItemSort: (
      state,
      action: PayloadAction<{
        listId: string;
        field: SortBy;
        direction: SortDirection;
      }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];

      list.hasUnsavedData = true;

      list.sortItemsDirection =
        list.sortItemsBy === action.payload.field ||
        action.payload.direction === 'custom'
          ? getNextSortDirection(action.payload.direction)
          : action.payload.direction;
      list.sortItemsBy = action.payload.field;
    },
    editCatName: (
      state,
      action: PayloadAction<{
        listId: string;
        catId: string;
        catName: string;
      }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { catId, catName } = action.payload;

      if (list.categories[catId].name !== catName) {
        list.hasUnsavedData = true;
      }

      list.categories[catId].name = catName;
    },
    removeCategory: (
      state,
      action: PayloadAction<{ listId: string; catId: string }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { catId } = action.payload;

      list.hasUnsavedData = true;

      list.categoryIds = list.categoryIds.filter(id => id !== catId);

      delete list.categories[catId];
    },
    toggleCheckItem: (
      state,
      action: PayloadAction<{ listId: string; catId: string; gearId: string }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { catId, gearId } = action.payload;

      list.hasUnsavedData = true;

      list.categories[catId].gearItems[gearId].checked = !list.categories[catId]
        .gearItems[gearId].checked;
    },
    updateItem: (
      state,
      action: PayloadAction<{
        listId: string;
        catId: string;
        gearId: string;
        field: string;
        value: string;
      }>
    ) => {
      const { catId, gearId, field, value, listId } = action.payload;

      const list = state.gearListsMap[listId];

      list.hasUnsavedData = true;

      list.categories[catId].gearItems[gearId][field] = value;
    },
    toggleUnit: (
      state,
      action: PayloadAction<{
        listId: string;
        catId: string;
        gearId: string;
      }>
    ) => {
      const { catId, gearId, listId } = action.payload;

      const list = state.gearListsMap[listId];

      list.hasUnsavedData = true;

      const item = list.categories[catId].gearItems[gearId];

      if(item.unit === 'oz') {
        item.unit = 'lb';
      } else if (item.unit === 'g') {
        item.unit = 'kg';
      } else if (item.unit === 'kg') {
        item.unit = 'g';
      } else {
        item.unit = 'oz';
      }

    },
    toggleWorn: (
      state,
      action: PayloadAction<{ listId: string; catId: string; gearId: string }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { catId, gearId } = action.payload;

      list.hasUnsavedData = true;

      const item = list.categories[catId].gearItems[gearId];

      if (item.consumable && !item.worn) {
        item.consumable = false;
      }

      item.worn = !item.worn;
    },
    toggleConsumable: (
      state,
      action: PayloadAction<{ listId: string; catId: string; gearId: string }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { catId, gearId } = action.payload;

      list.hasUnsavedData = true;

      const item = list.categories[catId].gearItems[gearId];

      if (item.worn && !item.consumable) {
        item.worn = false;
      }

      item.consumable = !item.consumable;
    },
    toggleStarred: (
      state,
      action: PayloadAction<{ listId: string; catId: string; gearId: string }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { catId, gearId } = action.payload;
      list.hasUnsavedData = true;

      list.categories[catId].gearItems[gearId].starred = getNextStar(
        list.categories[catId].gearItems[gearId].starred
      );
    },
    removeItem: (
      state,
      action: PayloadAction<{ listId: string; catId: string; gearId: string }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { catId, gearId } = action.payload;

      list.hasUnsavedData = true;

      delete list.categories[catId].gearItems[gearId];

      list.categories[catId].gearIds = list.categories[catId].gearIds.filter(
        id => id !== gearId
      );
    },
    updateUnitType: (
      state,
      action: PayloadAction<{ listId: string; unitType: UnitType }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { unitType } = action.payload;

      list.hasUnsavedData = true;

      list.categoryIds.forEach(catId => {
        list.categories[catId].gearIds.forEach(gearId => {
          const item = list.categories[catId].gearItems[gearId];

          const weightInGrams = toGrams(item.weight, item.unit);

          const targetUnit = toggleUnit(item.unit, unitType);

          const targetWeight = fromGrams(weightInGrams, targetUnit);

          item.unit = targetUnit;

          item.weight = toFixed(targetWeight);
        });
      });

      list.unitType = unitType;
    },
    editDescription: (
      state,
      action: PayloadAction<{ listId: string; description: string }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { description } = action.payload;

      list.hasUnsavedData = true;

      list.description = description;
    },
    updateItemWithSuggestion: (
      state,
      action: PayloadAction<{
        listId: string;
        catId: string;
        gearId: string;
        suggestion: GearSuggestion;
        weight: string;
        unit: Unit;
      }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { catId, gearId, suggestion, weight, unit } = action.payload;

      list.hasUnsavedData = true;

      const item = list.categories[catId].gearItems[gearId];

      item.name = suggestion.label;
      item.hyperlink = suggestion.hyperlink;
      item.weight = weight;
      item.price = suggestion.price;
      item.unit = unit;
      item.description = suggestion.description;
      item.consumable = suggestion.consumable;
      item.worn = suggestion.worn;
      item.starred = suggestion.starred;
    },
    addCategory: (
      state,
      action: PayloadAction<{ listId: string; catId: string }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { catId } = action.payload;

      list.hasUnsavedData = true;

      const newCategory = {
        id: catId,
        name: '',
        gearIds: [],
        color: getNextColor(list.categories),
        gearItems: {},
      };

      list.categories[catId] = newCategory;

      list.categoryIds.push(catId);
    },
    toggleShowColumn: (
      state,
      action: PayloadAction<{
        listId: string;
        column:
          | 'showPrices'
          | 'showCheckboxes'
          | 'showDescriptions'
          | 'showQuantities';
      }>
    ) => {
      const { listId, column} = action.payload;

      const list = state.gearListsMap[listId];

      list.hasUnsavedData = true;

      list[column] = !list[column];
    },
    toggleCategorySort: (
      state,
      action: PayloadAction<{
        listId: string;
        field: SortBy;
        direction: SortDirection;
      }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { field, direction } = action.payload;

      list.hasUnsavedData = true;

      list.sortCategoriesDirection =
        list.sortCategoriesBy === field || direction === 'custom'
          ? getNextSortDirection(direction)
          : direction;
      list.sortCategoriesBy = field;
    },
    setHyperlink: (
      state,
      action: PayloadAction<{
        listId: string;
        catId: string;
        hyperlink: string;
        gearId: string;
      }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { catId, gearId, hyperlink } = action.payload;

      list.hasUnsavedData = true;

      list.categories[catId].gearItems[gearId].hyperlink = hyperlink;
    },
    setCurrencyCharacter: (
      state,
      action: PayloadAction<{ listId: string; character: string }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { character } = action.payload;

      list.hasUnsavedData = true;

      list.currencyCharacter = character;
    },
    editListName: (
      state,
      action: PayloadAction<{ listId: string; name: string }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { name } = action.payload;

      if (name !== list.name) {
        list.hasUnsavedData = true;
      }

      list.name = name;
    },
    swapCategories: (
      state,
      action: PayloadAction<{
        listId: string;
        sourceIndex: number;
        destinationIndex: number;
        draggableId: string;
      }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const { sourceIndex, destinationIndex, draggableId } = action.payload;

      list.hasUnsavedData = true;

      const newList = Array.from(list.categoryIds);
      newList.splice(sourceIndex, 1);
      newList.splice(destinationIndex, 0, draggableId);

      list.categoryIds = newList;
    },
    swapItems: (
      state,
      action: PayloadAction<{
        listId: string;
        sourceCatId: string;
        destCatId: string;
        sourceIndex: number;
        destinationIndex: number;
        draggableId: string;
      }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];
      const {
        listId,
        sourceCatId,
        destCatId,
        sourceIndex,
        destinationIndex,
        draggableId,
      } = action.payload;
      list.hasUnsavedData = true;

      const sourceCat = list.categories[sourceCatId];

      // same cat table
      if (sourceCatId === destCatId) {
        const newList = Array.from(sourceCat.gearIds);
        newList.splice(sourceIndex, 1);
        newList.splice(destinationIndex, 0, draggableId);

        sourceCat.gearIds = newList;

        // different cat tables
      } else {
        const newSourceList = Array.from(sourceCat.gearIds);
        const sourceGearId = newSourceList[sourceIndex];
        newSourceList.splice(sourceIndex, 1);
        sourceCat.gearIds = newSourceList;

        const destCat = list.categories[destCatId];
        const newDestList = Array.from(destCat.gearIds);
        newDestList.splice(destinationIndex, 0, draggableId);

        destCat.gearIds = newDestList;
        destCat.gearItems[sourceGearId] = sourceCat.gearItems[sourceGearId];
        delete sourceCat.gearItems[sourceGearId];
      }
    },
    gearListsAlert: (
      state,
      action: PayloadAction<{ message: string; severity: Severity }>
    ) => {},
    updateList: (
      state,
      action: PayloadAction<{ list: GearList; unsavedChanges?: boolean }>
    ) => {
      const { list, unsavedChanges } = action.payload;

      state.gearListsMap[list.id] = list;
      state.gearListsMap[list.id].hasUnsavedData = unsavedChanges
        ? true
        : false;
    },
    unpackLists: (
      state,
      action: PayloadAction<{ lists: any[]; isOwner: boolean }>
    ) => {
      const { lists, isOwner } = action.payload;

      lists.forEach(list => {
        list.showCheckboxes = false;

        if(list.showQuantities === undefined) {
          list.showQuantities = true;
        }

        state.gearListsMap[list.id] = list;

        if (!state.gearListIds.includes(list.id) && isOwner) {
          state.gearListIds.push(list.id);
        }
      });
    },
    setOwnerDisplayName: (
      state,
      action: PayloadAction<{ listId: string; ownerName: string }>
    ) => {
      const list = state.gearListsMap[action.payload.listId];

      list.ownerDisplayName = action.payload.ownerName;
    },
    setGearListLoadingMessage: (
      state,
      action: PayloadAction<string | { message: string; isModal: boolean }>
    ) => {},
    deleteListState: (state, action: PayloadAction<string>) => {
      delete state.gearListsMap[action.payload];
      state.gearListIds = state.gearListIds.filter(
        listId => listId !== action.payload
      );
    },
  },
});

const {
  gearListsAlert,
  updateList,
  setOwnerDisplayName,
  setGearListLoadingMessage,
  deleteListState,
  unpackLists,
} = gearListsSlice.actions;

export const postList = (list: GearList): AppThunk => async dispatch => {
  const packedList = packList(list);

  try {
    await db
      .collection('gearLists')
      .doc(list.id)
      .set(packedList);

    dispatch(updateList({ list }));
  } catch (err) {
    dispatch(gearListsAlert({ message: err.message, severity: 'error' }));
  }
};

export const getList = (listId: string): AppThunk => async (
  dispatch,
  getState
) => {
  const state = getState();

  if (state.gearLists.gearListsMap[listId]) {
    return;
  }

  try {
    if (listId !== 'demo') {
      dispatch(
        setGearListLoadingMessage({ message: 'Getting list', isModal: false })
      );
    }

    const res = await db
      .collection('gearLists')
      .doc(listId)
      .get();

    if (!res.exists) {
      return;
    }

    const list = res.data();

    const userId = state.user.id;

    dispatch(unpackLists({ lists: [list], isOwner: list?.userId === userId }));

    if (list && (list.userId === state.user.id || list?.id === 'demo')) {
      return;
    }

    const userRes = await db
      .collection('users')
      .doc(list?.userId)
      .get();

    const listOwner = userRes.data();

    dispatch(
      setOwnerDisplayName({
        ownerName: listOwner?.displayName,
        listId: list?.id,
      })
    );
  } catch (err) {
    dispatch(gearListsAlert({ message: err.message, severity: 'error' }));
  } finally {
    dispatch(setGearListLoadingMessage(''));
  }
};

export const deleteList = (listId: string): AppThunk => async dispatch => {
  try {
    dispatch(setGearListLoadingMessage('Deleting list'));

    await navigate('/');

    await db
      .collection('gearLists')
      .doc(listId)
      .delete();

    dispatch(deleteListState(listId));
  } catch (err) {
    dispatch(gearListsAlert({ message: err.message, severity: 'error' }));
  } finally {
    dispatch(setGearListLoadingMessage(''));
  }
};

export const getUserLists = (userId: string): AppThunk => async dispatch => {
  try {
    const res = await db
      .collection('gearLists')
      .where('userId', '==', userId)
      .get();

    if (res.empty) {
      return;
    }

    const lists: any[] = [];

    res.forEach(doc => {
      lists.push(doc.data());
    });

    dispatch(unpackLists({ lists, isOwner: true }));
  } catch (err) {
    dispatch(gearListsAlert({ message: err.message, severity: 'error' }));
  }
};

export const saveLists = (): AppThunk => async (dispatch, getState) => {
  const state = getState();

  state.gearLists.gearListIds.forEach(listId => {
    const list = state.gearLists.gearListsMap[listId];

    if (list.hasUnsavedData) {
      dispatch(postList(list));
    }
  });
};
