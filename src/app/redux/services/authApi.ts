import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../feature/user/userSlice";
import ForgotPassword from "../../(auth)/forgotPassword/page";

export const authUserAPI = createApi({
  reducerPath: "authUser",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),

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

    loginUser: build.mutation({
      query: (body: { email: string; password: string }) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),

    // ForgotPassword: build.mutation({
    //   query: (email: string) => ({
    //     url: "/forgot-password",
    //     method: "POST",
    //     body: { email },
    //   }),
    // }),

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
  // useForgotPasswordMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = authUserAPI;
