
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="w-full bg-[#361a27] text-white py-16 px-6 lg:px-20 md:px-12 mt-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16">
          {/* Logo and Description */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <div className="size-6 text-primary">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="text-[19px] font-bold tracking-tight">MotherCare</span>
            </div>
            <p className="text-sm leading-relaxed text-[#d4a3c0] max-w-[280px]">
              Supporting mothers through the journey of postpartum health with compassion, privacy, and clinical
              expertise.
            </p>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[15px] font-bold uppercase tracking-wider text-white">Resources</h4>
            <nav className="flex flex-col gap-3.5">
              <Link href="/screening" className="text-[14px] text-[#d4a3c0] hover:text-white transition-colors">
                Risk Analysis
              </Link>
              <Link href="/resources" className="text-[14px] text-[#d4a3c0] hover:text-white transition-colors">
                Find a Therapist
              </Link>
              <Link href="/" className="text-[14px] text-[#d4a3c0] hover:text-white transition-colors">
                Community Forum
              </Link>
              <Link href="/guide" className="text-[14px] text-[#d4a3c0] hover:text-white transition-colors">
                Partner Guide
              </Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[15px] font-bold uppercase tracking-wider text-white">Legal</h4>
            <nav className="flex flex-col gap-3.5">
              <Link href="/privacy" className="text-[14px] text-[#d4a3c0] hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[14px] text-[#d4a3c0] hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/disclaimer" className="text-[14px] text-[#d4a3c0] hover:text-white transition-colors">
                Disclaimer
              </Link>
            </nav>
          </div>

          {/* Crisis Support Box */}
          <div className="lg:col-span-1">
            <div className="bg-[#4a2334] rounded-2xl p-6 border border-[#5c2e42] flex flex-col gap-4">
              <div className="flex items-center gap-2.5 text-primary">
                <span className="material-symbols-outlined text-[20px] fill">emergency</span>
                <span className="text-[14px] font-bold uppercase tracking-widest">Crisis Support</span>
              </div>
              <p className="text-[13px] leading-relaxed text-[#f3b3d8]/80">
                If you are in immediate danger, please call 911 or your local emergency number.
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-black text-white">988</span>
                <span className="text-[11px] font-medium text-[#d4a3c0] uppercase tracking-tighter leading-tight">
                  (Suicide & Crisis Lifeline)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#4a2334] flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[13px] text-[#d4a3c0]/60">© 2025 MamaCare Support System. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <button className="text-[#d4a3c0] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">language</span>
            </button>
            <button className="text-[#d4a3c0] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
            <button className="text-[#d4a3c0] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}




// import Link from "next/link"

// export function SiteFooter() {
//   return (
//     <footer className="w-full border-t border-border bg-background py-6 mt-12">
//       <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-6 lg:px-10">
//         <div className="flex items-center gap-2 text-foreground">
//           <div className="size-5 text-primary">
//             <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//             </svg>
//           </div>
//           <span className="text-sm font-semibold">MotherCare © 2025</span>
//         </div>

//         <nav className="flex items-center gap-6">
//           <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//             Privacy Policy
//           </Link>
//           <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//             Terms of Service
//           </Link>
//           <Link href="/crisis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//             Crisis Support
//           </Link>
//         </nav>
//       </div>
//     </footer>
//   )
// }
