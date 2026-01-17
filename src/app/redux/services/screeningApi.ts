import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EPDSQuestion, SymptomsQuestion } from "../../type";
export const screeningAPI = createApi({
  reducerPath: "ppdScreening",
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
    epdsScreening: build.mutation<EPDSQuestion, EPDSQuestion>({
      query: (body) => ({
        url: "/epds-screen",
        method: "POST",
        body,
      }),
    }),
    

    symptomsQuestion: build.query<SymptomsQuestion[], void>({
      query: () => ({
        url: "/symptom/ppd-risk/form",
        method: "GET",
      }),
    }),

     symptomsAssessment: build.mutation<SymptomsAnswer, SymptomsAnswer>({
      query: (answers) => ({
        url: "/symptom/ppd-risk/assess",
        method: "POST",
        body: answers ,
      }),
    }),


  }),
});

export const { useEpdsScreeningMutation, useSymptomsQuestionQuery, useSymptomsAssessmentMutation } =
  screeningAPI;
