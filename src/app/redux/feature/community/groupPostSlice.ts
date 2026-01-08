import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface CreateGroupPostPayload {
  postTitle?: string;
  postBody?: string;
  tags?: string[];
  categoryId: string; // Send just ID
  isAnonymous: boolean;
  image?: string;
  groupId: string;
}

export interface GroupPost {
  id: string; // Backend adds this
  formData: {
    postTitle?: string;
    postBody?: string;
    tags?: string[];
    category: category; // Backend returns full object
    isAnonymous: boolean;
    image?: string;
  };
  user?: User;
  groupPost: CreateGroupPostPayload[];
  createdAt?: string; // Backend adds this
  groupId: string;
}
interface category {
  id: string;
  name: string;
}
interface User {
  id: string;
  name: string;
}

const initialState: GroupPost = {
  id: "",
  formData: {
    postTitle: "",
    postBody: "",
    tags: [],
    category: { id: "", name: "" },
    isAnonymous: false,
    image: "",
  },
  groupPost: [],
  groupId: "",
};

export const createGroupPostSlice = createSlice({
  name: "createGroupPost",
  initialState,
  reducers: {
    // Update form fields
    setTitle: (state, action: PayloadAction<string>) => {
      state.formData.postTitle = action.payload;
    },
    setBody: (state, action: PayloadAction<string>) => {
      state.formData.postBody = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.formData.tags = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.formData.category.name = action.payload;
    },
    setPostType: (state, action: PayloadAction<boolean>) => {
      state.formData.isAnonymous = action.payload;
    },
    setImageUrl: (state, action: PayloadAction<string | undefined>) => {
      state.formData.image= action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<Partial<GroupPost["formData"]>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
  },
});

export const {
  setTitle,
  setBody,
  setTags,
  setCategory,
  setPostType,
  setImageUrl,
  setFormData,
} = createGroupPostSlice.actions;

export default createGroupPostSlice.reducer;
