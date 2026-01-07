// "use client";

// import { useRef, useState } from "react";
// import { useUploadImageMutation } from "@/src/app/redux/services/communityPostApi";

// interface ImageUploadProps {
//   onImageUpload: (imageUrl: string | null) => void;
// }

// export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadError, setUploadError] = useState<string | null>(null);

//   const [uploadImage] = useUploadImageMutation();

//   const handleFileUpload = async (file: File) => {
//     if (!file || !file.type.startsWith("image/")) {
//       setUploadError("Please select a valid image file");
//       return;
//     }

//     // Show preview immediately
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setPreview(e.target?.result as string);
//     };
//     reader.readAsDataURL(file);

//     // Upload to server
//     setIsUploading(true);
//     setUploadError(null);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       console.log("Uploading file:", file.name, file.type, file.size);

//       const response = await uploadImage(formData).unwrap();

//       console.log("Upload response:", response);

//       // Extract URL from response (adjust based on actual API response structure)
//       const imageUrl =
//         response?.url ??
//         response?.data?.url ??
//         response?.image_url ??
//         response?.imageUrl ??
//         response?.data?.image_url ??
//         response?.path ??
//         response?.data?.path ??
//         response?.file_url ??
//         response?.file_path ??
//         (typeof response === "string" ? response : null);

//       if (imageUrl) {
//         console.log("Image URL extracted:", imageUrl);
//         onImageUpload(imageUrl);
//       } else {
//         console.warn("Image uploaded but no URL found in response:", response);
//         // If response is the URL itself as a string
//         if (typeof response === "string" && response.length > 0) {
//           onImageUpload(response);
//         } else {
//           setUploadError("Image uploaded but URL not received");
//           onImageUpload(null);
//         }
//       }
//     } catch (error: any) {
//       console.error("Failed to upload image:", error);
//       console.error("Error details:", JSON.stringify(error, null, 2));

//       // Extract error message from various possible error formats
//       const errorMessage =
//         error?.data?.message ??
//         error?.data?.detail ??
//         error?.message ??
//         error?.error ??
//         (typeof error === "string" ? error : "Failed to upload image");

//       setUploadError(errorMessage);
//       setPreview(null);
//       onImageUpload(null);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleFiles = (files: FileList) => {
//     const file = files[0];
//     if (file) {
//       handleFileUpload(file);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     handleFiles(e.dataTransfer.files);
//   };

//   const handleClick = () => {
//     if (!isUploading) {
//       fileInputRef.current?.click();
//     }
//   };

//   const handleRemove = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setPreview(null);
//     setUploadError(null);
//     onImageUpload(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   return (
//     <div
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onDrop={handleDrop}
//       onClick={handleClick}
//       className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
//         isDragging
//           ? "border-primary bg-accent"
//           : "border-border hover:border-primary"
//       } ${isUploading ? "opacity-50 cursor-wait" : ""}`}
//     >
//       {isUploading ? (
//         <div className="space-y-2">
//           <div className="text-4xl animate-pulse">📤</div>
//           <p className="text-muted-foreground">Uploading image...</p>
//         </div>
//       ) : preview ? (
//         <div className="space-y-4">
//           <img
//             src={preview}
//             alt="Preview"
//             className="w-32 h-32 object-cover mx-auto rounded-lg"
//           />
//           <button
//             onClick={handleRemove}
//             className="text-primary hover:text-primary/80 text-sm font-medium"
//           >
//             Remove Image
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           <div className="text-4xl">🖼️</div>
//           <p className="text-muted-foreground">
//             Drag and drop an image here, or click to select
//           </p>
//           <p className="text-sm text-muted-foreground">
//             Supports: JPG, PNG, GIF
//           </p>
//         </div>
//       )}

//       {uploadError && (
//         <p className="text-destructive text-sm mt-2">{uploadError}</p>
//       )}

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={(e) => e.target.files && handleFiles(e.target.files)}
//         className="hidden"
//         disabled={isUploading}
//       />
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import type React from "react";

import { useRef, useState } from "react";

import { useUploadImageMutation } from "@/src/app/redux/services/communityPostApi";
import { useUploadImageMutation as useGroupImageMutation } from "@/src/app/redux/services/communityPostApi";

interface ImageUploadProps {
  value: string | null;
  onImageUpload: (imageUrl: string | null) => void;
  uploadType?: "post" | "group"; // optional, defaults to "post"
}

export default function ImageUpload({
  value,
  onImageUpload,
  uploadType = "post",
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadPostImage] = useUploadImageMutation();
  const [uploadGroupImage] = useGroupImageMutation();

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (file && file.type.startsWith("image/")) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      setIsUploading(true);
      setUploadError(null);
      try {
        const formData = new FormData();
        formData.append("file", file);
        // const response = await uploadImage(formData).unwrap();
        let response;
        if (uploadType === "group") {
          response = await uploadGroupImage(formData).unwrap();
        } else {
          response = await uploadPostImage(formData).unwrap();
        }
        const imageUrl =
          response?.url ?? response?.data?.url ?? response?.image_url;
        if (imageUrl) {
          onImageUpload(imageUrl);
        } else {
          setUploadError("Image uploaded but URL not received");
          onImageUpload(null);
        }
      } catch (error: any) {
        console.error("Failed to upload image:", error);
        setUploadError(error?.data?.message ?? "Failed to upload image");
        setPreview(null);
        onImageUpload(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragging
          ? "border-primary bg-accent"
          : "border-border hover:border-primary"
      } ${isUploading ? "opacity-50 cursor-wait" : ""}`}
    >
      {value && (
        <img
          src={value}
          alt="Preview"
          style={{ maxWidth: 200, maxHeight: 200 }}
        />
      )}
      {isUploading ? (
        <div className="space-y-2">
          <div className="text-4xl animate-pulse">📤</div>
          <p className="text-muted-foreground">Uploading image...</p>
        </div>
      ) : preview ? (
        <div className="space-y-4">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            // fill
            loading="lazy" // Add this
            // placeholder="blur" // Add this
            // blurDataURL="/placeholder.png"
            className="w-32 h-32 object-cover mx-auto rounded-lg"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
              setUploadError(null);
              onImageUpload(null);
            }}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-4xl">🖼️</div>
          <p className="text-foreground">
            Drag and drop an image here, or{" "}
            <span className="text-primary font-medium">click to upload</span>
          </p>
          <p className="text-sm text-muted-foreground">
            (JPG, PNG, GIF up to 10MB)
          </p>
        </div>
      )}

      {uploadError && (
        <p className="text-destructive text-sm mt-2">{uploadError}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
