"use client";

import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Button } from "@/components/ui/button";
import ImageUpload from "../common-component/imgae-uploader";
import RichTextEditor from "./rich-text-editor";
import { useCreatePostMutation } from "@/src/app/redux/services/communityPostApi";

import { useCustomSelectStyles } from "@/lib/selectStyle";
import { useCategorySelect } from "@/src/app/Hooks/useCategorySelect";
import { toast } from "react-toastify";

interface Tag {
  value: string;
  label: string;
}

const defaultTags: Tag[] = [
  { value: "postpartum-depression", label: "Postpartum Depression" },
  { value: "anxiety", label: "Anxiety" },
  { value: "postpartum-anxiety", label: "Postpartum Anxiety" },
  { value: "postpartum-ocd", label: "Postpartum OCD" },
];

export default function ShareJourneyForm() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [sensitiveContent, setSensitiveContent] = useState(false);
  const [postAnonymously, setPostAnonymously] = useState(false);
  const [tags, setTags] = useState<Tag[]>(defaultTags);

  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();

  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    handleCategoryChange,
    categoriesLoading,
    isCreatingCategory,
  } = useCategorySelect();

  const customSelectStyles = useCustomSelectStyles();
  const isLoading = isCreatingPost || isCreatingCategory;

  const router = require("next/navigation").useRouter();

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

  // Image Upload Handler - receives URL from ImageUpload component
  const handleImageUpload = (imageUrl: string | null) => {
    setUploadedImage(imageUrl);
  };

  const handlePublish = async () => {
    if (!title.trim() || !story.trim()) {
      toast.info("Please fill in both title and story");
      return;
    }
    if (selectedTags.length === 0) {
      toast.info("Please select at least one tag");
      return;
    }
    if (!selectedCategory) {
      toast.info("Please select a category");
      return;
    }

    const payload = {
      title: title.trim(),
      body: story,
      tags: selectedTags.map((t) => t.value),
      categoryId: selectedCategory.value,
      isAnonymous: postAnonymously,
      image: uploadedImage ?? "",
    };

    try {
      await createPost(payload).unwrap();
      toast.success("Story published successfully!");
      router.push("/community");
      // Reset form
      setTitle("");
      setStory("");
      setSelectedTags([]);
      setSelectedCategory(null);
      setUploadedImage(null);
      setSensitiveContent(false);
      setPostAnonymously(false);
    } catch (error: any) {
      console.error("Failed to publish:", error);
      toast.error(error?.data?.message ?? "Failed to publish story");
    }
  };

  <CreatableSelect styles={customSelectStyles} />;

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
        <ImageUpload value={null} onImageUpload={handleImageUpload} />
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
          {/* <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sensitiveContent}
              onChange={(e) => setSensitiveContent(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-foreground">
              Add sensitive content warning
            </span>
          </label> */}
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
