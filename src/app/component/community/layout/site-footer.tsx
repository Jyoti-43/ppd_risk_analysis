import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-background py-6 mt-12">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-6 lg:px-10">
        <div className="flex items-center gap-2 text-foreground">
          <div className="size-5 text-primary">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="text-sm font-semibold">MotherCare © 2025</span>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link href="/crisis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Crisis Support
          </Link>
        </nav>
      </div>
    </footer>
  )
}
