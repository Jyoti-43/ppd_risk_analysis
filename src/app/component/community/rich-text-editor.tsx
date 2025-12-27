"use client"

import { useRef, useEffect } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  // Sync value from props to editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value = "") => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-white overflow-hidden transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border bg-slate-50/50">
        <button
          onClick={() => execCommand("bold")}
          className="p-1.5 rounded-md hover:bg-slate-200 transition-colors"
          title="Bold"
        >
          <span className="material-symbols-outlined text-[20px]">format_bold</span>
        </button>
        <button
          onClick={() => execCommand("italic")}
          className="p-1.5 rounded-md hover:bg-slate-200 transition-colors"
          title="Italic"
        >
          <span className="material-symbols-outlined text-[20px]">format_italic</span>
        </button>
        <button
          onClick={() => execCommand("underline")}
          className="p-1.5 rounded-md hover:bg-slate-200 transition-colors"
          title="Underline"
        >
          <span className="material-symbols-outlined text-[20px]">format_underlined</span>
        </button>
        <div className="w-[1px] h-6 bg-border mx-1" />
        <button
          onClick={() => execCommand("insertUnorderedList")}
          className="p-1.5 rounded-md hover:bg-slate-200 transition-colors"
          title="Bullet List"
        >
          <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
        </button>
        <button
          onClick={() => execCommand("formatBlock", "blockquote")}
          className="p-1.5 rounded-md hover:bg-slate-200 transition-colors"
          title="Quote"
        >
          <span className="material-symbols-outlined text-[20px]">format_quote</span>
        </button>
        <div className="ml-auto px-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Draft saved
          </span>
        </div>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-6 text-foreground outline-none text-base leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50 empty:before:pointer-events-none"
        data-placeholder={placeholder}
        
      />
    </div>
  )
}
