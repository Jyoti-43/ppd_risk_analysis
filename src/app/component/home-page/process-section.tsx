import Image from "next/image"

export function ProcessSection() {
  const steps = [
    {
      image: "/assets/image/risk-assessment-home.jpg",
      title: "Risk Assessment",
      description: "Take a gentle, 5-minute screening to help us understand where you are at emotionally.",
    },
    {
      image: "/assets/image/personalized-support-home.jpg",
      title: "Personalized Support",
      description: "Receive a curated list of articles, coping strategies, and professional help options.",
    },
    {
      image: "/assets/image/community-home.jpg",
      title: "Community Connection",
      description: "Join a safe, moderated space to connect with other mothers who understand your journey.",
    },
  ]

  return (
    <section className="py-24 px-6 lg:px-10 bg-[#fef2f8]/40">
      <div className="container mx-auto max-w-6xl flex flex-col gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="text-[40px] font-bold text-foreground">A Gentle Process</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Three simple steps designed to be supportive, not overwhelming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, idx) => (
            
            <div key={idx} className="flex flex-col gap-6">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-sm group">
                <Image
                  src={step.image || "/placeholder.svg"}
                  alt={step.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-[#f3b3d8] text-primary flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <h3 className="text-[20px] font-bold text-foreground">{step.title}</h3>
                </div>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
