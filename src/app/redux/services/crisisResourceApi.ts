import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CrisisResource,
  CrisisResourceRecommendationRequest,
} from "../../type";

export const crisisResourceApi = createApi({
  reducerPath: "crisisResourceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    prepareHeaders: (headers) => {
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
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["CrisisResource"],
  endpoints: (builder) => ({
    recommendCrisisResources: builder.mutation<
      CrisisResource[],
      CrisisResourceRecommendationRequest
    >({
      query: (body) => ({
        url: "/crisis-resources/recommend",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CrisisResource"],
    }),

    getCrisisResources: builder.query<CrisisResource[], void>({
      query: () => ({
        url: "/crisis-resources",
        method: "GET",
      }),
      providesTags: ["CrisisResource"],
    }),
  }),
});

export const {
  useRecommendCrisisResourcesMutation,
  useGetCrisisResourcesQuery,
} = crisisResourceApi;
