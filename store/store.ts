// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { cuisineApi } from '@/features/cuisine/cuisineApi'; // update the path if needed
import { productApi } from '@/features/product/productApi';

export const store = configureStore({
 

  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [cuisineApi.reducerPath]: cuisineApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware,cuisineApi.middleware),
});
console.log(' Redux store initialized');
// Types for use throughout your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
