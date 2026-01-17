"use client";

import type { SymptomsQuestionType, SymptomsQuestion } from "@/src/app/type";
import { cn } from "@/lib/utils";
import type { Question } from "@/lib/screening-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
    if (currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== "") return currentAnswer;
    if (question.type === "number" && (question.id === "Enter Age" || question.id === 17)) {
      if (question.default !== undefined) return question.default;
      if (question.min !== undefined) return question.min;
    }
    return "";
  })();
  return (
    <Card className="bg-white rounded-3xl px-3 pt-4 mb-2 lg:pt-4 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col h-64">
      <CardHeader className="">
        <div className="inline-flex w-max items-center gap-1 px-3 py-1 bg-secondary rounded-full text-xs font-bold text-primary">
          <span className="material-symbols-outlined text-[12px]">help</span>
          Question: {question.id}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
          {question.label}
        </h2>
        <p className="text-muted-foreground">
          Please select the option that comes closest to you .
        </p>
      </CardHeader>


      <CardContent className="mt-auto w-full">
        {/* fixed bottom area for input/select so control appears in same place across cards */}
        {question.type === "dropdown" ? (
          <Select
            value={answerValue === "" || answerValue === undefined ? "" : String(answerValue)}
            onValueChange={(value) => onAnswer(question.id, value)}
          >
            <SelectTrigger className="w-full py-2 px-4 rounded-2xl border-2 text-md">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className=" text-md">
              {question.options?.map((option, idx) => (
                <SelectItem key={idx} value={option} className=" text-md">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : question.type === "number" ? (
          <input
            type="number"
            min={question.min}
            max={question.max}
            value={answerValue}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (
                (question.min === undefined || value >= question.min) &&
                (question.max === undefined || value <= question.max)
              ) {
                onAnswer(question.id, value);
              }
            }}
            className="w-full p-2 px-3 rounded-2xl border-2"
            placeholder={question.label}
          />
        ) : (
          question.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => onAnswer(question.id, option)}
              className={cn(
                "w-full flex items-center gap-4 p-3 rounded-2xl border-2 text-left transition-all duration-200 group",
                answerValue === option
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/30 hover:bg-secondary/50"
              )}
            >
              <div
                className={cn(
                  "size-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  answerValue === option
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30 group-hover:border-primary/50"
                )}
              >
                {answerValue === option && (
                  <div className="size-2 bg-white rounded-full" />
                )}
              </div>
              <span className="font-semibold">{option}</span>
            </button>
          ))
        )}
      </CardContent>
    </Card>
  );
};
