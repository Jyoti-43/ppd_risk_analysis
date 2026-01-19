"use client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import { useGetPublishedArticleQuery } from "../../redux/services/articleApi";

export default function ArticleResources() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: articles,
    isLoading,
    isError,
    error,
  } = useGetPublishedArticleQuery();

  const topicFilters = [
    { id: "all", label: "All Topics", icon: null },
    { id: "Mental Health", label: "Mental Health", icon: "🧠" },
    { id: "Baby Care", label: "Baby Care", icon: "👶" },
    { id: "Physical Recovery", label: "Physical Recovery", icon: "💪" },
    { id: "Partner Support", label: "Partner Support", icon: "🤝" },
    { id: "Wellness", label: "Wellness", icon: "✨" },
  ];

  // Determine the actual array of articles
  const articlesArray = Array.isArray(articles)
    ? articles
    : (articles as any)?.articles ||
      (articles as any)?.allArticles ||
      (articles as any)?.all_articles ||
      (articles as any)?.data ||
      [];

  const filteredArticles = articlesArray.filter((article: any) => {
    // 1. Get properties safely with multiple fallbacks
    const title = (
      article.title ||
      article.article_title ||
      article.postTitle ||
      ""
    ).toLowerCase();
    const catName = (
      typeof article.category === "object"
        ? article.category?.name
        : article.category || article.categoryName || ""
    ).toLowerCase();

    // 2. Normalize filter values
    const filter = activeFilter.toLowerCase();
    const search = searchQuery.toLowerCase();

    // 3. Match logic
    const categoryMatch = filter === "all" || catName.includes(filter);
    const searchMatch =
      !search || title.includes(search) || catName.includes(search);

    return categoryMatch && searchMatch;
  });

  console.log("Raw Articles Data:", articles);
  console.log("Articles Array:", articlesArray);
  if (articlesArray.length > 0) {
    console.log("First article keys:", Object.keys(articlesArray[0]));
    console.log("First article content:", articlesArray[0]);
  }
  console.log("Active Filter:", activeFilter);
  console.log("Search Query:", searchQuery);
  console.log("Filtered Results:", filteredArticles);

  return (
    <div className="min-h-screen bg-background py-6">
      {/* Hero Section */}
      <div className="px-8 pt-4 pb-5">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Latest Articles */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Latest Articles
          </h2>
          {/* <Link href="/new-article">
            <button className="mb-6 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full font-semibold transition-colors">
              <span className="material-symbols-outlined text-md">add</span>
              Write New Article
            </button>
          </Link> */}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500">
            <p className="text-lg font-medium">Failed to load articles.</p>
            <p className="text-sm opacity-70">
              Please check your connection or try again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
            {filteredArticles && filteredArticles.length > 0 ? (
              filteredArticles.map((article:any) => {
                const articleId = article.id || (article as any).articleId;
                return (
                  <Link
                    key={articleId}
                    href={`/resources/article-details/${articleId}`}
                  >
                    <article className="flex flex-col gap-6 p-5 bg-white rounded-[20px] border border-border shadow-sm hover:shadow-md transition-shadow h-full cursor-pointer">
                      {/* Image Container */}
                      <div className="relative md:w-full shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                        <img
                          src={(() => {
                            const imgPath = article.image || article.imageUrl;
                            if (!imgPath) return "/placeholder.svg";
                            if (imgPath.startsWith("http")) return imgPath;
                            return `${process.env.NEXT_PUBLIC_API_URL}${
                              imgPath.startsWith("/") ? "" : "/"
                            }${imgPath}`;
                          })()}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/90 hover:bg-white text-foreground/80 text-[11px] font-bold px-2 py-0.5 border-none shadow-sm backdrop-blur-sm rounded-md">
                            {typeof article.category === "object" &&
                            article.category !== null
                              ? (article.category as any).name
                              : article.category || "General"}
                          </Badge>
                        </div>
                      </div>

                      {/* card Content Section */}
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                            <span className="material-symbols-outlined text-[16px] fill">
                              account_circle
                            </span>
                          </div>
                          <span className="text-[13px] font-semibold text-foreground/90">
                            {article.contributor.name || "Contributor"}
                          </span>
                          <span className="text-[13px] text-muted-foreground">
                            •
                          </span>
                          <span className="text-[13px] text-muted-foreground">
                            {article.createdAt
                              ? new Date(article.createdAt).toLocaleDateString()
                              : "Recent"}
                          </span>
                        </div>

                        <h3 className="text-[20px] font-extrabold text-foreground leading-snug mb-3 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {article.preview}
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground text-lg">
                  {articles && articles.length > 0
                    ? "No articles found matching your criteria."
                    : "No articles have been shared yet."}
                </p>
                {(searchQuery || activeFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("all");
                    }}
                    className="mt-4 text-primary font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

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
