import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//  community post types

export const userDashboardApi = createApi({
  reducerPath: "userDashboardApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    prepareHeaders: (headers, { endpoint }) => {
      // Get token from localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.access_token) {
            headers.set("Authorization", `Bearer ${user.access_token}`);
          }
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
      return headers;
    },
  }),

  // Cache data for 1 hour (3600 seconds) - won't refetch if data exists
  keepUnusedDataFor: 3600,

  // Tag types for cache invalidation
  tagTypes: ["Articles", "Categories"],

  endpoints: (build) => ({
    postCount: build.query<any, void>({
      query: () => ({
        url: `/user/posts/count`,
        method: "GET",
      }),
      // Invalidate posts cache when a post is deleted
      //   invalidatesTags: [""],
    }),
    getUserPosts: build.query<any, void>({
      query: () => ({
        url: `/user/posts`,
        method: "GET",
      }),
      // Invalidate posts cache when a post is deleted
      //   invalidatesTags: [""],
    }),
    getUserGroupCreated: build.query<any, void>({
      query: () => ({
        url: `/user/my-groups/created`,
        method: "GET",
      }),
      // Invalidate posts cache when a post is deleted
      //   invalidatesTags: [""],
    }),

    getUserGroupJoined: build.query<any, void>({
      query: () => ({
        url: `/user/my-groups/joined`,
        method: "GET",
      }),
      // Invalidate posts cache when a post is deleted
      //   invalidatesTags: [""],
    }),

    screeningCount: build.query<any, void>({
      query: () => ({
        url: `/screening/count`,
        method: "GET",
      }),
      // Invalidate posts cache when a post is deleted
      //   invalidatesTags: [""],
    }),
    getSymptomsScreeningHistory: build.query<any, void>({
      query: () => ({
        url: `/symptom/ppd-risk/history`,
        method: "GET",
      }),
    }),
    getHybridScreeningHistory: build.query<any, void>({
      query: () => ({
        url: `/hybrid-screen/history`,
        method: "GET",
      }),
    }),
    getEpdsScreeningHistory: build.query<any, void>({
      query: () => ({
        url: `/epds-screen/history`,
        method: "GET",
      }),
    }),

    getEpdsScreeningHistoryById: build.query<any, any>({
      query: (result_id: string) => ({
        url: `/epds-screen/${result_id}`,
        method: "GET",
      }),
    }),

    getSymptomsScreeningHistoryById: build.query<any, any>({
      query: (result_id: string) => ({
        url: `/symptom/ppd-risk/${result_id}`,
        method: "GET",
      }),
    }),

    getHybridScreeningHistoryById: build.query<any, any>({
      query: (result_id: string) => ({
        url: `/hybrid-screen/${result_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  usePostCountQuery,
  useGetUserPostsQuery,
  useGetUserGroupCreatedQuery,
  useGetUserGroupJoinedQuery,
  useScreeningCountQuery,
  useGetSymptomsScreeningHistoryQuery,
  useGetHybridScreeningHistoryQuery,
  useGetEpdsScreeningHistoryQuery,
  useGetEpdsScreeningHistoryByIdQuery,
  useGetSymptomsScreeningHistoryByIdQuery,
  useGetHybridScreeningHistoryByIdQuery,
} = userDashboardApi;
