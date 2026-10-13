import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/lib/base-api-rtk";
import { uiSlice } from "./slices/ui.slice";
import { authSlice } from "./slices/auth.slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      [uiSlice.name]: uiSlice.reducer,
      [authSlice.name]: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Typed hooks – import these instead of raw useDispatch/useSelector
export type { AppStore as Store };
