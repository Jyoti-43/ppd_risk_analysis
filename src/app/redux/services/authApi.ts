import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


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
  }),
});


export const { useRegisterUserMutation, useLoginUserMutation } = authUserAPI;
