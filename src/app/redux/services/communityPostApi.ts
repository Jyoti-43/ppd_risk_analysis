import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "@/src/app/type";

export const communityPost = createApi({
  reducerPath: "communityPost",

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
      if (endpoint !== "uploadImage") {
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),

  // Cache data for 1 hour (3600 seconds) - won't refetch if data exists
  keepUnusedDataFor: 3600,

  // Tag types for cache invalidation
  tagTypes: ["Posts", "Categories"],

  endpoints: (build) => ({
    uploadImage: build.mutation<{ url: string } | any, FormData>({
      query: (formData) => ({
        url: "/community/upload-post-image",
        method: "POST",
        body: formData,
      }),
    }),

    createCategory: build.mutation<any, { name: string }>({
      query: (body) => ({
        url: "/community/create-categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    getCategory: build.query<any, void>({
      query: () => ({
        url: "/community/category",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    createPost: build.mutation<
      any,
      {
        title: string;
        body: string;
        tags: string[];
        categoryId: string;
        isAnonymous: boolean;
        image?: string;
      }
    >({
      query: (body) => ({
        url: "/community/create-post",
        method: "POST",
        body,
      }),
      // Invalidate posts cache when a new post is created
      invalidatesTags: ["Posts"],
    }),

    getPost: build.query<Post[], any>({
      query: () => ({
        url: "/community/view-post",
        method: "GET",
      }),
      // Tag this query so it can be invalidated
      providesTags: ["Posts"],
    }),

    deletePost: build.mutation<any, string>({
      query: (postId) => ({
        url: `/community/delete-post/${postId}`,
        method: "DELETE",
      }),
      // Invalidate posts cache when a post is deleted
      invalidatesTags: ["Posts"],
    }),

    updatePost: build.mutation<
      any,
      {
        postId: string;
        postBody: {
          title?: string;
          body?: string;
          tags?: string[];
          categoryId?: string;
          isAnonymous?: boolean;
          image?: string;
        };
      }
    >({
      query: ({ postId, postBody }) => ({
        url: `/community/update-post/${postId}`,
        method: "PATCH",
        body: postBody,
      }),
      // Invalidate posts cache when a post is updated
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useCreatePostMutation,
  useGetPostQuery,
  useCreateCategoryMutation,
  useGetCategoryQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
} = communityPost;
