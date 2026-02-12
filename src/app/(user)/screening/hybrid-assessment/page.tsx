"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SCREENING_QUESTIONS as EPDS_QUESTIONS } from "@/lib/screening-data";
import { ProgressBar } from "@/src/app/component/screening/progress-bar";
import { QuestionCard } from "@/src/app/component/screening/epds-question-card";
import { SymptomsQuestionCard } from "@/src/app/component/screening/symptoms-question-card";
import {
  useSymptomsQuestionQuery,
  useHybridAssessmentMutation,
} from "@/src/app/redux/services/screeningApi";
import { SymptomsQuestion, SymptomsQuestionsResponse } from "@/src/app/type";
import { useAppDispatch } from "@/src/app/Hooks/hook";
import { toast } from "react-toastify";
import {
  setHybridStatus,
  setHybridError,
  setHybridResult,
  setHybridRecommendedArticles,
  setHybridRecommendationsStatus,
} from "@/src/app/redux/feature/screening/hybrid/hybridSlice";

const QUESTIONS_PER_PAGE_SYMPTOMS = 4;
const QUESTIONS_PER_PAGE_EPDS = 2;

export default function HybridAssessmentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // RTK Query mutation hook
  const [submitHybrid, { isLoading: isSubmitting }] =
    useHybridAssessmentMutation();

  // Symptoms questions from API
  const { data: apiQuestions, isLoading: isQuestionsLoading } =
    useSymptomsQuestionQuery() as {
      data?: SymptomsQuestionsResponse;
      isLoading: boolean;
    };

  const [questions, setQuestions] = useState<SymptomsQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0); // Steps include EPDS pages then Symptoms pages
  const [epdsAnswers, setEpdsAnswers] = useState<Record<number, number>>({});
  const [symptomsAnswers, setSymptomsAnswers] = useState<
    Record<string, string | number>
  >({});

  // Effect to load questions and progress from cache initially
  useEffect(() => {
    // 1. Load questions
    const cachedQuestions = localStorage.getItem("symptomsQuestions");
    if (cachedQuestions) {
      try {
        const parsed = JSON.parse(cachedQuestions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
          console.log("Loaded symptoms questions from cache:", parsed.length);
        }
      } catch (e) {
        console.error("Failed to parse cached symptoms questions", e);
      }
    }

    // 2. Load assessment progress
    const savedProgress = localStorage.getItem("hybrid_assessment_progress");
    if (savedProgress) {
      try {
        const { step, epds, symptoms } = JSON.parse(savedProgress);
        if (step !== undefined) setCurrentStep(step);
        if (epds) setEpdsAnswers(epds);
        if (symptoms) setSymptomsAnswers(symptoms);
        console.log("Restored hybrid assessment progress");
      } catch (e) {
        console.error("Failed to restore hybrid progress", e);
      }
    }
  }, []);

  // Save progress to local storage when state changes
  useEffect(() => {
    const progress = {
      step: currentStep,
      epds: epdsAnswers,
      symptoms: symptomsAnswers,
    };
    localStorage.setItem(
      "hybrid_assessment_progress",
      JSON.stringify(progress),
    );
  }, [currentStep, epdsAnswers, symptomsAnswers]);

  // Effect to handle API questions and update cache
  useEffect(() => {
    if (apiQuestions) {
      let fields: SymptomsQuestion[] = [];
      if (Array.isArray((apiQuestions as any).fields)) {
        fields = (apiQuestions as any).fields;
      } else if (Array.isArray(apiQuestions)) {
        fields = apiQuestions as any;
      }

      if (fields.length > 0) {
        setQuestions(fields);
        localStorage.setItem("symptomsQuestions", JSON.stringify(fields));
        console.log("Updated symptoms questions from API:", fields.length);
      }
    }
  }, [apiQuestions]);

  const totalEpds = EPDS_QUESTIONS.length;
  const epdsPages = Math.ceil(totalEpds / QUESTIONS_PER_PAGE_EPDS);
  const symptomsPages = Math.ceil(
    questions.length / QUESTIONS_PER_PAGE_SYMPTOMS,
  );
  const totalSteps = epdsPages + symptomsPages;

  const isEpdsPhase = currentStep < epdsPages;
  const currentEpdsPageIndex = isEpdsPhase ? currentStep : -1;
  const currentSymptomsPageIndex = isEpdsPhase ? -1 : currentStep - epdsPages;

  const handleEpdsAnswer = (questionId: number, answer: number) => {
    setEpdsAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSymptomsAnswer = (id: string, value: string | number) => {
    if (typeof value === "number") {
      setSymptomsAnswers((prev) => ({ ...prev, [id]: value }));
      return;
    }
    const asNumber = Number(value);
    if (!isNaN(asNumber) && value !== "") {
      setSymptomsAnswers((prev) => ({ ...prev, [id]: asNumber }));
    } else {
      setSymptomsAnswers((prev) => ({ ...prev, [id]: String(value) }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final Submit
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Format EPDS scores into a simple list of values [val1, val2, ...]
    const epdsResponses = EPDS_QUESTIONS.map((q) => epdsAnswers[q.id] ?? 0);

    const payload = {
      epds_responses: epdsResponses,
      ...symptomsAnswers,
      include_crisis_resources: true,
      city: "Kathmandu",
      lat: 27.7172,
      lng: 85.324,
      limit: 3,
    };

    console.log("Submitting Hybrid Assessment Payload:", payload);

    try {
      dispatch(setHybridStatus("loading"));
      const res = await submitHybrid(payload).unwrap();

      // The setHybridResult reducer now handles setting recommended articles, crisis resources, etc.
      dispatch(setHybridResult(res));

      console.log("Hybrid Assessment Submitted Successfully:", res);

      // Save result to localStorage for persistence on result page
      localStorage.setItem("hybrid_screening_result", JSON.stringify(res));

      // Clear progress on successful submission
      localStorage.removeItem("hybrid_assessment_progress");

      router.push("/screening/hybrid-assessment-results");
    } catch (error: any) {
      console.error("Submission failed", error);
      dispatch(setHybridStatus("failed"));

      let errorMessage = "Failed to submit assessment. Please try again.";

      if (error?.status === "PARSING_ERROR") {
        errorMessage =
          "Server error: The backend returned an invalid response. Please contact support.";
        console.error("Parsing Error Data:", error.data);
      } else if (error?.data?.detail) {
        errorMessage = error.data.detail;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      dispatch(setHybridError(errorMessage));
      toast.error(errorMessage);
    }
  };

  // Determine if "Next" should be disabled
  const isAnswered = () => {
    if (isEpdsPhase) {
      const startIdx = currentEpdsPageIndex * QUESTIONS_PER_PAGE_EPDS;
      const currentQuestions = EPDS_QUESTIONS.slice(
        startIdx,
        startIdx + QUESTIONS_PER_PAGE_EPDS,
      );
      return currentQuestions.every((q) => epdsAnswers[q.id] !== undefined);
    } else {
      const startIdx = currentSymptomsPageIndex * QUESTIONS_PER_PAGE_SYMPTOMS;
      const currentQuestions = questions.slice(
        startIdx,
        startIdx + QUESTIONS_PER_PAGE_SYMPTOMS,
      );
      return currentQuestions.every((q) => {
        const key = String(q.id);
        return (
          symptomsAnswers[key] !== undefined && symptomsAnswers[key] !== ""
        );
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fef5f9]">
      <main className="flex-1 px-6 lg:px-10 py-6 lg:py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Progress Bar */}
          <div className="bg-white rounded-2xl px-6 py-4 lg:p-4 shadow-sm">
            <ProgressBar
              current={currentStep + 1}
              total={totalSteps}
              category={
                isEpdsPhase
                  ? "Emotional Health (EPDS)"
                  : "Physical & Clinical Symptoms"
              }
            />
          </div>

          {/* Question(s) Area */}
          <div className="min-h-[400px]">
            {isEpdsPhase ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {EPDS_QUESTIONS.slice(
                  currentEpdsPageIndex * QUESTIONS_PER_PAGE_EPDS,
                  (currentEpdsPageIndex + 1) * QUESTIONS_PER_PAGE_EPDS,
                ).map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    onAnswer={handleEpdsAnswer}
                    currentAnswer={epdsAnswers[q.id]}
                  />
                ))}
              </div>
            ) : isQuestionsLoading ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground flex-col gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                Loading symptom questions...
              </div>
            ) : questions.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-destructive flex-col gap-4 bg-white rounded-2xl shadow-sm">
                <span className="material-symbols-outlined text-4xl">
                  error
                </span>
                <p className="font-semibold text-lg">
                  Failed to load symptom questions.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Try Refreshing
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions
                  .slice(
                    currentSymptomsPageIndex * QUESTIONS_PER_PAGE_SYMPTOMS,
                    (currentSymptomsPageIndex + 1) *
                      QUESTIONS_PER_PAGE_SYMPTOMS,
                  )
                  .map((q) => (
                    <SymptomsQuestionCard
                      key={q.id}
                      question={q}
                      onAnswer={(id, val) =>
                        handleSymptomsAnswer(String(q.id), val)
                      }
                      currentAnswer={symptomsAnswers[String(q.id)]}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              className="rounded-full h-12 px-6 font-semibold disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">
                arrow_back
              </span>
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isAnswered() || isSubmitting}
              className="rounded-full h-10 px-6 bg-primary hover:bg-[#b50d62] text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Submitting..."
                : currentStep === totalSteps - 1
                  ? "Submit Assessment"
                  : "Next"}
              <span className="material-symbols-outlined text-[20px] ml-2">
                arrow_forward
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
