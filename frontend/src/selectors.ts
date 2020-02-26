import { GearSuggestion } from './types';
import { RootState } from './reducers/index';
import { createSelector } from 'reselect';
import { getAllGearItems } from './utils';

export const listIdsSelector = (state: RootState) =>
  state.gearLists.gearListIds;
export const listMapSelector = (state: RootState) =>
  state.gearLists.gearListsMap;

const listSelector = createSelector(
  listMapSelector,
  (_, listId) => listId,
  (gearListsMap, listId) => gearListsMap[listId]
);

const suggestionIdsSelector = (state: RootState) => state.gearSuggestions.suggestionIds;

const suggestionMapSelector = (state: RootState) => state.gearSuggestions.suggestionMap;

export const gearSuggestionsSelector = createSelector(
  suggestionIdsSelector,
  suggestionMapSelector,
  (suggestionIds, suggestionMap) => suggestionIds.map(id => suggestionMap[id])
)

export const unitTypeSelector = createSelector(
  listSelector,
  list => list.unitType
)

export const showDescriptionsSelector = createSelector(
  listSelector,
  list => list.showDescriptions
);

export const showQuantitiesSelector = createSelector(
  listSelector,
  list => list.showQuantities
);

export const unsavedChangesSelector = createSelector(
  listIdsSelector,
  listMapSelector,
  (gearListIds, gearListsMap) =>
    gearListIds.some(listId => gearListsMap[listId].hasUnsavedData)
);

export const getGearLocker = createSelector(
  listIdsSelector,
  listMapSelector,
  (_, ignoreListIds) => ignoreListIds,
  (gearListIds, gearListsMap, ignoreListIds) => {
    const listIds = gearListIds.filter(
      listId => !ignoreListIds.includes(listId)
    );

    const gearItems = listIds
      .map(listId =>
        getAllGearItems(
          gearListsMap[listId].categories,
          gearListsMap[listId].categoryIds
        )
      )
      .reduce(
        (accGearItems, currGearItems) => ({
          ...accGearItems,
          ...currGearItems,
        }),
        {}
      );

    const nameMap = {};

    const suggestions: GearSuggestion[] = [];

    Object.keys(gearItems).forEach(gearId => {
      const item = gearItems[gearId];

      const name = item.name.toLowerCase();

      if (!nameMap.hasOwnProperty(name)) {
        nameMap[name] = name;
        suggestions.push({
          weight: item.weight,
          price: item.price,
          hyperlink: item.hyperlink,
          label: item.name,
          serverSuggestion: false,
          unit: item.unit,
          description: item.description,
          worn: item.worn,
          consumable: item.consumable,
          starred: item.starred,
        });
        return;
      }

      delete gearItems[gearId];
    });

    return suggestions;
  }
);
