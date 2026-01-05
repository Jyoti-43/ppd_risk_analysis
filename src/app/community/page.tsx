"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
// import { fetchPosts } from "./firebase-actions"
import { SiteHeader } from "../common/layout/site-header";
import { CommunityHero } from "../component/community/community-hero";
import { CommunityTabs } from "../component/community/community-tabs";
import { CommunityFilters } from "../component/community/community-filters";
import { PostCard } from "../component/community/post-card";
import { CreateGroupCard } from "../component/community/create-group-card";
import { GroupCard } from "../component/community/group-card";
import { FeaturedStoryCard } from "../component/community/featured-story-card";
import { SecondaryStoryCard } from "../component/community/secondary-story-card";
import { StoryCard } from "../component/community/story-card";
import { SiteFooter } from "../common/layout/site-footer";
import { useAppDispatch, useAppSelector } from "../Hooks/hook";
import {
  loadPostsFromStorage,
  selectPosts,
  selectPostStatus,
  selectPostError,
} from "../redux/feature/community/createPostSlice";

export default function CommunityPage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("feed");
  
  // Get posts from Redux store
  const posts = useAppSelector(selectPosts);
  const loadingPosts = useAppSelector(selectPostStatus) === "loading";
  const postsError = useAppSelector(selectPostError);

  useEffect(() => {
    console.log("Loading posts from localStorage...");
    dispatch(loadPostsFromStorage());
  }, [dispatch]);

  const formatTimeAgo = (timestamp: any) => {
    const date = timestamp?.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date();
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
      {/* <SiteHeader /> */}

      <main className="flex-grow">
        <div className="container max-w-[1040px] mx-auto px-6 py-4">
          <CommunityHero activeTab={activeTab} />

          <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <CommunityFilters activeTab={activeTab} />

          {activeTab === "feed" && (
            <>
              {/* Posts Feed */}
              <div className="flex flex-col gap-6 mb-12">
                {loadingPosts && (
                  <p className="text-sm text-muted-foreground">
                    Loading feed...
                  </p>
                )}
                {postsError && (
                  <p className="text-sm text-destructive">{postsError}</p>
                )}
                {!loadingPosts && !postsError && posts.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No posts yet. Be the first to share.
                  </p>
                )}
                {!loadingPosts &&
                  !postsError &&
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      topic={post.topics?.[0] || "Community"}
                      // {
                      //   post.tags?.[0] || post.topics?.[0] || "Community"
                      // }
                      author={
                        post.isAnonymous
                          ? "Anonymous"
                          : post.author || "Unknown"
                      }
                      timeAgo={formatTimeAgo(post.createdAt)}
                      title={post.title || "Untitled"}
                      excerpt={post.content || ""}
                      // imageUrl={
                      //   post.imageUrl ||
                      //   "/abstract-illustration-of-diverse-hands-forming-a-c.jpg"
                      // }
                      // likes={
                      //   Array.isArray(post.likes)
                      //     ? post.likes.length
                      //     : Number(post.likes || 0)
                      // }
                      // comments={post.commentCount ?? post.commentsCount ?? 0}
                      isSensitive={post.isSensitive}
                    />
                  ))}
              </div>

              {/* Pagination / Load More */}
              <div className="flex flex-col items-center gap-4 mb-16">
                <span className="text-[13px] font-medium text-muted-foreground">
                  Showing 4 of 128 updates
                </span>
                <Button
                  variant="outline"
                  className="h-11 px-10 rounded-xl border-border bg-white font-bold text-foreground hover:bg-muted"
                >
                  Load More
                </Button>
              </div>
            </>
          )}

          {activeTab === "groups" && (
            <>
              {/* Groups Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <CreateGroupCard />

                <GroupCard
                  id="1"
                  name="Postpartum Anxiety Support"
                  description="A safe, non-judgmental space to discuss anxiety symptoms, intrusi..."
                  members={1200}
                  onlineCount={54}
                  backgroundGradient="bg-gradient-to-br from-pink-300 via-purple-300 to-pink-200"
                  icon="flutter_dash"
                  avatars={["1", "2", "3"]}
                  extraAvatarCount={8}
                />

                <GroupCard
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
                />

                <GroupCard
                  id="3"
                  name="First Time Moms 2024"
                  description="Navigating the first year of new mother. Milestones,..."
                  members={5800}
                  onlineCount={12}
                  backgroundGradient="bg-gradient-to-br from-yellow-200 via-amber-200 to-yellow-100"
                  icon="child_care"
                  avatars={["1", "2", "3"]}
                  extraAvatarCount={42}
                />

                <GroupCard
                  id="4"
                  name="Mindful Recovery"
                  description="Focusing on holistic healing, meditation, and gentle movement..."
                  members={890}
                  onlineCount={24}
                  backgroundGradient="bg-gradient-to-br from-green-200 via-emerald-200 to-teal-100"
                  icon="self_improvement"
                  avatars={["1", "2"]}
                />

                <GroupCard
                  id="5"
                  name="Partners & Dads Support"
                  description="A group for partners supporting new mothers. Share advice, ask..."
                  members={450}
                  onlineCount={5}
                  backgroundGradient="bg-gradient-to-br from-purple-200 via-violet-200 to-purple-100"
                  icon="diversity_3"
                  avatars={["1"]}
                />
              </div>

              {/* Pagination / Load More */}
              <div className="flex flex-col items-center gap-4 mb-16">
                <span className="text-[13px] font-medium text-muted-foreground">
                  Showing 5 of 24 groups
                </span>
                <Button
                  variant="outline"
                  className="h-11 px-10 rounded-xl border-border bg-white font-bold text-foreground hover:bg-muted"
                >
                  Load More Groups
                </Button>
              </div>
            </>
          )}

          {activeTab === "stories" && (
            <>
              {/* Top Inspiring Stories Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-[24px] text-primary fill">
                    favorite
                  </span>
                  <h2 className="text-[22px] font-black text-foreground">
                    Top Inspiring Stories
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Large Featured Story */}
                  <div className="lg:col-span-2">
                    <FeaturedStoryCard
                      id="1"
                      category="Recovery & Hope"
                      author="Sarah J."
                      timeAgo="1 day ago"
                      title="Found myself again after 6 months"
                      quote="I wanted to share a positive update for anyone currently in the trenches. Today I laughed—really laughed—for the first time in what feels like a lifetime. The fog does lift. It happens slowly, and then all at once."
                      likes={342}
                      comments={56}
                      imageUrl="https://images.unsplash.com/photo-1518005020250-675f0f0fd13b?q=80&w=2002&auto=format&fit=crop"
                    />
                  </div>

                  {/* Two Secondary Stories */}
                  <div className="flex flex-col gap-6">
                    <SecondaryStoryCard
                      id="2"
                      category="Sleep"
                      title="The 3 AM thoughts that..."
                      excerpt="I used to dread the sunset knowing wh..."
                      likes={124}
                      imageUrl="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop"
                      categoryColor="bg-primary/90"
                    />
                    <SecondaryStoryCard
                      id="3"
                      category="Partner"
                      title="Watching her struggle and..."
                      excerpt="I didn't understand it at first. I thought sh..."
                      likes={56}
                      imageUrl="https://images.unsplash.com/photo-1536640712247-c45474d66482?q=80&w=2050&auto=format&fit=crop"
                      categoryColor="bg-red-500/90"
                    />
                  </div>
                </div>
              </div>

              {/* Latest Community Stories Section */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[22px] font-black text-foreground">
                    Latest Community Stories
                  </h2>
                  <a
                    href="#"
                    className="text-primary hover:text-[#b50d62] text-[13px] font-bold transition-colors"
                  >
                    View Archive
                  </a>
                </div>

                <div className="flex flex-col gap-6">
                  <StoryCard
                    id="4"
                    category="Severe Anxiety"
                    author="Anonymous Mother"
                    timeAgo="5 hours ago"
                    title="When the intrusive thoughts became too loud"
                    excerpt="Everything felt dangerous. The stairs, the kitchen knives, the car ride. I couldn't explain why I was so terrified of everything around me. It started as small worries but quickly spiraled into something I couldn't control..."
                    likes={89}
                    comments={42}
                    imageUrl="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop"
                    isSensitive
                    categoryColor="bg-white/90"
                  />

                  <StoryCard
                    id="5"
                    category="Community"
                    author="Maria K."
                    timeAgo="3 days ago"
                    title="Why joining a support group saved my sanity"
                    excerpt="I resisted for the longest time. I thought I could handle it alone, or that talking to strangers wouldn't help. Walking into that room for the first time was the hardest thing I've..."
                    likes={215}
                    comments={34}
                    imageUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop"
                    categoryColor="bg-orange-500/90"
                  />
                </div>
              </div>

              {/* Pagination / Load More */}
              <div className="flex flex-col items-center gap-4 mb-16">
                <span className="text-[13px] font-medium text-muted-foreground">
                  Showing top stories for you
                </span>
                <Button
                  variant="outline"
                  className="h-11 px-10 rounded-xl border-border bg-white font-bold text-foreground hover:bg-muted"
                >
                  Load More Stories
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* <SiteFooter /> */}
    </div>
  );
}
