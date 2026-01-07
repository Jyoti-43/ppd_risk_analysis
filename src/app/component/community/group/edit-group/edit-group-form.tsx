"use client";

import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Button } from "@/components/ui/button";

import RichTextEditor from "../create-group/create-group-editor";
import {
  useGetGroupQuery,
  useUpdateGroupMutation,
} from "@/src/app/redux/services/communityGroupApi";

import { useCustomSelectStyles } from "@/lib/selectStyle";
import { useCategorySelect } from "@/src/app/Hooks/useCategorySelect";
import ImageUpload from "../../common-component/imgae-uploader";
import { useParams } from "next/navigation";

export default function EditGroupForm() {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const params = useParams();
  const groupId =
    typeof params === "object" && "id" in params ? params.id : undefined;
  console.log("Editing group ID:", groupId);

  const [updateGroup, { isLoading: isUpdatingGroup }] =
    useUpdateGroupMutation();

  const numericGroupId = String(groupId).replace(/^group_/, "");

  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    handleCategoryChange,
    categoriesLoading,
    isCreatingCategory,
  } = useCategorySelect();

  const customSelectStyles = useCustomSelectStyles();

  const router = require("next/navigation").useRouter();

  const { data: groups, isLoading: isGroupsLoading } = useGetGroupQuery();
  const normalizedGroupId = String(groupId).replace(/^group_/, "");
  const group = groups?.find((g: any) => {
    const groupIdStr = String(g.groupId);
    return (
      groupIdStr === String(groupId) ||
      groupIdStr.replace(/^group_/, "") === normalizedGroupId
    );
  });
  // Pre-fill form fields when post data loads
  useEffect(() => {
    if (group) {
      setGroupName(group.groupName ?? "");
      setGroupDescription(group.groupDescription ?? "");
      // Prefill category from group.category if available
      if (group.category && (group.category.id || group.category.name)) {
        setSelectedCategory({
          value: String(group.category.id ?? group.categoryId ?? ""),
          label: String(group.category.name ?? group.categoryName ?? ""),
        });
      } else {
        setSelectedCategory(null);
      }
      // Prefill image from group.image
      setUploadedImage(group.image ?? group.imageUrl ?? null);
    }
  }, [group, setSelectedCategory]);

  // Image Upload Handler - receives URL from ImageUpload component
  const handleImageUpload = (imageUrl: string | null) => {
    setUploadedImage(imageUrl);
  };

  const handlePublish = async () => {
    if (!groupName.trim() || !groupDescription.trim()) {
      alert("Please fill in both group name and groupDescription");
      return;
    }

    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }

    const payload = {
      groupName: groupName.trim(),
      groupDescription: groupDescription,
      categoryId: selectedCategory.value,
      image: uploadedImage ?? "",
    };

    try {
      await updateGroup({ GroupId: numericGroupId, body: payload }).unwrap();
      alert("groupDescription published successfully!");
      router.push("/community");
      console.log("group:", updateGroup);
      // Reset form
      setGroupName("");
      setGroupDescription("");
      setSelectedCategory(null);
      setUploadedImage(null);
    } catch (error: any) {
      console.error("Failed to publish:", error);
      alert(error?.data?.message ?? "Failed to publish groupDescription");
    }
  };

  <CreatableSelect styles={customSelectStyles} />;
  const isLoading = isUpdatingGroup || isCreatingCategory;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Edit Your Group
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
        <ImageUpload
          value={uploadedImage}
          onImageUpload={handleImageUpload}
          uploadType="group"
        />
      </div>

      {/* Tags Section */}
      <div className="flex flex-row gap-5 mx-1">
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

        <div className="flex flex-1 flex-col ">
          <label className="text-sm font-semibold text-muted-foreground mb-3 block">
            Group Name
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Give your group a name..."
            className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground  hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
            disabled={isGroupsLoading || !group}
          />
        </div>
      </div>

      {/* groupDescription groupName */}

      {/* Rich Text Editor */}
      <div>
        <label className="text-sm font-semibold text-muted-foreground mb-3 block">
          YOUR Group Description
        </label>
        <RichTextEditor
          value={groupDescription}
          onChange={setGroupDescription}
        />
      </div>

      {/* Options */}
      <div className="flex flex-row items-center justify-center">
        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handlePublish}
            disabled={isLoading}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? "Creating..." : "Create group"}
          </Button>
        </div>
      </div>
    </div>
  );
}
