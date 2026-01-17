// import React from "react";

// const ArticleDetails = () => {
//   return (
//     <div className="min-h-screen bg-background py-6 flex flex-col items-center">

//      <p className="p-20 "> Article details here</p>
//     </div>
//   );
// };

// export default ArticleDetails;

"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function CreateArticleForm() {
  const [article, setArticle] = useState({
    title: "",
    slug: "",
    meta: "",
    preview: "",
    desc: "",
    tags: [] as string[],
    category: [] as string[],
    toc: [] as { name: string; value: string }[],
  });

  const [tagInput, setTagInput] = useState("");

  // Auto-generate slug
  useEffect(() => {
    setArticle((prev) => ({
      ...prev,
      slug: prev.title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, ""),
    }));
  }, [article.title]);

  const addTag = () => {
    if (!tagInput.trim()) return;
    setArticle({
      ...article,
      tags: [...article.tags, tagInput.trim()],
    });
    setTagInput("");
  };

  const addTOC = () => {
    setArticle({
      ...article,
      toc: [...article.toc, { name: "", value: "" }],
    });
  };

  const updateTOC = (index: number, name: string) => {
    const updated = [...article.toc];
    updated[index] = {
      name,
      value: name.toLowerCase().replace(/\s+/g, "-"),
    };
    setArticle({ ...article, toc: updated });
  };

  return (
    <div className=" relative max-w-2xl mx-auto space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Article Title *</label>
            <Input
              placeholder="Enter article title"
              value={article.title}
              onChange={(e) =>
                setArticle({ ...article, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Article Link (URL)</label>
            <Input value={article.slug} />
            <p className="text-xs text-muted-foreground mt-1">
              Auto-generated from the title
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Meta / SEO */}
      <Card>
        <CardHeader>
          <CardTitle>Search Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Meta Description</label>
            <Textarea
              rows={3}
              placeholder="Short description shown on search engines (Google, etc.)"
              value={article.meta}
              onChange={(e) => setArticle({ ...article, meta: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 140–160 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Article Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Short Summary</label>
            <Textarea
              placeholder="Brief summary shown before opening the article"
              value={article.preview}
              onChange={(e) =>
                setArticle({ ...article, preview: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Article Body *</label>
            <Textarea
              rows={8}
              placeholder="Write the full article here..."
              value={article.desc}
              onChange={(e) => setArticle({ ...article, desc: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Article Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="text-sm font-medium">Categories</label>
          {CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                checked={article.category.includes(cat)}
                onCheckedChange={(checked) => {
                  setArticle({
                    ...article,
                    category: checked
                      ? [...article.category, cat]
                      : article.category.filter((c) => c !== cat),
                  });
                }}
              />
              <span className="text-sm">{cat}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
            />
            <Button onClick={addTag}>Add</Button>
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* TOC */}
      <Card>
        <CardHeader>
          <CardTitle>Article Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {article.toc.map((item, index) => (
            <Input
              key={index}
              placeholder="Section title (e.g. Introduction)"
              value={item.name}
              onChange={(e) => updateTOC(index, e.target.value)}
            />
          ))}
          <Button variant="outline" onClick={addTOC}>
            + Add Section
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Save as Draft</Button>
        <Button>Publish</Button>
      </div>
    </div>
  );
}
const CATEGORIES = [
  "Understanding Postpartum Depression",
  "Emotional Well-Being After Birth",
  "Screening & Self-Assessment",
  "Coping & Self-Care",
  "Professional Help & Therapy",
  "Support for New Mothers",
  "Partner & Family Guidance",
  "Resources & Help Lines",
];
