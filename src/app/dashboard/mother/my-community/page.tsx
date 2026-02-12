"use client";
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Heart, Users, Search } from "lucide-react";
import MyPostsTable from "@/src/app/component/dashboard/mother/my-community";
import {
  usePostCountQuery,
  useGetUserGroupCreatedQuery,
  useGetUserGroupJoinedQuery,
  useGetUserPostsQuery,
} from "@/src/app/redux/services/userDashboardApi";
import { GroupCard } from "@/src/app/component/community/group/group-card";
import { cn } from "@/lib/utils";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";
import { useAppSelector } from "@/src/app/Hooks/hook";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ClientDashboard = () => {
  const { data: postCount, isLoading: isPostLoading } = usePostCountQuery();
  const { data: userGroupsJoined, isLoading: isGroupsLoading } =
    useGetUserGroupJoinedQuery(undefined, {
      refetchOnMountOrArgChange: false,
    });
  const { data: postsData, isLoading: isUserPostsLoading } =
    useGetUserPostsQuery(undefined, {
      refetchOnMountOrArgChange: false,
    });
  const userPosts = postsData?.posts;
  const { data: groupCreated, isLoading: isGroupCreatedLoading } =
    useGetUserGroupCreatedQuery(undefined, {
      refetchOnMountOrArgChange: false,
    });
  const [activeGroupTab, setActiveGroupTab] = React.useState("all");
  const currentUser = useAppSelector(selectCurrentUser);

  console.log("userPosts", userPosts);
  console.log("userGroupsJoined", userGroupsJoined);
  console.log("postCount", postCount);
  console.log("groupCreated", groupCreated);

  const mergedGroups = useMemo(() => {
    const joined = Array.isArray(userGroupsJoined) ? userGroupsJoined : [];
    const created = Array.isArray(groupCreated) ? groupCreated : [];

    // Create a map by ID to avoid duplicates
    const groupMap = new Map();

    joined.forEach((g) => {
      const id = g.groupId || g.id;
      if (id) groupMap.set(id, { ...g, isJoined: true });
    });

    created.forEach((g) => {
      const id = g.groupId || g.id;
      if (id) {
        groupMap.set(id, { ...g, isOwner: true, isJoined: true });
      }
    });

    return Array.from(groupMap.values());
  }, [userGroupsJoined, groupCreated]);

  const displayedGroups = useMemo(() => {
    if (activeGroupTab === "created") {
      return Array.isArray(groupCreated) ? groupCreated : [];
    }
    if (activeGroupTab === "joined") {
      return Array.isArray(userGroupsJoined) ? userGroupsJoined : [];
    }
    return mergedGroups;
  }, [activeGroupTab, mergedGroups, groupCreated, userGroupsJoined]);
  // Calculate total likes from user posts
  const totalLikes = useMemo(() => {
    if (!userPosts || !Array.isArray(userPosts)) return 0;
    return userPosts.reduce((acc, post) => {
      const likes = parseInt(post.like?.likeCount || post.likeCount || "0");
      return acc + (isNaN(likes) ? 0 : likes);
    }, 0);
  }, [userPosts]);

  return (
    <div className="w-full flex flex-col pt-8 px-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-950/80 tracking-tight">
          Community Dashboard
        </h2>
        <p className="text-slate-500 font-medium">
          Track your engagement and activity in the MotherCare community.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-4 h-full">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Post Count
              </span>
              <p className="text-2xl font-bold text-slate-800">
                {isPostLoading ? "..." : postCount?.total_post_count || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-4 h-full">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                My Groups
              </span>
              <p className="text-2xl font-bold text-slate-800">
                {isGroupsLoading ? "..." : userGroupsJoined?.length || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-4 h-full">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Likes Count
              </span>
              <p className="text-2xl font-bold text-slate-800">
                {isUserPostsLoading ? "..." : totalLikes}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card className="relative border-none shadow-md shadow-primary/20 overflow-hidden pt-0">
        <div className="  bg-primary/5 p-8 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800">My Posts</h3>
              <p className="text-sm text-slate-500">
                Manage and view your community contributions
              </p>
            </div>
            <Link href="/community/create-post">
              <Button className="bg-primary text-white px-3 py-4 rounded-full mr-75">
                + Create New Post
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-0">
          {userPosts?.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-500">No posts found</p>
            </div>
          ) : (
            <MyPostsTable data={userPosts} isLoading={isUserPostsLoading} />
          )}
        </div>
      </Card>
      {/* Groups Section */}
      <div className="space-y-6">
        <div className="flex flex-col  space-y-4">
          <div className="flex    justify-between">
            <h3 className="text-xl font-bold text-slate-800">My Groups</h3>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-1 bg-slate-100/50 p-1 rounded-xl w-fit">
              {[
                { id: "all", label: "All My Groups" },
                { id: "created", label: "My Created Groups" },
                { id: "joined", label: "My Joined Groups" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGroupTab(tab.id)}
                  className={cn(
                    "px-4 py-2 text-sm font-bold rounded-lg transition-all",
                    activeGroupTab === tab.id
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-white/50",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Link href="/community/group/create-group">
              <Button className="bg-primary hover:bg-[#b50d62] text-white px-6 rounded-full h-10 font-bold shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                + Create New Group
              </Button>
            </Link>
          </div>
        </div>

        {/* my groups  */}
        {isGroupsLoading || isGroupCreatedLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-slate-100 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : displayedGroups.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                No groups found in this category
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedGroups.map((group: any) => {
              const gId = String(group.groupId || group.id || "");
              return (
                <GroupCard
                  key={gId}
                  id={gId}
                  name={group.groupName || group.name}
                  description={
                    group.groupDescription ||
                    group.description ||
                    "No description provided."
                  }
                  imageUrl={group.image || group.imageUrl}
                  category={
                    group.category?.name ||
                    group.categoryName ||
                    group.category ||
                    "General"
                  }
                  members={group.members || group.memberCount || 0}
                  isOwner={
                    activeGroupTab === "created" ||
                    group.isOwner ||
                    group.createdBy?.id === currentUser?.userId
                  }
                  isJoined={true} // Since these are from my-groups endpoints, user is already joined
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
