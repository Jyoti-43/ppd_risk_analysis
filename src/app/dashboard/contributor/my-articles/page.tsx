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
import { useGetArticleQuery } from "@/src/app/redux/services/articleApi";

export default function MyArticlesPage() {
  const [activeTab, setActiveTab] = React.useState("All Articles");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const { data: articles = [], isLoading, error } = useGetArticleQuery();

  const filteredArticles = articles.filter((article) => {
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

    const status = (article.status || "Pending").toLowerCase();

    let matchesTab = true;
    if (activeTab === "Published") {
      matchesTab = status === "published" || status === "approved";
    } else if (activeTab === "Pending Review") {
      matchesTab = status === "pending" || status === "pending review";
    } else if (activeTab === "Drafts") {
      matchesTab = status === "draft";
    }

    return matchesSearch && matchesCategory && matchesTab;
  });

  const tabs = [
    {
      name: "All Articles",
      count: articles.length,
    },
    {
      name: "Published",
      count: articles.filter((a) => {
        const s = (a.status || "").toLowerCase();
        return s === "published" || s === "approved";
      }).length,
    },
    {
      name: "Pending Review",
      count: articles.filter((a) => {
        const s = (a.status || "").toLowerCase();
        return s === "pending" || s === "pending review";
      }).length,
    },
    {
      name: "Rejected",
      count: articles.filter((a) => (a.status || "").toLowerCase() === "rejected")
        .length,
    },
  ];

  return (
    <div className="px-8 py-4 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight leading-tight">
            My Articles
          </h1>
          <p className="text-gray-500 text-md font-medium opacity-80">
            Organize, edit, and track the status of your professional content.
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
              placeholder="Search articles..."
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
              <SelectItem value="Physical Health">Physical Health</SelectItem>
              <SelectItem value="Mental Health">Mental Health</SelectItem>
              <SelectItem value="Self-Care">Self-Care</SelectItem>
              <SelectItem value="Clinical Analysis">
                Clinical Analysis
              </SelectItem>
              <SelectItem value="Support System">Support System</SelectItem>
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-20 font-medium text-xl text-gray-400"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span>Loading your articles...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article) => {
                const articleId = article.id;
                const articleImage = article.image || article.imageUrl;
                const articleCategory =
                  typeof article.category === "object"
                    ? (article.category as any).name
                    : article.category;
                const status = (article.status || "Pending").toLowerCase();

                return (
                  <TableRow
                    key={articleId}
                    className="border-b border-gray-50/50 hover:bg-gray-50/80 transition-colors"
                  >
                    <TableCell className="px-2 py-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10 rounded-2xl border-none shadow-sm overflow-hidden bg-gray-100 flex-shrink-0">
                          <AvatarImage
                            src={articleImage}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-pink-50 text-pink-300 font-bold uppercase">
                            {article.title?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className=" text-foreground text-lg font-medium">
                          {article.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1">
                      <span className="text-gray-500 font-medium text-lg leading-relaxed">
                        {articleCategory || "Uncategorized"}
                      </span>
                    </TableCell>
                    <TableCell className="py-1 whitespace-nowrap">
                      <Badge
                        className={cn(
                          "px-4 py-1.5 rounded-xl uppercase text-[10px] font-black border-none tracking-widest",
                          (status === "published" || status === "approved") &&
                            "bg-emerald-50 text-emerald-500 hover:bg-emerald-100",
                          (status === "pending" ||
                            status === "pending review") &&
                            "bg-orange-50 text-orange-500 hover:bg-orange-100/10 border border-orange-100/50",
                          status === "draft" &&
                            "bg-blue-50 text-blue-500 hover:bg-blue-100",
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
                    <TableCell className="px-8 py-1 text-right">
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                        >
                          <Pencil size={20} />
                        </Button>
                        <Link href={`/resources/article-details/${articleId}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                          >
                            <Eye size={20} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-20 text-gray-400 font-medium text-xl"
                >
                  {error
                    ? "Failed to load articles. Please try again."
                    : "No articles found matching your criteria."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="px-8 py-2 flex items-center justify-center bg-white border-t border-gray-50/50">
          {/* <p className="text-gray-400 font-bold text-lg">
            Showing <span className="text-gray-900">5</span> of{" "}
            <span className="text-gray-900">24</span> articles
          </p> */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-2xl border-none bg-gray-50/50 hover:bg-gray-100 text-gray-600 transition-all active:scale-90"
            >
              <ChevronLeft size={24} strokeWidth={4} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-2xl border-none bg-white shadow-lg shadow-gray-100 hover:bg-gray-50 text-gray-600 transition-all active:scale-95"
            >
              <ChevronRight size={24} strokeWidth={4} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
