"use client";

import { useEffect, useState } from "react";
import { ArticleEditor } from "../../../component/contributor/editor/article-editor";
import { EditorHeader } from "../../../component/contributor/editor/editor-header";
import { EditorSidebar } from "../../../component/contributor/editor/editor-sidebar";
import {
  articleApi,
  useGetArticleQuery,
  useUpdateArticleMutation,
} from "../../../redux/services/articleApi";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch } from "../../../Hooks/hook";

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params?.id as string;

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { article, isLoading } = useGetArticleQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => ({
      article: data?.find((a: any) => a.id === articleId || a._id === articleId),
      isLoading,
    }),
  });
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!articleId || !article) return;

    setTitle(article.title || "");
    setContent(article.content || "");
    setPreview(article.preview || "");
    setTags(article.tags || []);
    setImageUrl(article.image || article.imageUrl || "");

    const cat = article.category;
    if (!cat) setCategoryId("");
    else if (typeof cat === "string") setCategoryId(cat);
    else if (typeof cat === "object" && cat !== null) {
      const obj = cat as {
        id?: string;
        _id?: string;
        toString?: () => string;
      } & Record<string, any>;
      setCategoryId(obj.id ?? obj._id ?? obj.toString?.() ?? "");
    }
  }, [articleId, article]);

  const handlePublish = async () => {
    if (!title || !content || !categoryId) {
      alert("Please fill in title, content and category");
      return;
    }

    try {
      const res = await updateArticle({
        articleId,
        articleBody: {
          title,
          content,
          preview,
          categoryId,
          tags,
          image: imageUrl,
        },
      }).unwrap();

      alert("Article updated successfully!");
      dispatch(articleApi.util.invalidateTags(["Articles"]));
      console.log("Article updated:", res);
      router.push("/dashboard/contributor/my-articles");
    } catch (err) {
      console.error("Failed to update article:", err);
      alert("Failed to update article");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EditorHeader onPublish={handlePublish} isLoading={isUpdating} />
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <ArticleEditor
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
          />
          <EditorSidebar
            preview={preview}
            setPreview={setPreview}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            tags={tags}
            setTags={setTags}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
          />
        </div>
      </main>
      <footer className="py-6 border-t border-border mt-auto">
        <p className="text-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          PPD Support Contributor Portal © 2026
        </p>
      </footer>
    </div>
  );
}
