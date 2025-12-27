"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { createGroup, createPost, saveDraft } from "../firebase-actions"
import { auth } from "@/lib/firebaseConfig"
import { SiteHeader } from "../../component/community/layout/site-header"
import { RichTextEditor } from "../../component/community/rich-text-editor"
import { TopicSelector } from "../../component/community/topic-selector"
import { SiteFooter } from "../../component/community/layout/site-footer"

export default function CreatePostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [topics, setTopics] = useState<string[]>([])
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [isSensitive, setIsSensitive] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const handleSaveDraft = async () => {
    if (!title.trim() && !content.trim()) {
      alert("Add a title or content before saving a draft.")
      return
    }

    setIsSaving(true)
    try {
      const user = auth.currentUser
      await saveDraft({
        title,
        content,
        topics,
        isAnonymous,
        isSensitive,
        userId: user?.uid,
        userEmail: user?.email || undefined,
        status: "draft",
      })
      alert("Draft saved to Firebase.")
    } catch (error) {
      console.error("Failed to save draft", error)
      alert("Could not save draft. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please add a title and content before publishing.")
      return
    }

    setIsPublishing(true)
    try {
      const user = auth.currentUser
      await createPost({
        title,
        content,
        topics,
        isAnonymous,
        isSensitive,
        author: isAnonymous ? "Anonymous Mother" : user?.displayName || "User",
        userId: user?.uid,
        userEmail: user?.email || undefined,
        status: "published",
      })

      // Navigate back to community
      router.push("/community")
    } catch (error) {
      console.error("Failed to publish post", error)
      alert("Could not publish right now. Please try again.")
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
      <SiteHeader />

      <main className="flex-grow">
        <div className="container max-w-[1200px] mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-[36px] lg:text-[44px] font-black text-foreground mb-3">Share Your Journey</h1>
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-[700px]">
              Your voice matters. Share your experience in a safe, supportive space. You can choose to remain anonymous.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
                <div className="flex flex-col gap-6">
                  {/* Title Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Story Title
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your story a title..."
                      className="h-12 text-lg font-medium border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                    />
                  </div>

                  {/* Rich Text Editor */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Your Story
                    </label>
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Start writing here. How are you feeling today? Remember, this is a safe space to express whatever is on your mind."
                    />
                  </div>

                  {/* Topic Selector */}
                  <TopicSelector selectedTopics={topics} onTopicsChange={setTopics} />

                  {/* Checkboxes */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="anonymous"
                        checked={isAnonymous}
                        onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                      />
                      <label htmlFor="anonymous" className="text-sm font-medium cursor-pointer">
                        Post Anonymously{" "}
                        <span className="text-muted-foreground font-normal">(Your name will be hidden)</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="sensitive"
                        checked={isSensitive}
                        onCheckedChange={(checked) => setIsSensitive(checked as boolean)}
                      />
                      <label htmlFor="sensitive" className="text-sm font-medium cursor-pointer">
                        Add 'Sensitive Content' warning
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={isSaving || isPublishing}
                      className="flex-1 h-11 rounded-full font-semibold bg-transparent"
                    >
                      {isSaving ? "Saving..." : "Save Draft"}
                    </Button>
                    <Button
                      onClick={handlePublish}
                      disabled={isPublishing || isSaving}
                      className="flex-1 h-11 rounded-full font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px] mr-1.5">send</span>
                      {isPublishing ? "Publishing..." : "Publish Story"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Writing Prompts Card */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="material-symbols-outlined text-primary text-[24px] fill">lightbulb</span>
                  <h3 className="text-[15px] font-bold text-foreground uppercase tracking-wider">Writing Prompts</h3>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[14px] font-semibold text-foreground leading-snug">
                      "What is one emotion that surprised you today?"
                    </p>
                    <p className="text-[12px] text-muted-foreground">Try writing for 5 minutes</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[14px] font-semibold text-foreground leading-snug">
                      "Describe a small victory, no matter how tiny."
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[14px] font-semibold text-foreground leading-snug">
                      "Write a letter to yourself for the hard days."
                    </p>
                  </div>
                </div>
              </div>

              {/* Community Safety Card */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="material-symbols-outlined text-primary text-[24px] fill">diversity_3</span>
                  <h3 className="text-[15px] font-bold text-foreground uppercase tracking-wider">Community Safety</h3>
                </div>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
                  We are a supportive community. Please be kind, respectful, and mindful that everyone is on their own
                  journey.
                </p>
                <a href="#" className="text-primary hover:text-[#b50d62] text-[13px] font-bold transition-colors">
                  Read Guidelines
                </a>
              </div>

              {/* Crisis Resources Card */}
              <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="material-symbols-outlined text-destructive text-[24px] fill">error</span>
                  <h3 className="text-[15px] font-bold text-foreground uppercase tracking-wider">
                    Need Immediate Help?
                  </h3>
                </div>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
                  If you are feeling overwhelmed or unsafe, please reach out to a professional immediately.
                </p>
                <Button variant="destructive" className="w-full h-10 rounded-full font-semibold">
                  Crisis Resources
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}



// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
    
//     // Helper function to check if user is authenticated
//     function isAuthenticated() {
//       return request.auth != null;
//     }
    
//     // Helper function to check if user owns the resource
//     function isOwner(userId) {
//       return isAuthenticated() && request.auth.uid == userId;
//     }
    
//     // Users collection
//     match /users/{userId} {
//       allow read: if isAuthenticated();
//       allow write: if isOwner(userId);
//     }
    
//     // Posts collection
//     match /posts/{postId} {
//       allow read: if isAuthenticated();
//       allow create: if isAuthenticated();
//       allow update: if isAuthenticated();
//       allow delete: if isOwner(resource.data.userId);
      
//       // Comments sub-collection
//       match /comments/{commentId} {
//         allow read: if isAuthenticated();
//         allow create: if isAuthenticated();
//         allow delete: if isOwner(resource.data.userId);
//       }
//     }
    
//     // Groups collection
//     match /groups/{groupId} {
//       allow read: if isAuthenticated();
//       allow create: if isAuthenticated();
//       allow update: if isAuthenticated();
//     }
    
//     // Stories collection
//     match /stories/{storyId} {
//       allow read: if isAuthenticated();
//       allow create: if isAuthenticated();
//       allow update: if isAuthenticated();
//       allow delete: if isOwner(resource.data.userId);
//     }
//   }
// }