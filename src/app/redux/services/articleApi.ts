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

export const articleApi = createApi({
  reducerPath: "articleApi",

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

  // Cache data for 1 hour (3600 seconds) - won't refetch if data exists
  keepUnusedDataFor: 3600,

  // Tag types for cache invalidation
  tagTypes: ["Articles", "Categories"],

  endpoints: (build) => ({
    articleUploadImage: build.mutation<{ url: string } | any, FormData>({
      query: (formData) => ({
        url: "/contributor/article/upload-image",
        method: "POST",
        body: formData,
      }),
    }),

    createArticle: build.mutation<
      any,
      {
        title: string;
        preview: string;
        content: string;
        tags: string[];
        categoryId: string;
        image?: string;
      }
    >({
      query: (body) => ({
        url: "/contributor/article/create",
        method: "POST",
        body,
      }),
      // Invalidate posts cache when a new post is created
      invalidatesTags: ["Articles"],
    }),

    // both pending and published articles
    getArticle: build.query<Article[], any>({
      query: () => ({
        url: "/contributor/article/list",
        method: "GET",
      }),
      // Tag this query so it can be invalidated
      providesTags: ["Articles"],
    }),

    // published articles
    getPublishedArticle: build.query<Article[], any>({
      query: () => ({
        url: "/article/published",
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

    getPubMedArticles: build.query<{ articles: any[] }, string>({
      query: (query) => ({
        url: `${window.location.origin}/pubmed/search?query=${encodeURIComponent(query)}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useArticleUploadImageMutation,
  useCreateArticleMutation,
  useGetPublishedArticleQuery,
  useDeleteArticleMutation,
  useUpdateArticleMutation,
  useGetArticleQuery,
  useGetPubMedArticlesQuery,
} = articleApi;
