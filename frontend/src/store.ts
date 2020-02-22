import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { rootReducer, RootState } from './reducers';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

const middleware = [...getDefaultMiddleware()];

if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');

  const logger = createLogger({
    collapsed: true,
  })

  middleware.push(logger);
}

const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
