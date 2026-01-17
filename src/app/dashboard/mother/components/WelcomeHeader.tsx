"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, Flame, Trophy, Sparkles } from "lucide-react";

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    iconBgColor?: string;
    iconColor?: string;
}

function StatCard({
    icon: Icon,
    label,
    value,
    iconBgColor = "bg-primary/10",
    iconColor = "text-primary",
}: StatCardProps) {
    return (
        <Card className="border-0 bg-card/80 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
                <div className={cn("rounded-full p-2", iconBgColor)}>
                    <Icon className={cn("h-5 w-5", iconColor)} />
                </div>
                <div>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                </div>
            </CardContent>
        </Card>
    );
}

interface WelcomeHeaderProps {
    userName?: string;
    totalCheckups?: number;
    streak?: number;
    totalPoints?: number;
    className?: string;
}

export function WelcomeHeader({
    userName = "Sarah",
    totalCheckups = 24,
    streak = 13,
    totalPoints = 2350,
    className,
}: WelcomeHeaderProps) {
    const tabs = ["Dashboard", "Screenings", "Resources", "Newsfeed"];

    return (
        <div className={cn("space-y-6", className)}>
            {/* Navigation Tabs */}
            <div className="flex items-center justify-between">
                <nav className="flex gap-1 rounded-full bg-card p-1 shadow-sm">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab}
                            className={cn(
                                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                                idx === 0
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <Sparkles className="h-4 w-4" />
                        Knowledge Hub
                    </button>
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        Resources
                    </button>
                </div>
            </div>

            {/* Welcome Section */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Welcome back, {userName}!
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Here is your wellness journey. Just keep up this great progress!
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Privacy Mode</span>
                    <div className="h-5 w-9 rounded-full bg-primary/20 p-0.5">
                        <div className="h-4 w-4 rounded-full bg-card shadow" />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard
                    icon={Calendar}
                    label="TOTAL CHECK-UPS"
                    value={totalCheckups}
                    iconBgColor="bg-amber-100"
                    iconColor="text-amber-600"
                />
                <StatCard
                    icon={Flame}
                    label="STREAK"
                    value={`${streak} days`}
                    iconBgColor="bg-orange-100"
                    iconColor="text-orange-500"
                />
                <StatCard
                    icon={Trophy}
                    label="TOTAL POINTS"
                    value={totalPoints.toLocaleString()}
                    iconBgColor="bg-emerald-100"
                    iconColor="text-emerald-600"
                />
            </div>
        </div>
    );
}
