import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import {
  HybridResultState,
  HybridAssessmentResponse,
  EPDSQuestion,
  RecommendedArticle,
} from "@/src/app/type";

const initialState: HybridResultState = {
  epdsAnswers: null,
  symptomsAnswers: null,
  status: "idle",
  error: null,
  result: null,
  recommendedArticles: [],
  recommendationsStatus: "idle",
  interpretation: null,
  crisisResources: [],
};

export const HybridResultSlice = createSlice({
  name: "hybridResult",
  initialState,
  reducers: {
    setHybridAnswers: (
      state,
      action: PayloadAction<{
        epds: EPDSQuestion;
        symptoms: Record<string, any>;
      }>,
    ) => {
      state.epdsAnswers = action.payload.epds;
      state.symptomsAnswers = action.payload.symptoms;
    },
    setHybridStatus: (
      state,
      action: PayloadAction<"idle" | "loading" | "succeeded" | "failed">,
    ) => {
      state.status = action.payload;
    },
    setHybridError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setHybridResult: (
      state,
      action: PayloadAction<HybridAssessmentResponse | null>,
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
    setHybridRecommendedArticles: (
      state,
      action: PayloadAction<RecommendedArticle[]>,
    ) => {
      state.recommendedArticles = action.payload;
    },
    setHybridRecommendationsStatus: (
      state,
      action: PayloadAction<"ok" | "unavailable">,
    ) => {
      state.recommendationsStatus = action.payload;
    },
    resetHybrid: (state) => {
      state.epdsAnswers = null;
      state.symptomsAnswers = null;
      state.status = "idle";
      state.error = null;
      state.result = null;
      state.recommendedArticles = [];
      state.recommendationsStatus = "idle";
      state.interpretation = null;
      state.crisisResources = [];
    },
  },
});

export const {
  setHybridAnswers,
  setHybridStatus,
  setHybridError,
  setHybridResult,
  setHybridRecommendedArticles,
  setHybridRecommendationsStatus,
  resetHybrid,
} = HybridResultSlice.actions;

export const selectHybridResult = (state: RootState) =>
  state.hybridResult.result;
export const selectHybridStatus = (state: RootState) =>
  state.hybridResult.status;
export const selectHybridError = (state: RootState) => state.hybridResult.error;
export const selectHybridRecommendedArticles = (state: RootState) =>
  state.hybridResult.recommendedArticles;
export const selectHybridRecommendationsStatus = (state: RootState) =>
  state.hybridResult.recommendationsStatus;
export const selectHybridInterpretation = (state: RootState) =>
  state.hybridResult.interpretation;
export const selectHybridCrisisResources = (state: RootState) =>
  state.hybridResult.crisisResources;

export default HybridResultSlice.reducer;
