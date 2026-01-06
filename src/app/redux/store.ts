import { configureStore } from "@reduxjs/toolkit";
import UserSliceReducer from "./feature/user/userSlice";
import { authUserAPI } from "./services/authApi";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import createPostReducer from "./feature/community/createPostSlice";
import { communityPost } from "./services/communityPostApi";

export const store = configureStore({
  reducer: {
    user: UserSliceReducer,
    createPost: createPostReducer,
    [authUserAPI.reducerPath]: authUserAPI.reducer,
    [communityPost.reducerPath]: communityPost.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authUserAPI.middleware)
      .concat(communityPost.middleware),

});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)