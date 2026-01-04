import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import axios from "axios";

interface UserState {
  currentUser: {
    userId: string | null;
    // userName: string | null;
    email: string | null;
    access_token: string | null;
    refreshToken: string | null;
  };
  isLoggedIn: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  currentUser: {
    userId: null,
    // userName: null,
    email: null,
    access_token: null,
    refreshToken: null,
  },
  isLoggedIn: false,
  status: "idle",
  error: null,
};

export const userLogin = createAsyncThunk(
  "user/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        { email: credentials.email, password: credentials.password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
    //   console.log("Login successful from slice");
      console.log("response data is ", response.data);
      console.log(response.data.token);
      localStorage.setItem("userToken", response.data.access_token);
    //   localStorage.setItem("refreshToken", response.data.refreshToken);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredientials: (
      state,
      action: PayloadAction<{
        userId: string;
        // userName: string;
        email: string;
        access_token: string;
        refreshToken: string;
      }>
    ) => {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = {
          userId: action.payload.userId,
          // userName: action.payload.userName,
          email: action.payload.email,
          access_token: action.payload.access_token,
          refreshToken: action.payload.refreshToken,
        };
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.isLoggedIn = false;
      });
  },
});

export const { setCredientials } = UserSlice.actions;
export default UserSlice.reducer;
