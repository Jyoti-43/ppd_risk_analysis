



import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface Post {
  id: string;
  title: string;
  content: string;
  topics: string[];
  isAnonymous: boolean;
  isSensitive: boolean;
  author: string;
  userId: string;
  userEmail: string;
  createdAt: string;
}

interface CreatePostState {
  formData: {
    title: string;
    content: string;
    topics: string[];
    isAnonymous: boolean;
    isSensitive: boolean;
  };
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CreatePostState = {
  formData: {
    title: "",
    content: "",
    topics: [],
    isAnonymous: false,
    isSensitive: false,
  },
  posts: [],
  status: "idle",
  error: null,
};

const POSTS_STORAGE_KEY = "community_posts";

// Helper function to get posts from localStorage
const getPostsFromStorage = (): Post[] => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(POSTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  return [];
};

// Helper function to save posts to localStorage
const savePostsToStorage = (posts: Post[]): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch {
      console.error("Failed to save posts to localStorage");
    }
  }
};

export const createPostSlice = createSlice({
  name: "createPost",
  initialState,
  reducers: {
    // Update form fields
    setTitle: (state, action: PayloadAction<string>) => {
      state.formData.title = action.payload;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.formData.content = action.payload;
    },
    setTopics: (state, action: PayloadAction<string[]>) => {
      state.formData.topics = action.payload;
    },
    setIsAnonymous: (state, action: PayloadAction<boolean>) => {
      state.formData.isAnonymous = action.payload;
    },
    setIsSensitive: (state, action: PayloadAction<boolean>) => {
      state.formData.isSensitive = action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<Partial<CreatePostState["formData"]>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    // Create and save post
    createPost: (
      state,
      action: PayloadAction<{
        userId: string;
        userName: string;
        userEmail: string;
      }>
    ) => {
      const { userId, userName, userEmail } = action.payload;

      if (!state.formData.title.trim() || !state.formData.content.trim()) {
        state.error = "Title and content are required";
        state.status = "failed";
        return;
      }

      const newPost: Post = {
        id: Date.now().toString(),
        title: state.formData.title,
        content: state.formData.content,
        topics: state.formData.topics,
        isAnonymous: state.formData.isAnonymous,
        isSensitive: state.formData.isSensitive,
        author: state.formData.isAnonymous ? "Anonymous" : userName,
        userId,
        userEmail,
        createdAt: new Date().toISOString(),
      };

      state.posts.unshift(newPost);
      savePostsToStorage(state.posts);
      state.status = "succeeded";

      // Reset form
      state.formData = initialState.formData;
      state.error = null;
    },

    // Load posts from localStorage
    loadPostsFromStorage: (state) => {
      state.posts = getPostsFromStorage();
      state.status = "succeeded";
    },

    // Delete post
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      savePostsToStorage(state.posts);
    },

    // Reset form
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Selectors
export const selectFormData = (state: RootState) =>
  state.createPost.formData;
export const selectPosts = (state: RootState) => state.createPost.posts;
export const selectPostStatus = (state: RootState) => state.createPost.status;
export const selectPostError = (state: RootState) => state.createPost.error;

export const {
  setTitle,
  setContent,
  setTopics,
  setIsAnonymous,
  setIsSensitive,
  setFormData,
  createPost,
  loadPostsFromStorage,
  deletePost,
  resetForm,
  clearError,
} = createPostSlice.actions;

export default createPostSlice.reducer;