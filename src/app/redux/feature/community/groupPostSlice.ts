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
  // likeCount?: number ;
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
    // likeCount?: string ;
    // hasLiked?: boolean;
  };
  likeByPostId: { [postId: string]: Like };
  like?: Like;
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
interface Like {
  id: string;
  likeCount: string;
  hasLiked: boolean;
}

const initialState: GroupPost = {
  id: "",
  formData: {
    postTitle: "",
    postBody: "",
   tags: ["general"],
    category: { id: "", name: "" },
    isAnonymous: false,
    image: "",
    //  likeCount: "",
    // hasLiked: false,
  },
  likeByPostId: {},
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
      state.formData.image = action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<Partial<GroupPost["formData"]>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setGroupPostLikes: (state, action: PayloadAction<Like>) => {
      const { id, likeCount, hasLiked } = action.payload;
      state.likeByPostId[id] = { id, likeCount, hasLiked };
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
  setGroupPostLikes,
} = createGroupPostSlice.actions;

export default createGroupPostSlice.reducer;
