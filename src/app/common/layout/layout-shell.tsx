"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import ProtectedRoute from "../../component/auth/ProtectedRoute/ProtectedRoute";

const AUTH_PREFIXES = [
  "/login",
  "/signup",
  "/forgotPassword",
  "/resetPassword",
  "/contributor-login",
  "/(auth)",
];
const PUBLIC_ROUTES = ["/"]; // Add public routes that don't need protection

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_PREFIXES.some((p) => pathname?.startsWith(p));
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname || "");
  const isDashboardRoute = pathname?.startsWith("/dashboard");
  // Auth routes: no header/footer, no protection
  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (isDashboardRoute) {
    let allowedRoles = ["mother", "contributor", "admin"];

    if (pathname?.startsWith("/dashboard/mother")) {
      allowedRoles = ["mother"];
    } else if (pathname?.startsWith("/dashboard/contributor")) {
      allowedRoles = ["contributor"];
    } else if (pathname?.startsWith("/dashboard/admin")) {
      allowedRoles = ["admin"];
    }

    return (
      <ProtectedRoute roles={allowedRoles}>
        <SiteHeader />
        {children}
      </ProtectedRoute>
    );
  }

  // Public routes: header/footer, no protection
  if (isPublicRoute) {
    return (
      <>
        <SiteHeader />
        {children}
        <SiteFooter />
      </>
    );
  }

  // Protected routes: header/footer + authentication required
  return (
    <ProtectedRoute roles={["mother", "contributor", "admin"]}>
      <SiteHeader />
      {children}
      <SiteFooter />
    </ProtectedRoute>
  );
}
