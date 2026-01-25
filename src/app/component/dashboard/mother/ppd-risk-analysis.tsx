"use client";

import { useState } from "react";
import { TrendingUp, Info, ChevronDown, X } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  epds: {
    label: "EPDS Score",
    color: "#3b82f6", // Blue
  },
  symptom: {
    label: "Symptom Probability",
    color: "#f59e0b", // Amber
  },
  hybrid: {
    label: "Hybrid Probability",
    color: "#10b981", // Emerald
  },
} satisfies ChartConfig;

interface PPDRiskAnalysisProps {
  symptomsHistory?: any;
  epdsHistory?: any;
  hybridHistory?: any;
}

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/src/app/Hooks/hook";
import { setStatus as setEpdsStatus, setScore as setEpdsScore, setAnswers as setEpdsAnswers } from "@/src/app/redux/feature/screening/epds/epdsSlice";
import { setResult as setSymptomsResult, setStatus as setSymptomsStatus } from "@/src/app/redux/feature/screening/symptoms/symptomsSlice";
import { setHybridResult, setHybridStatus } from "@/src/app/redux/feature/screening/hybrid/hybridSlice";

export function PPD_Risk_Analysis({
  symptomsHistory = [],
  epdsHistory = [],
  hybridHistory = [],
}: PPDRiskAnalysisProps) {
  const [activeView, setActiveView] = useState<string>("all");
  const [dataRange, setDataRange] = useState<string>("last6");
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Process and combine data for the chart
  const combinedData = (() => {
    const dataPoints: any[] = [];

    // Helper to get array data
    const getArray = (val: any, key: string) => 
      Array.isArray(val) ? val : (Array.isArray(val?.[key]) ? val[key] : []);

    const sData = getArray(symptomsHistory, "data");
    const eData = getArray(epdsHistory, "history");
    const hData = getArray(hybridHistory, "history");

    // Map Symptoms
    sData.forEach((s: any) => {
      const date = new Date(s.createdAt || s.created_at || s.date);
      if (isNaN(date.getTime())) return;

      const prob = s.result?.risk_probability ?? s.risk_probability ?? s.probability ?? 0;

      dataPoints.push({
        date,
        symptom: Math.round(prob <= 1 ? prob * 100 : prob),
        raw: s,
        id: s._id || s.id,
        type: "symptom"
      });
    });

    // Map EPDS
    eData.forEach((e: any) => {
      const date = new Date(e.created_at || e.createdAt || e.date);
      if (isNaN(date.getTime())) return;

      const score = e.score ?? e.total_score ?? e.result?.score ?? e.epds_score ?? 0;

      dataPoints.push({
        date,
        epds: score,
        raw: e,
        id: e.result_id || e._id || e.id,
        type: "epds"
      });
    });

    // Map Hybrid
    hData.forEach((h: any) => {
      const date = new Date(h.created_at || h.createdAt || h.audit?.timestamp || h.date);
      if (isNaN(date.getTime())) return;

      const prob = h.final_probability ?? h.result?.probability ?? h.probability ?? 0;

      dataPoints.push({
        date,
        hybrid: Math.round(prob <= 1 ? prob * 100 : prob),
        raw: h,
        id: h.id || h._id,
        type: "hybrid"
      });
    });

    // Sort by date ascending
    dataPoints.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Filter based on range
    let filteredData = dataPoints;
    if (dataRange === "last6") {
      filteredData = dataPoints.slice(-6);
    } else if (dataRange === "last12") {
      filteredData = dataPoints.slice(-12);
    }

    // Group close dates/times if necessary, but Recharts handles unique points well
    return filteredData.map((pt) => ({
      ...pt,
      formattedDate: pt.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      // Fill missing values with null to skip them in the line drawing
      epds: pt.epds ?? null,
      symptom: pt.symptom ?? null,
      hybrid: pt.hybrid ?? null,
    }));
  })();

  const showEpds = activeView === "all" || activeView === "epds";
  const showSymptom = activeView === "all" || activeView === "symptom";
  const showHybrid = activeView === "all" || activeView === "hybrid";

  const handlePointClick = (e: any) => {
    if (e && e.activePayload && e.activePayload.length > 0) {
      const activeEntry = e.activePayload.find((entry: any) => 
        (activeView === "all" || entry.dataKey === activeView) && entry.value !== null
      ) || e.activePayload[0];
      
      const payload = activeEntry.payload;
      const { id, type, raw } = payload;

      if (raw && type) {
        if (type === "epds") {
          dispatch(setEpdsScore(raw.score || raw.total_score || 0));
          dispatch(setEpdsAnswers(raw.answers || []));
          dispatch(setEpdsStatus("succeeded"));
          router.push("/screening/epds-assessment-results");
        } else if (type === "symptom") {
          dispatch(setSymptomsResult(raw));
          dispatch(setSymptomsStatus("succeeded"));
          router.push("/screening/symptoms-assessment-result");
        } else if (type === "hybrid") {
          dispatch(setHybridResult(raw));
          dispatch(setHybridStatus("succeeded"));
          router.push("/screening/hybrid-assessment-results");
        }
      }
    }
  };

  return (
    <Card className="h-full flex flex-col border-none shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <CardTitle className="text-sm font-bold text-slate-400 tracking-tight uppercase">
                Risk Analysis
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Select value={dataRange} onValueChange={setDataRange}>
                  <SelectTrigger className="w-[110px] h-7 text-[10px] font-bold bg-white border-slate-100 rounded-md focus:ring-1 focus:ring-slate-200 transition-all uppercase">
                    <SelectValue placeholder="Range" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-slate-100 shadow-xl">
                    <SelectItem value="last6" className="text-[10px] font-bold uppercase">Last 6</SelectItem>
                    <SelectItem value="last12" className="text-[10px] font-bold uppercase">Last 12</SelectItem>
                    <SelectItem value="all" className="text-[10px] font-bold uppercase">All History</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={activeView} onValueChange={setActiveView}>
                  <SelectTrigger className="w-[130px] h-7 text-[10px] font-bold bg-slate-50 border-slate-100 rounded-md focus:ring-1 focus:ring-slate-200 transition-all uppercase">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-slate-100 shadow-xl">
                    <SelectItem value="all" className="text-[10px] font-bold uppercase">Combined View</SelectItem>
                    <SelectItem value="epds" className="text-[10px] font-bold uppercase">EPDS Only</SelectItem>
                    <SelectItem value="symptom" className="text-[10px] font-bold uppercase">Symptoms Only</SelectItem>
                    <SelectItem value="hybrid" className="text-[10px] font-bold uppercase">Hybrid Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <CardDescription className="text-xl font-black text-slate-800 leading-none mt-2">
              {activeView === "all" ? "Screening Trend" : 
               activeView === "epds" ? "EPDS Scoring" : 
               activeView === "symptom" ? "Symptom Probability" : "Hybrid Analysis"}
            </CardDescription>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
          {showEpds && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50/50 rounded-md border border-blue-100/50">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              <span className="text-[10px] font-bold text-blue-700/80 uppercase tracking-tight">EPDS Score</span>
            </div>
          )}
          {showSymptom && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50/50 rounded-md border border-amber-100/50">
              <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              <span className="text-[10px] font-bold text-amber-700/80 uppercase tracking-tight">Symptom %</span>
            </div>
          )}
          {showHybrid && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50/50 rounded-md border border-emerald-100/50">
              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-[10px] font-bold text-emerald-700/80 uppercase tracking-tight">Hybrid %</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 min-h-[300px] pt-4 cursor-pointer">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            data={combinedData}
            onClick={handlePointClick}
            margin={{
              top: 10,
              right: 15,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#f1f5f9" />
            <XAxis
              dataKey="formattedDate"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              className="text-[10px] font-bold text-slate-400"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              domain={[0, (dataMax: number) => Math.max(100, dataMax)]}
              className="text-[10px] font-bold text-slate-400"
              tickFormatter={(val) => val === 0 ? "" : val}
            />
            <ChartTooltip
              cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }}
              content={<CustomTooltip />}
            />
            
            {showEpds && (
              <Line
                type="monotone"
                dataKey="epds"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls
                animationDuration={1000}
              />
            )}
            {showSymptom && (
              <Line
                type="monotone"
                dataKey="symptom"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls
                animationDuration={1000}
              />
            )}
            {showHybrid && (
              <Line
                type="monotone"
                dataKey="hybrid"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls
                animationDuration={1000}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 leading-none font-semibold text-slate-700">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              {activeView === "all" ? "Combined Progress Summary" : 
               activeView === "epds" ? "EPDS Score Stability" :
               activeView === "symptom" ? "Symptom Probability Map" : "Hybrid Depth Analysis"}
            </div>
            <div className="text-slate-400 text-[10px] font-medium leading-none">
              Last update: {new Date().toLocaleDateString()} • {combinedData.length} data points
            </div>
          </div>
        </div>
      </CardFooter>

    </Card>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-xl border border-slate-100 rounded-2xl min-w-[200px]">
        <p className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.1em]">{label}</p>
        <div className="space-y-3">
          {payload.map((entry: any, index: number) => {
            const isEPDS = entry.dataKey === "epds";
            const unit = isEPDS ? "pts" : "%";
            const indicatorLabel = isEPDS ? "EPDS Score" : 
                         entry.dataKey === "symptom" ? "Symptom Prob." : "Hybrid Prob.";
            
            return (
              <div key={index} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{indicatorLabel}</span>
                <div className="flex items-baseline gap-1">
                  <span 
                    className="text-xl font-black" 
                    style={{ color: entry.color }}
                  >
                    {entry.value}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{unit}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <TrendingUp className="h-3 w-3 text-primary animate-pulse" />
          <span className="text-[10px] text-primary font-black uppercase tracking-widest">Click for full report</span>
        </div>
      </div>
    );
  }
  return null;
}
