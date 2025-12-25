
import { Button } from "@/components/ui/button"
import { CommunityHero } from "../component/community/community-hero"
import { CommunityTabs } from "../component/community/community-tabs"
import { CommunityFilters } from "../component/community/community-filters"
import { PostCard } from "../component/community/post-card"
import { SiteFooter } from "../component/community/layout/site-footer"
import { SiteHeader } from "../component/community/layout/site-header"

export default function CommunityPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
      <SiteHeader />

      <main className="flex-grow">
        <div className="container max-w-[1040px] mx-auto px-6 py-4">
          <CommunityHero />

          <CommunityTabs />

          <CommunityFilters />

          {/* Posts Feed */}
          <div className="flex flex-col gap-6 mb-12">
            <PostCard
              id="1"
              category="Sleep Deprivation"
              author="Anonymous Mother"
              timeAgo="2 hours ago"
              title="The 3 AM thoughts that finally went away"
              excerpt="I used to dread the sunset knowing what was coming. It took me three months to realize that asking for help wasn't a sign of weakness. The nights felt endless, and the silence was deafening, but finding a community here change..."
              likes={124}
              comments={18}
              imageUrl="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop"
            />

            <PostCard
              id="2"
              category="Severe Anxiety"
              author="Anonymous Mother"
              timeAgo="5 hours ago"
              isSensitive
              title="When the intrusive thoughts became too loud"
              excerpt="Everything felt dangerous. The stairs, the kitchen knives, the car ride. I couldn't explain why I was so terrified of everything around me. It started as small worries but quickly spiraled into something I couldn't control..."
              likes={89}
              comments={42}
              imageUrl="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop"
            />

            <PostCard
              id="3"
              category="Recovery & Hope"
              author="Sarah J."
              timeAgo="1 day ago"
              title="Found myself again after 6 months"
              excerpt="I wanted to share a positive update for anyone currently in the trenches. Today I laughed—really laughed—for the first time in what feels like a lifetime. The fog does lift. It happens slowly, and then all at once."
              likes={342}
              comments={56}
              imageUrl="https://images.unsplash.com/photo-1518005020250-675f0f0fd13b?q=80&w=2002&auto=format&fit=crop"
            />

            <PostCard
              id="4"
              category="Partner Support"
              author="New Dad"
              timeAgo="2 days ago"
              title="Watching her struggle and learning how to help"
              excerpt="I didn't understand it at first. I thought she just needed more sleep. It took a while to realize that fixing the baby's schedule wouldn't fix how she was feeling. Here is what we learned about communication during the fourth..."
              likes={56}
              comments={8}
              imageUrl="https://images.unsplash.com/photo-1536640712247-c45474d66482?q=80&w=2050&auto=format&fit=crop"
            />
          </div>

          {/* Pagination / Load More */}
          <div className="flex flex-col items-center gap-4 mb-16">
            <span className="text-[13px] font-medium text-muted-foreground">Showing 4 of 128 updates</span>
            <Button
              variant="outline"
              className="h-11 px-10 rounded-xl border-border bg-white font-bold text-foreground hover:bg-muted"
            >
              Load More
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
