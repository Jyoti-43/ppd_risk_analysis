import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Anonymous Mom",
      date: "2 days ago",
      rating: 5,
      quote:
        "I finally felt understood. The screening was gentle and the resources helped me find a therapist without feeling overwhelmed.",
    },
    {
      name: "Sarah J.",
      date: "1 week ago",
      rating: 5,
      quote:
        "It's a relief to know I'm not alone in feeling this way. The articles really helped me explain my feelings to my partner.",
    },
    {
      name: "Anonymous Mom",
      date: "3 weeks ago",
      rating: 5,
      quote: "A safe space when I felt most vulnerable. Highly recommend for any new mom questioning her feelings.",
    },
  ]

  return (
    <section className="py-24 px-6 lg:px-10 bg-white">
      <div className="container mx-auto max-w-6xl text-center flex flex-col items-center gap-16">
        <h2 className="text-[40px] font-bold text-foreground">Voices of Mothers</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="p-8 rounded-[32px] border border-border bg-[#fcf8fa]/30 flex flex-col gap-6 text-left"
            >
              <div className="flex items-center gap-4">
                <Avatar className="size-12 border border-border">
                  <AvatarFallback className="bg-secondary text-primary font-bold">{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold">{testimonial.name}</span>
                  <span className="text-[12px] text-muted-foreground">{testimonial.date}</span>
                </div>
              </div>

              <div className="flex gap-0.5 text-[#f3b3d8]">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px] fill">
                    star
                  </span>
                ))}
              </div>

              <p className="text-[15px] leading-relaxed text-muted-foreground italic">
                &quot;{testimonial.quote}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
