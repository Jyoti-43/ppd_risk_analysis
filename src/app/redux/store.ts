import { configureStore } from "@reduxjs/toolkit";
import  UserSliceReducer  from "./feature/user/userSlice";
import { authUserAPI } from "./services/authApi";
import { setupListeners } from "@reduxjs/toolkit/query/react";

export const store = configureStore({
  reducer:{
    user: UserSliceReducer,
     [authUserAPI.reducerPath]: authUserAPI.reducer,
  },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authUserAPI.middleware),

});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)