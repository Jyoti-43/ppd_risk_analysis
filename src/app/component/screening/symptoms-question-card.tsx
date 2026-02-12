"use client";

import type { SymptomsQuestion } from "@/src/app/type";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Heart, HelpCircle } from "lucide-react";

interface SymptomsQuestionCardProps {
  question: SymptomsQuestion;
  onAnswer: (questionId: number | string, value: number | string) => void;
  currentAnswer?: number | string;
}

export const SymptomsQuestionCard = ({
  question,
  onAnswer,
  currentAnswer,
}: SymptomsQuestionCardProps) => {
  // Only show default/min for Age, otherwise empty until user selects
  const answerValue = (() => {
    if (currentAnswer !== undefined && currentAnswer !== null)
      return currentAnswer;

    // Only return fallback for new/untouched Age questions
    if (
      (question.type === "number" ||
        String(question.label).toLowerCase().includes("age") ||
        question.id === "Enter Age" ||
        question.id === 17) &&
      currentAnswer === undefined
    ) {
      if (question.default !== undefined) return question.default;
      if (question.min !== undefined) return question.min;
    }
    return "";
  })();

  return (
    <Card className="bg-white rounded-[2.5rem] p-4 lg:p-6 shadow-xl border-b-4 border-primary/10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-700 min-h-[320px] flex flex-col">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 size-45 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="relative space-y-4 ">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-xs font-bold text-primary">
            <Heart className="size-4 fill-primary" />
            Personal Journey
          </div>
          {/* <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-xs">
            <HelpCircle className="size-4" />
            Step {typeof question.id === "number" ? question.id : "Detail"}
          </div> */}
        </div>

        <div className="space-y-2">
          <h2 className="text-lg lg:text-2xl font-bold text-foreground tracking-tight leading-tight">
            {question.label}
          </h2>
          <p className="text-muted-foreground text-base">
            Your response helps us understand you better.
          </p>
        </div>
      </CardHeader>

      <CardContent className="relative mt-auto  space-y-2">
        {question.type === "dropdown" ? (
          <div className="space-y-2 ">
            <label className="text-sm font-semibold text-muted-foreground ml-1 mb-2">
              Choose an option
            </label>
            <Select
              value={
                answerValue === "" || answerValue === undefined
                  ? ""
                  : String(answerValue)
              }
              onValueChange={(value) => onAnswer(question.id, value)}
            >
              <SelectTrigger className="w-full h-18 py-5 px-6 mt-2 rounded-2xl border-2 border-border hover:border-primary/50 transition-all text-lg font-medium bg-secondary/30">
                <SelectValue placeholder="Select from the list " />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-2 shadow-lg">
                {question.options?.map((option, idx) => (
                  <SelectItem
                    key={idx}
                    value={option}
                    className="py-3 px-4 text-lg focus:bg-primary/5 focus:text-primary rounded-xl cursor-pointer"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : question.type === "number" ||
          String(question.label).toLowerCase().includes("age") ||
          question.id === "Enter Age" ||
          question.id === 17 ? (
          <div className="space-y-4">
            <label className="text-sm font-semibold text-muted-foreground ml-1">
              Please enter your{" "}
              {String(question.label).toLowerCase().includes("age")
                ? "age"
                : "number"}
            </label>
            <input
              type="number"
              value={answerValue}
              onChange={(e) => {
                onAnswer(question.id, e.target.value);
              }}
              className="w-full h-14 px-6 rounded-2xl border-2 border-border hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg font-bold bg-secondary/30"
              placeholder={`e.g. ${question.min || 25}`}
            />
            {question.min !== undefined && question.max !== undefined && (
              <p className="text-xs text-muted-foreground ml-1 italic">
                Range: {question.min} - {question.max}
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {question.options?.map((option, idx) => {
              const isSelected = answerValue === option;
              return (
                <button
                  key={idx}
                  onClick={() => onAnswer(question.id, option)}
                  className={cn(
                    "relative w-full flex items-center justify-between gap-4 p-5 rounded-3xl border-2 text-left transition-all duration-300 group overflow-hidden",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5 -translate-y-0.5"
                      : "border-border hover:border-primary/40 hover:bg-secondary/40 hover:shadow-lg hover:-translate-y-1",
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={cn(
                        "flex-shrink-0 size-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
                        isSelected
                          ? "border-primary bg-primary text-white scale-110"
                          : "border-muted-foreground/20 group-hover:border-primary/50",
                      )}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="size-4 stroke-[3]" />
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground group-hover:text-primary">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "font-semibold text-lg transition-colors duration-300",
                        isSelected
                          ? "text-primary"
                          : "text-foreground group-hover:text-primary/90",
                      )}
                    >
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
