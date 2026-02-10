"use client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  useGetPublishedArticleQuery,
  useGetPubMedArticlesQuery,
} from "../../redux/services/articleApi";
import { useGetRecommendedArticlesQuery } from "../../redux/services/userDashboardApi";
import { BookOpen, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ArticleResources() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: articles,
    isLoading,
    isError,
  } = useGetPublishedArticleQuery({});

  const { data: pubmedData, isLoading: isPubMedLoading } =
    useGetPubMedArticlesQuery(searchQuery || "postpartum depression");
  console.log("pubmed article", pubmedData);
  const {
    data: recommendations,
    isLoading: isRecLoading,
    refetch: refetchRecs,
  } = useGetRecommendedArticlesQuery();

  const topicFilters = [
    { id: "all", label: "All Topics", icon: null },
    { id: "Mental Health", label: "Mental Health", icon: "🧠" },
    { id: "Physical Recovery", label: "Physical Recovery", icon: "💪" },
    { id: "Partner Support", label: "Partner Support", icon: "🤝" },
    { id: "pubmed", label: "Medical Research", icon: "🔬" },
  ];

  // Enhanced Category-based decoration mapping with SVG patterns
  const categoryStyles: Record<
    string,
    { gradient: string; icon: string; pattern: string }
  > = {
    "Mental Health": {
      gradient: "from-violet-200 via-indigo-100 to-purple-100",
      icon: "🧠",
      pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238B5CF6' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
    },
    "Baby Care": {
      gradient: "from-sky-200 via-blue-100 to-white",
      icon: "👶",
      pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230EA5E9' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
    },
    "Physical Recovery": {
      gradient: "from-emerald-200 via-teal-100 to-emerald-50",
      icon: "💪",
      pattern: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.414 31L4 29.586V31h1.414zM4 21.086L9.086 31H10.5L4 24.5V21.086zM4 12.586L12.586 31h1.414L4 16V12.586zM4 4.086L16.086 31h1.414L4 7.5V4.086zM4 0h1.5L20.5 31h1.414L4.086 0H4v4.086zM6.5 0l16 31h1.414L8.086 0H6.5zM10 0l16 31h1.414L11.586 0H10zm3.5 0l16 31h1.414L15.086 0h-1.586zM17 0l14 27.5V31h-1.5L18.586 0H17zm3.5 0L31 16.5V20.5l-6.5-17.5H20.5zM24 0l7 8.5V12.5L25.5 0H24zm3.5 0L31 0.5V4.5L29 0h-1.5z' fill='%2310B981' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    },
    "Partner Support": {
      gradient: "from-orange-200 via-amber-100 to-yellow-50",
      icon: "🤝",
      pattern: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h24v24H0V0zm1 1h22v22H1V1z' fill='%23F59E0B' fill-opacity='0.1'/%3E%3C/svg%3E")`,
    },
    Wellness: {
      gradient: "from-rose-200 via-pink-100 to-fuchsia-50",
      icon: "✨",
      pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F43F5E' fill-opacity='0.08' fill-rule='evenodd'%3E%3Cpath d='M8 8V0h1v8h8v1H9v8H8V9H0V8h8z'/%3E%3C/g%3E%3C/svg%3E")`,
    },
    Default: {
      gradient: "from-rose-200 via-pink-100 to-fuchsia-50",
      icon: "",
      pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%233B82F6' fill-opacity='0.1'/%3E%3C/svg%3E")`,
    },
  };

  // Determine the actual array of articles
  const contributorArticles = Array.isArray(articles)
    ? articles
    : (articles as any)?.articles ||
      (articles as any)?.allArticles ||
      (articles as any)?.all_articles ||
      (articles as any)?.data ||
      [];

  const pubmedArticles = pubmedData?.articles || [];

  // Combine them
  const allArticles = [
    ...contributorArticles.map((a: any) => ({ ...a, source: "contributor" })),
    ...pubmedArticles.map((a: any) => ({ ...a, source: "pubmed" })),
  ];

  const filterArticle = (article: any) => {
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
    const categoryMatch =
      filter === "all" ||
      catName.includes(filter) ||
      (filter === "pubmed" && article.source === "pubmed");
    const searchMatch =
      !search || title.includes(search) || catName.includes(search);

    return categoryMatch && searchMatch;
  };

  const filteredArticles = allArticles.filter(filterArticle);
  const filteredRecommendations = (
    recommendations?.recommended_articles || []
  ).filter(filterArticle);

  // Pagination
  const PAGE_SIZE = 9; // Increased size to accommodate more articles
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / PAGE_SIZE),
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredArticles.length, totalPages]);

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
            {/* <a
              href="#"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              View All
            </a> */}
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

        {/* Recommended Section */}
        {recommendations &&
          filteredRecommendations &&
          filteredRecommendations.length > 0 && (
            <div className="max-w-7xl mx-auto px-5 py-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    Recommended for{" "}
                    <span className="text-primary italic">You</span>
                  </h2>
                  <p className="text-muted-foreground text-sm flex items-center gap-2 font-medium">
                    Personalized guidance based on your last{" "}
                    {recommendations.source_screening_type || "assessment"}{" "}
                    screening.
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => refetchRecs()}
                  className="rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold h-11"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isRecLoading ? "animate-spin" : ""}`}
                  />
                  Refresh Latest
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecommendations.map((article: any) => {
                  const hasImage = !!article.imageUrl;
                  const categoryName = article.category || "Wellness";
                  const style =
                    categoryStyles[categoryName] || categoryStyles["Default"];

                  return (
                    <Card
                      key={article.article_id}
                      className="group hover:shadow-2xl transition-all duration-500 border-none bg-white rounded-[32px] overflow-hidden flex flex-col shadow-sm"
                    >
                      
                      <CardHeader className="pb-2 pt-4 px-6">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge
                            variant="secondary"
                            className="bg-primary/5 text-primary border-none rounded-lg text-[10px] font-bold uppercase tracking-widest px-2.5"
                          >
                            {article.category || "Wellness"}
                          </Badge>
                          {article.risk_level && (
                            <Badge
                              variant="outline"
                              className="text-[10px] uppercase font-bold px-2.5 rounded-lg border-primary/10 text-primary/60"
                            >
                              {article.risk_level} Risk Scale
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 pb-2 px-6">
                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed italic opacity-80">
                          {article.preview
                            ? `"${article.preview}"`
                            : `Comprehensive resources regarding ${article.category.toLowerCase()} wellness for your postpartum journey.`}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-2 pb-5 px-6">
                        <Button
                          className="w-full bg-primary/5 hover:bg-primary text-primary hover:text-white border-primary/10 hover:border-primary font-black h-10 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                          variant="outline"
                          onClick={() =>
                            window.open(article.external_url, "_blank")
                          }
                        >
                          Read Full Article
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-8 bg-white/50 rounded-3xl p-6 flex items-center gap-4 border border-dashed border-primary/20">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Medical Disclaimer:</strong> These articles are for
                  educational purposes only and are automatically curated based
                  on your screening responses. Always consult with your
                  healthcare provider for medical diagnosis and treatment.
                </p>
              </div>
            </div>
          )}

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
              filteredArticles
                .slice(
                  (currentPage - 1) * PAGE_SIZE,
                  (currentPage - 1) * PAGE_SIZE + PAGE_SIZE,
                )
                .map((article: any) => {
                  const articleId = article.id || (article as any).articleId;
                  const isPubMed = article.source === "pubmed";

                  const hasImage = !!(article.image || article.imageUrl);
                  const categoryName =
                    (typeof article.category === "object"
                      ? article.category?.name
                      : article.category) || "Wellness";

                  const style =
                    categoryStyles[categoryName] || categoryStyles["Default"];

                  const CardContent = (
                    <article className="flex flex-col gap-3 p-3 bg-white rounded-[20px] border border-border shadow-sm hover:shadow-md transition-shadow h-full cursor-pointer">
                      {/* Image or Decorative Fallback - Only for non-PubMed articles */}
                      {!isPubMed && (
                        <div
                          className={`relative md:w-full shrink-0 aspect-[4/2] rounded-xl overflow-hidden ${!hasImage ? `bg-gradient-to-tr ${style.gradient}` : "bg-muted"}`}
                          style={
                            !hasImage ? { backgroundImage: style.pattern } : {}
                          }
                        >
                          {!hasImage && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-4xl filter drop-shadow-sm opacity-80">
                                {style.icon}
                              </div>
                            </div>
                          )}
                          {hasImage && (
                            <img
                              src={(() => {
                                const imgPath =
                                  article.image || article.imageUrl;
                                if (imgPath.startsWith("http")) return imgPath;
                                return `${process.env.NEXT_PUBLIC_API_URL}${
                                  imgPath.startsWith("/") ? "" : "/"
                                }${imgPath}`;
                              })()}
                              alt={article.title}
                              className="w-full h-full object-cover "
                            />
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-white/90 hover:bg-white text-foreground/80 text-[11px] font-bold px-2 py-0.5 border-none shadow-sm backdrop-blur-sm rounded-md">
                              {categoryName}
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* card Content Section */}
                      <div className="flex flex-col flex-1 py-1">
                        {/* Show category badge here for PubMed articles since image container is hidden */}
                        {isPubMed && (
                          <div className="mb-2">
                            <Badge className="bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold px-2 py-0.5 border-none shadow-none rounded-md">
                              {article.category || "Medical Research"}
                            </Badge>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2.5">
                          <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                            <span className="material-symbols-outlined text-[16px] fill">
                              account_circle
                            </span>
                          </div>
                          <span className="text-[13px] font-semibold text-foreground/90">
                            {article.contributor?.name ||
                              (article as any).userName ||
                              "Contributor"}
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

                        <h3 className="text-[20px] font-extrabold text-foreground leading-snug mb-3 line-clamp-2 hover:text-primary transition-all">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {isPubMed ? article.tags[0] : article.preview}
                        </p>

                        <div className="mt-auto pt-3 ">
                          <div className="w-full bg-primary/5 group-hover:bg-primary hover:bg-primary hover:text-white text-primary group-hover:text-white border border-primary/10 group-hover:border-primary font-bold h-9 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm md:w-1/2">
                            Read Full Article
                            <span className="material-symbols-outlined text-sm">
                              {/* {isPubMed ? "open_in_new" : "arrow_forward"} */}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );

                  if (isPubMed) {
                    return (
                      <a
                        key={articleId}
                        href={article.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {CardContent}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={articleId}
                      href={`/resources/article-details/${articleId}`}
                    >
                      {CardContent}
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
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-full bg-card hover:bg-muted shadow-sm flex items-center justify-center transition-colors ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="text-sm text-muted-foreground font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-full bg-card hover:bg-muted shadow-sm flex items-center justify-center transition-colors ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : ""}`}
          >
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
