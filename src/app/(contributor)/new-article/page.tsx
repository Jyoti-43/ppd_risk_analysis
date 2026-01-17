import { ArticleEditor } from "../../component/contributor/editor/article-editor";
import { EditorHeader } from "../../component/contributor/editor/editor-header";
import { EditorSidebar } from "../../component/contributor/editor/editor-sidebar";


export default function NewArticlePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EditorHeader />
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <ArticleEditor />
          <EditorSidebar />
        </div>
      </main>
      <footer className="py-6 border-t border-border mt-auto">
        <p className="text-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          PPD Support Contributor Portal © 2026
        </p>
      </footer>
    </div>
  )
}
