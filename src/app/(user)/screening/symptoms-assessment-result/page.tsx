"use client";

import { useEffect, useState } from "react";
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
  selectSymptomsInterpretation,
  selectSymptomsCrisisResources,
  selectSymptomsRecommendedArticles,
  selectSymptomsRecommendationsStatus,
} from "@/src/app/redux/feature/screening/symptoms/symptomsSlice";
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
  const score = useAppSelector(selectSymptomsScore);
  const answers = useAppSelector(selectSymptomsAnswers);
  const status = useAppSelector(selectSymptomsStatus);
  const resultState = useAppSelector(selectSymptomsResult);
  const currentUser = useAppSelector(selectCurrentUser);
  const apiInterpretation = useAppSelector(selectSymptomsInterpretation);
  const apiCrisisResources = useAppSelector(selectSymptomsCrisisResources);
  const recommendedArticles = useAppSelector(selectSymptomsRecommendedArticles);
  const recommendationsStatus = useAppSelector(
    selectSymptomsRecommendationsStatus,
  );

  // Persistence logic: Load from cache if Redux is empty (e.g., on refresh)
  const [cachedResult, setCachedResult] = useState<any>(null);

  useEffect(() => {
    if (!resultState && status !== "succeeded") {
      const saved = localStorage.getItem("symptoms_screening_result");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCachedResult(parsed);
          console.log("Restored symptoms results from cache");
        } catch (e) {
          console.error("Failed to parse cached Symptoms result", e);
        }
      }
    }
  }, [resultState, status]);

  // Unified data access
  const activeResult = resultState || cachedResult;
  const displayInterpretation =
    apiInterpretation || activeResult?.interpretation;
  const displayCrisisResources =
    apiCrisisResources?.length > 0
      ? apiCrisisResources
      : activeResult?.crisis_resources || [];
  const displayRecommendedArticles =
    recommendedArticles?.length > 0
      ? recommendedArticles
      : activeResult?.recommended_articles || [];
  const displayRecommendationsStatus =
    recommendationsStatus !== "idle"
      ? recommendationsStatus
      : activeResult?.recommendations_status || "idle";

  // `selectSymptomsResult` already returns the assessment object from the API
  const assessment = activeResult ?? null;
  const risk = assessment?.result?.prediction ?? "";
  const probability = assessment?.result?.risk_probability
    ? (assessment.result.risk_probability * 100).toFixed(1)
    : "0";
  const flagValue = assessment?.result?.flag === 1 ? "High" : "Low/Moderate";

  // Redirect to assessment if no data available anywhere
  useEffect(() => {
    if (!assessment && status !== "succeeded") {
      const savedResult = localStorage.getItem("symptoms_screening_result");
      if (!savedResult) {
        router.push("/screening/symptoms-assessment");
      }
    }
  }, [assessment, status, router]);

  const getRiskLevel = (flagValue: string) => {
    const level = flagValue === "High" ? "high" : "low";

    return {
      risk: level.toUpperCase(),
      message:
        displayInterpretation ||
        (level === "low"
          ? "Your responses suggest you’re coping well emotionally.\n Continue routine monitoring."
          : "We recommend connecting with a mental health specialist for further support."),
    };
  };

  const riskInfo = getRiskLevel(flagValue);

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
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
                      Keep caring for yourself, and reach out for support if
                      needed.
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
                    className={`text-sm font-medium text-left whitespace-pre-line ${
                      riskInfo.risk === "LOW"
                        ? "text-green-700"
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
              {/* Recommended Articles Section */}
              {(displayRecommendationsStatus === "ok" ||
                displayRecommendationsStatus === "succeeded") &&
                displayRecommendedArticles.length > 0 && (
                  <div className="space-y-6 pt-0 no-print">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                          Recommended Resources
                        </h2>
                        <p className="text-muted-foreground">
                          Based on your risk level, these resources may be
                          helpful
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pb-3">
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
                          <CardContent className="flex-1 pb-2">
                            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed italic">
                              {article.preview
                                ? `"${article.preview}"`
                                : `Resources and guidance regarding ${article.category.toLowerCase()} health during your postpartum journey.`}
                            </p>
                          </CardContent>
                          <CardFooter className="pt-0 pb-3 px-6">
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

            <div className="flex flex-col gap-8">
              {/* Emergency Crisis Resources Section */}
              {displayCrisisResources && displayCrisisResources.length > 0 && (
                <div className="space-y-6 pt-0 no-print">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-100 rounded-xl">
                      <span className="material-symbols-outlined text-red-600">
                        emergency
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        Support
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Near {answers?.city || "Kathmandu"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {displayCrisisResources.map((resource: any) => (
                      <Card
                        key={resource.id}
                        className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow bg-white rounded-2xl overflow-hidden shadow-sm"
                      >
                        <CardHeader className="pb-2">
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
                        <CardContent className="pb-3 text-xs">
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
