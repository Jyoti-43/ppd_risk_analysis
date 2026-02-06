"use client";

import React, { useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCheck,
  AlertTriangle,
  Calendar,
  Activity,
  Phone,
  Mail,
  Clock,
  FileText,
  Bell,
  AlertCircle,
  LockKeyhole,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PPD_Risk_Analysis } from "@/src/app/component/dashboard/mother/ppd-risk-analysis";
import { ScreeningHistory } from "@/src/app/component/dashboard/mother/screeing-history";
import { columns } from "@/src/app/component/dashboard/mother/ppd-risk-analysis-column-defination";
import ProtectedRoute from "@/src/app/component/auth/ProtectedRoute/ProtectedRoute";
import {
  useGetMotherScreeningSummaryQuery,
  useGetMotherScreeningHistoryQuery,
  useGetLinkedMotherProfileQuery,
} from "../../redux/services/userDashboardApi";

// Mock User Data for the Single Assigned Mother
const ASSIGNED_MOTHER = {
  id: "1",
  name: "Sarah Johnson",
  age: 28,
  weeksPostpartum: 4,
  email: "sarah.j@example.com",
  phone: "+1 (555) 123-4567",
  status: "Critical",
  lastScreeningDate: "2025-01-24T10:30:00",
  riskLevel: "High",
  image: "/avatars/01.png",
  latestScore: 18, // EPDS Score
};

// Simplified Mock Notifications
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "CRITICAL",
    title: "High Risk Detected",
    message: "Recent screening indicates severe symptoms.",
    timestamp: "2h ago",
    isRead: false,
  },
  {
    id: 2,
    type: "REMINDER",
    title: "Follow-up",
    message: "Scheduled for tomorrow at 10:00 AM.",
    timestamp: "5h ago",
    isRead: false,
  },
  {
    id: 3,
    type: "SYSTEM",
    title: "Report Ready",
    message: "Weekly summary available.",
    timestamp: "1d ago",
    isRead: true,
  },
];

