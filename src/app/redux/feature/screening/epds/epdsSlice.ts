import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import {
  EpdsResultState,
  EPDSQuestion,
  RecommendedArticle,
  SymptomsQuestion,
} from "@/src/app/type";

const initialState: EpdsResultState = {
  answers: null,
  score: null,
  recommendedArticles: [],
  recommendationsStatus: "idle",
  status: "idle",
  error: null,
};

export const EpdsResultSlice = createSlice({
  name: "epdsResult",
  initialState,
  reducers: {
    setAnswers: (state, action: PayloadAction<EPDSQuestion>) => {
      state.answers = action.payload;
    },
    setScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    setRecommendedArticles: (
      state,
      action: PayloadAction<RecommendedArticle[]>,
    ) => {
      state.recommendedArticles = action.payload;
    },
    setRecommendationsStatus: (
      state,
      action: PayloadAction<"ok" | "unavailable">,
    ) => {
      state.recommendationsStatus = action.payload;
    },
    setStatus: (
      state,
      action: PayloadAction<"idle" | "loading" | "succeeded" | "failed">,
    ) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Selectors
export const selectEpdsAnswers = (state: RootState) => state.epdsResult.answers;
export const selectEpdsScore = (state: RootState) => state.epdsResult.score;
export const selectRecommendedArticles = (state: RootState) =>
  state.epdsResult.recommendedArticles;
export const selectRecommendationsStatus = (state: RootState) =>
  state.epdsResult.recommendationsStatus;
export const selectEpdsStatus = (state: RootState) => state.epdsResult.status;
export const selectEpdsError = (state: RootState) => state.epdsResult.error;

export const {
  setAnswers,
  setScore,
  setRecommendedArticles,
  setRecommendationsStatus,
  setStatus,
  setError,
} = EpdsResultSlice.actions;

export default EpdsResultSlice.reducer;
