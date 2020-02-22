import { GearSuggestion } from '../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { db } from '../firebase';

interface GearSuggestionReducer {
  suggestionIds: string[];
  suggestionMap: { [key: string]: GearSuggestion };
}

const initialState: GearSuggestionReducer = {
  suggestionIds: [],
  suggestionMap: {},
};

export const gearSuggestionsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    gearSuggestionsError: (state, action: PayloadAction<string>) => {},
    setGearSuggestions: (
      state,
      action: PayloadAction<GearSuggestionReducer>
    ) => {
      return action.payload;
    },
  },
});

const {
  gearSuggestionsError,
  setGearSuggestions,
} = gearSuggestionsSlice.actions;

export const getSuggestions = (): AppThunk => async dispatch => {
  try {
    const storedSuggestions =
      JSON.parse(localStorage.getItem('suggestions') || 'null') || initialState;

    const lastFetched = Number(localStorage.getItem('lastFetched') || '0');

    const res = await db
      .collection('suggestions')
      .where('timestamp', '>', lastFetched)
      .get();

    localStorage.setItem('lastFetched', Date.now().toString());

    if (res.empty) {
      return dispatch(setGearSuggestions(storedSuggestions));
    }

    let fetchedSuggestionIds: string[] = [];
    let fetchedSuggestionMap = {};

    res.docs.forEach(doc => {
      const suggestion = doc.data();

      fetchedSuggestionIds.push(suggestion.label);

      fetchedSuggestionMap[suggestion.label] = suggestion;
    });

    const newSuggestionIds = [
      ...(new Set([...fetchedSuggestionIds, ...storedSuggestions.suggestionIds])),
    ];

    const newSuggestionMap = {
      ...storedSuggestions.suggestionMap,
      ...fetchedSuggestionMap,
    }

    const newState = {
      suggestionIds: newSuggestionIds,
      suggestionMap: newSuggestionMap,
    }

    dispatch(setGearSuggestions(newState));

    localStorage.setItem('suggestions', JSON.stringify(newState));
  } catch (err) {
    return dispatch(gearSuggestionsError(err.message));
  }
};
