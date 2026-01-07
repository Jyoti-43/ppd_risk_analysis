import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface Group {
  id: string;
  title: string;
  body: string;
  category: string;
  imageUrl?: string;
  userId?: string;
  userName?: string;
  createdAt?: string;
}

interface CreateGroupState {
  formData: {
    title: string;
    body: string;
    category: string;
    imageUrl?: string;
  };
  posts: Group[];
  userName?: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CreateGroupState = {
  formData: {
    title: "",
    body: "",
    category: "",
    imageUrl: undefined,
  },
  posts: [],
  userName: null,
  status: "idle",
  error: null,
};

export const createGroupSlice = createSlice({
  name: "createGroup",
  initialState,
  reducers: {
    // Update form fields
    setTitle: (state, action: PayloadAction<string>) => {
      state.formData.title = action.payload;
    },
    setBody: (state, action: PayloadAction<string>) => {
      state.formData.body = action.payload;
    },
   
    setCategory: (state, action: PayloadAction<string>) => {
      state.formData.category = action.payload;
    },
    
    setImageUrl: (state, action: PayloadAction<string | undefined>) => {
      state.formData.imageUrl = action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<Partial<CreateGroupState["formData"]>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    // Handle API responses
    setLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setGroupSuccess: (state, action: PayloadAction<Group[]>) => {
      state.posts = action.payload;
      state.status = "succeeded";
    },
    addGroupSuccess: (state, action: PayloadAction<Group>) => {
      state.posts.unshift(action.payload);
      state.status = "succeeded";
      state.formData = initialState.formData;
    },
    deleteGroupSuccess: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      state.status = "succeeded";
    },
    updateGroupSuccess: (state, action: PayloadAction<Group>) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      state.status = "succeeded";
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = "failed";
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Selectors
export const selectFormData = (state: RootState) => state.createPost.formData;
export const selectPosts = (state: RootState) => state.createPost.posts;
export const selectPostStatus = (state: RootState) => state.createPost.status;
export const selectPostError = (state: RootState) => state.createPost.error;

export const {
  setTitle,
  setBody,
  setCategory,
  setImageUrl,
  setLoading,
  setGroupSuccess,
  addGroupSuccess,
  deleteGroupSuccess,
  updateGroupSuccess,
  setError,
  // setErrorromStorage,
  // deletePost,
  resetForm,
  clearError,
} = createGroupSlice.actions;

export default createGroupSlice.reducer;
