"use client";

import { use, useState } from "react";
import { X, Users } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import ImageUpload from "../../../common-component/imgae-uploader";
import { useDispatch, useSelector } from "react-redux";

import CreatableSelect from "react-select/creatable";
import { useCustomSelectStyles } from "@/lib/selectStyle";
import { useCategorySelect } from "@/src/app/Hooks/useCategorySelect";
import {
  setImageUrl,
  setTitle,
  setBody,
  setTags,
} from "@/src/app/redux/feature/community/groupPostSlice";

import { useAppDispatch, useAppSelector } from "@/src/app/Hooks/hook";
import { useCreateGroupPostMutation } from "@/src/app/redux/services/groupPostApi";
import { RootState } from "@/src/app/redux/store";
import { useUploadImageMutation } from "@/src/app/redux/services/communityPostApi";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAvatar: string;
  groupId: string | null;
}

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

export function CreatePostModal({
  isOpen,
  onClose,
  userName,
  userAvatar,
  groupId,
}: CreatePostModalProps) {
  const privacy = "Member";
  const dispatch = useAppDispatch();
  const [createGroupPost] = useCreateGroupPostMutation();
  const [uploadImage] = useUploadImageMutation();
  const [open, setOpen] = useState(false);
  // Use Redux slice for form state
  const formData = useAppSelector(
    (state: RootState) => state.createGroupPost.formData
  );
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  // Tag and category state (local for select options, Redux for selected values)
  const [tags, setTags] = useState<Tag[]>(defaultTags);

  // selectedTags from Redux
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const {
    categories,
    selectedCategory,
    handleCategoryChange,
    categoriesLoading,
    isCreatingCategory,
  } = useCategorySelect();
  const customSelectStyles = useCustomSelectStyles();
  const router = require("next/navigation").useRouter();
  // Image Upload Handler - receives URL from ImageUpload component
  const handleImageUpload = (imageUrl: string | null) => {
    setUploadedImage(imageUrl);
  };

  // Tag change handler
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

  // Submit handler
  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      alert("Please select at least one tag");
      return;
    }
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }

    console.log("Group ID prop:", groupId);
    if (!groupId) {
      alert("No group selected. Please select a group before posting.");
      return;
    }

    const cleanGroupId =
      groupId !== null && groupId !== undefined ? groupId.toString() : null;

    console.log("Clean Group ID:", cleanGroupId);
    try {
      const response = await createGroupPost({
        postTitle: formData.postTitle ?? "",
        postBody: formData.postBody ?? "",
        tags: selectedTags.map(tag => tag.value) ?? [],
        categoryId: selectedCategory?.value ?? "",
        isAnonymous: formData.isAnonymous,
        image: uploadedImage ?? "",
        groupId: cleanGroupId ?? "",
      }).unwrap();
      console.log("Api response success", response);
      alert("Story published successfully!");
      router.push("/community");
      setOpen(false);
      onClose();
    } catch (error: any) {
      console.error("Failed to publish:", error);
      alert(error?.data?.message ?? "Failed to publish story");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-secondary rounded-lg w-full max-w-2xl  min-h-[90vh] flex flex-col overflow-hidden  px-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Create post</h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2">
              {/* User Section */}
              <div className="flex  items-center gap-3 mb-2">
                <div className="w-16 p-2 rounded-full shrink-0  ">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      className="rounded-3xl"
                    />
                  </Avatar>
                </div>
                {/* <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex-shrink-0"></div> */}
                {/* <div> */}
                <p className="font-semibold text-foreground">{userName}</p>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition bg-muted px-2 py-1 rounded">
                  {/* <Users className="w-4 h-4" /> */}
                  {privacy}
                </button>
                {/* </div> */}
              </div>

              {/* Text Area */}
              <div className="flex gap-6  items-center  ">
                <div className="mb-2 flex-1">
                  <textarea
                    value={formData.postBody}
                    onChange={(e) => dispatch(setBody(e.target.value))}
                    placeholder={`What's on your mind, ${userName}?`}
                    className="w-full bg-background text-foreground placeholder-muted-foreground rounded-lg px-4 py-3 border border-primary focus:outline-none  resize-none "
                    rows={7}
                  />
                </div>

                {/* Emoji Button */}
                <div
                  className="flex  items-center justify-center  "
                  style={{ height: "90px", width: "230px" }}
                >
                  <ImageUpload
                    value={null}
                    onImageUpload={handleImageUpload}
                    uploadType="groupPost"
                  />
                </div>
              </div>

              {/* Add to your post: tags and category selection at the bottom */}
              {/* <div className="border border-border rounded-lg p-2 mt-4"> */}
              <div className="flex gap-4 items-center justify-between mb-3">
                <div className="flex-1">
                  {/* <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                      SELECT TAGS
                    </label> */}
                  <CreatableSelect
                    isMulti
                    options={tags}
                    value={selectedTags}
                    onChange={handleTagChange}
                    placeholder="Choose or create tags..."
                    styles={customSelectStyles}
                    formatCreateLabel={(inputValue) =>
                      `Create tag: "${inputValue}"`
                    }
                  />
                </div>
                <div className="flex-1 ml-2">
                  {/* <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                      SELECT CATEGORY
                    </label> */}
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
              {/* </div> */}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex justify-center">
              <button
                onClick={handleSubmit}
                className="w-1/2 p-6 bg-primary text-primary-foreground font-semibold py-1 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