export default function PartnerDashboard() {
  const router = useRouter();

  const { data: motherProfile, isLoading: isProfileLoading } =
    useGetLinkedMotherProfileQuery();

  const profile = useMemo(() => {
    if (!motherProfile) return null;

    // Handle various response shapes: array, { data: [] }, { mothers: [] }, { mother: {} }
    if (Array.isArray(motherProfile)) return motherProfile[0];
    if (Array.isArray(motherProfile.data)) return motherProfile.data[0];
    if (Array.isArray(motherProfile.mothers)) return motherProfile.mothers[0];
    if (motherProfile.mother) return motherProfile.mother;
    if (motherProfile.data) return motherProfile.data; // might be a single object

    return motherProfile;
  }, [motherProfile]);

  const motherId =
    profile?.id ||
    profile?._id ||
    profile?.mother_id ||
    profile?.userId ||
    profile?.user_id;

  const {
    data: screeningSummary,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useGetMotherScreeningSummaryQuery(motherId, { skip: !motherId });

  const {
    data: screeningHistoryData,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useGetMotherScreeningHistoryQuery(
    { mother_id: motherId, limit: 100 },
    { skip: !motherId },
  );

  const isHistoryForbidden = (historyError as any)?.status === 403;

  const isLoading = isProfileLoading || isSummaryLoading || isHistoryLoading;

  // Map real data to ASSIGNED_MOTHER structure
  const motherData = useMemo(() => {
    if (!profile) return ASSIGNED_MOTHER;

    // Use summary data for metrics
    const latestEpds = screeningSummary?.latest_epds || screeningSummary?.epds;
    const latestSymp =
      screeningSummary?.latest_ppd ||
      screeningSummary?.latest_symptom ||
      screeningSummary?.ppd ||
      screeningSummary?.symptom;
    const latestHybrid =
      screeningSummary?.latest_hybrid || screeningSummary?.hybrid;

    // Determine which screening is absolute latest
    const dates = [
      { type: "epds", date: latestEpds?.created_at, data: latestEpds },
      { type: "symptom", date: latestSymp?.created_at, data: latestSymp },
      { type: "hybrid", date: latestHybrid?.created_at, data: latestHybrid },
    ]
      .filter((d) => d.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const absoluteLatest = dates[0];

    return {
      ...ASSIGNED_MOTHER,
      name: profile.mother_name || profile.name || profile.userName || "Mother",
      email: profile.mother_email || profile.email || "",
      phone: profile.phone || ASSIGNED_MOTHER.phone,
      age: profile.age || ASSIGNED_MOTHER.age,
      weeksPostpartum:
        profile.weeksPostpartum || ASSIGNED_MOTHER.weeksPostpartum,
      image: profile.image || ASSIGNED_MOTHER.image,
      riskLevel:
        screeningSummary?.overall_risk ||
        absoluteLatest?.data?.risk_level ||
        absoluteLatest?.data?.result?.risk_level ||
        absoluteLatest?.data?.result?.prediction ||
        absoluteLatest?.data?.prediction ||
        "Low",
      latestScore:
        latestEpds?.total_score || latestEpds?.result?.total_score || 0,
      lastScreeningDate:
        absoluteLatest?.date ||
        screeningSummary?.last_screening_date ||
        new Date().toISOString(),
    };
  }, [profile, screeningSummary]);

  // Prepare data for ScreeningHistory table
  const screeningHistory = useMemo(() => {
    const allScreenings: any[] = [];
    const history =
      screeningHistoryData?.items ||
      screeningHistoryData?.history ||
      screeningHistoryData?.data ||
      (Array.isArray(screeningHistoryData) ? screeningHistoryData : []);

    if (Array.isArray(history)) {
      history.forEach((item: any, idx: number) => {
        let type =
          item.type ||
          item.screening_type ||
          item.method ||
          (item.total_score !== undefined ||
          item.result?.total_score !== undefined
            ? "EPDS"
            : "Symptoms");

        // Normalize for UI
        const lowerType = type.toLowerCase();
        if (lowerType.includes("symptom") || lowerType.includes("ppd")) {
          type = "Symptoms";
        } else if (lowerType.includes("epds")) {
          type = "EPDS";
        } else if (lowerType.includes("hybrid")) {
          type = "Hybrid";
        }

        const risk =
          item.risk_level ||
          item.result?.risk_level ||
          item.result?.prediction ||
          item.prediction ||
          "Low";

        allScreenings.push({
          id: item.id || item._id || `${type}-${idx}`,
          screeningType: type,
          date: new Date(item.created_at).toLocaleDateString(),
          created_at: item.created_at,
          risk: risk,
          prediction: risk,
          action: "View Details",
          method: type.toLowerCase(),
          raw: item,
        });
      });
    }

    return allScreenings.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [screeningHistoryData]);

  const separatedHistories = useMemo(() => {
    const history =
      screeningHistoryData?.items ||
      screeningHistoryData?.history ||
      screeningHistoryData?.data ||
      (Array.isArray(screeningHistoryData) ? screeningHistoryData : []);

    return {
      epds: {
        history: history.filter((i: any) => {
          const type = (
            i.type ||
            i.screening_type ||
            i.method ||
            ""
          ).toLowerCase();
          return type.includes("epds");
        }),
      },
      symptoms: {
        data: history.filter((i: any) => {
          const type = (
            i.type ||
            i.screening_type ||
            i.method ||
            ""
          ).toLowerCase();
          return (
            type.includes("symptom") ||
            type.includes("ppd") ||
            type.includes("risk")
          );
        }),
      },
      hybrid: {
        history: history.filter((i: any) => {
          const type = (
            i.type ||
            i.screening_type ||
            i.method ||
            ""
          ).toLowerCase();
          return type.includes("hybrid");
        }),
      },
    };
  }, [screeningHistoryData]);

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "moderate":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <Activity className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <ProtectedRoute roles={["partner"]}>
      <div className="p-8 min-h-screen bg-gray-50/50">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT COLUMN: Main Dashboard Content (3 cols) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Support Hub
                </h1>
                <p className="text-slate-500 mt-1">
                  Viewing screening results for{" "}
                  <span className="font-bold text-primary">
                    {motherData.name}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" /> Download Report
                </Button>
              </div>
            </div>

            {/* Patient Overview Card */}
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden ring-4 ring-pink-50 flex-shrink-0">
                      <img
                        src={motherData.image}
                        alt={motherData.name}
                        className="h-full w-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://github.com/shadcn.png")
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {motherData.name}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span>{motherData.age} years old</span> •{" "}
                          <span>
                            {motherData.weeksPostpartum} weeks postpartum
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <Badge
                          className={`${getRiskColor(
                            motherData.riskLevel,
                          )} border px-3 py-1 text-sm`}
                        >
                          {motherData.riskLevel} Risk
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center bg-gray-100 px-2 py-1 rounded-full">
                          <Clock className="h-3 w-3 mr-1" /> Last screened:{" "}
                          {new Date(
                            motherData.lastScreeningDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 justify-center border-l pl-8 border-dashed min-w-[250px]">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Contact Information
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                        <Mail className="h-4 w-4 text-gray-400" />{" "}
                        {motherData.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                        <Phone className="h-4 w-4 text-gray-400" />{" "}
                        {motherData.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics Grid - Aligned with Mother Dashboard styling */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Card 1: Risk Status (Equivalent to Mother's Risk card) */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center space-x-4 p-2 h-full">
                  <div
                    className={`${
                      motherData.riskLevel === "Critical" ||
                      motherData.riskLevel === "High"
                        ? "bg-[#fff1f2] text-[#fb7185]"
                        : "bg-[#ecfdf5] text-[#10b981]"
                    } flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center`}
                  >
                    <AlertTriangle className="h-7 w-7" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      OVERALL RISK
                    </span>
                    <h3 className="text-xl font-bold text-slate-700 mt-0.5">
                      {motherData.riskLevel}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Total Screenings Shared */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center space-x-4 p-2 h-full">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#eff6ff] rounded-2xl flex items-center justify-center">
                    <Activity className="h-7 w-7 text-[#3b82f6]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      TOTAL RECORDED
                    </span>
                    <h3 className="text-xl font-bold text-slate-700 mt-0.5">
                      {screeningSummary?.total_screenings || 0}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Latest Check-in */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center space-x-4 p-2 h-full">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#fff7ed] rounded-2xl flex items-center justify-center">
                    <Calendar className="h-7 w-7 text-[#f97316]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      LATEST ENTRY
                    </span>
                    <h3 className="text-xl font-bold text-slate-700 mt-0.5">
                      {new Date(
                        motherData.lastScreeningDate,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-white border p-1 rounded-xl h-12 w-full md:w-auto grid grid-cols-3 md:inline-flex">
                <TabsTrigger value="overview" className="rounded-lg h-10 px-6">
                  Risk Analysis
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-lg h-10 px-6">
                  Screening History
                </TabsTrigger>
                <TabsTrigger value="notes" className="rounded-lg h-10 px-6">
                  Notes & Progress
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="overview"
                className="space-y-6 animate-in fade-in-50"
              >
                <PPD_Risk_Analysis
                  symptomsHistory={separatedHistories.symptoms}
                  epdsHistory={separatedHistories.epds}
                  hybridHistory={separatedHistories.hybrid}
                />
              </TabsContent>

              <TabsContent
                value="history"
                className="space-y-6 animate-in fade-in-50"
              >
                {isHistoryForbidden ? (
                  <Card className="min-h-[300px] flex flex-col items-center justify-center border-dashed bg-slate-50/50 p-8 text-center">
                    <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                      <LockKeyhole className="h-8 w-8 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Restricted Access
                    </h3>
                    <p className="text-muted-foreground max-w-[350px] leading-relaxed">
                      You currently have "Latest Summary" access. Full screening
                      history is only available to partners with "Full History"
                      permissions.
                    </p>
                    <p className="text-xs text-amber-600 font-medium mt-4 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 italic">
                      Please contact the mother to request full history access.
                    </p>
                  </Card>
                ) : (
                  <ScreeningHistory columns={columns} data={screeningHistory} />
                )}
              </TabsContent>

              <TabsContent value="notes">
                <Card className="min-h-[200px] flex items-center justify-center border-dashed">
                  <p className="text-muted-foreground">
                    Notes feature coming soon...
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT COLUMN: Notification Section (1 col) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-4 h-fit sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#FF6B98]" />
                  Recent Alerts
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-muted-foreground hover:text-[#FF6B98]"
                  onClick={() =>
                    router.push("/dashboard/partner/notifications")
                  }
                >
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {MOCK_NOTIFICATIONS.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.isRead
                        ? "bg-gray-50 border-gray-100 opacity-60"
                        : "bg-white border-gray-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                          notification.type === "CRITICAL"
                            ? "bg-red-500"
                            : notification.type === "REMINDER"
                              ? "bg-orange-500"
                              : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${
                            notification.type === "CRITICAL"
                              ? "text-red-700"
                              : "text-gray-800"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-2 block font-medium">
                          {notification.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-dashed">
                <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-pink-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-pink-800">
                        Complete Weekly Review
                      </p>
                      <p className="text-[10px] text-pink-600 mt-0.5">
                        Summary pending for this week.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
