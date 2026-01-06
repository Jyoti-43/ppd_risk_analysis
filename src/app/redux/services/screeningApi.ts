import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Question {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
}

export const screeningAPI = createApi({
  reducerPath: "epdsScreening",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    prepareHeaders: (headers) => {
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
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  endpoints: (build) => ({
    epdsScreening: build.mutation<Question, Question>({
      query: (body) => ({
        url: "/epds-screen",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useEpdsScreeningMutation } = screeningAPI;
