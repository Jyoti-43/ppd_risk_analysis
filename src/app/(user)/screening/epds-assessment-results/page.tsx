"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiskGauge } from "@/src/app/component/screening/risk-gauge";
import { useAppSelector } from "@/src/app/Hooks/hook";
import {
  selectEpdsScore,
  selectEpdsAnswers,
  selectEpdsStatus,
} from "@/src/app//redux/feature/screening/epds/epdsSlice";

export default function ResultsPage() {
  const router = useRouter();
  const score = useAppSelector(selectEpdsScore);
  const answers = useAppSelector(selectEpdsAnswers);
  const status = useAppSelector(selectEpdsStatus);

  console.log("EPDS Answers from Redux:", answers);
  // Max score for EPDS is 30 (10 questions × 3 max points each)
  const maxScore = 30;

  // Redirect to assessment if no score available
  useEffect(() => {
    if (score === null && status !== "succeeded") {
      // Check localStorage as backup
      const savedAnswers = localStorage.getItem("screeningAnswers");
      if (!savedAnswers) {
        router.push("/screening/assessment");
      }
    }
  }, [score, status, router]);

  // Calculate score from localStorage if Redux state is empty
  const displayScore =
    score ??
    (() => {
      const savedAnswers = localStorage.getItem("screeningAnswers");
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers);
        return Object.values(parsed).reduce(
          (sum: number, val) => sum + (val as number),
          0
        );
      }
      return 0;
    })();

  const getRiskLevel = (score: number) => {
    if (score <= 9)
      return {
        level: "low",
        message: "Your responses suggest minimal symptoms of depression.",
      };
    if (score > 9 && score <= 12)
      return {
        level: "moderate",
        message:
          "Your responses suggest some symptoms that may benefit from monitoring.",
      };
    return {
      level: "high",
      message:
        "Your responses suggest symptoms that warrant professional attention.",
    };
  };

  const riskInfo = getRiskLevel(displayScore);

  return (
    <div className="min-h-screen flex flex-col bg-[#fef5f9]">
      <main className="flex-1 px-6 lg:px-10 py-6 lg:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 mx-auto">
            <h1 className="text-xl md:text-3xl font-bold text-primary">
              Thank you for completing EPDS screening.
            </h1>
            <p></p>
            <p className="text-foreground text-sm  ">
              <i>
                {" "}
                You’ve taken an important step by checking in with yourself. You
                deserve care, understanding, and support.
              </i>
            </p>
          </div>

          {/* Risk Gauge Card */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm space-y-6">
            <div className="grid grid-cols-1 items-center">
              {riskInfo.level === "low" ? (
                <p className="text-green-700 text-center pb-2 font-semibold">
                  Your responses suggest GOOD emotional well-being.
                </p>
              ) : riskInfo.level === "moderate" ? (
                <p className="text-orange-700 text-center pb-2 font-semibold">
                  You may be experiencing SOME emotional difficulties. 
                </p>
              ) : (
                <p className="text-red-700 text-center pb-2 font-semibold">
                  Your responses suggest HIGHER emotional distress.
                </p>
              )}
              <h3 className="text-base font-semibold text-foreground">
                EPDS Score
              </h3>
              <RiskGauge
                score={displayScore}
                maxScore={maxScore}
                snapTo={riskInfo.level as "high" | "low" | "moderate"}
                screening="epds"
              />
            </div>

            {/* Risk Message */}
            <div
              className={`p-4 rounded-2xl ${riskInfo.level === "low"
                  ? "bg-green-50 border border-green-200"
                  : riskInfo.level === "moderate"
                    ? "bg-orange-50 border border-orange-200"
                    : "bg-red-50 border border-red-200"
                }`}
            >
              <p
                className={`text-sm font-medium ${riskInfo.level === "low"
                    ? "text-green-700"
                    : riskInfo.level === "moderate"
                      ? "text-orange-700"
                      : "text-red-700"
                  }`}
              >
                {riskInfo.message}
              </p>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center pt-4 italic">
              This screening tool is not a diagnostic instrument. Please consult
              a healthcare professional for proper evaluation.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => router.push("/screening/epds-assessment")}
              variant="outline"
              className="rounded-full h-12 px-8 font-semibold w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">
                refresh
              </span>
              Retake EPDS Assessment
            </Button>

            <Button
              onClick={() => router.push("/community")}
              className="rounded-full h-12 px-8 bg-primary hover:bg-[#b50d62] text-white font-semibold shadow-md w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">
                groups
              </span>
              Join Community
            </Button>
          </div>

          {/* Emergency Help Footer */}
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
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
          </div>
        </div>
      </main>
    </div>
  );
}
