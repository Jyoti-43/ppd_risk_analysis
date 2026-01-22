import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import {
  HybridResultState,
  HybridAssessmentResponse,
  EPDSQuestion,
} from "@/src/app/type";

const initialState: HybridResultState = {
  epdsAnswers: null,
  symptomsAnswers: null,
  status: "idle",
  error: null,
  result: null,
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
    },
  },
});

export const {
  setHybridAnswers,
  setHybridStatus,
  setHybridError,
  setHybridResult,
} = HybridResultSlice.actions;

export const selectHybridResult = (state: RootState) =>
  state.hybridResult.result;
export const selectHybridStatus = (state: RootState) =>
  state.hybridResult.status;
export const selectHybridError = (state: RootState) => state.hybridResult.error;

export default HybridResultSlice.reducer;
