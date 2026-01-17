"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    ClipboardList,
    AlertCircle,
    Users,
    Sparkles,
    Leaf,
    Moon,
} from "lucide-react";

interface ActionButtonProps {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
}

function ActionButton({
    icon: Icon,
    label,
    onClick,
    variant = "primary",
}: ActionButtonProps) {
    return (
        <Button
            variant={variant === "primary" ? "default" : "outline"}
            className={cn(
                "h-auto flex-col gap-2 py-4 rounded-xl",
                variant === "primary"
                    ? "bg-primary hover:bg-primary/90"
                    : "border-primary/20 hover:bg-primary/5"
            )}
            onClick={onClick}
        >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
        </Button>
    );
}

interface GroupBadgeProps {
    icon: React.ElementType;
    label: string;
    color?: string;
}

function GroupBadge({ icon: Icon, label, color = "bg-primary/10" }: GroupBadgeProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
                color
            )}
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </div>
    );
}

interface QuickActionsHubProps {
    className?: string;
}

const activeGroups = [
    { icon: Sparkles, label: "New Moms Support", color: "bg-rose-100 text-rose-700" },
    { icon: Leaf, label: "Yoga & Wellness", color: "bg-emerald-100 text-emerald-700" },
    { icon: Moon, label: "Mindfulness", color: "bg-violet-100 text-violet-700" },
];

export function QuickActionsHub({ className }: QuickActionsHubProps) {
    return (
        <Card className={cn("border-0 shadow-sm", className)}>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                    Quick Actions Hub
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <ActionButton
                        icon={ClipboardList}
                        label="Take a Quiz"
                        variant="primary"
                    />
                    <ActionButton
                        icon={AlertCircle}
                        label="View Crisis Resources"
                        variant="secondary"
                    />
                </div>

                {/* Active Groups */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-foreground">
                            Your Active Groups
                        </h4>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                            View All
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {activeGroups.map((group) => (
                            <GroupBadge
                                key={group.label}
                                icon={group.icon}
                                label={group.label}
                                color={group.color}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
