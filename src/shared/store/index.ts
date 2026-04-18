import { sessionReducer } from '@entities/session';
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@shared/api';

export const makeStore = () =>
  configureStore({
    reducer: {
      session: sessionReducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
