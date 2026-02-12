"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SCREENING_QUESTIONS as EPDS_QUESTIONS } from "@/lib/screening-data";
import Link from "next/link";

import {
  setStatus,
  setError,
  setEpdsResult,
} from "@/src/app/redux/feature/screening/epds/epdsSlice";
import { useEpdsScreeningMutation } from "@/src/app/redux/services/screeningApi";
import { EPDSQuestion } from "@/src/app/type";
import { useAppDispatch } from "@/src/app/Hooks/hook";
import { Progress } from "@/components/ui/progress";
import { Stepper } from "@/components/ui/stepper";
import { ProgressBar } from "@/src/app/component/screening/progress-bar";
import { QuestionCard } from "@/src/app/component/screening/epds-question-card";
import { toast } from "react-toastify";

export default function AssessmentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setLocalAnswers] = useState<Record<number, number>>({});

  // Load saved answers on mount
  useEffect(() => {
    const saved = localStorage.getItem("epds_progress_answers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocalAnswers(parsed);
      } catch (e) {
        console.error("Failed to load EPDS progress", e);
      }
    }
  }, []);

  const setCurrentStep = (currentQuestionIndex: number) => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };
  // RTK Query mutation hook
  const [submitScreening, { isLoading, isSuccess, isError, error }] =
    useEpdsScreeningMutation();

  const currentQuestion = EPDS_QUESTIONS[currentQuestionIndex];
  const totalQuestions = EPDS_QUESTIONS.length;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isAnswered = answers[currentQuestion.id] !== undefined;

  const handleAnswer = (questionId: number, answer: number) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setLocalAnswers(newAnswers);
    localStorage.setItem("epds_progress_answers", JSON.stringify(newAnswers));
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      // Get location from localStorage if it exists
      let locationData = { lat: 0, lng: 0, city: "Kathmandu" };
      try {
        const savedLocation = localStorage.getItem("userLocation");
        if (savedLocation) {
          const parsed = JSON.parse(savedLocation);
          if (parsed.lat && parsed.lng) {
            locationData = {
              lat: parsed.lat,
              lng: parsed.lng,
              city: parsed.city || "Kathmandu",
            };
          }
        }
      } catch (e) {
        console.warn("Failed to retrieve location from storage", e);
      }

      // Transform answers to the format expected by API (q1, q2, q3, etc.)
      const payload: EPDSQuestion = {
        q1: answers[1] ?? 0,
        q2: answers[2] ?? 0,
        q3: answers[3] ?? 0,
        q4: answers[4] ?? 0,
        q5: answers[5] ?? 0,
        q6: answers[6] ?? 0,
        q7: answers[7] ?? 0,
        q8: answers[8] ?? 0,
        q9: answers[9] ?? 0,
        q10: answers[10] ?? 0,
        include_crisis_resources: true,
        // city: locationData.city,
        // lat: locationData.lat,
        // lng: locationData.lng,
        city: "Kathmandu",
        lat: 27.7172,
        lng: 85.324,
        limit: 3,
      };

      try {
        dispatch(setStatus("loading"));

        // Save to localStorage BEFORE attempt to prevent data loss on crash
        localStorage.setItem("screeningAnswers", JSON.stringify(answers));

        // Call the API mutation
        const response = await submitScreening(payload).unwrap();

        // Use the new single action to set all result data
        dispatch(
          setEpdsResult({
            score: response.result.total_score,
            riskLevel: response.result.risk_level,
            interpretation: response.interpretation,
            recommendedArticles: response.recommended_articles,
            recommendationsStatus: response.recommendations_status,
            answers: payload,
            crisisResources: response.crisis_resources,
          }),
        );

        console.log("Screening submitted successfully:", response);
        localStorage.setItem("screeningResult", JSON.stringify(response));
        // Clear assessment progress on success
        localStorage.removeItem("epds_progress_answers");
        // Navigate to results page
        router.push("/screening/epds-assessment-results");
      } catch (err: any) {
        dispatch(setStatus("failed"));
        const errorMsg =
          err?.data?.detail || err?.message || "Submission failed";
        dispatch(setError(errorMsg));

        // Detailed logging for debugging 503 errors
        console.error("Screening submission error details:", {
          status: err?.status,
          detail: err?.data?.detail,
          fullError: err,
        });

        toast.error(`Submission failed: ${errorMsg}`);
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fef5f9]">
      <main className="flex-1 px-6 lg:px-10 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress Bar */}
          <div className="bg-white rounded-2xl px-6  py-4 lg:p-4 shadow-sm">
            {/* <Stepper
              steps={10}
              currentStep={currentQuestionIndex + 1}
              onStepClick={setCurrentStep}
              // label={"Quest"}
            /> */}

            <ProgressBar
              current={currentQuestionIndex + 1}
              total={totalQuestions}
              category="Emotional Health"
            />
          </div>

          {/* Question Card */}
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentQuestion.id]}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isFirstQuestion}
              className="rounded-full h-12 px-6 font-semibold disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">
                arrow_back
              </span>
              Back
            </Button>
            <div className="text-center">
              step {currentQuestionIndex + 1} of {totalQuestions}
            </div>

            <Button
              onClick={handleNext}
              disabled={!isAnswered || isLoading}
              className="rounded-full h-10 px-6 bg-primary hover:bg-[#b50d62] text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Submitting..."
                : isLastQuestion
                  ? "Submit"
                  : "Next Question"}
              <span className="material-symbols-outlined text-[20px] ml-2">
                arrow_forward
              </span>
            </Button>
          </div>

          {/* Emergency Help Footer */}
          {/* <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            <span className="material-symbols-outlined text-red-500 text-[20px]">
              emergency
            </span>
            <span>Need immediate help?</span>
            <Link
              href="/crisis-resources"
              className="font-semibold text-red-600 underline hover:text-red-700"
            >
              View Crisis Resources
            </Link>
          </div> */}
        </div>
      </main>
    </div>
  );
}
