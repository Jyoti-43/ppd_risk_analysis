"use client";

import { useEffect } from "react";
import { useAppSelector } from "../../Hooks/hook";
import { selectIsLoggedIn } from "../../redux/feature/user/userSlice";
import { communityPost } from "../../redux/services/communityPostApi";
import { communityGroup } from "../../redux/services/communityGroupApi";
import { groupPost } from "../../redux/services/groupPostApi";
import { userDashboardApi } from "../../redux/services/userDashboardApi";

export function CommunityPrefetcher() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  // Get prefetch functions
  const prefetchPosts = communityPost.usePrefetch("getPost");
  const prefetchGroups = communityGroup.usePrefetch("getGroup");
  const prefetchMyGroups = communityGroup.usePrefetch("getMyJoinedgroup");
  const prefetchGroupPosts = groupPost.usePrefetch("getGroupPost");
  const prefetchCategories = communityPost.usePrefetch("getCategory");

  // Dashboard prefetching
  const prefetchSymptoms = userDashboardApi.usePrefetch(
    "getSymptomsScreeningHistory",
  );
  const prefetchEpds = userDashboardApi.usePrefetch("getEpdsScreeningHistory");
  const prefetchHybrid = userDashboardApi.usePrefetch(
    "getHybridScreeningHistory",
  );
  const prefetchPostCount = userDashboardApi.usePrefetch("postCount");
  const prefetchScreeningCount = userDashboardApi.usePrefetch("screeningCount");

  useEffect(() => {
    if (isLoggedIn) {
      // Step 1: Immediate Dashboard Data (High priority)
      prefetchSymptoms(undefined, { force: false });
      prefetchEpds(undefined, { force: false });
      prefetchHybrid(undefined, { force: false });
      prefetchPostCount(undefined, { force: false });
      prefetchScreeningCount(undefined, { force: false });

      // Step 2: Community Data (Background priority, staggered by 1s)
      const timeoutId = setTimeout(() => {
        prefetchPosts(undefined, { force: false });
        prefetchGroups(undefined, { force: false });
        prefetchMyGroups(undefined, { force: false });
        prefetchGroupPosts(undefined, { force: false });
        prefetchCategories(undefined, { force: false });
        console.log("Community background cache warmed.");
      }, 1000);

      console.log("App data prefetching sequence started...");
      return () => clearTimeout(timeoutId);
    }
  }, [
    isLoggedIn,
    prefetchPosts,
    prefetchGroups,
    prefetchMyGroups,
    prefetchGroupPosts,
    prefetchCategories,
    prefetchSymptoms,
    prefetchEpds,
    prefetchHybrid,
    prefetchPostCount,
    prefetchScreeningCount,
  ]);

  return null; // This component doesn't render anything
}
