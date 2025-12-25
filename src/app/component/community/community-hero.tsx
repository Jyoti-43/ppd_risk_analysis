import { Button } from "@/components/ui/button"
import { FilePen } from "lucide-react"
import Image from "next/image"

export function CommunityHero() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-8 lg:py-12">
      {/* Hero Illustration */}
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="relative w-full aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-[#f5e6d3]">
          <Image src="/abstract-illustration-of-diverse-hands-forming-a-c.jpg" alt="Community illustration" fill className="object-contain p-8" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-3">
          <h1 className="text-[40px] lg:text-[48px] font-black text-foreground leading-[1.1] tracking-tight">
            Community
          </h1>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-[560px]">
            Welcome to your safe haven. Connect with other mothers, join support groups, and share your journey through
            our stories feed.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mt-1">
          <Button className="rounded-full h-11 px-6 bg-primary hover:bg-[#b50d62] text-white font-semibold shadow-sm">
            <span className="material-symbols-outlined text-[18px] mr-1.5"> <FilePen  strokeWidth={3} size={18} /></span>
            Create Post
          </Button>
          <Button
            variant="outline"
            className="rounded-full h-11 px-6 bg-white border-border hover:bg-secondary font-semibold"
          >
            Guidelines
          </Button>
        </div>
      </div>
    </div>
  )
}
