import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import type { PersistPartial } from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import medicineReducer from './slices/medicineSlice';
import notificationReducer from './slices/notificationSlice';
import favoriteReducer from './slices/favoriteSlice';
import pharmacyReducer from './slices/pharmacySlice';
import uiReducer from './slices/uiSlice';

const authTransform = createTransform(
  (inboundState: any) => {
    if (!inboundState) return inboundState;
    const { loading, error, ...rest } = inboundState;
    return rest;
  },
  (outboundState: any) => {
    if (!outboundState) return outboundState;
    return { ...outboundState, loading: false, error: null };
  },
  { whitelist: ['auth'] }
);

const rootReducer = combineReducers({
  auth: authReducer,
  medicines: medicineReducer,
  notifications: notificationReducer,
  favorites: favoriteReducer,
  pharmacy: pharmacyReducer,
  ui: uiReducer,
});

type BaseState = ReturnType<typeof rootReducer>;
type PersistedState = BaseState & PersistPartial;

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'favorites', 'pharmacy'],
  transforms: [authTransform],
};

const persistedReducer = persistReducer<BaseState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = PersistedState;
export type AppDispatch = typeof store.dispatch;
