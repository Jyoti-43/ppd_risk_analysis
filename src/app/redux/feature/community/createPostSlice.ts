import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface Post {
  id: string;
  title: string;
  body: string;
  tags: string[];
  category: string;
  postType: boolean;
  imageUrl?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  createdAt?: string;
}

interface CreatePostState {
  formData: {
    title: string;
    body: string;
    tags: string[];
    category: string;
    postType: boolean;
    imageUrl?: string;
  };
  posts: Post[];
  userName?: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CreatePostState = {
  formData: {
    title: "",
    body: "",
    tags: ["general"],
    category: "",
    postType: false,
    imageUrl: undefined,
  },
  posts: [],
  userName: null,
  status: "idle",
  error: null,
};



// Helper function to get posts from localStorage
// const getPostsFromStorage = (): Post[] => {
//   if (typeof window !== "undefined") {
//     try {
//       const stored = localStorage.getItem(POSTS_STORAGE_KEY);
//       return stored ? JSON.parse(stored) : [];
//     } catch {
//       return [];
//     }
//   }
//   return [];
// };

// // Helper function to save posts to localStorage
// const savePostsToStorage = (posts: Post[]): void => {
//   if (typeof window !== "undefined") {
//     try {
//       localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
//     } catch {
//       console.error("Failed to save posts to localStorage");
//     }
//   }
// };

export const createPostSlice = createSlice({
  name: "createPost",
  initialState,
  reducers: {
    // Update form fields
    setTitle: (state, action: PayloadAction<string>) => {
      state.formData.title = action.payload;
    },
    setBody: (state, action: PayloadAction<string>) => {
      state.formData.body = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.formData.tags = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.formData.category = action.payload;
    },
    setPostType: (state, action: PayloadAction<boolean>) => {
      state.formData.postType = action.payload;
    },
    setImageUrl: (state, action: PayloadAction<string | undefined>) => {
      state.formData.imageUrl = action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<Partial<CreatePostState["formData"]>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    // Handle API responses
    setLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setPostsSuccess: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.status = "succeeded";
    },
    addPostSuccess: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
      state.status = "succeeded";
      state.formData = initialState.formData;
    },
    deletePostSuccess: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      state.status = "succeeded";
    },
    updatePostSuccess: (state, action: PayloadAction<Post>) => {
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
  setTags,
  setCategory,
  setPostType,
  setImageUrl,
  setFormData,
  setLoading,
  setPostsSuccess,
  addPostSuccess,
  deletePostSuccess,
  updatePostSuccess,
  setError,
  // setErrorromStorage,
  // deletePost,
  resetForm,
  clearError,
} = createPostSlice.actions;

export default createPostSlice.reducer;
