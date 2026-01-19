"use client";

import * as React from "react";
import {
  Plus,
  Search,
  Pencil,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  useGetPendingArticlesQuery,
  usePublishArticleMutation,
} from "../../redux/services/adminApi";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = React.useState("All Articles");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  const { data: articles, isLoading } = useGetPendingArticlesQuery({});
  const [articlePublish] = usePublishArticleMutation();

  const tabs = [
    { name: "All Articles", count: articles?.length || 0 },
    {
      name: "Pending Review",
      count:
        articles?.filter((a) => {
          const s = (a.status || "").toLowerCase();
          return s === "pending" || s === "pending review" || s === "";
        }).length || 0,
    },
    {
      name: "Draft",
      count:
        articles?.filter((a) => (a.status || "").toLowerCase() === "draft")
          .length || 0,
    },
    {
      name: "Published",
      count:
        articles?.filter((a) => {
          const s = (a.status || "").toLowerCase();
          return s === "published" || s === "approved";
        }).length || 0,
    },
    {
      name: "Rejected",
      count:
        articles?.filter((a) => (a.status || "").toLowerCase() === "rejected")
          .length || 0,
    },
  ];

  const filteredArticles = (articles || []).filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const articleCategory =
      typeof article.category === "object"
        ? (article.category as any).name
        : article.category;

    const matchesCategory =
      categoryFilter === "all" ||
      (articleCategory &&
        articleCategory.toLowerCase() === categoryFilter.toLowerCase());

    // 3. Tab (Status) filtering
    const status = (article.status || "").toLowerCase();
    let matchesTab = true;

    if (activeTab === "Pending Review") {
      matchesTab =
        status === "pending" || status === "pending review" || status === "";
    } else if (activeTab === "Draft") {
      matchesTab = status === "draft";
    } else if (activeTab === "Published") {
      matchesTab = status === "published" || status === "approved";
    } else if (activeTab === "Rejected") {
      matchesTab = status === "rejected";
    }

    return matchesSearch && matchesCategory && matchesTab;
  });

  if (isLoading) {
    return <div className="p-8">Loading articles...</div>;
  }

  const publishArticle = async (articleId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to publish this article? It will become visible to all users.",
      )
    ) {
      return;
    }

    // Extract numeric ID (e.g., "article_6" -> "6")
    const numericId = articleId.replace(/\D/g, "");

    try {
      await articlePublish(numericId).unwrap();
      alert("Article published successfully!");
    } catch (error: any) {
      console.error("Error publishing article:", error);
      alert(
        error?.data?.message || "Failed to publish article. Please try again.",
      );
    }
  };

  return (
    <div className="px-8 py-4 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight leading-tight">
            Admin Dashboard - Article Moderation
          </h1>
          <p className="text-gray-500 text-md font-medium opacity-80">
            Review and manage articles submitted by contributors.
          </p>
        </div>
        <Link href="/new-article">
          <Button className="bg-primary hover:bg-[#e21e80] text-white px-4 py-2 rounded-2xl text-lg font-semibold shadow-lg shadow-pink-100 transition-all active:scale-95 flex gap-2">
            <Plus size={24} />
            <span>Create New Article</span>
          </Button>
        </Link>
      </div>

      {/* Filters & Search Section */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8 mt-12 bg-transparent">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={cn(
                "px-6 py-2 text-md font-semibold transition-all relative whitespace-nowrap",
                activeTab === tab.name
                  ? "text-primary"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              {tab.name} ({tab.count})
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full mx-2" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Search articles by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 rounded-2xl border-none bg-white shadow-sm text-lg placeholder:text-gray-300 ring-0 focus-visible:ring-1 focus-visible:ring-pink-200"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px] h-[52px] rounded-2xl border-none bg-white shadow-sm text-lg font-medium text-gray-600 outline-none">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-xl">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Physical Health">Physical Recovery</SelectItem>
              <SelectItem value="Mental Health">Mental Health</SelectItem>
              <SelectItem value="Baby Care">Baby Care</SelectItem>
              <SelectItem value="Wellness">Wellness</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-[40px] shadow-sm border-none overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-none  px-8 bg-accent   ">
              <TableHead className="  uppercase text-gray-700 font-extrabold tracking-widest text-md text-center  py-4 px-4">
                Title
              </TableHead>
              <TableHead className="uppercase text-gray-700 font-extrabold tracking-widest text-md py-4">
                Category
              </TableHead>
              <TableHead className="uppercase text-gray-700 font-extrabold tracking-widest text-md py-4">
                Status
              </TableHead>
              <TableHead className="uppercase text-gray-700 font-extrabold tracking-widest text-md py-4">
                Last Modified
              </TableHead>
              <TableHead className="uppercase text-gray-700 font-extrabold tracking-widest text-md text-right py-4 px-8">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <TableRow
                  key={article.id}
                  className="border-b border-gray-50/50 hover:bg-gray-50/80 transition-colors"
                >
                  <TableCell className="px-2 py-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 rounded-2xl border-none shadow-sm overflow-hidden bg-gray-100 flex-shrink-0">
                        <AvatarImage
                          src={article.image}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-pink-50 text-pink-300 font-bold uppercase">
                          {article.title.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className=" text-foreground text-lg ">
                        {article.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-1">
                    <span className="text-gray-500 font-medium text-lg leading-relaxed">
                      {typeof article.category === "object"
                        ? (article.category as any).name
                        : article.category || "General"}
                    </span>
                  </TableCell>
                  <TableCell className="py-1 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-4 py-1.5 rounded-xl uppercase text-[10px] font-black border-none tracking-widest",
                        (() => {
                          const s = (article.status || "").toLowerCase();
                          if (s === "published" || s === "approved")
                            return "bg-green-100 text-green-700 hover:bg-green-200";
                          if (s === "pending" || s === "pending review")
                            return "bg-amber-100 text-amber-700 hover:bg-amber-200";
                          if (s === "draft")
                            return "bg-blue-100 text-blue-700 hover:bg-blue-200";
                          return "bg-gray-100 text-gray-700";
                        })(),
                      )}
                    >
                      {article.status || "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-1">
                    <span className="text-gray-500 font-medium text-lg leading-relaxed">
                      {article.createdAt
                        ? new Date(article.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-1  text-right">
                    <div className="flex justify-between gap-">
                      <Button
                        onClick={() => publishArticle(article.id)}
                        className="  px-2  py-0 text-primary  text-md font-semibold hover:bg-background bg-green-100 rounded-lg transition-all"
                      >
                        Publish
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                      >
                        <Eye size={20} />
                      </Button> */}
                      <Button className=" px-2  py-0 text-primary  text-md font-semibold hover:bg-background bg-red-100 rounded-lg transition-all">
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-20 text-gray-400 font-medium text-xl"
                >
                  No articles found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="px-8 py-8 flex items-center justify-center bg-white border-t border-gray-50/50">
          {/* <p className="text-gray-400 font-bold text-lg">
            Showing <span className="text-gray-900">5</span> of{" "}
            <span className="text-gray-900">24</span> articles
          </p> */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-2xl border-none bg-gray-50/50 hover:bg-gray-100 text-gray-600 transition-all active:scale-90"
            >
              <ChevronLeft size={24} strokeWidth={4} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-2xl border-none bg-white shadow-lg shadow-gray-100 hover:bg-gray-50 text-gray-600 transition-all active:scale-95"
            >
              <ChevronRight size={24} strokeWidth={4} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
