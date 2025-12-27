export function TrustSection() {
  const trustFeatures = [
    {
      icon: "verified_user",
      title: "Private & Anonymous",
      description:
        "Your data stays yours. No tracking, no judgment. Complete the screening anonymously without creating an account.",
    },
    {
      icon: "medical_services",
      title: "Clinically Backed",
      description:
        "Our assessment is based on the clinically validated Edinburgh Postnatal Depression Scale used by professionals.",
    },
    {
      icon: "tips_and_updates",
      title: "Instant Guidance",
      description:
        "Get immediate, personalized resources, coping mechanisms, and therapist recommendations based on your score.",
    },
  ]

  return (
    <section className="py-24 px-6 lg:px-10 bg-white rounded-2xl">
      <div className="container mx-auto max-w-6xl text-center flex flex-col items-center gap-4 mb-16">
        <h2 className="text-[40px] font-bold text-foreground">Why Trust Us?</h2>
        <p className="text-lg text-muted-foreground max-w-[680px] leading-relaxed">
          Your mental health journey is personal. We prioritize your privacy and safety above all else, creating a
          sanctuary for your healing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto max-w-6xl">
        {trustFeatures.map((feature, idx) => (
          <div
            key={idx}
            className="group p-8 rounded-[32px] border border-border bg-[#fcf8fa]/50 hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-[24px] fill">{feature.icon}</span>
            </div>
            <h3 className="text-[20px] font-bold mb-4 text-foreground">{feature.title}</h3>
            <p className="text-[15px] leading-relaxed text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
