import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import {
  SymptomsQuestion,
  SymptomsResultState,
  SymptomsAssessmentResponse,
} from "@/src/app/type";

const initialState: SymptomsResultState & { result?: SymptomsAssessmentResponse | null } = {
  answers: null,
  score: null,
  status: "idle",
  error: null,
  result: null,
};

export const SymptomsResultSlice = createSlice({
  name: "symptomsResult",
  initialState,
  reducers: {
    setAnswers: (state, action: PayloadAction<SymptomsQuestion | null>) => {
      state.answers = action.payload;
    },
    setScore: (state, action: PayloadAction<number | null>) => {
      state.score = action.payload;
    },
    setStatus: (
      state,
      action: PayloadAction<"idle" | "loading" | "succeeded" | "failed">
    ) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setResult: (
      state,
      action: PayloadAction<SymptomsAssessmentResponse | undefined | null>
    ) => {
      state.result = action.payload ?? null;
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

export const { setAnswers, setScore, setStatus, setError, setResult } =
  SymptomsResultSlice.actions;

export default SymptomsResultSlice.reducer;
