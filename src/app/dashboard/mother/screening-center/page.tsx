"use client";
import { Card, CardContent } from "@/components/ui/card";
import MethodCard from "@/src/app/component/screening/method-card";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";
import {
  useGetEpdsScreeningHistoryQuery,
  useGetHybridScreeningHistoryQuery,
  useGetSymptomsScreeningHistoryQuery,
  useScreeningCountQuery,
} from "@/src/app/redux/services/userDashboardApi";
import { ScreeningMethod } from "@/src/app/type";
import { useAppSelector } from "@/src/app/Hooks/hook";
import {
  Brain,
  CalendarHeart,
  FileText,
  HeartPulse,
  Info,
  Play,
} from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";

// Interface for screening data structure
interface ScreeningData {
  created_at: string;
  createdAt?: string; // For symptoms API
  risk_level?: string; // For EPDS API
  result?: {
    prediction?: string; // For symptoms API
    flag?: number;
    clinical_note?: string;
  };
  method: string;
}

export default function SelectScreeningMethod() {
  const user = useAppSelector(selectCurrentUser);
  const [selectedMethod, setSelectedMethod] =
    React.useState<ScreeningMethod | null>(null);
  const router = require("next/navigation").useRouter();

  const { data: symptomsScreeningHistory, isLoading: isSymptomsLoading } =
    useGetSymptomsScreeningHistoryQuery();
  const { data: epdsScreeningHistory, isLoading: isEpdsLoading } =
    useGetEpdsScreeningHistoryQuery();
  const { data: hybridScreeningHistory, isLoading: isHybridLoading } =
    useGetHybridScreeningHistoryQuery();

  // Local storage caching for faster initial load
  const [cachedHistory, setCachedHistory] = useState<{
    symptoms?: any;
    epds?: any;
    hybrid?: any;
  }>({});

  useEffect(() => {
    const savedData = localStorage.getItem("screening_history_cache");
    if (savedData) {
      try {
        setCachedHistory(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to load screening history cache", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!isSymptomsLoading && !isEpdsLoading && !isHybridLoading) {
      if (
        symptomsScreeningHistory ||
        epdsScreeningHistory ||
        hybridScreeningHistory
      ) {
        const dataToCache = {
          symptoms: symptomsScreeningHistory || cachedHistory.symptoms,
          epds: epdsScreeningHistory || cachedHistory.epds,
          hybrid: hybridScreeningHistory || cachedHistory.hybrid,
        };
        localStorage.setItem(
          "screening_history_cache",
          JSON.stringify(dataToCache),
        );
      }
    }
  }, [
    symptomsScreeningHistory,
    epdsScreeningHistory,
    hybridScreeningHistory,
    isSymptomsLoading,
    isEpdsLoading,
    isHybridLoading,
  ]);

  console.log("symptoms screeningHistory", symptomsScreeningHistory);
  console.log("epds screeningHistory", epdsScreeningHistory);
  console.log("hybrid screeningHistory", hybridScreeningHistory);

  // Calculate the latest screening from all available screening histories
  const latestScreening = useMemo(() => {
    const allScreenings: ScreeningData[] = [];

    const activeSymptoms = symptomsScreeningHistory || cachedHistory.symptoms;
    const activeEpds = epdsScreeningHistory || cachedHistory.epds;
    const activeHybrid = hybridScreeningHistory || cachedHistory.hybrid;

    // Add symptoms screening history with method tag
    if (activeSymptoms?.data && Array.isArray(activeSymptoms.data)) {
      activeSymptoms.data.forEach((screening: any) => {
        allScreenings.push({
          ...screening,
          created_at: screening.createdAt || screening.created_at,
          method: "symptoms",
        });
      });
    }

    // Add EPDS screening history with method tag
    if (activeEpds?.history && Array.isArray(activeEpds.history)) {
      activeEpds.history.forEach((screening: any) => {
        allScreenings.push({
          ...screening,
          method: "epds",
        });
      });
    }

    // Add hybrid screening history with method tag
    if (activeHybrid?.data && Array.isArray(activeHybrid.data)) {
      activeHybrid.data.forEach((screening: any) => {
        allScreenings.push({
          ...screening,
          created_at: screening.createdAt || screening.created_at,
          method: "hybrid",
        });
      });
    }

    // If no screenings available, return null
    if (allScreenings.length === 0) {
      return null;
    }

    // Sort by created_at date (most recent first) and return the latest one
    const sorted = allScreenings.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });

    return sorted[0];
  }, [
    symptomsScreeningHistory,
    epdsScreeningHistory,
    hybridScreeningHistory,
    cachedHistory,
  ]);

  // Calculate time since last screening (days, hours, or minutes)
  const calculateTimeSince = (
    dateString: string,
  ): { value: number; unit: string } => {
    // Normalize date (logic from @/utills/timeAgo)
    let screeningDate: Date;
    if (dateString.includes("Z") || dateString.includes("+")) {
      screeningDate = new Date(dateString);
    } else {
      // If no timezone info, treat as UTC by appending 'Z'
      screeningDate = new Date(dateString + "Z");
    }

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - screeningDate.getTime());

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    // If more than 1 day, show days
    if (diffDays >= 1) {
      return { value: diffDays, unit: "DAYS" };
    }
    // If more than 1 hour but less than 24 hours, show hours
    else if (diffHours >= 1) {
      return { value: diffHours, unit: "HOURS" };
    }
    // Otherwise show minutes
    else {
      return { value: diffMinutes, unit: "MINUTES" };
    }
  };

  // Get time since last screening
  const timeSinceLastScreening = latestScreening?.created_at
    ? calculateTimeSince(latestScreening.created_at)
    : null;

  // Check if any screening data is loading
  const isAnyScreeningLoading =
    isSymptomsLoading || isEpdsLoading || isHybridLoading;

  const handleMethodSelect = (method: any) => {
    setSelectedMethod(method);
    router.push("/screening/" + method + "-assessment");
  };

  return (
    <>
      <div className="min-h-screen grid grid-cols-1 bg-background p-4 md:p-8 pt-6 transition-colors duration-300 gap-10 max-w-5xl mx-auto">
        <div className="grid gap-10 w-full h-auto min-h-60">
          <Card className="relative p-6 w-full border-none shadow-sm overflow-hidden bg-gradient-to-r from-[#fbcfe8] to-[#bfdbfe]">
            <CardContent className="flex flex-col md:flex-row items-center justify-between p-0 gap-10">
              <div className="flex flex-col space-y-6 max-w-xl">
                <div>
                  <span className="bg-white/80 text-[#f472b6] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                    VIBE CHECK
                  </span>
                  <h3 className="text-3xl font-bold text-slate-800 leading-tight">
                    Ready for your check-in, {user?.userName}?
                  </h3>
                  <p className="text-slate-500 mt-2 text-lg">
                    It only takes 5 minutes to see your progress and update your
                    well-being.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <button
                    onClick={() => handleMethodSelect("hybrid")}
                    className="flex items-center gap-2 bg-[#f472b6] hover:bg-[#db2777] text-white px-6 py-3 rounded-full font-bold transition-all shadow-md active:scale-95"
                  >
                    <div className="bg-white rounded-full p-1">
                      <Play size={12} className="text-[#f472b6] fill-current" />
                    </div>
                    Start Comprehensive Screening
                  </button>
                  <button
                    onClick={() => handleMethodSelect("symptoms")}
                    className="text-slate-600 font-semibold hover:text-slate-800 underline underline-offset-4 decoration-slate-300 transition-all"
                  >
                    Quick Symptoms Check
                  </button>
                </div>
              </div>
              <Card className="absolute top-5 right-10 p-3 space-y-4 ">
                <CardContent className="flex flex-col items-center justify-center py-4">
                  {isAnyScreeningLoading ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Loading...</p>
                    </div>
                  ) : timeSinceLastScreening !== null ? (
                    <>
                      {/* Circular Progress */}
                      <div className="relative w-22 h-22 mb-4">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          {/* Background circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#F472B6"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${Math.min(
                              timeSinceLastScreening.unit === "DAYS"
                                ? (timeSinceLastScreening.value / 30) * 251.2
                                : timeSinceLastScreening.unit === "HOURS"
                                  ? (timeSinceLastScreening.value / 24) * 251.2
                                  : (timeSinceLastScreening.value / 60) * 251.2,
                              251.2,
                            )} 251.2`}
                            className="transition-all duration-500"
                          />
                        </svg>
                        {/* Center text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-gray-800">
                            {timeSinceLastScreening.value}
                          </span>
                          <span className="text-xs text-gray-500">
                            {timeSinceLastScreening.unit}
                          </span>
                        </div>
                      </div>
                      {/* Label */}
                      <p className="text-sm text-gray-500 text-center">
                        Since Last
                        <br />
                        Check-in
                      </p>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="relative w-32 h-32 mb-4">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-gray-400">
                            -
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">No screenings yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
        <div className=" text-center md:text-left gap-4  min-h-min">
          <p className="text-muted-foreground text-lg leading-relaxed">
            Select the screening method that feels right for you today.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3  lg:gap-8">
          <MethodCard
            id="epds"
            title="EPDS Standard"
            description="The gold-standard Edinburgh Postnatal Depression Scale. 10 focused questions on your mood, to identify emotional wellbeing."
            icon={CalendarHeart}
            colorClass="bg-primary"
            onClick={handleMethodSelect}
          />
          <MethodCard
            id="symptoms"
            title="Symptom Check"
            description="Focuses on specific clinical symptoms and their intensity. Helpful for identifying physical shifts, social impact."
            icon={HeartPulse}
            colorClass="bg-primary"
            onClick={handleMethodSelect}
          />
          <MethodCard
            id="hybrid"
            title="Full Assessment"
            description="A comprehensive combined (epds + symptoms) screening for the most accurate understanding of your wellbeing."
            icon={Brain}
            colorClass="bg-primary"
            onClick={handleMethodSelect}
          />
        </div>
        <div className="mt-20 bg-card border border-border rounded-2xl p-6 md:p-8  flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
          <div className="bg-amber-50 p-2 rounded-xl text-amber-600 border border-amber-100">
            <Info size={30} className="text-primary" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-primary mb-3">
              Privacy & Clinical Notice
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              This tool provides a preliminary screening based on validated
              research. It is{" "}
              <strong className="text-primary font-semibold">
                not a clinical diagnosis
              </strong>
              . All responses are processed locally and remain confidential.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
