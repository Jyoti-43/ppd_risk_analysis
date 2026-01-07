import { configureStore } from "@reduxjs/toolkit";
import UserSliceReducer from "./feature/user/userSlice";
import { authUserAPI } from "./services/authApi";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import createPostReducer from "./feature/community/createPostSlice";
import { communityPost } from "./services/communityPostApi";
import { EpdsResultSlice } from "./feature/screening/epds/epdsSlice";
import { screeningAPI } from "./services/screeningApi";
import { createGroupSlice } from "./feature/community/groupSlice";
import { communityGroup } from "./services/communityGroupApi";

export const store = configureStore({
  reducer: {
    user: UserSliceReducer,
    [authUserAPI.reducerPath]: authUserAPI.reducer,

    // createGroupSlice ko detail lai communityGroupDetail vanne naam diyekoo
    createPost: createPostReducer,
    // yo chai api call ko lagi redux service add gareko
    [communityPost.reducerPath]: communityPost.reducer,

    // Slice ko detail lai epdsResult vanne naam diyekoo
    epdsResult: EpdsResultSlice.reducer,
    // yo chai api call ko lagi redux service add gareko
    [screeningAPI.reducerPath]: screeningAPI.reducer,

    // createGroupSlice ko detail lai communityGroupDetail vanne naam diyekoo
    createGroup: createGroupSlice.reducer,
    // yo chai api call ko lagi redux service add gareko
    [communityGroup.reducerPath]: communityGroup.reducer,

  },

  // Adding the middleware for the APIs that helps in caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authUserAPI.middleware)
      .concat(communityPost.middleware)
      .concat(screeningAPI.middleware)
      .concat(communityGroup.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
