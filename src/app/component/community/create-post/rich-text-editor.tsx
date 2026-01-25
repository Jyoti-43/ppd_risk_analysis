"use client"

import React, { useRef, useEffect } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const isFocused = document.activeElement === el
    if (!isFocused && el.innerHTML !== value) {
      el.innerHTML = value || ""
    }
  }, [value])

  const executeCommand = (command: string, valueArg: string = "") => {
    document.execCommand(command, false, valueArg)
    if (contentRef.current) onChange(contentRef.current.innerHTML)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 bg-secondary p-3 rounded-t-md border border-b-0 border-border">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            executeCommand("formatBlock", "h1")
          }}
          className="p-2 hover:bg-muted rounded text-foreground"
          title="H1"
        >
          H1
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            executeCommand("formatBlock", "h2")
          }}
          className="p-2 hover:bg-muted rounded text-foreground"
          title="H2"
        >
          H2
        </button>

        <div className="w-px h-5 bg-border mx-2" />

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            executeCommand("bold")
          }}
          className="p-2 hover:bg-muted rounded text-foreground"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            executeCommand("italic")
          }}
          className="p-2 hover:bg-muted rounded text-foreground"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            executeCommand("underline")
          }}
          className="p-2 hover:bg-muted rounded text-foreground"
          title="Underline"
        >
          <u>U</u>
        </button>

        <div className="w-px h-5 bg-border mx-2" />

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            executeCommand("formatBlock", "blockquote")
          }}
          className="p-2 hover:bg-muted rounded text-foreground"
          title="Quote"
        >
          ❝
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            executeCommand("insertUnorderedList")
          }}
          className="p-2 hover:bg-muted rounded text-foreground"
          title="List"
        >
          ≡
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            executeCommand("insertOrderedList")
          }}
          className="p-2 hover:bg-muted rounded text-foreground"
          title="Numbered List"
        >
          1.
        </button>
      </div>

      <div
        ref={contentRef}
        onInput={(e) => onChange((e.currentTarget as HTMLDivElement).innerHTML)}
        className="w-full h-64 px-4 py-3 bg-input border border-border rounded-b-md text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 resize-none min-h-[200px]
        [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6
        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
        [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-muted-foreground"
        contentEditable
        data-placeholder="Start writing here. How are you feeling today? Remember, this is a safe space to express whatever is on your mind."
      />

      <div className="text-right text-sm text-muted-foreground">Draft saved</div>
    </div>
  )
}
