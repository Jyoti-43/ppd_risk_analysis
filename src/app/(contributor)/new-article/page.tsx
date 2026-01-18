"use client";

import { useState } from "react";
import { ArticleEditor } from "../../component/contributor/editor/article-editor";
import { EditorHeader } from "../../component/contributor/editor/editor-header";
import { EditorSidebar } from "../../component/contributor/editor/editor-sidebar";
import { articleApi, useCreateArticleMutation } from "../../redux/services/articleApi";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../Hooks/hook";
// import { useToast } from "@/hooks/use-toast"; // Assuming a toast hook exists, if not I'll just use alert for now but follow pattern

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
const dispatch = useAppDispatch()
  const router = useRouter();
  const [createArticle, { isLoading }] = useCreateArticleMutation();

  const handlePublish = async () => {
    if (!title || !content || !categoryId) {
      alert("Please fill in title, content and category");
      return;
    }

    try {
      const res = await createArticle({
        title,
        content,
        preview,
        categoryId,
        tags,
        image: imageUrl,
      }).unwrap();
      alert("Article submitted successfully!");
      dispatch(articleApi.util.invalidateTags(["Articles"]));
      console.log("Article submitted successfully!", res);
      router.push("/dashboard/contributor/my-articles");
    } catch (err) {
      console.error("Failed to create article:", err);
      alert("Failed to submit article");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EditorHeader onPublish={handlePublish} isLoading={isLoading} />
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
