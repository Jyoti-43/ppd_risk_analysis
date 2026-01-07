
import EditPostForm from "@/src/app/component/community/edit-post/edit-post-form";
import Sidebar from "@/src/app/component/community/create-post/sidebar";



export default function Page() {
  return (
    <div className="min-h-screen bg-background">
     
      <div className="flex gap-6 max-w-7xl mx-auto px-4 py-8">
        <main className="flex-1">
           
        <EditPostForm />
        </main>
        <aside className="w-80">
          <Sidebar />
        </aside>
      </div>
    </div>
  )
}
