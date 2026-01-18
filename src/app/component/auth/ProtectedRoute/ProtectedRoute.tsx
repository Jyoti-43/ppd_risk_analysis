"use client";

import { useAppSelector } from "@/src/app/Hooks/hook";
import {
  selectCurrentUser,
  selectIsLoggedIn,
} from "@/src/app/redux/feature/user/userSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles: string[]; // allowed roles
}

export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const role = useAppSelector(selectCurrentUser)?.role ?? "";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (mounted) {
      if (!isLoggedIn || !roles.includes(role)) {
        router.push("/login");
      } else if (role === "contributor") {
        const setupCompleted = localStorage.getItem(
          `setup_completed_${currentUser?.userId}`,
        );
        if (
          !setupCompleted &&
          !window.location.pathname.includes("/profile-setup")
        ) {
          router.push("/dashboard/contributor/profile-setup");
        }
      }
    }
  }, [mounted, isLoggedIn, router, role, roles, currentUser?.userId]);

  // Don't render protected content until we've checked auth on client
  if (!mounted || !isLoggedIn || !roles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
