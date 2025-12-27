'use client';
import React from 'react'
import { HomeHero } from './component/home-page/home-her';
import { TrustSection } from './component/home-page/trust-section';
import { ProcessSection } from './component/home-page/process-section';
import { TestimonialsSection } from './component/home-page/testimonials-section';
import { FinalCTA } from './component/home-page/final-CTA';


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans background">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-center   ">
        <HomeHero />
        <TrustSection />
        <ProcessSection />
        <TestimonialsSection />
        <FinalCTA />
        
      </main>
    </div>
  );
}
