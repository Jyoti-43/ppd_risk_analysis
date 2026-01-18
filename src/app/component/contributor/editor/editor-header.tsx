import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface EditorHeaderProps {
  onPublish: () => void;
  isLoading: boolean;
}

export function EditorHeader({ onPublish, isLoading }: EditorHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white px-4 md:px-6 py-2">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
            <span className="text-[13px] font-medium">Back to Home</span>
          </Link>
        </Button>
        <div className="h-4 w-px bg-border mx-2" />
        <div className="flex items-center gap-2.5">
          <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px] fill">
              description
            </span>
          </div>
          <h1 className="text-base font-bold tracking-tight">New Article</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-4 text-[13px] font-medium bg-transparent"
        >
          Save Draft
        </Button>
        <Button
          size="sm"
          onClick={onPublish}
          disabled={isLoading}
          className="h-9 px-5 bg-primary hover:bg-primary-hover text-white text-[13px] font-medium shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            "Submit for Review"
          )}
        </Button>
        <Avatar className="size-8 border border-border ml-2">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback className="bg-secondary text-primary font-bold text-[10px]">
            A
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
