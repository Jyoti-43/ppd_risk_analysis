"use client"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 bg-secondary p-3 rounded-t-md border border-b-0 border-border">
        <button
          onClick={() => {
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement
            if (textarea) {
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const beforeText = text.substring(0, start)
              const selectedText = text.substring(start, end)
              const afterText = text.substring(end)
              onChange(`${beforeText}**${selectedText || "bold text"}**${afterText}`)
            }
          }}
          className="p-2 hover:bg-muted rounded text-foreground"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => {
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement
            if (textarea) {
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const beforeText = text.substring(0, start)
              const selectedText = text.substring(start, end)
              const afterText = text.substring(end)
              onChange(`${beforeText}*${selectedText || "italic text"}*${afterText}`)
            }
          }}
          className="p-2 hover:bg-muted rounded text-foreground"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => {
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement
            if (textarea) {
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const beforeText = text.substring(0, start)
              const selectedText = text.substring(start, end)
              const afterText = text.substring(end)
              onChange(`${beforeText}<u>${selectedText || "underlined text"}</u>${afterText}`)
            }
          }}
          className="p-2 hover:bg-muted rounded text-foreground"
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="border-l border-border mx-2" />
        <button className="p-2 hover:bg-muted rounded text-foreground" title="List">
          ≡
        </button>
        <button className="p-2 hover:bg-muted rounded text-foreground" title="Quote">
          ❝
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing here. How are you feeling today? Remember, this is a safe space to express whatever is on your mind."
        className="w-full h-64 px-4 py-3 bg-input border border-border rounded-b-md text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 resize-none"
      />
      <div className="text-right text-sm text-muted-foreground">Draft saved</div>
    </div>
  )
}
