import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { CreatePostState, Post, Like } from "@/src/app/type";

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
  likeByPostId: {},
};

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
      action: PayloadAction<Partial<CreatePostState["formData"]>>,
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setCurrentPostId: (state, action: PayloadAction<string | null>) => {
      state.currentPostId = action.payload;
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
    setPostLikes: (state, action: PayloadAction<Like>) => {
      const { id, likeCount, hasLiked } = action.payload;
      if (!state.likeByPostId) state.likeByPostId = {};
      state.likeByPostId[id] = { id, likeCount, hasLiked };
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
  // setPostsSuccess,
  // addPostSuccess,
  // deletePostSuccess,
  // updatePostSuccess,
  // setError,
  // setErrorromStorage,
  // deletePost,
  resetForm,
  setPostLikes,
  clearError,
} = createPostSlice.actions;

export default createPostSlice.reducer;
