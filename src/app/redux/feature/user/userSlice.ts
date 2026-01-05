import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import axios from "axios";

interface UserState {
  currentUser: {
    userId: string | null;
    userName: string | null;
    email: string | null;
    access_token: string | null;
    refreshToken: string | null;
  };
  isLoggedIn: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Helper function to get user from localStorage
const getUserFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  return null;
};

const storedUser = getUserFromStorage();

const initialState: UserState = {
  currentUser: {
    userId: storedUser?.userId || null,
    userName: storedUser?.userName || null,
    email: storedUser?.email || null,
    access_token: storedUser?.access_token || null,
    refreshToken: storedUser?.refreshToken || null,
  },
  isLoggedIn: !!storedUser?.access_token,
  status: "idle",
  error: null,
};

// export const userLogin = createAsyncThunk(
//   "user/login",
//   async (
//     credentials: { email: string; password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/login`,
//         { email: credentials.email, password: credentials.password },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );
//       //   console.log("Login successful from slice");
//       console.log("response data is ", response.data);
//       console.log(response.data.token);
//       localStorage.setItem("userToken", response.data.access_token);
//       //   localStorage.setItem("refreshToken", response.data.refreshToken);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );

export const UserSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    setCredientials: (
      state,
      action: PayloadAction<{
        userId: string;
        userName?: string; // Optional since API might not return it
        email: string;
        access_token: string;
        refreshToken: string;
      }>
    ) => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: action.payload.email,
          access_token: action.payload.access_token,
          refreshToken: action.payload.refreshToken,
          userId: action.payload.userId,
          // ...(action.payload.userName && { userName: action.payload.userName }), // Only save if provided
        })
      );
      state.currentUser = {
        ...action.payload,
        userName: action.payload.userName || null, // Default to null if not provided
      };
      state.isLoggedIn = true;
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.currentUser = {
        userId: null,
        userName: null,
        email: null,
        access_token: null,
        refreshToken: null,
      };
      state.isLoggedIn = false;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(userLogin.pending, (state) => {
  //       state.status = "loading";
  //       state.error = null;
  //     })
  //     .addCase(userLogin.fulfilled, (state, action) => {
  //       state.status = "succeeded";
  //       state.currentUser = {
  //         userId: action.payload.userId,
  //         // userName: action.payload.userName,
  //         email: action.payload.email,
  //         access_token: action.payload.access_token,
  //         refreshToken: action.payload.refreshToken,
  //       };
  //       state.isLoggedIn = true;
  //       state.error = null;
  //     })
  //     .addCase(userLogin.rejected, (state, action) => {
  //       state.status = "failed";
  //       state.error = action.payload as string;
  //       state.isLoggedIn = false;
  //     });
  // },
});

export const selectAuth = (state: RootState) => state.user;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectCurrentUser = (state: RootState) => state.user.currentUser;

export const { setCredientials, logout } = UserSlice.actions;

export default UserSlice.reducer;