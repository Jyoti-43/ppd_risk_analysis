"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, Users, Moon, Award, Star, Sparkles } from "lucide-react";

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    earned: boolean;
}

const defaultAchievements: Achievement[] = [
    {
        id: "sensitivity",
        title: "Sensitivity Linked",
        description: "Completed sensitivity assessment",
        icon: Heart,
        color: "text-rose-600",
        bgColor: "bg-rose-100",
        earned: true,
    },
    {
        id: "partner",
        title: "Partner Links",
        description: "Connected with support partner",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        earned: true,
    },
    {
        id: "sleep",
        title: "Sleep Improvement",
        description: "7 days of improved sleep",
        icon: Moon,
        color: "text-violet-600",
        bgColor: "bg-violet-100",
        earned: true,
    },
    {
        id: "streak",
        title: "Streak Master",
        description: "14 day check-in streak",
        icon: Award,
        color: "text-amber-600",
        bgColor: "bg-amber-100",
        earned: false,
    },
    {
        id: "mindful",
        title: "Mindful Maven",
        description: "Complete 10 meditations",
        icon: Sparkles,
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
        earned: false,
    },
];

interface AchievementsSectionProps {
    achievements?: Achievement[];
    className?: string;
}

export function AchievementsSection({
    achievements = defaultAchievements,
    className,
}: AchievementsSectionProps) {
    return (
        <Card className={cn("border-0 shadow-sm", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Achievements</CardTitle>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                    View All
                </Button>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className={cn(
                                "flex min-w-[100px] flex-col items-center gap-2 rounded-xl p-3 text-center transition-all",
                                achievement.earned
                                    ? "bg-card shadow-sm ring-1 ring-border"
                                    : "opacity-50"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex h-12 w-12 items-center justify-center rounded-full",
                                    achievement.bgColor
                                )}
                            >
                                <achievement.icon className={cn("h-6 w-6", achievement.color)} />
                            </div>
                            <span className="text-xs font-medium text-foreground line-clamp-2">
                                {achievement.title}
                            </span>
                            {achievement.earned && (
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
