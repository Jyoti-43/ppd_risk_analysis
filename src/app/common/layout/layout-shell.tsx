"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "./site-header"
import { SiteFooter } from "./site-footer"
import ProtectedRoute from "../../component/auth/ProtectedRoute/ProtectedRoute"

const AUTH_PREFIXES = ["/login", "/signup", "/forgotPassword", "/resetPassword", "/(auth)"]
const PUBLIC_ROUTES = ["/"] // Add public routes that don't need protection

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute = AUTH_PREFIXES.some((p) => pathname?.startsWith(p))
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname || "")

  // Auth routes: no header/footer, no protection
  if (isAuthRoute) {
    return <>{children}</>
  }

  // Public routes: header/footer, no protection
  if (isPublicRoute) {
    return (
      <>
        <SiteHeader />
        {children}
        <SiteFooter />
      </>
    )
  }

  

  // Protected routes: header/footer + authentication required
  return (
    <ProtectedRoute>
      <SiteHeader />
      {children}
      <SiteFooter />
    </ProtectedRoute>
  )
}
