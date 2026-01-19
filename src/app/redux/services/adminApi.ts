import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//  community post types

export interface Article {
  id: string;
  title: string;
  preview: string;
  content: string;
  tags: string[];
  category: string;
  imageUrl?: string;
  image?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  createdAt?: string;
  status?: string;
}

export const adminApi = createApi({
  reducerPath: "adminApi",

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

  // Cache data for 5 minutes (300 seconds) - won't refetch if data exists
  keepUnusedDataFor: 600,

  // Tag types for cache invalidation
  tagTypes: ["Articles", "Categories"],

  endpoints: (build) => ({
    getPendingArticles: build.query<Article[], any>({
      query: () => ({
        url: "/admin/article/pending",
        method: "GET",
      }),
      // Tag this query so it can be invalidated
      providesTags: ["Articles"],
    }),

    publishArticle: build.mutation<any, string>({
      query: (articleId) => ({
        url: `/admin/article/${articleId}/publish`,
        method: "PATCH",
      }),
      // Invalidate posts cache when a post is deleted
      invalidatesTags: ["Articles"],
    }),

    // get pending and published article list
    getArticle: build.query<Article[], void>({
      query: () => ({
        url: "/contributor/article/list",
        method: "GET",
      }),
      // Tag this query so it can be invalidated
      providesTags: ["Articles"],
    }),

    deleteArticle: build.mutation<any, string>({
      query: (articleId) => ({
        url: `/contributor/article/${articleId}`,
        method: "DELETE",
      }),
      // Invalidate posts cache when a post is deleted
      invalidatesTags: ["Articles"],
    }),

    updateArticle: build.mutation<
      any,
      {
        articleId: string;
        articleBody: {
          title?: string;
          preview?: string;
          content?: string;
          tags?: string[];
          categoryId?: string;
          image?: string;
        };
      }
    >({
      query: ({ articleId, articleBody }) => ({
        url: `/contributor/article/update/${articleId}`,
        method: "PATCH",
        body: articleBody,
      }),
      // Invalidate posts cache when a post is updated
      invalidatesTags: ["Articles"],
    }),
  }),
});

export const {
  useGetPendingArticlesQuery,
  usePublishArticleMutation,
  useDeleteArticleMutation,
  useUpdateArticleMutation,
} = adminApi;
