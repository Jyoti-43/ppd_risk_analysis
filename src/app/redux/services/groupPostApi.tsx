import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface CreateGroupPostPayload {
  postTitle: string;
  postBody: string;
  tags: string[];
  categoryId: string; // Send just ID
  isAnonymous: boolean;
  image?: string;
  groupId: string;
}

interface GroupPost {
  id: string; // Backend adds this
  postTitle: string;
  postBody: string;
  tags: string[];
  category: Category; // Backend returns full object
  isAnonymous: boolean;
  image?: string;
  user: User; // Backend adds this
  postedTime: string; // Backend adds this
  groupId: string;
  // hasLiked: boolean;
  // likeCount?: string;
  commentsCount: number;
  like: LikeResponse;
}

// For like API request
interface LikeRequest {
  
  postId: string;
  hasLike: boolean;
}

// For like API response (if different from your main Like)
interface LikeResponse {
  id: string;
  likeCount: string;
  hasLiked: boolean;
}
interface Category {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

// interface GroupPostResponse {
//   posts: GroupPost[];
//   totalCount: number;
// }

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

  // Cache data for 5 minutes (300 seconds) - won't refetch if data exists
  keepUnusedDataFor: 300,

  // Tag types for cache invalidation
  tagTypes: ["Posts", "Categories"],

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
      invalidatesTags: ["Posts"],
    }),

    getGroupPost: build.query<GroupPost[], void>({
      query: () => ({
        url: "/group/view-post",
        method: "GET",
      }),
      // Tag this query so it can be invalidated
      providesTags: ["Posts"],
    }),

    groupPostLike: build.mutation<any, LikeResponse>({
      query: ({ id, hasLiked }) => ({
        url: `/group/toggle-like/${id}`,
        method: hasLiked ? "POST" : "DELETE",
      }),
      // Invalidate posts cache when a post is liked/unliked
      invalidatesTags: ["Posts"],
    }),

    deleteGroupPost: build.mutation<any, string>({
      query: (groupId) => ({
        url: `/community/delete-post/${groupId}`,
        method: "DELETE",
      }),
      // Invalidate posts cache when a post is deleted
      invalidatesTags: ["Posts"],
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
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useCreateGroupPostMutation,
  useGetGroupPostQuery,
  useDeleteGroupPostMutation,
  useUpdateGroupPostMutation,
} = groupPost;
