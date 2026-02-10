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
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";
import { Info } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const score = useAppSelector(selectSymptomsScore);
  const answers = useAppSelector(selectSymptomsAnswers);
  const status = useAppSelector(selectSymptomsStatus);
  const resultState = useAppSelector(selectSymptomsResult);
  const currentUser = useAppSelector(selectCurrentUser);
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
      {/* Print-only Header */}
      <div className="hidden print:block text-center border-b-2 border-primary mb-8 pb-4">
        <h1 className="text-3xl font-bold text-primary">MotherCare</h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest">
          Postpartum Wellbeing Screening Report
        </p>
      </div>
      <main className="flex-1 px-6 lg:px-10 py-6 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Symptoms-Based Assessment Summary
            </h1>

            <p className="text-muted-foreground text-md max-w-xl mx-auto no-print ">
              You’ve taken an important step by checking in with yourself. You
              deserve care, understanding, and support.
            </p>
            {/* User Information specifically for PDF */}
            <div className="hidden print:block text-left border-y ml-3 border-gray-100 py-4 my-6">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block uppercase text-lg font-bold tracking-wider">
                    Patient Name
                  </span>
                  <p className="font-semibold text-foreground text-md uppercase">
                    {currentUser?.userName || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground block uppercase text-lg font-bold tracking-wider">
                    Email Address
                  </span>
                  <p className="font-semibold text-foreground text-md">
                    {currentUser?.email || "—"}
                  </p>
                </div>
              </div>
            </div>
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
            <div
              className={`flex items-center w-max mx-auto  gap-2 px-4 py-1 rounded-full border-2  font-bold text-md uppercase tracking-wider print:mt-4 ${
                riskInfo.risk === "LOW"
                  ? "text-green-700 bg-green-50 border border-green-200"
                  : "text-red-700 bg-red-50 border border-red-200"
              }`}
            >
              {riskInfo.risk} RISK
            </div>

            {/* Risk Message */}
            <div
              className={`p-5 rounded-2xl border-l-4 space-y-3 shadow-sm print:mt-10 ${
                riskInfo.risk === "LOW"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <h3
                className={`text-lg font-bold  flex items-center gap-2 ${
                  riskInfo.risk === "LOW"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                <Info size={20} />
                Suggested Next Step
              </h3>
              <p
                className={`text-sm font-medium text-left ${
                  riskInfo.risk === "LOW" ? "text-green-700" : "text-red-700"
                }`}
              >
                {riskInfo.message}
              </p>
            </div>

           
            {/* Disclaimer */}
            <div className="pt-6 border-t border-gray-100 print:mt-20">
              <p className="text-sm text-muted-foreground text-center italic">
                This tool is here to help you check in on yourself, but it is{" "}
                <strong>not a doctor's diagnosis</strong>. Please share these
                results with your doctor, midwife, or nurse.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="rounded-full h-14 px-4 font-semibold w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary/5"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">
                download
              </span>
              Download Report (PDF)
            </Button>

            <Button
              onClick={() => router.push("/screening/symptoms-assessment")}
              variant="outline"
              className="rounded-full h-12 px-4 font-semibold w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">
                refresh
              </span>
              Retake Symptoms Assessment
            </Button>

            <Button
              onClick={() => router.push("/community")}
              className="rounded-full h-12 px-4 bg-primary hover:bg-[#b50d62] text-white font-semibold shadow-md w-full sm:w-auto"
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
