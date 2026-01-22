"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "../../Hooks/hook";
import { selectCurrentUser } from "../../redux/feature/user/userSlice";
import { PPD_Risk_Analysis } from "../../component/dashboard/mother/ppd-risk-analysis";
import { ScreeningHistory } from "../../component/dashboard/mother/screeing-history";
import {
  columns,
  PPDRiskAnalysis,
} from "../../component/dashboard/mother/ppd-risk-analysis-column-defination";
import {
  usePostCountQuery,
  useScreeningCountQuery,
  useGetSymptomsScreeningHistoryQuery,
  useGetHybridScreeningHistoryQuery,
  useGetEpdsScreeningHistoryQuery,
} from "../../redux/services/userDashboardApi";
import { Activity, FileText, AlertTriangle, Calendar } from "lucide-react";
import { timeAgo } from "@/utills/timeAgo";
import { useMemo } from "react";

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

export default function MotherDashboard() {
  const user = useAppSelector(selectCurrentUser);
  const { data: postCount, isLoading: isPostLoading } = usePostCountQuery(
    undefined,
    { refetchOnMountOrArgChange: false },
  );
  const { data: screeningCount, isLoading: isScreeningLoading } =
    useScreeningCountQuery(undefined, { refetchOnMountOrArgChange: false });
  const { data: symptomsScreeningHistory, isLoading: isSymptomsLoading } =
    useGetSymptomsScreeningHistoryQuery(undefined, {
      refetchOnMountOrArgChange: false,
    });
  const { data: epdsScreeningHistory, isLoading: isEpdsLoading } =
    useGetEpdsScreeningHistoryQuery(undefined, {
      refetchOnMountOrArgChange: false,
    });
  const { data: hybridScreeningHistory, isLoading: isHybridLoading } =
    useGetHybridScreeningHistoryQuery(undefined, {
      refetchOnMountOrArgChange: false,
    });

  console.log("Dashboard State:", {
    symptoms: { data: symptomsScreeningHistory, loading: isSymptomsLoading },
    epds: { data: epdsScreeningHistory, loading: isEpdsLoading },
    hybrid: { data: hybridScreeningHistory, loading: isHybridLoading },
    counts: screeningCount,
  });
  // Aggregated screening history from all sources, mapped to table format
  const screeningHistory = useMemo(() => {
    const allScreenings: any[] = [];

    // Add symptoms screening history
    if (
      symptomsScreeningHistory?.data &&
      Array.isArray(symptomsScreeningHistory.data)
    ) {
      symptomsScreeningHistory.data.forEach((screening: any) => {
        allScreenings.push({
          id: screening._id || `symptoms-${screening.createdAt}`,
          screeningType: "Symptoms",
          date: new Date(screening.createdAt).toLocaleDateString(),
          created_at: screening.createdAt,
          risk: (screening.result?.prediction === "High Risk"
            ? "High"
            : screening.result?.prediction === "Low Risk"
            ? "Low"
            : "Moderate") as any,
          prediction: screening.result?.prediction || "Unknown",
          action: "View Details",
          method: "symptoms",
        });
      });
    }

    // Add EPDS screening history
    if (
      epdsScreeningHistory?.history &&
      Array.isArray(epdsScreeningHistory.history)
    ) {
      epdsScreeningHistory.history.forEach((screening: any, index: number) => {
        allScreenings.push({
          id: `epds-${index}-${screening.created_at}`,
          screeningType: "EPDS",
          date: new Date(screening.created_at).toLocaleDateString(),
          created_at: screening.created_at,
          risk: (screening.risk_level === "High Risk"
            ? "High"
            : screening.risk_level === "Low Risk"
            ? "Low"
            : "Moderate") as any,
          prediction: screening.risk_level || "Unknown",
          action: "View Details",
          method: "epds",
        });
      });
    }

    // Add hybrid screening history
    if (
      hybridScreeningHistory?.data &&
      Array.isArray(hybridScreeningHistory.data)
    ) {
      hybridScreeningHistory.data.forEach((screening: any) => {
        allScreenings.push({
          id: screening._id || `hybrid-${screening.createdAt}`,
          screeningType: "Hybrid",
          date: new Date(
            screening.createdAt || screening.created_at,
          ).toLocaleDateString(),
          created_at: screening.createdAt || screening.created_at,
          risk: (screening.result?.prediction === "High Risk"
            ? "High"
            : screening.result?.prediction === "Low Risk"
            ? "Low"
            : "Moderate") as any,
          prediction: screening.result?.prediction || "Unknown",
          action: "View Details",
          method: "hybrid",
        });
      });
    }

    // Sort by created_at date (most recent first)
    return allScreenings.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
  }, [symptomsScreeningHistory, epdsScreeningHistory, hybridScreeningHistory]);

  // Calculate the latest screening from sorted history
  const latestScreening = useMemo(() => {
    return screeningHistory.length > 0 ? screeningHistory[0] : null;
  }, [screeningHistory]);

  // Extract risk level from latest screening
  // Handle different API structures:
  // - EPDS: risk_level (direct field)
  // - Symptoms: result.prediction (nested field)
  // - Hybrid: TBD (will likely follow one of the above patterns)
  const currentRiskLevel = latestScreening
    ? latestScreening.prediction || "N/A"
    : "N/A";

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

  console.log("Latest screening selected:", latestScreening);
  console.log("Time since last screening:", timeSinceLastScreening);

  return (
    <div className="px-8 space-y-8">
      <div className="flex pt-2 pb-6">
        <h2 className="text-2xl font-bold mb-4"></h2>
        <p>
          <span className="text-2xl md:text-3xl font-bold text-amber-950/80 tracking-tight text-heading">
            Welcome back, {user?.userName} !
          </span>{" "}
          <br />
          Here is your wellness overview.
        </p>
      </div>

      {/* total count cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-2 h-full">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total screenings
              </span>
              <p className="text-2xl font-bold text-slate-800">
                {isScreeningLoading
                  ? "..."
                  : screeningCount?.total_screening_count}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-2 h-full">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Posts
              </span>
              <p className="text-2xl font-bold text-slate-800">
                {isPostLoading ? "..." : postCount?.total_post_count}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-2 h-full">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Current Risk Level
              </span>
              <p className="text-2xl font-bold capitalize text-slate-800">
                {isAnyScreeningLoading ? "..." : currentRiskLevel}
              </p>
              {!isAnyScreeningLoading && currentRiskLevel !== "N/A" && (
                <p
                  className={`text-xs font-semibold mt-0.5 ${
                    currentRiskLevel?.toLowerCase().includes("high")
                      ? "text-red-500"
                      : currentRiskLevel?.toLowerCase().includes("moderate")
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {currentRiskLevel?.toLowerCase().includes("high")
                    ? "Seek Care"
                    : currentRiskLevel?.toLowerCase().includes("moderate")
                    ? "Monitor Closely"
                    : "Doing Great"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-2 h-full">
            <div className="flex-shrink-0 w-12 h-12 bg-[#fff1f2] rounded-2xl flex items-center justify-center">
              <Calendar className="h-7 w-7 text-[#fb7185]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                LATEST SCREENING
              </span>
              <h3 className="text-xl font-bold text-slate-700 mt-0.5">
                {isAnyScreeningLoading
                  ? "..."
                  : latestScreening
                  ? new Date(latestScreening.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                  : "No data"}
              </h3>
              <p className="text-sm font-medium text-emerald-500 mt-0.5">
                On schedule
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* risk analysis overview */}
      <div className="grid grid-cols-1 sm:grid-cols-1  lg:grid-cols-5 gap-4 w-full">
        <div className="grid grid-col-span-1 md:col-span-1 lg:col-span-2 ">
          <PPD_Risk_Analysis />
        </div>
        <div className="grid grid-col-span-1 md:col-span-1 lg:col-span-3 ">
          <ScreeningHistory columns={columns} data={screeningHistory} />
        </div>
      </div>
    </div>
  );
}
