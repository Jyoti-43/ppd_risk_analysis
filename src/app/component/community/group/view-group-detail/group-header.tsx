"use client";
import { Heart, CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";
import {
  useGetGroupQuery,
  useGetMyJoinedgroupQuery,
} from "@/src/app/redux/services/communityGroupApi";
import { useAppSelector } from "@/src/app/Hooks/hook";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";

const normalizeId = (id: string | number | null | undefined): string => {
  if (!id) return "";
  return String(id).replace("user_", "");
};

export function GroupHeader() {
  const params = useParams();
  const id = String(params?.id || "");
  const currentUser = useAppSelector(selectCurrentUser);

  const { data: groups, isLoading: isAllLoading } = useGetGroupQuery(
    currentUser?.userId,
  );
  const { data: joinedGroups, isLoading: isJoinedLoading } =
    useGetMyJoinedgroupQuery(currentUser?.userId, {
      skip: !currentUser?.userId,
    });

  const group = groups?.find(
    (g) =>
      String(g.groupId || g.id) === id || `group_${g.groupId || g.id}` === id,
  );
  const isJoined = joinedGroups?.some(
    (g) =>
      String(g.groupId || g.id) === id || `group_${g.groupId || g.id}` === id,
  );

  if (isAllLoading || isJoinedLoading) {
    return <div className="h-64 bg-muted animate-pulse rounded-b-2xl" />;
  }

  if (!group) return null;

  const isOwner =
    group.isOwner ||
    normalizeId(group.createdBy?.id) === normalizeId(currentUser?.userId);

  return (
    <div className="bg-gradient-to-br from-secondary via-accent to-secondary">
      <div className="max-w-6xl mx-auto px-6 py-16 pb-4 relative">
        {/* Decorative element */}

        <div className="flex gap-5 items-start">
          {/* Group icon */}
          <div className="bg-card rounded-lg p-4 shrink-0">
            <Heart className="w-12 h-12 text-primary fill-primary" />
          </div>

          {/* Group info */}
          <div className="flex-1 max-w-5xl">
            <h1 className="text-3xl font-bold mb-2">
              {group.groupName || "Group Details"}
            </h1>
            <p className="text-foreground mb-6">
              {group.groupDescription ||
                group.description ||
                "A safe, non-judgmental community space."}
            </p>

            {/* Stats and buttons */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-6">
                <div>
                  {/* <div className="text-xl font-bold">{group.members || 0}</div>
                  <div className="text-sm text-muted-foreground">Members</div> */}
                </div>
                {/* <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">54 Online now</span>
                </div> */}
              </div>

              {/* Avatars */}
              {/* <div className="flex items-center -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-card"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-pink-600 border-2 border-card"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-600 border-2 border-card"></div>
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-card flex items-center justify-center text-xs font-bold">
                  +%
                </div>
              </div> */}

              <div className="flex gap-3 ml-auto">
                <button className="flex items-center gap-2 px-4 py-2 border border-green-200 bg-green-50 text-green-700 rounded-lg font-semibold transition cursor-default">
                  <CheckCircle className="w-4 h-4" />
                  {isOwner ? "Admin" : isJoined ? "Member" : "Joined"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
