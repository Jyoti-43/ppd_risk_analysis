"use client";

import React, { useMemo } from "react";
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
  Share2,
  Bell,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PPD_Risk_Analysis } from "@/src/app/component/dashboard/mother/ppd-risk-analysis";
import { ScreeningHistory } from "@/src/app/component/dashboard/mother/screeing-history";
import { columns } from "@/src/app/component/dashboard/mother/ppd-risk-analysis-column-defination";

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

// Mock Screening Data Generators
const generateHistory = (
  count: number,
  riskType: "High" | "Low" | "Moderate" | "Critical",
) => {
  return Array.from({ length: count }).map((_, i) => ({
    _id: `mock-${i}`,
    created_at: new Date(Date.now() - i * 86400000 * 3).toISOString(), // Every 3 days
    risk_level: i === 0 ? riskType : "Low", // Latest is the riskType
    total_score: i === 0 ? (riskType === "Critical" ? 22 : 10) : 5,
    result: {
      prediction: i === 0 ? riskType : "Low",
      flag: i === 0 ? 1 : 0,
    },
    answers: [],
    risk_label: i === 0 ? riskType : "Low",
    prediction: i === 0 ? riskType : "Low",
  }));
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

  // Mock Data matching the structure expected by components
  const symptomsHistory = {
    data: generateHistory(5, ASSIGNED_MOTHER.status as any),
  };
  const epdsHistory = {
    history: generateHistory(5, ASSIGNED_MOTHER.status as any),
  };
  const hybridHistory = {
    history: generateHistory(5, ASSIGNED_MOTHER.status as any),
  };

  // Prepare data for ScreeningHistory table
  const screeningHistory = useMemo(() => {
    const allScreenings: any[] = [];

    [...epdsHistory.history].forEach((item, idx) => {
      allScreenings.push({
        id: `epds-${idx}`,
        screeningType: "EPDS",
        date: new Date(item.created_at).toLocaleDateString(),
        created_at: item.created_at,
        risk: item.risk_level,
        prediction: item.risk_level,
        action: "View Details",
        method: "epds",
        raw: item,
      });
    });

    [...symptomsHistory.data].forEach((item, idx) => {
      allScreenings.push({
        id: `sym-${idx}`,
        screeningType: "Symptoms",
        date: new Date(item.created_at).toLocaleDateString(),
        created_at: item.created_at,
        risk: item.result.prediction,
        prediction: item.result.prediction,
        action: "View Details",
        method: "symptoms",
        raw: item,
      });
    });

    return allScreenings.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [epdsHistory, symptomsHistory]);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
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

  return (
    <div className="p-8 min-h-screen bg-gray-50/50">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT COLUMN: Main Dashboard Content (3 cols) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Partner Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitoring progress for{" "}
                <span className="font-semibold text-gray-800">
                  {ASSIGNED_MOTHER.name}
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
                      src={ASSIGNED_MOTHER.image}
                      alt={ASSIGNED_MOTHER.name}
                      className="h-full w-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src = "https://github.com/shadcn.png")
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {ASSIGNED_MOTHER.name}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span>{ASSIGNED_MOTHER.age} years old</span> •{" "}
                        <span>
                          {ASSIGNED_MOTHER.weeksPostpartum} weeks postpartum
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <Badge
                        className={`${getRiskColor(
                          ASSIGNED_MOTHER.riskLevel,
                        )} border px-3 py-1 text-sm`}
                      >
                        {ASSIGNED_MOTHER.riskLevel} Risk
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center bg-gray-100 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3 mr-1" /> Last screened:{" "}
                        {new Date(
                          ASSIGNED_MOTHER.lastScreeningDate,
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
                      {ASSIGNED_MOTHER.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                      <Phone className="h-4 w-4 text-gray-400" />{" "}
                      {ASSIGNED_MOTHER.phone}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-200">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Weekly Screenings
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                    On Track
                  </h3>
                </div>
                <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-200">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Latest EPDS Score
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-3xl font-bold text-gray-900">
                      {ASSIGNED_MOTHER.latestScore}
                    </h3>
                    <span className="text-sm text-gray-400">/ 30</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-200">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Next Check-in
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                    Tomorrow
                  </h3>
                </div>
                <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-500" />
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
                symptomsHistory={symptomsHistory}
                epdsHistory={epdsHistory}
                hybridHistory={hybridHistory}
              />
            </TabsContent>

            <TabsContent
              value="history"
              className="space-y-6 animate-in fade-in-50"
            >
              <ScreeningHistory columns={columns} data={screeningHistory} />
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
                onClick={() => router.push("/dashboard/partner/notifications")}
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
  );
}
