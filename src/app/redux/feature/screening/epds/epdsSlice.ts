import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import {
  EpdsResultState,
  EPDSQuestion,
  SymptomsQuestion,
} from "@/src/app/type";

const initialState: EpdsResultState = {
  answers: [] as unknown as EPDSQuestion,
  score: null,
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
    setStatus: (
      state,
      action: PayloadAction<"idle" | "loading" | "succeeded" | "failed">
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
export const selectEpdsStatus = (state: RootState) => state.epdsResult.status;
export const selectEpdsError = (state: RootState) => state.epdsResult.error;

export const { setAnswers, setScore, setStatus, setError } =
  EpdsResultSlice.actions;

export default EpdsResultSlice.reducer;
