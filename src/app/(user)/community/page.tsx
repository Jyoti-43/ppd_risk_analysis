"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CommunityHero } from "@/src/app/component/community/homaPage/community-hero";
import { useGetPostQuery } from "@/src/app/redux/services/communityPostApi";
import { CommunityTabs } from "@/src/app/component/community/homaPage/community-tabs";
import { CommunityFilters } from "@/src/app/component/community/homaPage/community-filters";
import { PostsList } from "@/src/app/component/community/homaPage/post/postList";
import { GroupList } from "@/src/app/component/community/group/groupList";
import { useAppSelector } from "@/src/app/Hooks/hook";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";

function CommunityContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") || "feed";
  const filterParam =
    searchParams.get("filter") ||
    (tabParam === "groups" ? "All Groups" : "All");

  const [activeTab, setActiveTab] = useState(tabParam);
  const [activeFilter, setActiveFilter] = useState(filterParam);
  const [searchQuery, setSearchQuery] = useState("");

  // Update local state when URL changes
  useEffect(() => {
    setActiveTab(tabParam);
    setActiveFilter(filterParam);
  }, [tabParam, filterParam]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const defaultFilter = tab === "groups" ? "All Groups" : "All";
    setActiveFilter(defaultFilter);
    router.push(`/community?tab=${tab}&filter=${defaultFilter}`, {
      scroll: false,
    });
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    router.push(`/community?tab=${activeTab}&filter=${filter}`, {
      scroll: false,
    });
  };

  const currentUser = useAppSelector(selectCurrentUser);
  const { data: posts } = useGetPostQuery(currentUser?.userId);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
      {/* <SiteHeader /> */}

      <main className="flex-grow">
        <div className="container max-w-[1040px] mx-auto px-6 py-4">
          <CommunityHero activeTab={activeTab} />

          <CommunityTabs activeTab={activeTab} onTabChange={handleTabChange} />

          <CommunityFilters
            activeTab={activeTab}
            activeCategory={activeFilter}
            onCategoryChange={handleFilterChange}
            onSearchChange={setSearchQuery}
          />

          {activeTab === "feed" && (
            <>
              {/* Posts Feed */}
              <div className="flex flex-col gap-6 mb-12">
                <PostsList
                  searchQuery={searchQuery}
                  activeFilter={activeFilter}
                />
              </div>

              {/* Pagination / Load More */}
              {/* <div className="flex flex-col items-center gap-4 mb-16">
                <span className="text-[13px] font-medium text-muted-foreground">
                  Showing 4 of {postsCount} updates
                </span>
                <Button
                  variant="outline"
                  className="h-11 px-10 rounded-xl border-border bg-white font-bold text-foreground hover:bg-muted"
                >
                  next Page
                </Button>
              </div> */}
            </>
          )}

          {activeTab === "groups" && (
            <>
              {/* Groups Grid */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"> */}

              <GroupList
                activeFilter={activeFilter}
                searchQuery={searchQuery}
              />

              {/* <GroupCard
                  id="1"
                  name="Postpartum Anxiety Support"
                  description="A safe, non-judgmental space to discuss anxiety symptoms, intrusi..."
                  members={1200}
                  onlineCount={54}
                  backgroundGradient="bg-gradient-to-br from-pink-300 via-purple-300 to-pink-200"
                  icon="flutter_dash"
                  avatars={["1", "2", "3"]}
                  extraAvatarCount={8}
                /> */}

              {/* <GroupCard
                  id="2"
                  name="The 3 AM Club"
                  description="For when you're awake and everyone else is asleep. Night..."
                  members={3400}
                  onlineCount={128}
                  backgroundGradient="bg-gradient-to-br from-blue-200 via-cyan-200 to-blue-100"
                  icon="bedtime"
                  avatars={["1", "2", "3"]}
                  extraAvatarCount={12}
                  isJoined
                /> */}

              {/* <GroupCard
                  id="3"
                  name="First Time Moms 2024"
                  description="Navigating the first year of new mother. Milestones,..."
                  members={5800}
                  onlineCount={12}
                  backgroundGradient="bg-gradient-to-br from-yellow-200 via-amber-200 to-yellow-100"
                  icon="child_care"
                  avatars={["1", "2", "3"]}
                  extraAvatarCount={42}
                /> */}

              {/* <GroupCard
                  id="4"
                  name="Mindful Recovery"
                  description="Focusing on holistic healing, meditation, and gentle movement..."
                  members={890}
                  onlineCount={24}
                  backgroundGradient="bg-gradient-to-br from-green-200 via-emerald-200 to-teal-100"
                  icon="self_improvement"
                  avatars={["1", "2"]}
                /> */}

              {/* <GroupCard
                  id="5"
                  name="Partners & Dads Support"
                  description="A group for partners supporting new mothers. Share advice, ask..."
                  members={450}
                  onlineCount={5}
                  backgroundGradient="bg-gradient-to-br from-purple-200 via-violet-200 to-purple-100"
                  icon="diversity_3"
                  avatars={["1"]}
                /> */}
              {/* </div> */}

              {/* Pagination / Load More */}
              {/* <div className="flex flex-col items-center gap-4 mb-16">
                <span className="text-[13px] font-medium text-muted-foreground">
                  Showing 5 of 24 groups
                </span>
                <Button
                  variant="outline"
                  className="h-11 px-10 rounded-xl border-border bg-white font-bold text-foreground hover:bg-muted"
                >
                  Load More Groups
                </Button>
              </div> */}
            </>
          )}
        </div>
      </main>

      {/* <SiteFooter /> */}
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div>Loading community...</div>}>
      <CommunityContent />
    </Suspense>
  );
}
