"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"


import { Button } from "@/components/ui/button"
import { SCREENING_QUESTIONS } from "@/lib/screening-data"
import Link from "next/link"
import { ProgressBar } from "../../component/screening/progress-bar"
import { QuestionCard } from "../../component/screening/question-card"

export default function AssessmentPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const currentQuestion = SCREENING_QUESTIONS[currentQuestionIndex]
  const totalQuestions = SCREENING_QUESTIONS.length
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const isAnswered = answers[currentQuestion.id] !== undefined

  const handleAnswer = (questionId: number, answer: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      localStorage.setItem("screeningAnswers", JSON.stringify(answers))
      // router.push("/screening/results")
    alert("Screening completed! Your responses have been recorded. Soon redirected to results page. Thank You!")
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fef5f9]">
   

      <main className="flex-1 px-6 lg:px-10 py-6 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Progress Bar */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
            <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} category="Emotional Health" />
          </div>

          {/* Question Card */}
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentQuestion.id]}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 pt-3">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isFirstQuestion}
              className="rounded-full h-12 px-6 font-semibold disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[20px] mr-2">arrow_back</span>
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="rounded-full h-12 px-8 bg-primary hover:bg-[#b50d62] text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastQuestion ? "Submit" : "Next Question"}
              <span className="material-symbols-outlined text-[20px] ml-2">arrow_forward</span>
            </Button>
          </div>

          {/* Emergency Help Footer */}
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            <span className="material-symbols-outlined text-red-500 text-[20px]">emergency</span>
            <span>Need immediate help?</span>
            <Link href="/crisis-resources" className="font-semibold text-red-600 underline hover:text-red-700">
              View Crisis Resources
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
