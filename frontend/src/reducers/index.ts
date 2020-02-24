import { modalsSlice } from './Modals';
import * as userDuck from './User';
import { loadingReducer } from './Loading';
import * as gearSuggestionsDuck from './GearSuggestions';
import * as gearListsDuck from './GearLists';
import { combineReducers } from 'redux';
import { alertSlice } from './Alert';
import { editModeSlice } from './EditMode';
import { snackMessageReducer } from './SnackMessage';

const { userSlice, ...userActions } = userDuck;
const { gearSuggestionsSlice, ...gearSuggestionsActions } = gearSuggestionsDuck;
const { gearListsSlice, ...gearListsActions } = gearListsDuck;

export const actions = {
  ...userActions,
  ...userSlice.actions,
  ...gearSuggestionsActions,
  ...gearSuggestionsSlice.actions,
  ...gearListsActions,
  ...gearListsSlice.actions,
  ...editModeSlice.actions,
  ...modalsSlice.actions,
  ...alertSlice.actions
};

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  gearLists: gearListsSlice.reducer,
  gearSuggestions: gearSuggestionsSlice.reducer,
  loading: loadingReducer,
  user: userSlice.reducer,
  alert: alertSlice.reducer,
  editMode: editModeSlice.reducer,
  snackMessage: snackMessageReducer,
  modals: modalsSlice.reducer,
});
