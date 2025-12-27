import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function HomeHero() {
  return (
    <section className="py-16 md:py-5 lg:py-12 px-2 lg:px-10 max-w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 xl:gap-24">
        <div className="order-2 lg:order-1 flex justify-center lg:justify-end">
          <div className="relative w-full aspect-[4/3] lg:aspect-square max-w-full md:w-full  rounded-[40px] overflow-hidden shadow-2xl shadow-primary/5">
            <Image
              src="/hero-image.jpg"
              alt="Mother hugging baby"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2 flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 rounded-full border border-primary/20 w-fit">
            <span className="material-symbols-outlined text-[16px] text-primary fill">favorite</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Safe Space</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] text-foreground tracking-tight">
            It&apos;s okay not to feel <br className="hidden md:block" />
            okay. <span className="text-primary italic font-serif">We&apos;re here to help.</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-[520px]">
            A private, non-judgmental space to assess your postpartum health, understand your feelings, and find the
            gentle support you deserve.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Button
              asChild
              className="rounded-full h-14 px-10 bg-primary hover:bg-[#b50d62] text-white font-bold text-base shadow-lg shadow-primary/20"
            >
              <Link href="/screening">Start Risk Analysis</Link>
            </Button>
            <Button variant="outline" className="rounded-full h-14 px-10 border-border bg-white font-bold text-base">
              Read Guide
            </Button>
          </div>

          <div className="flex items-center gap-2.5 mt-4 text-[#6b6b6b]">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span className="text-[13px] font-medium tracking-tight">100% Anonymous & Secure</span>
          </div>
        </div>
      </div>
    </section>
  )
}
