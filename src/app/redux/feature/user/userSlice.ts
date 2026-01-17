import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
interface UserState {
  currentUser: {
    userId: string | null;
    userName: string | null;
    email: string | null;
    access_token: string | null;
    refreshToken: string | null;
    role: string | null;
  };
  isLoggedIn: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  forgotPassword: {
    loading: boolean;
    success: boolean;
    error: string | null;
  };
  resetPassword: {
    loading: boolean;
    success: boolean;
    error: string | null;
  };
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
    role: storedUser?.role || null,
  },
  isLoggedIn: !!storedUser?.access_token,
  status: "idle",
  error: null,
  forgotPassword: {
    loading: false,
    success: false,
    error: null,
  },
  resetPassword: {
    loading: false,
    success: false,
    error: null,
  },
};
// Async thunk for forgot password (calls FastAPI endpoint)
export const forgotPassword = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("/forgot-password", async (email, { rejectWithValue }) => {
  try {
    await axios.post(`${baseUrl}/forgot-password`, {
      email,
    });
    return;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.detail ||
      err.message ||
      "Failed to send reset Password"
    );
  }
});

// Async thunk for reset password (calls FastAPI endpoint)
export const resetPassword = createAsyncThunk<
  void,
  { newPassword: string; token: string },
  { rejectValue: string }
>("/reset-password", async ({ newPassword, token }, { rejectWithValue }) => {
  try {
    await axios.post(`${baseUrl}/reset-password`, {
      token,
      newPassword,
    });
    return;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.detail ||
      err.message ||
      "Failed to send reset Password"
    );
  }
});

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
        role: string;
      }>
    ) => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: action.payload.email,
          access_token: action.payload.access_token,
          refreshToken: action.payload.refreshToken,
          userId: action.payload.userId,
          role: action.payload.role,
          ...(action.payload.userName && { userName: action.payload.userName }),
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
        role: null,
      };
      state.isLoggedIn = false;
    },

    // Reset forgot password state
    forgot_Password: (state) => {
      state.forgotPassword = { loading: false, success: false, error: null };
    },
    // Reset reset password state
    reset_Password: (state) => {
      state.resetPassword = { loading: false, success: false, error: null };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPassword.loading = true;
        state.forgotPassword.success = false;
        state.forgotPassword.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.success = true;
        state.forgotPassword.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.success = false;
        state.forgotPassword.error =
          action.payload || "Failed to send reset Password";
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword.loading = true;
        state.resetPassword.success = false;
        state.resetPassword.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPassword.loading = false;
        state.resetPassword.success = true;
        state.resetPassword.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.success = false;
        state.resetPassword.error =
          action.payload || "Failed to send reset Password";
      });
  },
});

export const selectAuth = (state: RootState) => state.user;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectCurrentUser = (state: RootState) => state.user.currentUser;

export const { setCredientials, logout, forgot_Password, reset_Password } =
  UserSlice.actions;

export default UserSlice.reducer;
