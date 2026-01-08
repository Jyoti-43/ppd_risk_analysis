import { DiscussionPost } from "./discussion-post";

export function DiscussionsSection() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recent Discussions</h2>
        <div className="flex gap-4">
          <button className="text-primary font-semibold hover:underline">
            Newest
          </button>
          <button className="text-muted-foreground hover:text-primary transition">
            Popular
          </button>
        </div>
      </div>

      {/* Posts */}
      <DiscussionPost
        author="Sarah Jenkins"
        badge="New Mom"
        timeAgo="2 hours ago"
        content="Does anyone else get hit with a wave of anxiety right when the sun goes down? The days are manageable, but as soon as evening hits, I feel this tightness in my chest. 🫂 Would love to hear your evening routines that help calm the nervous system."
        tags={["#EveningAnxiety", "#NoonHelpHelp"]}
        likes={24}
        comments={12}
      />

      <DiscussionPost
        author="Emily Chen"
        badge="Mentor"
        timeAgo="5 hours ago"
        content="Just wanted to share a breathing technique that my therapist taught me. It's called Box Breathing.

1. Inhale for 4 counts
2. Hold for 4 counts
3. Exhale for 4 counts
4. Hold empty for 4 counts

I made this little guide for you all! 💗"
        likes={89}
        comments={34}
        hasImage={true}
        imageUrl="/breathing-guide-visual.jpg"
      />
    </div>
  );
}
