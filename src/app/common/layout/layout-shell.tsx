"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "./site-header"
import { SiteFooter } from "./site-footer"

const AUTH_PREFIXES = ["/login", "/signup", "/forgotPassword", "/resetPassword", "/(auth)"]

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute = AUTH_PREFIXES.some((p) => pathname?.startsWith(p))

  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  )
}
