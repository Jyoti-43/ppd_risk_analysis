import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Group {
  id: string;
  groupName: string;
  groupDescription: string;
  categoryId: string;
  categoryName: string;
  category?: {
    id?: string;
    name?: string;
    // ...other category fields...
  };
  image?: string;
  imageUrl: string;
  isOwner?: boolean;
  members?: number;
  isJoined?: boolean;
  is_joined?: boolean;
  groupId?: string | number;
  description?: string;
  createdBy?: {
    id: string | number;
    name?: string;
  };
}

export const communityGroup = createApi({
  reducerPath: "communityGroup",

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
  tagTypes: ["Group"],

  endpoints: (build) => ({
    uploadImage: build.mutation<{ url: string } | any, FormData>({
      query: (formData) => ({
        url: "/community/upload-group-image",
        method: "POST",
        body: formData,
      }),
    }),

    createGroup: build.mutation<
      any,
      {
        groupName: string;
        groupDescription: string;
        categoryId: string;
        image: string;
        isOwner: boolean;
      }
    >({
      query: (body) => ({
        url: "/create-group",
        method: "POST",
        body,
      }),
      // Invalidate posts cache when a new post is created
      invalidatesTags: ["Group"],
    }),

    joinedGroup: build.mutation<
      any,
      {
        isJoined: boolean;
        groupId: string;
      }
    >({
      query: (body) => ({
        url: `/join-group/${body.groupId}`,
        method: "POST",
        body,
      }),
      // Invalidate posts cache when a new post is created
      invalidatesTags: ["Group"],
    }),

    getMyJoinedgroup: build.query<Group[], any>({
      query: () => ({
        url: `/user/my-groups/joined`,
        method: "GET",
      }),
      // Invalidate posts cache when a new post is created
      providesTags: ["Group"],
    }),

    getGroup: build.query<Group[], any>({
      query: () => ({
        url: "/view-group",
        method: "GET",
      }),
      // Tag this query so it can be invalidated
      providesTags: ["Group"],
    }),

    deleteGroup: build.mutation<any, string>({
      query: (groupId) => ({
        url: `/delete-group/${groupId}`,
        method: "DELETE",
      }),
      // Invalidate posts cache when a post is deleted
      invalidatesTags: ["Group"],
    }),

    updateGroup: build.mutation<
      any,
      {
        GroupId: string;
        body: {
          groupName?: string;
          groupDescription?: string;
          categoryId?: string;
          image?: string;
        };
      }
    >({
      query: ({ GroupId, body }) => ({
        url: `/update-group/${GroupId}`,
        method: "PATCH",
        body,
      }),
      // Invalidate posts cache when a post is updated
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useCreateGroupMutation,
  useGetGroupQuery,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
  useJoinedGroupMutation,
  useGetMyJoinedgroupQuery,
} = communityGroup;
