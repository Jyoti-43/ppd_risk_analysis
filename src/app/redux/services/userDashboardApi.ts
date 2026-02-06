import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./authApi";
import { DashboardRecommendationsResponse } from "../../type";

//  community post types

export const userDashboardApi = createApi({
  reducerPath: "userDashboardApi",

  baseQuery: axiosBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),

  // Cache data for 1 hour (3600 seconds) - won't refetch if data exists
  keepUnusedDataFor: 3600,

  // Tag types for cache invalidation
  tagTypes: ["Articles", "Categories", "Partners"],

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

    invitePartner: build.mutation<
      any,
      {
        partner_email: string;
        access_level: string;
        screening_types: string[];
      }
    >({
      query: (body) => ({
        url: `/partner/invite/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Partners" as any],
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
    getInvitedPartners: build.query<any, void>({
      query: () => ({
        url: `/partner/links`,
        method: "GET",
      }),
      providesTags: ["Partners" as any],
    }),
    getPendingInvites: build.query<any, void>({
      query: () => ({
        url: `/partner/invites`,
        method: "GET",
      }),
      providesTags: ["Partners" as any],
    }),

    // partner dashboard api
    getLinkedMotherProfile: build.query<any, void>({
      query: () => ({
        url: `/partner/linked-mothers`,
        method: "GET",
      }),
    }),
    getMotherScreeningSummary: build.query<any, string>({
      query: (mother_id) => ({
        url: `/screening/${mother_id}/summary`,
        method: "GET",
      }),
    }),
    getMotherScreeningHistory: build.query<
      any,
      { mother_id: string; page?: number; limit?: number }
    >({
      query: ({ mother_id, page = 1, limit = 10 }) => ({
        url: `/screening/${mother_id}/history`,
        method: "GET",
        params: { page, limit },
      }),
    }),
    getRecommendedArticles: build.query<DashboardRecommendationsResponse, void>(
      {
        query: () => ({
          url: `/me/recommended-articles`,
          method: "GET",
        }),
      },
    ),
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
  useInvitePartnerMutation,
  useGetInvitedPartnersQuery,
  useGetPendingInvitesQuery,
  useGetLinkedMotherProfileQuery,
  useLazyGetLinkedMotherProfileQuery,
  useGetMotherScreeningSummaryQuery,
  useGetMotherScreeningHistoryQuery,
  useGetRecommendedArticlesQuery,
} = userDashboardApi;
