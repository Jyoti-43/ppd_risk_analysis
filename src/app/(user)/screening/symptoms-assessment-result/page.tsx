"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiskGauge } from "@/src/app/component/screening/risk-gauge";
import { useAppSelector } from "@/src/app/Hooks/hook";

import {
  selectSymptomsScore,
  selectSymptomsAnswers,
  selectSymptomsStatus,
  selectSymptomsResult,
} from "@/src/app/redux/feature/screening/symptoms/symptomsSlice";

export default function ResultsPage() {
  const router = useRouter();
  const score = useAppSelector(selectSymptomsScore);
  const answers = useAppSelector(selectSymptomsAnswers);
  const status = useAppSelector(selectSymptomsStatus);
  const resultState = useAppSelector(selectSymptomsResult);

  // `selectSymptomsResult` already returns the assessment object from the API
  const assessment = resultState ?? null;
  const risk = assessment?.result?.prediction ?? "";
  const probability = assessment?.result?.risk_probability
    ? (assessment.result.risk_probability * 100).toFixed(1)
    : "N/A";
  const flagValue = assessment?.result?.flag === 1 ? "High" : "Low/Moderate";

  // Redirect to assessment if no score available
  useEffect(() => {
    if (!assessment && status !== "succeeded") {
      // Check localStorage as backup
      const savedAnswers = localStorage.getItem("symptomsAnswers");
      if (!savedAnswers) {
        router.push("/screening/symptoms-assessment");
      }
    }
  }, [assessment, status, router]);

  const getRiskLevel = (flagValue: string) => {
    if (flagValue === "Low/Moderate")
      return {
        risk: "LOW",

        message:
          "Your responses suggest you’re coping well emotionally.\n Continue routine monitoring.",
      };
    if (flagValue === "High")
      return {
        risk: "HIGH",
        message:
          "We recommend connecting with a mental health specialist for further support.",
      };
  };

  const riskInfo = getRiskLevel(flagValue) ?? { risk: "LOW", message: "" };

  return (
    <div className="min-h-screen flex flex-col bg-[#fef5f9]">
      <main className="flex-1 px-6 lg:px-10 py-6 lg:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 mx-auto">
            <h1 className="text-xl md:text-3xl font-bold text-primary">
              Thank you for completing Symptoms screening.
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
          <div className="bg-white rounded-3xl p-8 pt-4 md:p-10 shadow-sm space-y-6">
            {/* <RiskGauge /> */}
            <div className="grid grid-cols-1 items-center">
              {flagValue === "High" ? (
                <p className="text-red-700 text-center pb-2 font-semibold">
                  Your responses suggest higher emotional strain. <br />
                  Support may help you feel better.{" "}
                </p>
              ) : (
                <p className="text-green-700 text-center pb-2 font-semibold">
                  You’re doing well overall. <br />
                  Keep caring for yourself, and reach out for support if needed.
                </p>
              )}
              <h3 className="text-base font-semibold text-foreground">
                Symptoms Prediction
              </h3>
              <RiskGauge
                score={probability}
                maxScore={100}
                snapTo={flagValue === "Low/Moderate" ? "low" : "high"}
                screening="symptoms"
              />
            </div>

            {/* Risk Message */}
            <div
              className={`p-4 rounded-2xl ${
                riskInfo.risk === "LOW"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`text-sm font-medium text-center ${
                  riskInfo.risk === "LOW" ? "text-green-700" : "text-red-700"
                }`}
              >
                `${riskInfo.message}
              </p>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center pt-5">
              This screening tool is not a diagnostic instrument. Please consult
              a healthcare professional for proper evaluation.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => router.push("/screening/symptoms-assessment")}
              variant="outline"
              className="rounded-full h-12 px-8 font-semibold w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">
                refresh
              </span>
              Retake Symptoms Assessment
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
