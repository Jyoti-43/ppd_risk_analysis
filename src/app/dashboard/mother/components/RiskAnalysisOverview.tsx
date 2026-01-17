"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, ChevronDown, AlertTriangle } from "lucide-react";

interface DataPoint {
    label: string;
    value: number;
}

interface RiskAnalysisOverviewProps {
    data?: DataPoint[];
    riskLevel?: "low" | "moderate" | "high";
    className?: string;
}

const defaultData: DataPoint[] = [
    { label: "Jan 7", value: 30 },
    { label: "Jan 8", value: 45 },
    { label: "Jan 9", value: 40 },
    { label: "Jan 10", value: 55 },
    { label: "Jan 11", value: 35 },
    { label: "Jan 12", value: 60 },
    { label: "Jan 13", value: 50 },
];

export function RiskAnalysisOverview({
    data = defaultData,
    riskLevel = "low",
    className,
}: RiskAnalysisOverviewProps) {
    const maxValue = Math.max(...data.map((d) => d.value));

    const riskConfig = {
        low: {
            label: "Risk Identified as Low Levels",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-200",
        },
        moderate: {
            label: "Risk Identified as Moderate Levels",
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200",
        },
        high: {
            label: "Risk Identified as High Levels",
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
        },
    };

    const risk = riskConfig[riskLevel];

    return (
        <Card className={cn("border-0 shadow-sm", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                    <CardTitle className="text-base font-semibold">
                        Risk Analysis Overview
                    </CardTitle>
                    <Badge variant="secondary" className="gap-1 text-xs">
                        <TrendingUp className="h-3 w-3" />
                        Strong/+
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        Active Recommended{" "}
                        <span className="text-primary font-medium">High</span>
                    </span>
                    <button className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs">
                        1 Week
                        <ChevronDown className="h-3 w-3" />
                    </button>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                {/* Chart Area */}
                <div className="relative h-48">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                        {[100, 75, 50, 25, 0].map((val) => (
                            <div
                                key={val}
                                className="flex items-center border-b border-dashed border-border/50"
                            >
                                <span className="w-8 text-xs text-muted-foreground">{val}</span>
                            </div>
                        ))}
                    </div>

                    {/* Chart visualization */}
                    <svg className="absolute inset-0 ml-8 h-full w-[calc(100%-2rem)]" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>
                        {/* Area fill */}
                        <path
                            d={`M 0 ${192 - (data[0].value / maxValue) * 180} ${data
                                .map(
                                    (d, i) =>
                                        `L ${(i / (data.length - 1)) * 100}% ${192 - (d.value / maxValue) * 180}`
                                )
                                .join(" ")} L 100% 192 L 0 192 Z`}
                            fill="url(#chartGradient)"
                        />
                        {/* Line */}
                        <path
                            d={`M 0 ${192 - (data[0].value / maxValue) * 180} ${data
                                .map(
                                    (d, i) =>
                                        `L ${(i / (data.length - 1)) * 100}% ${192 - (d.value / maxValue) * 180}`
                                )
                                .join(" ")}`}
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="2"
                        />
                        {/* Data points */}
                        {data.map((d, i) => (
                            <circle
                                key={i}
                                cx={`${(i / (data.length - 1)) * 100}%`}
                                cy={192 - (d.value / maxValue) * 180}
                                r="4"
                                fill="var(--card)"
                                stroke="var(--primary)"
                                strokeWidth="2"
                            />
                        ))}
                    </svg>

                    {/* X-axis labels */}
                    <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-muted-foreground">
                        {data.map((d) => (
                            <span key={d.label}>{d.label}</span>
                        ))}
                    </div>
                </div>

                {/* Risk Status */}
                <div
                    className={cn(
                        "mt-6 flex items-center gap-2 rounded-lg border p-3",
                        risk.bgColor,
                        risk.borderColor
                    )}
                >
                    <AlertTriangle className={cn("h-4 w-4", risk.color)} />
                    <span className={cn("text-sm font-medium", risk.color)}>
                        {risk.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Follow necessary precautions and continue regular check-ups.
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
