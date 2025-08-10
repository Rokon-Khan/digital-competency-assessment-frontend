import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./fetures/authSlice";
import themeReducer from "./fetures/themeSlice";
import { assessmentApi } from "./services/assessmentApi";

export const store = configureStore({
  reducer: {
    [assessmentApi.reducerPath]: assessmentApi.reducer,
    theme: themeReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(assessmentApi.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
