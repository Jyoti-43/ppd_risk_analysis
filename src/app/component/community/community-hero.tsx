"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface CommunityHeroProps {
  activeTab: string
}

export function CommunityHero({ activeTab }: CommunityHeroProps) {
  const content = {
    feed: {
      title: "Community",
      description:
        "Welcome to your safe haven. Connect with other mothers, join support groups, and share your journey through our stories feed.",
      primaryButton: { icon: "edit", label: "Create Post", href: "/community/create-post" },
      secondaryButton: { icon: "edit", label: "Guidelines" },
    },
    groups: {
      title: "Community Groups",
      description:
        "Find your tribe. Join moderated groups focused on shared experiences, or create your own safe space to connect with other mothers.",
      primaryButton: { icon: "add_circle", label: "Create Group", href: "/community/create-post" },
      secondaryButton: { icon: "explore", label: "Discover" },
    },
    stories: {
      title: "Community Stories",
      description:
        "Welcome to your safe haven. Read inspiring stories from mothers who walked this path, or share your own journey of strength.",
      primaryButton: { icon: "edit", label: "Share Your Story", href: "/community/create-post" },
      secondaryButton: { icon: "edit", label: "Guidelines" },
    },
  }

  const currentContent = content[activeTab as keyof typeof content] || content.feed

  const primaryContent = (
    <>
      {currentContent.primaryButton.icon && (
        <span className="material-symbols-outlined text-[18px] mr-1.5">{currentContent.primaryButton.icon}</span>
      )}
      {currentContent.primaryButton.label}
    </>
  )

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-8 lg:py-12">
      {/* Hero Illustration */}
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="relative w-full aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-[#f5e6d3]">
          <Image
            src="/abstract-illustration-of-diverse-hands-forming-a-c.jpg"
            alt="Community illustration"
            fill
            className="object-contain p-8"
          />
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-3">
          <h1 className="text-[40px] lg:text-[48px] font-black text-foreground leading-[1.1] tracking-tight">
            {currentContent.title}
          </h1>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-[560px]">
            {currentContent.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mt-1">
          <Button
            className="rounded-full h-11 px-6 bg-primary hover:bg-[#b50d62] text-white font-semibold shadow-sm"
            asChild={Boolean(currentContent.primaryButton.href)}
          >
            {currentContent.primaryButton.href ? (
              <Link href={currentContent.primaryButton.href}>{primaryContent}</Link>
            ) : (
              primaryContent
            )}
          </Button>
          <Button
            variant="outline"
            className="rounded-full h-11 px-6 bg-white border-border hover:bg-secondary font-semibold"
          >
            {currentContent.secondaryButton.icon && (
              <span className="material-symbols-outlined text-[18px] mr-1.5 fill">
                {currentContent.secondaryButton.icon}
              </span>
            )}
            {currentContent.secondaryButton.label}
          </Button>
        </div>
      </div>
    </div>
  )
}
