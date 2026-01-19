"use client";

import { useState } from "react";

import { CreatePostModal } from "./create-group-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/src/app/Hooks/hook";
import { useParams } from "next/navigation";

export function PostCreator() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Get userName from userSlice or authApi
  const userName = useAppSelector((state) => state.user.currentUser.userName); // adjust path as needed
  // adjust path as needed

  const params = useParams();
  const groupID = params?.id as string;
  const cleanGroupId = groupID ? groupID.replace(/^group_/, "") : "";
  console.log("Clean Group ID form post-creator:", cleanGroupId);
  return (
    <>
      <div className="bg-card rounded-lg p-6 mb-6 ">
        <div className="flex gap-4 items-center justify-between ">
          <div className="w-16 p-2 rounded-full shrink-0  ">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="rounded-3xl"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 ">
            <Input
              type="text"
              placeholder="Share your thoughts with the group..."
              className="w-2/3 bg-secondary  text-foreground placeholder-muted-foreground rounded-lg px-2 py-4 border border-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              onClick={() => setIsModalOpen(true)}
              readOnly
            />
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userName={userName ?? "Unknown User"}
        userAvatar="/avatar.jpg"
        groupId={cleanGroupId ?? null}
      />
    </>
  );
}
