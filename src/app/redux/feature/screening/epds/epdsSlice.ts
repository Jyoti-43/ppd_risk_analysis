import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import {
  EpdsResultState,
  EPDSQuestion,
  RecommendedArticle,
  SymptomsQuestion,
  EPDSAssessmentResponse,
} from "@/src/app/type";

const initialState: EpdsResultState = {
  answers: null,
  score: null,
  recommendedArticles: [],
  recommendationsStatus: "idle",
  status: "idle",
  error: null,
  riskLevel: null,
  interpretation: null,
  crisisResources: [],
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
    setRiskLevelBase: (state, action: PayloadAction<string | null>) => {
      state.riskLevel = action.payload;
    },
    setInterpretation: (state, action: PayloadAction<string | null>) => {
      state.interpretation = action.payload;
    },
    setCrisisResources: (state, action: PayloadAction<any[]>) => {
      state.crisisResources = action.payload;
    },
    setEpdsResult: (state, action: PayloadAction<any | null>) => {
      const data = action.payload;
      if (data) {
        state.score =
          data.result?.total_score ?? data.total_score ?? data.score ?? 0;
        state.riskLevel =
          data.result?.risk_level ??
          data.risk_level ??
          data.riskLevel ??
          data.risk_label ??
          "Low";
        state.interpretation =
          data.interpretation ?? data.result?.interpretation ?? "";
        state.recommendedArticles =
          data.recommended_articles ??
          data.recommendedArticles ??
          data.result?.recommended_articles ??
          [];
        state.recommendationsStatus =
          data.recommendations_status ??
          data.recommendationsStatus ??
          data.result?.recommendations_status ??
          "ok";
        state.answers = data.result?.answers ?? data.answers ?? null;
        state.crisisResources =
          data.crisis_resources ??
          data.crisisResources ??
          data.result?.crisis_resources ??
          [];
        state.status = "succeeded";
      }
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
export const selectEpdsRiskLevel = (state: RootState) =>
  state.epdsResult.riskLevel;
export const selectEpdsInterpretation = (state: RootState) =>
  state.epdsResult.interpretation;
export const selectEpdsCrisisResources = (state: RootState) =>
  state.epdsResult.crisisResources;

export const {
  setAnswers,
  setScore,
  setRecommendedArticles,
  setRecommendationsStatus,
  setStatus,
  setError,
  setRiskLevelBase,
  setInterpretation,
  setCrisisResources,
  setEpdsResult,
} = EpdsResultSlice.actions;

export default EpdsResultSlice.reducer;
