import Sidebar from "@/src/app/component/community/create-post/sidebar";
import { DiscussionsSection } from "@/src/app/component/community/group/view-group-detail/group-post/discussion-section";
import { GroupHeader } from "@/src/app/component/community/group/view-group-detail/group-header";
import { PostCreator } from "@/src/app/component/community/group/view-group-detail/createGroupPost/post-creator";

export const metadata = {
  title: "Postpartum Anxiety Support Group - MotherCare Community",
  description:
    "Join our supportive community for mothers dealing with postpartum anxiety.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <GroupHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <PostCreator />
            <DiscussionsSection />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
