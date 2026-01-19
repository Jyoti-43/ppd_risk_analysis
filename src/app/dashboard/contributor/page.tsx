"use client";

import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Eye,
  Loader2,
  AlertCircle,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  useGetArticleQuery,
  useDeleteArticleMutation,
} from "@/src/app/redux/services/articleApi";
import { useGetContributorProfileQuery } from "@/src/app/redux/services/contributorProfileSetupApi";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useAppSelector } from "../../Hooks/hook";
import { selectCurrentUser } from "../../redux/feature/user/userSlice";
import { Badge } from "@/components/ui/badge";

const ContributorDashboard = () => {
  const {
    data: articles = [],
    isLoading: articlesLoading,
    refetch,
  } = useGetArticleQuery();
  const { data: profile } = useGetContributorProfileQuery();
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
  const currentUser = useAppSelector(selectCurrentUser)?.userName;
  const [searchQuery, setSearchQuery] = useState("");

  const basicInfo = profile?.step1_basic_profile || {};

  const stats = [
    {
      label: "Total Articles",
      value: articles.length,
      icon: <CheckCircle className="text-emerald-500" size={24} />,
      bgColor: "bg-emerald-50",
    },
    {
      label: "Pending Review",
      value: articles.filter((article) => article.status === "pending").length,
      icon: <Clock className="text-amber-500" size={24} />,
      bgColor: "bg-amber-50",
    },
    {
      label: "Drafts",
      value: 0, // Mocked for now
      icon: <FileText className="text-blue-500" size={24} />,
      bgColor: "bg-blue-50",
    },
  ];

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticle(id).unwrap();
        toast.success("Article deleted successfully");
      } catch (error) {
        toast.error("Failed to delete article");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
           Welcome  {currentUser} !!
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Manage your content and track your impact.
          </p>
        </div>
        {/* <Button
          asChild
          className="bg-primary hover:bg-[#b50d62] text-white rounded-full px-8 py-6 shadow-lg shadow-primary/20 transition-all font-bold gap-2 group"
        >
          <Link href="/dashboard/contributor/new-article">
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            Create New Article
          </Link>
        </Button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-[2rem] border border-[#f0e0e9] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <h3 className="text-4xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div
              className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Work in Progress Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Work in Progress</h2>
          <Button
            variant="link"
            className="text-primary font-bold text-sm gap-1 group"
          >
            View all drafts{" "}
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mock WIP Item 1 */}
          <div className="bg-white rounded-[2rem] border border-[#fef2f8] border-l-4 border-l-amber-400 p-8 space-y-4 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full uppercase tracking-widest">
                Pending Review
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">
                Submitted 2 days ago
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Understanding the Baby Blues vs. PPD
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-2 font-medium">
                An in-depth look at distinguishing between common hormonal
                shifts and symptoms that require clinical attention...
              </p>
            </div>
            <div className="pt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-full border-gray-100 font-bold text-xs h-10 hover:bg-gray-50 transition-colors"
              >
                Preview
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-gray-100 font-bold text-xs h-10 hover:bg-gray-50 transition-colors"
              >
                View Status
              </Button>
            </div>
          </div>

          {/* Mock WIP Item 2 */}
          <div className="bg-white rounded-[2rem] border border-[#fef2f8] border-l-4 border-l-blue-400 p-8 space-y-4 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-widest">
                Pending Review
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">
                Last edited 3h ago
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                5 Mindfulness Techniques for New Moms
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-2 font-medium">
                Drafting content about breathing exercises and grounding
                techniques for postpartum recovery...
              </p>
            </div>
            <div className="pt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-full border-gray-100 font-bold text-xs h-10 hover:bg-gray-50 transition-colors"
              >
                Preview
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-gray-100 font-bold text-xs h-10 hover:bg-gray-50 transition-colors"
              >
                View Status
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Published Articles List */}
      <section className="  overflow-hidden">
        <div className="px-4 py-4  flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            Published Articles
          </h2>
          <div className="flex w-full sm:w-auto gap-3 ">
            <div className="relative flex-1 sm:w-64">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
            {/* <Button
              variant="outline"
              className="p-6 rounded-2xl border-none bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Filter size={18} className="text-gray-500" />
            </Button> */}
          </div>
        </div>

        <div className="overflow-hidden bg-white border border-[#f0e0e9] rounded-xl shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-background ">
                <th className="px-8 py-3   border-r border-muted-foreground/20 text-left text-md font-semibold text-gray-400 uppercase tracking-widest">
                  Title
                </th>
                <th className="px-4 py-3 border-r border-muted-foreground/20 text-left text-md font-semibold text-gray-400 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-4 py-3 border-r border-muted-foreground/20 text-left text-md font-semibold text-gray-400 uppercase tracking-widest">
                  Created Date
                </th>
                <th className="px-4 py-3 border-r border-muted-foreground/20 text-left text-md font-semibold text-gray-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-md font-semibold text-gray-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e0e9]">
              {articlesLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center">
                    <Loader2 className="mx-auto w-8 h-8 text-primary animate-spin" />
                    <p className="mt-2 text-gray-400 font-medium">
                      Fetching your articles...
                    </p>
                  </td>
                </tr>
              ) : filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-[#fef2f8]/20 transition-colors group"
                  >
                    <td className="px-4 py-2 border border-muted-foreground/20">
                      <div className="flex items-center gap-4 max-w-sm">
                        <div className="w-8 h-8 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          {article.image ? (
                            <img
                              src={
                                article.image.startsWith("http")
                                  ? article.image
                                  : `${process.env.NEXT_PUBLIC_API_URL}${article.image}`
                              }
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FileText size={20} />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                          {article.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 border border-muted-foreground/20">
                      <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-full group-hover:bg-white group-hover:shadow-sm transition-all">
                        {typeof article.category === "object"
                          ? (article.category as any).name
                          : article.category || "General"}
                      </span>
                    </td>
                    <td className="px-4 border border-muted-foreground/20">
                      <span className="text-gray-500 font-medium text-sm">
                        {article.createdAt
                          ? format(new Date(article.createdAt), "MMM d, yyyy")
                          : "N/A"}
                      </span>
                    </td>
                    <td className="px-4 border border-muted-foreground/20">
                      <div className="flex items-center gap-2">
                        {article.status === "pending" ? (
                          <Badge className="text-gray-900 bg-orange-100 font-bold">Pending</Badge>
                        ) : article.status === "published" ? (
                          <Badge className="text-gray-900 bg-green-100 font-bold">Published</Badge>
                        ) : (
                          <Badge className="text-gray-900 bg-red-100 font-bold">Rejected</Badge>
                        )}
                      {/* <Badge className="text-gray-900 font-bold">{article.status}</Badge> */}
                        {/* <TrendingUp size={14} className="text-emerald-500" /> */}
                      </div>
                    </td>
                    <td className="px-4 text-right border border-muted-foreground/20">
                      <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(article.id)}
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      {/* <MoreVertical
                        className="text-gray-300 group-hover:hidden ml-auto"
                        size={18}
                      /> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-12 text-center text-gray-400 italic font-medium"
                  >
                    No articles found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-gray-50/50 text-center">
          <Button
            variant="ghost"
            className="text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-primary"
          >
            Load more articles
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ContributorDashboard;
