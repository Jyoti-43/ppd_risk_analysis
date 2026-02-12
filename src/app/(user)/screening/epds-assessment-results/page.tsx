"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiskGauge } from "@/src/app/component/screening/risk-gauge";
import { useAppSelector } from "@/src/app/Hooks/hook";
import {
  selectEpdsScore,
  selectEpdsAnswers,
  selectEpdsStatus,
  selectRecommendedArticles,
  selectRecommendationsStatus,
  selectEpdsRiskLevel,
  selectEpdsInterpretation,
  selectEpdsCrisisResources,
} from "@/src/app/redux/feature/screening/epds/epdsSlice";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";
import { Info, ExternalLink, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ResultsPage() {
  const router = useRouter();
  const score = useAppSelector(selectEpdsScore);
  const status = useAppSelector(selectEpdsStatus);
  const currentUser = useAppSelector(selectCurrentUser);
  const apiRiskLevel = useAppSelector(selectEpdsRiskLevel);
  const apiInterpretation = useAppSelector(selectEpdsInterpretation);
  const apiCrisisResources = useAppSelector(selectEpdsCrisisResources);
  const recommendedArticles = useAppSelector(selectRecommendedArticles);
  const recommendationsStatus = useAppSelector(selectRecommendationsStatus);
  const reduxAnswers = useAppSelector(selectEpdsAnswers);

  // Persistence logic: Load from cache if Redux is empty (e.g., on refresh)
  const [cachedResult, setCachedResult] = useState<any>(null);

  useEffect(() => {
    if (score === null || status !== "succeeded") {
      const saved = localStorage.getItem("screeningResult");
      if (saved) {
        try {
          setCachedResult(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse cached EPDS result", e);
        }
      }
    }
  }, [score, status]);

  // Unified data access
  const displayScore = score ?? cachedResult?.result?.total_score ?? 0;
  const displayRiskLevel = apiRiskLevel ?? cachedResult?.result?.risk_level;
  const displayInterpretation =
    apiInterpretation ?? cachedResult?.interpretation;
  const displayCrisisResources =
    apiCrisisResources?.length > 0
      ? apiCrisisResources
      : cachedResult?.crisis_resources || [];
  const displayRecommendedArticles =
    recommendedArticles?.length > 0
      ? recommendedArticles
      : cachedResult?.recommended_articles || [];
  const displayRecommendationsStatus =
    recommendationsStatus !== "idle"
      ? recommendationsStatus
      : cachedResult?.recommendations_status || "idle";

  const answers = reduxAnswers || cachedResult?.answers;
  const maxScore = 30;

  // Redirect to assessment if no data available anywhere
  useEffect(() => {
    if (score === null && status !== "succeeded") {
      const savedResult = localStorage.getItem("screeningResult");
      if (!savedResult) {
        router.push("/screening/epds-assessment");
      }
    }
  }, [score, status, router]);

  const getRiskLevel = (score: number) => {
    // If API/Cache provided a risk level, use it (normalized to lowercase)
    if (displayRiskLevel) {
      const level = displayRiskLevel.toLowerCase();
      return {
        level: level.includes("low")
          ? "low"
          : level.includes("moderate")
            ? "moderate"
            : "high",
        message:
          displayInterpretation ||
          (level.includes("low")
            ? "Your responses suggest minimal symptoms of depression."
            : level.includes("moderate")
              ? "Your responses suggest some symptoms that may benefit from monitoring."
              : "Your responses suggest symptoms that warrant professional attention."),
      };
    }

    // Fallback to local calculation
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
        <div className="max-w-7xl mx-auto space-y-8">
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
                <div>
                  <span className="text-muted-foreground block uppercase text-lg font-bold tracking-wider">
                    Screening Date
                  </span>
                  <p className="font-semibold text-foreground text-md">
                    {status === "succeeded"
                      ? new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8 gap-6">
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
                    This tool is here to help you check in on yourself, but it
                    is <strong>not a doctor's diagnosis</strong>. Please share
                    these results with your doctor, midwife, or nurse.
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                {(displayRecommendationsStatus === "ok" ||
                  displayRecommendationsStatus === "succeeded") &&
                  displayRecommendedArticles.length > 0 && (
                    <div className="space-y-6 pt-0 no-print">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            Recommended for You
                          </h2>
                          <p className="text-muted-foreground">
                            Based on your risk level, these resources may be
                            helpful
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 pb-6">
                        {displayRecommendedArticles.map((article: any) => (
                          <Card
                            key={article.article_id}
                            className="group hover:shadow-xl transition-all duration-300 border-none shadow-md overflow-hidden flex flex-col bg-white rounded-3xl"
                          >
                            {article.imageUrl && (
                              <div className="aspect-[16/9] w-full overflow-hidden">
                                <img
                                  src={article.imageUrl}
                                  alt={article.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start mb-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-primary/5 text-primary border-none rounded-lg text-[10px] font-bold uppercase tracking-wider"
                                >
                                  {article.category || "Educational"}
                                </Badge>
                                {article.risk_level && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg border-primary/20 text-primary/70"
                                  >
                                    {article.risk_level} Risk
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                {article.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 pb-4">
                              <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed italic">
                                {article.preview
                                  ? `"${article.preview}"`
                                  : `Resources and guidance regarding ${article.category.toLowerCase()} health during your postpartum journey.`}
                              </p>
                            </CardContent>
                            <CardFooter className="pt-0 pb-6 px-6">
                              <Button
                                className="w-full bg-primary/5 hover:bg-primary text-primary hover:text-white border-primary/20 hover:border-primary font-bold h-11 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                variant="outline"
                                onClick={() =>
                                  window.open(article.external_url, "_blank")
                                }
                              >
                                Read Full Article
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {/* Emergency Crisis Resources Section */}
              {displayCrisisResources && displayCrisisResources.length > 0 && (
                <div className="space-y-4 pt-0 no-print">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <span className="material-symbols-outlined text-red-600">
                        emergency
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        Immediate Support
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Help near {answers?.city || "Kathmandu"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {displayCrisisResources.map((resource: any) => (
                      <Card
                        key={resource.id}
                        className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow bg-white rounded-2xl overflow-hidden pb-2 mb-0"
                      >
                        <CardHeader className="pb-0">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base font-bold text-gray-900">
                              {resource.name}
                            </CardTitle>
                            {resource.hotline && (
                              <Badge className="bg-red-500 text-white border-none text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg ml-2">
                                Hotline
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {resource.type.replace("_", " ")} • {resource.city}
                          </p>
                        </CardHeader>
                        <CardContent className="pb-1 text-xs mb-0">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="material-symbols-outlined text-sm">
                                location_on
                              </span>
                              <span className="line-clamp-1">
                                {resource.address}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-primary font-semibold">
                                <span className="material-symbols-outlined text-sm">
                                  call
                                </span>
                                <span>{resource.phone}</span>
                              </div>
                              {resource.distance_km && (
                                <div className="flex items-center gap-1 text-muted-foreground text-xs italic">
                                  <span className="material-symbols-outlined text-xs">
                                    distance
                                  </span>
                                  <span>
                                    {resource.distance_km.toFixed(1)} km
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="link"
                      className="text-red-600 font-bold p-0 h-auto"
                      onClick={() => router.push("/crisis-resources")}
                    >
                      View All
                      <span className="material-symbols-outlined ml-1">
                        arrow_forward
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {/* Recommended Articles Section */}
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
