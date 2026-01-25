"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  AlertCircle,
  Calendar,
  CheckCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "CRITICAL",
    title: "High Risk detected for Sarah Johnson",
    message:
      "Recent screening indicates severe symptoms. Immediate follow-up recommended.",
    timestamp: "2 hours ago",
    isRead: false,
  },
  {
    id: 2,
    type: "REMINDER",
    title: "Follow-up Appointment with Emily Davis",
    message: "Scheduled for tomorrow at 10:00 AM.",
    timestamp: "5 hours ago",
    isRead: false,
  },
  {
    id: 3,
    type: "UPDATE",
    title: "New Screening Completed",
    message: "Jessica Wilson completed a weekly check-in. Risk level: Low.",
    timestamp: "1 day ago",
    isRead: true,
  },
  {
    id: 4,
    type: "SYSTEM",
    title: "Weekly Report Available",
    message: "Your weekly partner summary report is ready for download.",
    timestamp: "2 days ago",
    isRead: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="p-8 space-y-8 min-h-screen bg-gray-50/50">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Bell className="h-8 w-8 text-[#FF6B98]" />
          Notifications
        </h1>
        <p className="text-muted-foreground">
          Stay updated with real-time alerts and reminders.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {MOCK_NOTIFICATIONS.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {MOCK_NOTIFICATIONS.filter((n) => !n.isRead).map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
          {MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length === 0 && (
            <EmptyState message="No unread notifications." />
          )}
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          {MOCK_NOTIFICATIONS.filter((n) => n.type === "CRITICAL").map(
            (notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ),
          )}
          {MOCK_NOTIFICATIONS.filter((n) => n.type === "CRITICAL").length ===
            0 && <EmptyState message="No critical alerts." />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationCard({ notification }: { notification: any }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "CRITICAL":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "REMINDER":
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case "UPDATE":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "SYSTEM":
        return <CheckCircle2 className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "CRITICAL":
        return "bg-red-50 border-red-100";
      case "REMINDER":
        return "bg-orange-50 border-orange-100";
      default:
        return "bg-white border-gray-100";
    }
  };

  return (
    <Card
      className={`border shadow-sm transition-all hover:shadow-md ${getBgColor(
        notification.type,
      )} ${!notification.isRead ? "border-l-4 border-l-[#FF6B98]" : ""}`}
    >
      <CardContent className="p-4 flex gap-4 items-start">
        <div
          className={`mt-1 p-2 rounded-full bg-white shadow-sm flex-shrink-0`}
        >
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-start">
            <h4
              className={`font-semibold text-base ${
                notification.type === "CRITICAL"
                  ? "text-red-700"
                  : "text-gray-900"
              }`}
            >
              {notification.title}
            </h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {notification.timestamp}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {notification.message}
          </p>
          {notification.type === "CRITICAL" && (
            <div className="pt-2">
              <Button size="sm" variant="destructive" className="h-7 text-xs">
                Take Action
              </Button>
            </div>
          )}
        </div>
        {!notification.isRead && (
          <div
            className="mt-2 h-2 w-2 bg-[#FF6B98] rounded-full flex-shrink-0"
            title="Unread"
          ></div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Bell className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  );
}
