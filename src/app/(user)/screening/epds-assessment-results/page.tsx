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
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";
import { Info } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const score = useAppSelector(selectEpdsScore);
  const answers = useAppSelector(selectEpdsAnswers);
  const status = useAppSelector(selectEpdsStatus);
  const currentUser = useAppSelector(selectCurrentUser);

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
          0,
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
              EPDS Assessment Summary
            </h1>
            <p></p>
            <p className="text-muted-foreground text-md max-w-xl mx-auto no-print ">
              {" "}
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
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm space-y-6">
            <div className="grid grid-cols-1 items-center ">
              {riskInfo.level === "low" ? (
                <p className="text-green-700 pb-2 text-sm md:text-lg font-medium leading-relaxed italic text-center">
                  " Your responses suggest GOOD emotional well-being."
                </p>
              ) : riskInfo.level === "moderate" ? (
                <p className="text-orange-700 pb-2 text-sm md:text-lg font-medium leading-relaxed italic text-center">
                  " You may be experiencing SOME emotional difficulties."
                </p>
              ) : (
                <p className="text-red-700 pb-2 text-sm md:text-lg font-medium leading-relaxed italic text-center">
                  "Your responses suggest HIGHER emotional distress."
                </p>
              )}
              <h3 className="text-base font-semibold text-foreground pt-2">
                EPDS Score
              </h3>
              <RiskGauge
                score={displayScore}
                maxScore={maxScore}
                snapTo={riskInfo.level as "high" | "low" | "moderate"}
                screening="epds"
              />
            </div>
            <div
              className={`flex items-center w-max mx-auto gap-2 px-4 py-1 rounded-full border-2  font-bold text-md uppercase tracking-wider print:mt-4 ${
                riskInfo.level === "low"
                  ? "text-green-700 bg-green-50 border border-green-200"
                  : riskInfo.level === "moderate"
                  ? "text-orange-700 bg-orange-50 border border-orange-200 "
                  : "text-red-700 bg-red-50 border border-red-200"
              }`}
            >
              {riskInfo.level} RISK
            </div>

            {/* Risk Message */}
            <div
              className={`p-5 rounded-2xl border-l-4 space-y-3 shadow-sm print:mt-10 ${
                riskInfo.level === "low"
                  ? "bg-green-50 border border-green-200"
                  : riskInfo.level === "moderate"
                  ? "bg-orange-50 border border-orange-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <h3
                className={`text-lg font-bold  flex items-center gap-2 ${
                  riskInfo.level === "low"
                    ? "text-green-700"
                    : riskInfo.level === "moderate"
                    ? "text-orange-700"
                    : "text-red-700"
                }`}
              >
                <Info size={20} />
                Suggested Next Step
              </h3>
              <p
                className={`text-sm font-medium ${
                  riskInfo.level === "low"
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
            <div className="pt-6 border-t border-gray-100 print:mt-20">
              <p className="text-sm text-muted-foreground text-center italic">
                This tool is here to help you check in on yourself, but it is{" "}
                <strong>not a doctor's diagnosis</strong>. Please share these
                results with your doctor, midwife, or nurse.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-evenly gap-8">
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
              onClick={() => router.push("/screening/epds-assessment")}
              variant="outline"
              className="rounded-full h-12 px-4 font-semibold w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">
                refresh
              </span>
              Retake EPDS Assessment
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
          <div className="flex print:hidden items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
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

      <style jsx global>{`
        @media print {
          @page {
            margin: 1.5cm;
          }

          /* Force page break before Understanding section */
          .print\\:break-before-page {
            break-before: page !important;
            page-break-before: always !important;
          }

          /* Hide non-report elements */
          .no-print,
          nav,
          footer,
          header,
          button,
          .action-buttons {
            display: none !important;
          }

          /* Force background colors in PDF */
          body,
          .min-h-screen {
            background-color: white !important;
            background-image: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .bg-[#fef5f9],
          .bg-violet-50/50,
          .bg-rose-50/50,
          .bg-blue-50/50,
          .bg-emerald-50/50 {
            background-color: white !important;
            border: 1px solid #e5e7eb !important;
          }

          .bg-white {
            background-color: white !important;
            border: 1px solid #f0f0f0 !important;
            box-shadow: none !important;
          }

          /* Ensure grid layout works in print */
          .grid {
            display: grid !important;
            grid-template-cols: repeat(2, 1fr) !important;
          }

          /* Page break handling */
          .break-inside-avoid {
            break-inside: avoid;
          }

          main {
            padding: 0 !important;
            margin: 0 !important;
          }

          .max-w-4xl {
            max-width: 100% !important;
          }
        }

        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
