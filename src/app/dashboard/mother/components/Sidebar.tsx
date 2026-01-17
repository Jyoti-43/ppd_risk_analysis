"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Lightbulb,
  Heart,
  Dumbbell,
  Calendar,
  Bell,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive?: boolean;
}

interface AlertItem {
  date: string;
  message: string;
}

const navItems: NavItem[] = [
  { icon: BookOpen, label: "Book Guides", href: "#", isActive: true },
  { icon: Lightbulb, label: "Wellness tips", href: "#" },
  { icon: Heart, label: "Meditations", href: "#" },
  { icon: Dumbbell, label: "Exercises", href: "#" },
  { icon: Calendar, label: "Events", href: "#" },
];

const recentAlerts: AlertItem[] = [
  { date: "Monday, 19 May", message: "Weekly wellbeing & Buzz Audios" },
  { date: "Monday, 17 May", message: "New Recommended Topics" },
  { date: "Monday, 14 May", message: "New in-season Recipes added" },
];

interface SidebarProps {
  userName?: string;
  userAvatar?: string;
  className?: string;
}

export function Sidebar({
  userName = "Sarah Jenkins",
  userAvatar = "/avatars/sarah.jpg",
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col bg-card border-r border-border",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <Heart className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">
          Wellness Mom
        </span>
      </div>

      {/* User Profile Card */}
      <div className="mx-4 mb-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent p-4">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary/20 text-primary text-lg">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h3 className="mt-3 font-medium text-foreground">{userName}</h3>
          <Button
            variant="default"
            size="sm"
            className="mt-3 rounded-full px-6"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Book Guides
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                item.isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Recent Alerts */}
      <div className="mt-6 flex-1 px-4">
        <div className="flex items-center justify-between px-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent Alerts
          </p>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-3 space-y-3">
          {recentAlerts.map((alert, idx) => (
            <div key={idx} className="rounded-lg bg-accent/50 p-3">
              <p className="text-xs font-medium text-foreground">
                {alert.date}
              </p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-auto space-y-2 p-4">
        <Button variant="outline" className="w-full justify-between" size="sm">
          View All
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
          <Sparkles className="h-4 w-4 text-primary" />
          Recommend to us
        </Button>
      </div>
    </aside>
  );
}
