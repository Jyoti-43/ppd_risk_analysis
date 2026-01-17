"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizResultsProps {
    overallScore?: number;
    weeklyResults?: { day: string; score: number }[];
    className?: string;
}

const defaultWeeklyResults = [
    { day: "Mon", score: 85 },
    { day: "Tue", score: 72 },
    { day: "Wed", score: 90 },
    { day: "Thu", score: 68 },
    { day: "Fri", score: 88 },
    { day: "Sat", score: 95 },
    { day: "Sun", score: 80 },
];

export function QuizResults({
    overallScore = 78,
    weeklyResults = defaultWeeklyResults,
    className,
}: QuizResultsProps) {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (overallScore / 100) * circumference;

    const getScoreColor = (score: number) => {
        if (score >= 80) return "bg-emerald-500";
        if (score >= 60) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <Card className={cn("border-0 shadow-sm", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Quiz Results</CardTitle>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                    View All
                </Button>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex items-center gap-6">
                    {/* Circular Progress */}
                    <div className="relative">
                        <svg className="h-28 w-28 -rotate-90 transform">
                            {/* Background circle */}
                            <circle
                                cx="56"
                                cy="56"
                                r="45"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-muted"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="56"
                                cy="56"
                                r="45"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="text-primary transition-all duration-500"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-foreground">
                                {overallScore}%
                            </span>
                            <span className="text-xs text-muted-foreground">Score</span>
                        </div>
                    </div>

                    {/* Weekly Results Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-7 gap-1.5">
                            {weeklyResults.map((result) => (
                                <div key={result.day} className="flex flex-col items-center gap-1">
                                    <div
                                        className={cn(
                                            "h-14 w-3 rounded-full",
                                            getScoreColor(result.score)
                                        )}
                                        style={{
                                            opacity: result.score / 100,
                                        }}
                                        title={`${result.day}: ${result.score}%`}
                                    />
                                    <span className="text-[10px] text-muted-foreground">
                                        {result.day}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
