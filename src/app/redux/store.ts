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
import { groupPost } from "./services/groupPostApi";
import { createGroupPostSlice } from "./feature/community/groupPostSlice";
import { SymptomsResultSlice } from "./feature/screening/symptoms/symptomsSlice";
import { HybridResultSlice } from "./feature/screening/hybrid/hybridSlice";
import { articleApi } from "./services/articleApi";
import { contributorProfileApi } from "./services/contributorProfileSetupApi";
import { adminApi } from "./services/adminApi";
import { userDashboardApi } from "./services/userDashboardApi";

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
    symptomsResult: SymptomsResultSlice.reducer,
    hybridResult: HybridResultSlice.reducer,
    // yo chai api call ko lagi redux service add gareko
    [screeningAPI.reducerPath]: screeningAPI.reducer,

    // createGroupSlice ko detail lai communityGroupDetail vanne naam diyekoo
    createGroup: createGroupSlice.reducer,
    // yo chai api call ko lagi redux service add gareko
    [communityGroup.reducerPath]: communityGroup.reducer,

    createGroupPost: createGroupPostSlice.reducer,
    [groupPost.reducerPath]: groupPost.reducer,

    article: articleApi.reducer,
    [articleApi.reducerPath]: articleApi.reducer,

    contributorProfile: contributorProfileApi.reducer,
    [contributorProfileApi.reducerPath]: contributorProfileApi.reducer,
    admin: adminApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    userDashboard: userDashboardApi.reducer,
    [userDashboardApi.reducerPath]: userDashboardApi.reducer,
  },

  // Adding the middleware for the APIs that helps in caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authUserAPI.middleware)
      .concat(communityPost.middleware)
      .concat(screeningAPI.middleware)
      .concat(communityGroup.middleware)
      .concat(groupPost.middleware)
      .concat(articleApi.middleware)
      .concat(contributorProfileApi.middleware)
      .concat(adminApi.middleware)
      .concat(userDashboardApi.middleware),
});

import { injectStore } from "../utils/axiosInstance";

// Inject store into axiosInstance to break circular dependency
injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
