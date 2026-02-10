"use client";

import { useGetRecommendedArticlesQuery } from "@/src/app/redux/services/userDashboardApi";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RecommendedArticlesPage() {
  const router = useRouter();
  const {
    data: recommendations,
    isLoading,
    isError,
    refetch,
  } = useGetRecommendedArticlesQuery();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <div className="animate-spin mb-4">
          <RefreshCw className="h-8 w-8 text-primary opacity-50" />
        </div>
        <p className="text-muted-foreground animate-pulse font-medium">
          Retrieving your personalized recommendations...
        </p>
      </div>
    );
  }

  if (
    isError ||
    !recommendations?.recommended_articles ||
    recommendations.recommended_articles.length === 0
  ) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-6">
        <div className="bg-white rounded-[40px] p-12 shadow-sm border border-pink-50 flex flex-col items-center gap-6">
          <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-primary/40" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              No recommendations found
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Please complete a wellness screening to see personalized articles
              tailored to your needs.
            </p>
          </div>
          <Link href="/dashboard/mother/screening-center">
            <Button className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
              Go to Screening Center
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          {/* <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/mother"
              className="text-primary hover:text-primary/70 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xs font-bold text-primary/50 uppercase tracking-widest">
              Dashboard / Wellness
            </span>
          </div> */}
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Recommended for <span className="text-primary italic">You</span>
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2 font-medium">
            Personalized guidance based on your last{" "}
            {recommendations.source_screening_type || "assessment"} screening.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          className="rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold h-11"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Latest
        </Button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.recommended_articles.map((article: any) => (
          <Card
            key={article.article_id}
            className="group hover:shadow-2xl transition-all duration-500 border-none bg-white rounded-[32px] overflow-hidden flex flex-col shadow-sm"
          >
            {article.imageUrl && (
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            )}
            <CardHeader className="pb-2 pt-6 px-6">
              <div className="flex flex-wrap gap-2 mb-3">
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
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-4 px-6">
              <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed italic opacity-80">
                {article.preview
                  ? `"${article.preview}"`
                  : `Comprehensive resources regarding ${article.category.toLowerCase()} wellness for your postpartum journey.`}
              </p>
            </CardContent>
            <CardFooter className="pt-2 pb-8 px-6">
              <Button
                className="w-full bg-primary/5 hover:bg-primary text-primary hover:text-white border-primary/10 hover:border-primary font-black h-12 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                variant="outline"
                onClick={() => window.open(article.external_url, "_blank")}
              >
                Read Full Article
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-white/50 rounded-3xl p-6 flex items-center gap-4 border border-dashed border-primary/20">
        <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Medical Disclaimer:</strong> These articles are for
          educational purposes only and are automatically curated based on your
          screening responses. Always consult with your healthcare provider for
          medical diagnosis and treatment.
        </p>
      </div>
    </div>
  );
}
