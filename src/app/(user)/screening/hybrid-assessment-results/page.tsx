"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/src/app/Hooks/hook";
import {
  selectHybridResult,
  selectHybridStatus,
  selectHybridRecommendedArticles,
  selectHybridRecommendationsStatus,
} from "@/src/app/redux/feature/screening/hybrid/hybridSlice";
import { RootState } from "@/src/app/redux/store";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";
import { RiskGauge } from "@/src/app/component/screening/risk-gauge";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  PhoneCall,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HybridResultsPage() {
  const router = useRouter();
  const result = useAppSelector(selectHybridResult);
  const status = useAppSelector(selectHybridStatus);
  const currentUser = useAppSelector(selectCurrentUser);
  const recommendedArticles = useAppSelector(selectHybridRecommendedArticles);
  const recommendationsStatus = useAppSelector(
    selectHybridRecommendationsStatus,
  );
  const symptomsAnswers = useAppSelector(
    (state: RootState) => state.hybridResult.symptomsAnswers,
  );

  useEffect(() => {
    if (!result && status !== "loading") {
      router.push("/screening/select-screening-method");
    }
  }, [result, status, router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fef5f9]">
        <div className="animate-pulse text-primary font-semibold">
          Loading results...
        </div>
      </div>
    );
  }

  const {
    risk_label,
    clinical_recommendation,
    explanation,
    is_critical,
    final_probability,
    metrics,
    audit,
  } = result;

  const getRiskStyles = (label: string) => {
    const lowerLabel = label.toLowerCase();
    switch (lowerLabel) {
      case "critical":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: <AlertCircle className="text-red-600 size-6" />,
          gaugeSnap: "high" as const,
          caringMessage:
            "You’re not alone and help is available. Please reach out for you and your baby.",
        };
      case "high":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: <AlertCircle className="text-red-600 size-6" />,
          gaugeSnap: "high" as const,
          caringMessage:
            "You’re going through a tough time. Your feelings matter, and seeking support is a strong first step.",
        };
      case "moderate":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-700",
          icon: <AlertTriangle className="text-orange-600 size-6" />,
          gaugeSnap: "moderate" as const,
          caringMessage:
            "It’s okay to feel overwhelmed. Checking in with yourself is a brave step toward feeling better.",
        };
      case "discordant":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
          icon: <Info className="text-amber-600 size-6" />,
          gaugeSnap: "moderate" as const,
          caringMessage:
            "It’s normal to have mixed feelings. Take a moment to reflect and talk with someone you trust.",
        };
      case "low":
      default:
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          icon: <CheckCircle2 className="text-green-600 size-6" />,
          gaugeSnap: "low" as const,
          caringMessage:
            "You’re doing great. Keep being kind to yourself as you navigate this journey.",
        };
    }
  };

  const styles = getRiskStyles(risk_label);

  return (
    <div className="min-h-screen  flex flex-col print:bg-none bg-[#fef5f9]">
      {/* Print-only Header */}
      <div className="hidden print:block text-center border-b-2 border-primary mb-8 pb-4">
        <h1 className="text-3xl font-bold text-primary">MotherCare</h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest">
          Postpartum Wellbeing Screening Report
        </p>
      </div>

      <main className="flex-1  px-6 ptint:pt-4 lg:px-10 py-6 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Hybrid Assessment Summary
            </h1>
            <p className="text-muted-foreground text-md max-w-xl mx-auto no-print">
              You've completed the comprehensive wellbeing screening. Here is
              the analysis based on your responses.
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
                {/* <div>
                  <span className="text-muted-foreground block uppercase text-[10px] font-bold tracking-wider">
                    Age
                  </span>
                  <p className="font-semibold text-foreground text-md">
                    {symptomsAnswers?.AGE || "—"}
                  </p>
                </div> */}
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-pink-100/50 space-y-10">
            {/* Risk Indicator Section */}
            <div className="flex flex-col items-center text-center space-y-8">
              {/* Caring Message */}
              <div className="max-w-xl mx-auto">
                <p className="text-sm md:text-lg font-medium text-foreground/80 leading-relaxed italic">
                  "{styles.caringMessage}"
                </p>
              </div>

              <div className="w-full max-w-2xl mx-auto print:mt-6">
                <RiskGauge
                  score={Math.round(final_probability * 100)}
                  maxScore={100}
                  snapTo={styles.gaugeSnap}
                  screening="hybrid"
                />
              </div>

              <div
                className={`inline-flex items-center gap-2 px-4 py-1 rounded-full border-2 ${styles.bg} ${styles.border} ${styles.text} font-bold text-md uppercase tracking-wider print:mt-4`}
              >
                {styles.icon}
                {risk_label} RISK
              </div>
            </div>

            {/* Recommendation Box */}
            <div
              className={`p-5 rounded-2xl border-l-4 ${styles.bg} ${styles.border} space-y-3 shadow-sm print:mt-10`}
            >
              <h3
                className={`text-lg font-bold ${styles.text} flex items-center gap-2`}
              >
                <Info size={20} />
                Suggested Next Step
              </h3>
              <p className="text-foreground leading-relaxed font-medium text-lg text-left">
                {clinical_recommendation}
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

            {/* Flash Cards Section */}
            <div className="space-y-4 pt-4 print:break-before-page">
              <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Info size={18} className="text-primary" />
                Understanding Your Result
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 print:gap-8 gap-4">
                <div className="bg-violet-50/50 border border-violet-100 p-5 rounded-3xl shadow-sm">
                  <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest block mb-1">
                    Quick Summary
                  </span>
                  <p className="text-[14px] text-foreground font-medium leading-relaxed">
                    {(() => {
                      if (!explanation)
                        return "We looked at both your mood and physical health to give you a full picture of how you're doing.";
                      if (
                        explanation.includes("Q10=3") ||
                        explanation.includes("Q10 Override")
                      ) {
                        return "Your answers show you are going through a very hard time. Getting help from a professional is the most important thing right now.";
                      }
                      if (
                        explanation.includes("EPDS >= 13") ||
                        explanation.includes("Clinical Dominance")
                      ) {
                        return "Your emotional responses show patterns that are best shared with a doctor to help you feel better.";
                      }
                      if (explanation.toLowerCase().includes("discordant")) {
                        return "You have a mix of different feelings and physical signs. Talking this through with someone you trust can help clear things up.";
                      }
                      return (
                        explanation.replace(/^[A-Z0-9>=_\s:]+/, "").trim() ||
                        "We looked at both your mood and physical health to give you a full picture of how you're doing."
                      );
                    })()}
                  </p>
                </div>

                <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-3xl shadow-sm">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block mb-1">
                    Emotional Check-in
                  </span>
                  <p className="text-[14px] text-foreground font-medium leading-relaxed">
                    Your emotional score of{" "}
                    <strong>{metrics?.epds_total ?? "—"}</strong> indicates a{" "}
                    <strong>{metrics?.epds_risk ?? "reviewed"} risk</strong>{" "}
                    level.
                    <p className="text-[14px] text-foreground font-medium leading-relaxed">
                      {(() => {
                        if (!explanation)
                          return "We looked at both your mood and physical health to give you a full picture of how you're doing.";
                        if (
                          explanation.includes("Q10=3") ||
                          explanation.includes("Q10 Override")
                        ) {
                          return "Your answers for suicidal thoughts show you are going through a very hard time.";
                        }
                        if (
                          explanation.includes("EPDS >= 13") ||
                          explanation.includes("Clinical Dominance")
                        ) {
                          return "Your emotional responses show patterns that are best to shared with a doctor.";
                        }
                        if (explanation.toLowerCase().includes("discordant")) {
                          return "You have a mix of different feelings and physical signs. Talking this through with someone you trust can help clear things up.";
                        }
                        return (
                          explanation.replace(/^[A-Z0-9>=_\s:]+/, "").trim() ||
                          "We looked at both your mood and physical health to give you a full picture of how you're doing."
                        );
                      })()}
                    </p>
                  </p>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-3xl shadow-sm">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
                    What we checked
                  </span>
                  <p className="text-[14px] text-foreground font-medium leading-relaxed">
                    We combined a standard emotional scale with a check of your
                    physical symptoms for a deeper analysis.
                  </p>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-3xl shadow-sm">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                    Overall Finding
                  </span>
                  <p className="text-[14px] text-foreground font-medium leading-relaxed">
                    There is a{" "}
                    <strong>{metrics?.epds_risk ?? "reviewed"} Risk</strong>{" "}
                    indication of the wellness factors being monitored in this
                    checkup.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Alert if Critical */}
          {is_critical && (
            <div className="bg-red-600 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center gap-6 shadow-lg animate-bounce-subtle">
              <div className="bg-white/20 p-4 rounded-full">
                <PhoneCall size={32} />
              </div>
              <div className="flex-1 text-center md:text-left space-y-1">
                <h4 className="text-xl font-bold">Immediate Support Needed</h4>
                <p className="text-red-50 text-md opacity-90">
                  Please reach out to crisis support or a medical professional
                  immediately.
                </p>
              </div>
              <Link href="/crisis-resources">
                <Button className="bg-white text-red-600 hover:bg-red-50 border-none rounded-full h-12 px-8 font-bold text-md shadow-sm">
                  Get Help Now
                </Button>
              </Link>
            </div>
          )}

          {/* Recommended Articles Section */}
          {recommendationsStatus === "ok" && recommendedArticles.length > 0 && (
            <div className="space-y-6 pt-6 no-print">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recommended for You
                  </h2>
                  <p className="text-muted-foreground">
                    Based on your hybrid analysis, these resources may be
                    helpful
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                {recommendedArticles.map((article) => (
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
                          : `Comprehensive resources regarding ${article.category.toLowerCase()} wellness for your recovery.`}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 no-print">
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="rounded-full h-14 px-8 font-semibold w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary/5"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">
                download
              </span>
              Download Report (PDF)
            </Button>

            <Button
              onClick={() => router.push("/screening/select-screening-method")}
              variant="outline"
              className="rounded-full h-14 px-8 font-semibold w-full sm:w-auto border-2 hover:bg-secondary/50"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">
                refresh
              </span>
              Start New Screening
            </Button>

            <Link href="/community" className="w-full sm:w-auto">
              <Button className="rounded-full h-14 px-8 bg-primary hover:bg-[#b50d62] text-white font-semibold shadow-md w-full">
                <span className="material-symbols-outlined text-[20px] mr-2">
                  groups
                </span>
                Join MotherCare Community
              </Button>
            </Link>
          </div>

          {/* Print-only Footer */}
          <div className="hidden print:block text-center mt-12 pt-4 border-t border-gray-100 italic text-[10px] text-muted-foreground">
            {audit?.timestamp && (
              <>
                Generated on {new Date(audit.timestamp).toLocaleDateString()} at{" "}
                {new Date(audit.timestamp).toLocaleTimeString()}
              </>
            )}{" "}
            • MotherCare Assessment Tool
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
