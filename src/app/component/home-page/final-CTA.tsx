import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FinalCTA() {
  return (
     <section className="py-24 px-6 lg:px-10 bg-[#fef2f8]/40">
      <div className="container mx-auto max-w-6xl flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col gap-6 ">
          <h2 className="text-4xl md:text-[48px] font-bold text-foreground leading-tight tracking-tight">
            You are doing the best you can.
          </h2>
          <p className="text-lg text-center text-muted-foreground max-w-[580px] mx-auto leading-relaxed">
            Taking the first step is often the hardest. We are here to walk with you.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            asChild
            className="rounded-full h-14 px-10 bg-primary hover:bg-[#b50d62] text-white font-bold text-base shadow-lg shadow-primary/20"
          >
            <Link href="/screening">Take Screening</Link>
          </Button>
          <Button variant="outline" className="rounded-full h-14 px-10 border-border bg-white font-bold text-base">
            Browse Resources
          </Button>
        </div>
      </div>
    </section>
  )
}
