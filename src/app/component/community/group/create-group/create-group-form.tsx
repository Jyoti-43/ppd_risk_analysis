"use client";

import {  useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Button } from "@/components/ui/button";

import RichTextEditor from "./create-group-editor";
import {

  useCreateGroupMutation,
} from "@/src/app/redux/services/communityGroupApi";

import { useCustomSelectStyles } from "@/lib/selectStyle";
import { useCategorySelect } from "@/src/app/Hooks/useCategorySelect";
import ImageUpload from "../../common-component/imgae-uploader";

export default function ShareJourneyForm() {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [createGroup, { isLoading: isCreatingGroup }] =
    useCreateGroupMutation();

  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    handleCategoryChange,
    categoriesLoading,
    isCreatingCategory,
  } = useCategorySelect();

  const customSelectStyles = useCustomSelectStyles();
  const isLoading = isCreatingGroup || isCreatingCategory;

  const router = require("next/navigation").useRouter();

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
      await createGroup(payload).unwrap();
      alert("groupDescription published successfully!");
      router.push("/community");
      console.log("group:", createGroup);
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
        <ImageUpload
          value={null}
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
