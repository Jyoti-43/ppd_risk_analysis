import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { logout } from "../feature/user/userSlice";
import { communityPost } from "./communityPostApi";
import { communityGroup } from "./communityGroupApi";
import { screeningAPI } from "./screeningApi";
import { groupPost } from "./groupPostApi";
import { articleApi } from "./articleApi";
import { contributorProfileApi } from "./contributorProfileSetupApi";
import axiosInstance from "../../utils/axiosInstance";
import { AxiosError, AxiosRequestConfig } from "axios";

// Custom base query using axios instance with refresh token support
export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" },
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      body?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", body, params, headers }, api) => {
    try {
      const state = api.getState() as any;
      const token = state.user?.currentUser?.access_token;

      const result = await axiosInstance({
        url,
        method,
        data: body,
        params,
        headers: {
          ...headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      // If refresh failed in axiosInstance, it will bubble up here
      if (err.response?.status === 401) {
        api.dispatch(logout());
      }

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export interface User {
  id: string;
  name: string;
  email: string;
  is_verified?: boolean;
  status?: string;
}

export interface LoginResponse {
  access_token?: string;
  accessToken?: string;
  refresh_token?: string;
  refreshToken?: string;
  role: string;
  user: User;
  userId?: string;
  userName?: string;
  email?: string;
  message?: string;
  is_verified?: boolean;
  status?: string;
}

export const authUserAPI = createApi({
  reducerPath: "authUser",
  baseQuery: axiosBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),

  endpoints: (build) => ({
    registerUser: build.mutation({
      query: (body: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        role: string;
      }) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
    }),

    loginUser: build.mutation<
      LoginResponse,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),

    updateName: build.mutation({
      query: (body: { name: string }) => ({
        url: "/update-name",
        method: "PATCH",
        body,
      }),
    }),

    changePassword: build.mutation({
      query: (body: { oldPassword: string; newPassword: string }) => ({
        url: "/change-password",
        method: "PATCH",
        body,
      }),
    }),

    verifyPartnerOtp: build.mutation<LoginResponse, { invite_code: string }>({
      query: (body) => ({
        url: "/partner/invite/accept",
        method: "POST",
        body,
      }),
    }),

    logoutUser: build.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      // This is the "Magic" part
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // 1. Wipe all API cache (PPD scores, user info, etc.)
          dispatch(authUserAPI.util.resetApiState());
          dispatch(communityPost.util.resetApiState());
          dispatch(communityGroup.util.resetApiState());
          dispatch(screeningAPI.util.resetApiState());
          dispatch(groupPost.util.resetApiState());
          dispatch(articleApi.util.resetApiState());
          dispatch(contributorProfileApi.util.resetApiState());

          // 2. Clear your Auth Slice (the 'user' object)
          dispatch(logout());
        } catch {
          // Even if API fails, you might want to clear local state for safety
          dispatch(logout());
        }
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useUpdateNameMutation,
  useChangePasswordMutation,
  useVerifyPartnerOtpMutation,
} = authUserAPI;
