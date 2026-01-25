import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Category,
  User,
  CreateGroupPostPayload,
  GroupPost,
  LikeResponse,
} from "@/src/app/type";

export const groupPost = createApi({
  reducerPath: "groupPost",

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
  tagTypes: ["GroupPost", "Categories", "Comments"],

  endpoints: (build) => ({
    uploadImage: build.mutation<{ url: string } | any, FormData>({
      query: (formData) => ({
        url: "/group/upload-post-image",
        method: "POST",
        body: formData,
      }),
    }),

    createGroupPost: build.mutation<any, CreateGroupPostPayload>({
      query: (formData) => ({
        url: "/group/create-post",
        method: "POST",
        body: formData,
      }),
      // Invalidate posts cache when a new post is created
      invalidatesTags: ["GroupPost"],
    }),

    getGroupPost: build.query<GroupPost[], void>({
      query: () => ({
        url: "/group/view-post",
        method: "GET",
      }),
      // Tag this query so it can be invalidated
      providesTags: ["GroupPost"],
    }),

    groupPostLike: build.mutation<any, LikeResponse>({
      query: ({ id, hasLiked }) => ({
        url: `/group/toggle-like/${id}`,
        method: "POST",
      }),
      // Invalidate posts cache when a post is liked/unliked
      invalidatesTags: ["GroupPost"],
    }),

    postGroupComment: build.mutation<
      any,
      { postId: string; body: string; parentCommentId?: string }
    >({
      query: ({ postId, body, parentCommentId }) => ({
        url: "/group/comments",
        method: "POST",
        body: {
          postId,
          text: body,
          parentCommentId: parentCommentId || null,
        },
      }),
      invalidatesTags: ["Comments"],
    }),

     getGroupPostsComments: build.query<any, { postId: string }>({
      query: ({ postId }) => ({
        url: `/group/comments/${postId}`,
        method: "GET",
      }),
      providesTags: ["Comments"],
    }),

    groupCommentLike: build.mutation<any, { commentId: string; hasLiked: boolean }>({
      query: ({ commentId, hasLiked }) => ({
        url: `/group/comments/${commentId}/toggle-like`,
        method: "POST",
        body: { commentId, hasLiked },
      }),
      async onQueryStarted(
        { commentId, hasLiked },
        { dispatch, queryFulfilled },
      ) {
       
      },
      invalidatesTags: ["Comments"],
    }),

    deleteGroupPost: build.mutation<any, string>({
      query: (groupId) => ({
        url: `/group/delete-post/${groupId}`,
        method: "DELETE",
      }),
      // Invalidate posts cache when a post is deleted
      invalidatesTags: ["GroupPost"],
    }),

    updateGroupPost: build.mutation<
      any,
      {
        groupId: string;
        formBody: {
          title?: string;
          body?: string;
          tags?: string[];
          categoryId?: string;
          isAnonymous?: boolean;
          image?: string;
        };
      }
    >({
      query: ({ groupId, formBody }) => ({
        url: `/group/update-post/${groupId}`,
        method: "PATCH",
        body: formBody,
      }),
      // Invalidate posts cache when a post is updated
      invalidatesTags: ["GroupPost"],
    }),
  }),
});

export const {
  useGroupPostLikeMutation,
  useUploadImageMutation,
  useCreateGroupPostMutation,
  useGetGroupPostQuery,
  useDeleteGroupPostMutation,
  useUpdateGroupPostMutation,
  usePostGroupCommentMutation,
  useGetGroupPostsCommentsQuery,
  useGroupCommentLikeMutation,
} = groupPost;
