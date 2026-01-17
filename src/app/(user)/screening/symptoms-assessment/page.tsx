"use client";

import { useState, useEffect } from "react";
import {useRouter} from "next/navigation"
import { Button } from "@/components/ui/button";
import { useSymptomsQuestionQuery } from "@/src/app/redux/services/screeningApi";
import { ProgressBar } from "@/src/app/component/screening/progress-bar";
import { SymptomsQuestionCard } from "@/src/app/component/screening/symptoms-question-card";
import { useSymptomsAssessmentMutation } from "@/src/app/redux/services/screeningApi";
import { SymptomsQuestion, SymptomsQuestionsResponse } from "@/src/app/type";
import { screeningAPI } from "@/src/app/redux/services/screeningApi";
import { useAppDispatch } from "@/src/app/Hooks/hook";
import {
  setAnswers,
  setScore,
  setStatus,
  setError,
  setResult,
} from "@/src/app/redux/feature/screening/symptoms/symptomsSlice";

const SymptomsAssessmentPage = () => {
  // Only handle question fetching and display
  const { data: apiQuestions, isLoading: isQuestionsLoading } =
    useSymptomsQuestionQuery() as {
      data?: SymptomsQuestionsResponse;
      isLoading: boolean;
    };

  const router = useRouter();
  const [questions, setQuestions] = useState<SymptomsQuestion[]>([]);
  const QUESTIONS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setLocalAnswers] = useState<Record<string, string | number>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [
    submitSymptoms,
    { isLoading: isSubmitting, data: submitData, error: submitError },
  ] = useSymptomsAssessmentMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const cached = localStorage.getItem("symptomsQuestions");
    if (cached) {
      try {
        setQuestions(JSON.parse(cached));
      } catch {
        setQuestions([]);
      }
    }
  }, []);

  useEffect(() => {
    if (apiQuestions) {
      if (
        Array.isArray(apiQuestions.fields) &&
        apiQuestions.fields.length > 0
      ) {
        setQuestions(apiQuestions.fields);
        localStorage.setItem(
          "symptomsQuestions",
          JSON.stringify(apiQuestions.fields)
        );
        console.log(
          "Fetched and cached symptoms questions from API (fields)",
          apiQuestions.fields
        );
      } else if (Array.isArray(apiQuestions) && apiQuestions.length > 0) {
        setQuestions(apiQuestions);
        localStorage.setItem("symptomsQuestions", JSON.stringify(apiQuestions));
        console.log(
          "Fetched and cached symptoms questions from API (array)",
          apiQuestions
        );
      } else {
        setQuestions([]);
      }
    }
  }, [apiQuestions]);

  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;
  const startIdx = currentPage * QUESTIONS_PER_PAGE;
  const endIdx = startIdx + QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIdx, endIdx);

  // For navigation disabling: all questions on this page must be answered
  const isPageAnswered = currentQuestions.every((q) => {
    const key = String(q.id);
    return answers[key] !== undefined && answers[key] !== "";
  });

  // Handle answer selection
  const handleAnswer = (
    questionId: string | number,
    value: string | number
  ) => {
    const key = String(questionId);
    // if numeric-like, store as number, otherwise store as string
    if (typeof value === "number") {
      setLocalAnswers((prev) => ({ ...prev, [key]: value }));
      return;
    }
    const asNumber = Number(value);
    if (!isNaN(asNumber) && value !== "") {
      setLocalAnswers((prev) => ({ ...prev, [key]: asNumber }));
    } else {
      setLocalAnswers((prev) => ({ ...prev, [key]: String(value) }));
    }
  };

  // Navigation handlers
  const handleBack = () => {
    if (!isFirstPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  const handleNext = () => {
    if (!isLastPage) {
      setCurrentPage((prev) => prev + 1);
      return;
    }
    // If last page, submit
    const submit = async () => {
      try {
        dispatch(setStatus("loading"));
        setIsLoading(true);
        const payload = answers; // send collected answers as-is; backend should accept mapping
        const res = await submitSymptoms(payload).unwrap();
        console.log("Submitted symptoms assessment", res);
        router.push("/screening/symptoms-assessment-result");
        // store answers and result in redux
        dispatch(setAnswers(null));
        dispatch(setResult(res));
        dispatch(setStatus("succeeded"));
        setIsLoading(false);
        // handle navigation to result page or show success
      } catch (e) {
        console.error("Failed to submit symptoms assessment", e);
        setIsLoading(false);
        dispatch(
          setError(e instanceof Error ? e.message : "Submission failed")
        );
        dispatch(setStatus("failed"));
        alert("Failed to submit assessment. Please try again.");
      }
    };
    submit();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fef5f9]">
      <main className="flex-1 px-6 lg:px-10 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress Bar */}
          <div className="bg-white rounded-2xl px-6  py-4 lg:p-4 shadow-sm">
            <ProgressBar
              current={Math.min(startIdx + 1, totalQuestions)}
              total={totalQuestions}
              category="Emotional Health"
            />
          </div>

          {/* Question Cards */}
          {isQuestionsLoading && <div>Loading questions...</div>}
          {!isQuestionsLoading && currentQuestions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentQuestions.map((q) => (
                <SymptomsQuestionCard
                  key={q.id}
                  question={q}
                  onAnswer={handleAnswer}
                  currentAnswer={answers[String(q.id)]}
                />
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isFirstPage}
              className="rounded-full h-12 px-6 font-semibold disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">
                arrow_back
              </span>
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isPageAnswered || isLoading}
              className="rounded-full h-10 px-6 bg-primary hover:bg-[#b50d62] text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : isLastPage ? "Submit" : "Next"}
              <span className="material-symbols-outlined text-[20px] ml-2">
                arrow_forward
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
export default SymptomsAssessmentPage;
