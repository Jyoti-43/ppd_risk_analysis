"use client";

import { useEffect, useRef } from "react";

interface ArticleEditorProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
}

export function ArticleEditor({
  title,
  setTitle,
  content,
  setContent,
}: ArticleEditorProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Synchronize content with local state only once on mount if needed,
  // but better to manage via input events to avoid cursor jumping
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== content) {
      // Only update if external content changed significantly (like a reset)
      // Otherwise we let the user type naturally
      if (content === "") {
        contentRef.current.innerHTML = "";
      }
    }
  }, [content]);

  const executeCommand = (command: string, value: string = "") => {
    console.log("Executing command:", command, value);
    document.execCommand(command, false, value);
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm min-h-[800px] flex flex-col">
      <div className="p-8 pb-4 space-y-4">
        {/* title Section */}
        <textarea
          placeholder="Enter article title..."
          className="w-full bg-transparent border-0 outline-none text-4xl font-black placeholder:text-muted-foreground/20 resize-none overflow-hidden h-auto"
          rows={1}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />
      </div>

      <div className="sticky top-[61px] z-40 bg-white border-y border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon="format_h1"
            label="H1"
            onClick={() => executeCommand("formatBlock", "h1")}
          />
          <ToolbarButton
            icon="format_h2"
            label="H2"
            onClick={() => executeCommand("formatBlock", "h2")}
          />
          <div className="w-px h-5 bg-border mx-2" />
          <ToolbarButton
            icon="format_bold"
            onClick={() => executeCommand("bold")}
          />
          <ToolbarButton
            icon="format_italic"
            onClick={() => executeCommand("italic")}
          />
          <ToolbarButton
            icon="format_underlined"
            onClick={() => executeCommand("underline")}
          />
          <div className="w-px h-5 bg-border mx-2" />
          <ToolbarButton
            icon="format_quote"
            onClick={() => executeCommand("formatBlock", "blockquote")}
          />
          <ToolbarButton
            icon="format_list_bulleted"
            onClick={() => executeCommand("insertUnorderedList")}
          />
          <ToolbarButton
            icon="format_list_numbered"
            onClick={() => executeCommand("insertOrderedList")}
          />
        </div>
      </div>

      <div className="flex-1 p-8 pt-6">
        <div
          ref={contentRef}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className="min-h-full outline-none text-[16px] leading-relaxed text-foreground/80 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40 
          [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6
          [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
          [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-muted-foreground"
          contentEditable
          data-placeholder="Start writing your story here... Share your insights and experiences regarding PPD recovery."
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  onClick,
  className,
  onChange,
}: {
  icon: string;
  label?: string;
  onClick?: () => void;
  className?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        // Prevent loss of focus from the contentEditable div
        e.preventDefault();
        onClick?.();
      }}
      className={`h-8 w-8 lg:w-auto lg:px-2 rounded flex items-center justify-center gap-1 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      {label && <span className="text-[11px] font-bold">{label}</span>}
      {!label && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
    </button>
  );
}
