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

        {/* <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/40 border border-border/50 rounded-full w-fit group hover:border-primary/20 transition-colors">
          <span className="material-symbols-outlined text-[16px] text-muted-foreground">link</span>
          <span className="text-[12px] text-muted-foreground">ppdsupport.com/blog/</span>
          <span className="text-[12px] font-medium text-foreground">
            {title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "understanding-postpartum-..."}
          </span>
        </div> */}
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
            className="p-2 hover:bg-muted rounded text-foreground"
            onClick={() => {
              const textarea = document.querySelector(
                "textarea",
              ) as HTMLTextAreaElement;
              if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const text = textarea.value;
                const beforeText = text.substring(0, start);
                const selectedText = text.substring(start, end);
                const afterText = text.substring(end);
                // Add markdown blockquote style
                const quoteText = selectedText
                  ? selectedText
                      .split("\n")
                      .map((line) => `> ${line}`)
                      .join("\n")
                  : ">";
                // onChange?.(`${beforeText}${quoteText}${afterText}`);
              }
            }}
          />
          <ToolbarButton
            icon="format_list_bulleted"
            onClick={() => {
              const textarea = document.querySelector(
                "textarea",
              ) as HTMLTextAreaElement;
              if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const text = textarea.value;
                const beforeText = text.substring(0, start);
                const selectedText = text.substring(start, end);
                const afterText = text.substring(end);
                // Add markdown unordered list style
                const listText = selectedText
                  ? selectedText
                      .split("\n")
                      .map((line) => `- ${line || "list item"}`)
                      .join("\n")
                  : "- list item";
                // onChange?.(`${beforeText}${listText}${afterText}`);
              }
            }}
            className="p-2 hover:bg-muted rounded text-foreground"
          />
          <ToolbarButton
            icon="format_list_numbered"
            onClick={() => executeCommand("insertOrderedList")}
          />
        </div>
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon="link"
            onClick={() => {
              const url = prompt("Enter the URL");
              if (url) executeCommand("createLink", url);
            }}
          />
          <ToolbarButton
            icon="image"
            onClick={() => {
              const url = prompt("Enter the image URL");
              if (url) executeCommand("insertImage", url);
            }}
          />
        </div>
      </div>

      <div className="flex-1 p-8 pt-6">
        <div
          ref={contentRef}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className="min-h-full outline-none text-[15px] leading-relaxed text-foreground/80 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40"
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
