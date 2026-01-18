import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const contributorProfileApi = createApi({
  reducerPath: "contributorProfileApi",

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
      if (endpoint !== "articleUploadImage") {
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),

  // Cache data for 5 minutes (300 seconds) - won't refetch if data exists
  keepUnusedDataFor: 600,

  // Tag types for cache invalidation
  tagTypes: ["Articles", "Categories"],

  endpoints: (build) => ({
    basicProfileSetup: build.mutation<
      any,
      {
        first_name: string;
        last_name: string;
        professional_title: string;
        short_bio: string;
      }
    >({
      query: (body) => ({
        url: "/contributor/profile/step1-basic-profile",
        method: "POST",
        body,
      }),
      // Invalidate posts cache when a new post is created
      //   invalidatesTags: ["ContributorProfile"],
    }),

    // education
    educationProfileSetup: build.mutation<
      any,
      {
        education: [
          {
            education_id: string;
            institution_name: string;
            degree: string;
            year_of_graduation: string;
            field_of_study: string;
          },
        ];
      }
    >({
      query: (body) => ({
        url: "/contributor/profile/step2-education",
        method: "POST",
        body,
      }),
      // Invalidate posts cache when a new post is created
      //   invalidatesTags: ["ContributorProfile"],
    }),

    // experience
    experienceProfileSetup: build.mutation<
      any,
      {
        experience: [
          {
            experience_id: string;
            job_title: string;
            company_name: string;
            start_month: number;
            start_year: number;
            end_month: number;
            end_year: number;
            is_currently_working: boolean;
            key_responsibilities: string;
          },
        ];
      }
    >({
      query: (body) => ({
        url: "/contributor/profile/step3-experience",
        method: "POST",
        body,
      }),
      // Invalidate posts cache when a new post is created
      //   invalidatesTags: ["ContributorProfile"],
    }),

    // certificate
    certificateProfileSetup: build.mutation<
      any,
      {
        certifications: [
          {
            certification_id: string;
            certification_name: string;
            issuing_organization: string;
            date_issued: string;
            expiration_date: string;
            credential_id: string;
          },
        ];
      }
    >({
      query: (body) => ({
        url: "/contributor/profile/step4-certifications",
        method: "POST",
        body,
      }),
      // Invalidate posts cache when a new post is created
      //   invalidatesTags: ["ContributorProfile"],
    }),

    // skill ,experties and publication
    expertiesProfileSetup: build.mutation<
      any,
      {
        expertise_topics: [string];
        publications: [
          {
            publication_id: string;
            title: string;
            url: string;
          },
        ];
      }
    >({
      query: (body) => ({
        url: "/contributor/profile/step5-experties-and-publications",
        method: "POST",
        body,
      }),
      // Invalidate posts cache when a new post is created
      //   invalidatesTags: ["ContributorProfile"],
    }),
  }),
});

export const {
  useBasicProfileSetupMutation,
  useEducationProfileSetupMutation,
  useExperienceProfileSetupMutation,
  useCertificateProfileSetupMutation,
  useExpertiesProfileSetupMutation,
} = contributorProfileApi;
