import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import {
  SymptomsQuestion,
  SymptomsResultState,
  SymptomsAssessmentResponse,
} from "@/src/app/type";

const initialState: SymptomsResultState = {
  answers: null,
  score: null,
  status: "idle",
  error: null,
  interpretation: null,
  crisisResources: [],
  recommendedArticles: [],
  recommendationsStatus: "idle",
  result: null,
};

export const SymptomsResultSlice = createSlice({
  name: "symptomsResult",
  initialState,
  reducers: {
    setSymptomsAnswers: (
      state,
      action: PayloadAction<Record<string, any> | null>,
    ) => {
      state.answers = action.payload;
    },
    setSymptomsScore: (state, action: PayloadAction<number | null>) => {
      state.score = action.payload;
    },
    setSymptomsStatus: (
      state,
      action: PayloadAction<"idle" | "loading" | "succeeded" | "failed">,
    ) => {
      state.status = action.payload;
    },
    setSymptomsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSymptomsResult: (
      state,
      action: PayloadAction<SymptomsAssessmentResponse | null>,
    ) => {
      state.result = action.payload;
      if (action.payload) {
        state.interpretation = action.payload.interpretation;
        state.crisisResources = action.payload.crisis_resources || [];
        state.recommendedArticles = action.payload.recommended_articles || [];
        state.recommendationsStatus =
          action.payload.recommendations_status || "unavailable";
        state.status = "succeeded";
      }
    },
    resetSymptoms: (state) => {
      state.answers = null;
      state.score = null;
      state.status = "idle";
      state.error = null;
      state.interpretation = null;
      state.crisisResources = [];
      state.recommendedArticles = [];
      state.recommendationsStatus = "idle";
      state.result = null;
    },
  },
});

// Selectors
export const selectSymptomsAnswers = (state: RootState) =>
  state.symptomsResult.answers;
export const selectSymptomsScore = (state: RootState) =>
  state.symptomsResult.score;
export const selectSymptomsStatus = (state: RootState) =>
  state.symptomsResult.status;
export const selectSymptomsError = (state: RootState) =>
  state.symptomsResult.error;
export const selectSymptomsResult = (state: RootState) =>
  state.symptomsResult.result;
export const selectSymptomsInterpretation = (state: RootState) =>
  state.symptomsResult.interpretation;
export const selectSymptomsCrisisResources = (state: RootState) =>
  state.symptomsResult.crisisResources;
export const selectSymptomsRecommendedArticles = (state: RootState) =>
  state.symptomsResult.recommendedArticles;
export const selectSymptomsRecommendationsStatus = (state: RootState) =>
  state.symptomsResult.recommendationsStatus;

export const {
  setSymptomsAnswers,
  setSymptomsScore,
  setSymptomsStatus,
  setSymptomsError,
  setSymptomsResult,
  resetSymptoms,
} = SymptomsResultSlice.actions;

export default SymptomsResultSlice.reducer;
