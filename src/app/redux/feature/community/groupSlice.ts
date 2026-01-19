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
  currentGroupId?: string | null;
  groups: Group[];
  userName?: string | null;
  joinedGroupIds: string[];
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
  groups: [],
  joinedGroupIds:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("joinedGroupIds") || "[]")
      : [],
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
      action: PayloadAction<Partial<CreateGroupState["formData"]>>,
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    setCurrentGroupId: (state, action: PayloadAction<string | null>) => {
      state.currentGroupId = action.payload;
    },
    // Handle API responses
    setLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setGroupSuccess: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
      state.status = "succeeded";
    },
    addGroupSuccess: (state, action: PayloadAction<Group>) => {
      state.groups.unshift(action.payload);
      state.status = "succeeded";
      state.formData = initialState.formData;
    },
    deleteGroupSuccess: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter(
        (group) => group.id !== action.payload,
      );
      state.status = "succeeded";
    },
    updateGroupSuccess: (state, action: PayloadAction<Group>) => {
      const index = state.groups.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = action.payload;
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
export const selectFormData = (state: RootState) => state.createGroup.formData;
export const selectGroups = (state: RootState) => state.createGroup.groups;
export const selectGroupStatus = (state: RootState) => state.createGroup.status;
export const selectGroupError = (state: RootState) => state.createGroup.error;

export const {
  setTitle,
  setBody,
  setCategory,
  setImageUrl,
  setCurrentGroupId,
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
