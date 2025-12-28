"use client"

import type { Question } from "@/lib/screening-data"
import { cn } from "@/lib/utils"

interface QuestionCardProps {
  question: Question
  onAnswer: (questionId: number, value: number) => void
  currentAnswer?: number
}

export function QuestionCard({ question, onAnswer, currentAnswer }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-xs font-bold text-primary">
          <span className="material-symbols-outlined text-[16px]">help</span>
          Question {question.id}
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">{question.text}</h2>
        <p className="text-muted-foreground">
          Please select the option that comes closest to how you have felt in the past 7 days.
        </p>
      </div>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(question.id, option.value)}
            className={cn(
              "w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 group",
              currentAnswer === option.value
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/30 hover:bg-secondary/50",
            )}
          >
            <div
              className={cn(
                "size-6 rounded-full border-2 flex items-center justify-center transition-colors",
                currentAnswer === option.value
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30 group-hover:border-primary/50",
              )}
            >
              {currentAnswer === option.value && <div className="size-2 bg-white rounded-full" />}
            </div>
            <span className="font-semibold">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
