import { Button } from "@/components/ui/button";



export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-blob blur-3xl opacity-50" />
      
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Empathetic Support for <span className="text-primary">Postpartum Wellness</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Take a moment for yourself. Our risk analysis tool provides a safe space 
          to understand your feelings and connect with the support you deserve.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg" className="rounded-full px-8 py-6 text-lg hover:bg-primary-hover active:bg-primary-active">
            Start Free Screening
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}