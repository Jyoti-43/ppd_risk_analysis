"use client"

import { Button } from "@/components/ui/button"

export default function Sidebar() {
  return (
    <div className="space-y-6">
      {/* Writing Prompts */}
      <div className="bg-accent border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💡</span>
          <h3 className="font-bold text-foreground">WRITING PROMPTS</h3>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-foreground">
            <span className="font-semibold">"What is one emotion that surprised you today?"</span>
            <br />
            <span className="text-muted-foreground">Try writing for 5 minutes</span>
          </p>
          <p className="text-sm text-foreground">
            <span className="font-semibold">"Describe a small victory, no matter how tiny."</span>
          </p>
          <p className="text-sm text-foreground">
            <span className="font-semibold">"Write a letter to yourself for the hard days."</span>
          </p>
        </div>
      </div>

      {/* Community Safety */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">👥</span>
          <h3 className="font-bold text-foreground">COMMUNITY SAFETY</h3>
        </div>
        <p className="text-sm text-foreground mb-3">
          We are a supportive community. Please be kind, respectful, and mindful that everyone is on their own journey.
        </p>
        <button className="text-primary hover:text-primary/80 font-semibold text-sm">Read Guidelines</button>
      </div>

      {/* Need Immediate Help */}
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🚨</span>
          <h3 className="font-bold text-destructive">NEED IMMEDIATE HELP?</h3>
        </div>
        <p className="text-sm text-foreground mb-4">
          If you are feeling overwhelmed or unsafe, please reach out to a professional immediately.
        </p>
        <Button className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
          Crisis Resources
        </Button>
      </div>
    </div>
  )
}
