"use client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";

export default function ArticleResources() {
  const [activeFilter, setActiveFilter] = useState("all");

  const articles = [
    {
      id: 1,
      tag: "Self-Care",
      tagColor: "bg-gray-100",
      imageGradient: "from-gray-300 to-gray-400",
      date: "Oct 24, 2023",
      readTime: "5 min read",
      title: "Reclaiming Your Sleep Schedule",
      description:
        "Simple, non-judgmental tips for finding rest in the chaos of newborn life. Prioritizing yourself...",
    },
    {
      id: 2,
      tag: "Partner Support",
      tagColor: "bg-white",
      imageGradient: "from-[#ffb4a0] to-[#ff8b7b]",
      date: "Oct 22, 2023",
      readTime: "6 min read",
      title: "How Partners Can Help",
      description:
        "Practical ways for partners to provide emotional and physical support during the...",
    },
    {
      id: 3,
      tag: "Nutrition",
      tagColor: "bg-white",
      imageGradient: "from-[#2d4d4a] to-[#1a3330]",
      date: "Oct 20, 2023",
      readTime: "4 min read",
      title: "Postpartum Nutrition Guide",
      description:
        "Fueling your body for recovery and energy. What nutrients matter most right now?",
    },
    {
      id: 4,
      tag: "Mental Health",
      tagColor: "bg-white",
      imageGradient: "from-[#88b36a] to-[#6a9450]",
      date: "Oct 18, 2023",
      readTime: "8 min read",
      title: "Mindfulness Exercises for Moms",
      description:
        "Quick, 5-minute grounding techniques you can do while the baby sleeps to reduce anxiety.",
    },
    {
      id: 5,
      tag: "Community Stories",
      tagColor: "bg-white",
      imageGradient: "from-[#ffc8b0] to-[#ffb49a]",
      date: "Oct 15, 2023",
      readTime: "5 min read",
      title: "You Are Not Alone: Sarah's Story",
      description:
        "A real mom shares her journey through postpartum depression and her path to...",
    },
    {
      id: 6,
      tag: "Medical Care",
      tagColor: "bg-white",
      imageGradient: "from-[#4a6670] to-[#36515c]",
      date: "Oct 10, 2023",
      readTime: "7 min read",
      title: "When to See a Doctor",
      description:
        "Recognizing the physical and emotional signs that indicate you should schedule a check-up.",
    },
  ];

  const topicFilters = [
    { id: "all", label: "All Topics", icon: null },
    { id: "mental", label: "Mental Health", icon: "🧠" },
    { id: "baby", label: "Baby Care", icon: "👶" },
    { id: "physical", label: "Physical Recovery", icon: "💪" },
    { id: "partner", label: "Partner Support", icon: "🤝" },
    { id: "wellness", label: "Wellness", icon: "✨" },
  ];

  return (
    <div className="min-h-screen bg-background py-6">
      {/* Hero Section */}
      <div className="px-8 pt-4 pb-5">
        {/* <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-[#8aa771] to-[#5a7048] px-6 py-20 md:py-24"> */}
        <div
          className="px-6 py-20 md:py-24  overflow-hidden relative"
          style={{
            backgroundImage: "url('/assets/image/article-resource-page.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "400px",
            borderRadius: "1.5rem",
          }}
        >
          {/* Your content here */}

          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Resources & Insights
            </h1>
            <p className="text-lg text-white/95 mb-8 max-w-2xl mx-auto">
              Knowledge is power. Explore our library of supportive articles
              designed to help you navigate motherhood with confidence.
            </p>

            {/* Search Box */}
            <div className="flex max-w-2xl mx-auto bg-white rounded-full shadow-lg overflow-hidden">
              <div className="flex items-center pl-4 text-muted-foreground">
                <span className="material-symbols-outlined text-xl">
                  search
                </span>
              </div>
              <input
                type="text"
                placeholder="Search topics like 'sleep' or 'anxiety'..."
                className="flex-1 px-4 py-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 font-semibold rounded-r-full transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Browse by Topic */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-foreground">
              Browse by Topic
            </h2>
            <a
              href="#"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              View All
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            {topicFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                  activeFilter === filter.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {filter.icon && <span className="mr-2">{filter.icon}</span>}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Reading */}
        {/* <h2 className="text-2xl font-bold text-foreground mb-6">
          Featured Reading
        </h2>
        <div className="bg-card rounded-2xl p-8 md:p-10 shadow-sm mb-12 grid md:grid-cols-2 gap-8 md:gap-10">
          <div className="flex flex-col justify-center">
            <div className="text-xs font-bold text-destructive uppercase mb-3 tracking-wide">
              Medical Reviewed • 5 min read
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              Understanding the Baby Blues vs. PPD
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              It is crucial to distinguish between normal hormonal shifts and
              symptoms that require professional support. This gentle guide
              breaks down the key differences and offers actionable steps for
              seeking help.
            </p>
            <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition-colors self-start">
              Read Full Article
              <span className="material-symbols-outlined text-xl">
                bookmark
              </span>
            </button>
          </div>
          <div className="bg-gradient-to-br from-[#c8e6dc] to-[#a8d5c8] rounded-2xl min-h-[280px]"></div>
        </div> */}

        {/* Latest Articles */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Latest Articles
          </h2>
          <Link href="/contributor/articles/new-article">
            <button className="mb-6 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full font-semibold transition-colors">
              <span className="material-symbols-outlined text-md">add</span>
              Write New Article
            </button>
          </Link>
        </div>
<Link href="/resources/article-details">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
          {articles.map((article) => (
            <article className="flex flex-col gap-6  p-5 bg-white rounded-[20px] border border-border shadow-sm hover:shadow-md transition-shadow">
              {/* Image Container */}

              <div className="relative  md:w-full shrink-0  aspect-[4/3]  rounded-xl overflow-hidden bg-muted">
                <img
                  src={article.imageGradient || "/placeholder.svg"}
                  alt="resource image"
                  style={{ objectFit: "cover" }}
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 hover:bg-white text-foreground/80 text-[11px] font-bold px-2 py-0.5 border-none shadow-sm backdrop-blur-sm rounded-md">
                    {article.tag}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-1 py-1">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                    <span className="material-symbols-outlined text-[16px] fill">
                      account_circle
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-foreground/90">
                    Author_{article.id}
                  </span>
                  <span className="text-[13px] text-muted-foreground">•</span>
                  <span className="text-[13px] text-muted-foreground">
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-[20px] font-extrabold text-foreground leading-snug mb-3">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.description}
                </p>
              </div>
            </article>
          ))}
        </div>
        </Link>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 pt-8 my-10">
          <button className="w-10 h-10 rounded-full bg-card hover:bg-muted shadow-sm flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="text-sm text-muted-foreground font-medium">
            Page 1 of 5
          </span>
          <button className="w-10 h-10 rounded-full bg-card hover:bg-muted shadow-sm flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Footer Banner */}
      {/* <div className="px-5 pb-8">
        <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm px-6 py-5 flex flex-wrap items-center justify-center gap-3 text-center">
          <span className="material-symbols-outlined text-primary text-2xl">
            medical_services
          </span>
          <span className="text-muted-foreground">
            Feeling overwhelmed? Help is available 24/7.
          </span>
          <a
            href="#"
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Connect with a specialist now
          </a>
        </div>
      </div> */}
    </div>
  );
}
