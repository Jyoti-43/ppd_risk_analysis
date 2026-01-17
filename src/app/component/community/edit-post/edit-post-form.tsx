"use client";

import { useEffect, useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Button } from "@/components/ui/button";
import ImageUpload from "../common-component/imgae-uploader";
import RichTextEditor from "../create-post/rich-text-editor";
import {

  useGetPostQuery,
  useUpdatePostMutation,
} from "@/src/app/redux/services/communityPostApi";
import { useParams } from "next/navigation";
import { useCustomSelectStyles } from "@/lib/selectStyle";
import { useCategorySelect } from "@/src/app/Hooks/useCategorySelect";

interface Tag {
  value: string;
  label: string;
}

// interface Category {
//   value: string;
//   label: string;
// }

const defaultTags: Tag[] = [
  { value: "postpartum-depression", label: "Postpartum Depression" },
  { value: "anxiety", label: "Anxiety" },
  { value: "postpartum-anxiety", label: "Postpartum Anxiety" },
  { value: "postpartum-ocd", label: "Postpartum OCD" },
];

export default function EditPostForm() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<Category | null>(
  //   null
  // );

  // Get postId from URL params
  const params = useParams();
  const postId =
    typeof params === "object" && "id" in params ? params.id : undefined;
  console.log("Editing post ID:", postId);

  const customSelectStyles = useCustomSelectStyles();
  // Fetch all posts and find the one to edit
  const { data: posts, isLoading: isPostsLoading } = useGetPostQuery();
  const post = posts?.find((p: any) => String(p.id) === String(postId));

  const [title, setTitle] = useState<string>("");
  const [story, setStory] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [sensitiveContent, setSensitiveContent] = useState<boolean>(false);
  const [postAnonymously, setPostAnonymously] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>(defaultTags);
  // const [categories, setCategories] = useState<Category[]>([]);
  const [updatePost, { isLoading: isUpdatingPost }] = useUpdatePostMutation();
  const numericPostId = String(postId).replace(/^post_/, "");

  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    handleCategoryChange,
    categoriesLoading,
    isCreatingCategory,
  } = useCategorySelect();



  const router = require("next/navigation").useRouter();

  // Pre-fill form fields when post data loads
  useEffect(() => {
    if (post) {
      setTitle(post.title ?? "");
      setStory(post.body ?? "");
      setSelectedTags(
        Array.isArray(post.tags)
          ? post.tags.map((tag: string) => ({ value: tag, label: tag }))
          : []
      );
      setSelectedCategory(
        post.category && (post.category as any).id && (post.category as any).name
          ? {
            value: String((post.category as any).id),
            label: String((post.category as any).name),
          }
          : null
      );
      setUploadedImage((post as any).image ?? null);
      setPostAnonymously(!!(post as any).isAnonymous);
      // Optionally: setSensitiveContent if you store this in post
    }
  }, [post?.id]);


  const handleTagChange = (newValue: any) => {
    if (newValue) {
      const updatedTags = newValue.map((item: any) => {
        if (item.__isNew__) {
          return {
            value: item.label.toLowerCase().replace(/\s+/g, "-"),
            label: item.label,
          };
        }
        return item;
      });
      setSelectedTags(updatedTags);

      // Add new tag to available tags if it doesn't exist
      updatedTags.forEach((tag: Tag) => {
        if (!tags.some((t) => t.value === tag.value)) {
          setTags((prev) => [...prev, tag]);
        }
      });
    } else {
      setSelectedTags([]);
    }
  };


  const handleImageUpload = (imageUrl: string | null) => {
    setUploadedImage(imageUrl);
  };

  const handlePublish = async () => {
    if (!title.trim() || !story.trim()) {
      alert("Please fill in both title and story");
      return;
    }
    if (selectedTags.length === 0) {
      alert("Please select at least one tag");
      return;
    }
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }

    const postBody = {
      title: title.trim(),
      body: story,
      tags: selectedTags.map((t) => t.value as string),
      categoryId: selectedCategory.value as string,
      isAnonymous: postAnonymously,
      image: uploadedImage ?? "",
    };

    try {
      await updatePost({ postId: numericPostId, postBody }).unwrap();
      alert("Story updated successfully!");

      setSelectedCategory(null);
      setSelectedTags([]);
      setTitle("");
      setStory("");
      //   setUploadedImage(null);
      setPostAnonymously(false);
      setSensitiveContent(false);
      router.push("/community");
      // Optionally: reset form or redirect
    } catch (error: any) {
      console.error("Failed to update:", error);
      console.log(error?.data?.detail);
      alert(error?.data?.message ?? "Failed to update story");
    }
  };

  <CreatableSelect styles={customSelectStyles} />;

  const isLoading = isUpdatingPost || isCreatingCategory;

  console.log("image url:", uploadedImage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Share Your Journey
        </h1>
        <p className="text-muted-foreground">
          Your voice matters. Share your experience in a safe, supportive space.
          You can choose to remain anonymous.
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="text-sm font-semibold text-muted-foreground mb-3 block">
          UPLOAD COVER IMAGE
        </label>
        <ImageUpload value={uploadedImage} onImageUpload={handleImageUpload} />
      </div>

      {/* Tags Section */}
      <div className="flex flex-row gap-5 mx-1">
        <div className="flex flex-1 flex-col">
          <label className="text-sm font-semibold text-muted-foreground mb-3 block">
            SELECT TAGS
          </label>
          <CreatableSelect
            isMulti
            options={tags}
            value={selectedTags}
            onChange={handleTagChange}
            placeholder="Choose or create tags..."
            styles={customSelectStyles}
            formatCreateLabel={(inputValue) => `Create tag: "${inputValue}"`}
          />
        </div>

        {/* Category Section */}
        <div className="flex flex-1 flex-col mx-1">
          <label className="text-sm font-semibold text-muted-foreground mb-3 block">
            SELECT CATEGORY
          </label>
          <CreatableSelect
            isClearable
            isLoading={categoriesLoading || isCreatingCategory}
            options={categories}
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Choose or create category..."
            styles={customSelectStyles}
            formatCreateLabel={(inputValue) =>
              `Create category: "${inputValue}"`
            }
          />
        </div>
      </div>

      {/* Story Title */}
      <div>
        <label className="text-sm font-semibold text-muted-foreground mb-3 block">
          STORY TITLE
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your story a title..."
          className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
          disabled={isPostsLoading || !post}
        />
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="text-sm font-semibold text-muted-foreground mb-3 block">
          YOUR STORY
        </label>
        <RichTextEditor value={story} onChange={setStory} />
      </div>

      {/* Options */}
      <div className="flex flex-row">
        <div className="space-y-3 flex flex-col flex-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sensitiveContent}
              onChange={(e) => setSensitiveContent(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-foreground">
              Add sensitive content warning
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={postAnonymously}
              onChange={(e) => setPostAnonymously(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-foreground">Post Anonymously</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handlePublish}
            disabled={isLoading}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? "Publishing..." : "Publish Story"}
          </Button>
        </div>
      </div>
    </div>
  );
}
