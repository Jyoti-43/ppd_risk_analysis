"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  Calendar,
  Download,
  Share2,
  Clock,
} from "lucide-react";
import { PPD_Risk_Analysis } from "@/src/app/component/dashboard/mother/ppd-risk-analysis";
import { ScreeningHistory } from "@/src/app/component/dashboard/mother/screeing-history";
import { columns } from "@/src/app/component/dashboard/mother/ppd-risk-analysis-column-defination";

// Mock User Data
const MOCK_USER_DETAILS = {
  "1": {
    name: "Sarah Johnson",
    age: 28,
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    status: "Critical",
    weeksPostPartum: 4,
  },
  "2": {
    name: "Emily Davis",
    age: 32,
    email: "emily.d@example.com",
    phone: "+1 (555) 987-6543",
    status: "Moderate",
    weeksPostPartum: 12,
  },
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

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const user =
    MOCK_USER_DETAILS[id as keyof typeof MOCK_USER_DETAILS] ||
    MOCK_USER_DETAILS["1"];

  // Mock Data matching the structure expected by components
  const symptomsHistory = { data: generateHistory(5, user.status as any) };
  const epdsHistory = { history: generateHistory(5, user.status as any) };
  const hybridHistory = { history: generateHistory(5, user.status as any) };

  // Prepare data for ScreeningHistory table (Logic adapted from MotherDashboard)
  const screeningHistory = useMemo(() => {
    const allScreenings: any[] = [];

    // Simulate mapping (Simplified version of MotherDashboard logic)
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

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gray-50/50">
      {/* Header / Nav */}
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-sm text-muted-foreground">
            Patient Profile •{" "}
            <span className="font-medium text-gray-700">ID: #{id}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" /> Download Report
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-[#FF6B98] hover:bg-[#ff5286]"
          >
            <Share2 className="mr-2 h-4 w-4" /> Share with Provider
          </Button>
        </div>
      </div>

      {/* Patient Overview Card */}
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex gap-4">
              <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden ring-4 ring-pink-50">
                <img
                  src={`/avatars/0${Number(id) < 5 ? id : 1}.png`}
                  alt={user.name}
                  className="h-full w-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src = "https://github.com/shadcn.png")
                  }
                />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{user.age} years old</span> •{" "}
                  <span>{user.weeksPostPartum} weeks postpartum</span>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  {user.status === "Critical" ? (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                      Critical Risk
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                      Stable
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Last screened: 2 days ago
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center border-l pl-6 border-dashed">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Contact Info
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="h-4 w-4 text-gray-400" /> {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="h-4 w-4 text-gray-400" /> {user.phone}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border p-1 rounded-xl h-12">
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
  );
}
