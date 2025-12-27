'use client';
import React from 'react'
import { HomeHero } from './component/home-page/home-her';


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans background">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-center   ">
        <HomeHero />
        
      </main>
    </div>
  );
}
