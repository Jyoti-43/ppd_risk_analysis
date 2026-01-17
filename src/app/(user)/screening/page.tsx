"use client";

import { Button } from "@/components/ui/button"
import Link from "next/link"


export default function ScreeningPage() {
  return (
    <div className="min-h-screen flex flex-col">
   

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 lg:px-10 py-12 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left Content */}
              <div className="flex-1 space-y-8">
                {/* <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <span className="material-symbols-outlined text-primary text-[18px]">info</span>
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">Step 1 of 5</span>
                </div> */}

                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                    Your Well-being <span className="text-primary">Matters</span>
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                    This is a safe, confidential space to understand how you are feeling and connect you with the right
                    support. There are no right or wrong answers—only your truth.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Linking to the assessment page */}
                  {/* <Link href="/screening/epds-assessment"> */}
                   <Link href="/screening/select-screening-method">
                    <Button className="rounded-full h-12 px-8 bg-primary hover:bg-[#b50d62] text-white font-semibold shadow-md">
                      <span className="material-symbols-outlined text-[20px] mr-2">arrow_forward</span>
                      Start Screening
                    </Button>
                  </Link>
                  <Button variant="outline" className="rounded-full h-12 px-8 font-semibold border-2 bg-transparent">
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Right Image */}
              <div className="flex-1 w-full max-w-lg">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/screen.png"
                    alt="Mother holding baby in warm lighting"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="px-6 lg:px-10 py-16 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">What to expect</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We are here to support you through every step of your postpartum journey with privacy and care.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-border text-center space-y-4">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10">
                  <span className="material-symbols-outlined text-primary text-[32px]">schedule</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Less than 5 minutes</h3>
                <p className="text-muted-foreground">A quick check-in designed to respect your time as a new mother.</p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-border text-center space-y-4">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10">
                  <span className="material-symbols-outlined text-primary text-[32px]">lock</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">100% Confidential</h3>
                <p className="text-muted-foreground">
                  Your answers are private, secure, and protected by HIPAA standards.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-border text-center space-y-4">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10">
                  <span className="material-symbols-outlined text-primary text-[32px]">favorite</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Personalized Support</h3>
                <p className="text-muted-foreground">
                  Receive immediate guidance tailored specifically to your feelings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Banner */}
        <section className="px-6 lg:px-10 py-8 bg-red-50 border-t border-red-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-red-600 text-[24px] mt-0.5">error</span>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  If you are in immediate danger or need urgent help, please do not use this tool.{" "}
                  <Link href="/crisis-resources" className="font-semibold text-red-600 underline hover:text-red-700">
                    Click here for emergency resources
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

    
    </div>
  )
}
