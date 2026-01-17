export interface Question {
  id: number
  text: string
  options: { label: string; value: number }[]
  type?: string
}

export const SCREENING_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How often have you been able to laugh and see the funny side of things?",
    options: [
      { label: "As much as I always could", value: 0 },
      { label: "Not quite so much now", value: 1 },
      { label: "Definitely not so much now", value: 2 },
      { label: "Not at all", value: 3 },
    ],
  },
  {
    id: 2,
    text: "How often have you looked forward with enjoyment to things?",
    options: [
      { label: "As much as I ever did", value: 0 },
      { label: "Rather less than I used to", value: 1 },
      { label: "Definitely less than I used to", value: 2 },
      { label: "Hardly at all", value: 3 },
    ],
  },

  {
    id: 3,
    text: "How often have you  blamed yourself unnecessarily when things went wrong?",
    options: [
      { label: " Yes, most of the time", value: 3 },
      { label: "Yes, some of the time", value: 2 },
      { label: "Not very often ", value: 1 },
      { label: "No, never ", value: 0 },
    ],
  },
  {
    id: 4,
    text: " How often have you felt anxious or worried for no good reason?",
    options: [
      { label: "No, not at all", value: 0 },
      { label: "Hardly ever, Yes", value: 1 },
      { label: "Sometimes, Yes", value: 2 },
      { label: "Very often", value: 3 },
    ],
  },
  {
    id: 5,
    text: "How often have you felt scared or panicky for no very good reason?",
    options: [
      { label: "Yes, quite a lot", value: 3 },
      { label: "Yes, sometimes", value: 2 },
      { label: "No, not much", value: 1 },
      { label: "No, not at all", value: 0 },
    ],
  },
  {
    id: 6,
    text: "How often have things been getting on top of you?",
    options: [
      { label: "Yes, most of the time I haven't been able to cope at all", value: 3 },
      { label: "Yes, sometimes I haven't been coping as well as usual", value: 2 },
      { label: "No, most of the time I have coped quite well", value: 1 },
      { label: "No, I have been coping as well as ever", value: 0 },
    ],
  },
  {
    id: 7,
    text: "How often have you been so unhappy that you have had difficulty sleeping?",
    options: [
      { label: "Yes, most of the time", value: 3 },
      { label: "Yes, sometimes", value: 2 },
      { label: "Not very often", value: 1 },
      { label: "No, not at all", value: 0 },
    ],
  },
  {
    id: 8,
    text: "How often have you felt sad or miserable?",
    options: [
      { label: "Yes, most of the time", value: 3 },
      { label: "Yes, quite often", value: 2 },
      { label: "Not very often", value: 1 },
      { label: "No, not at all", value: 0 },
    ],
  },
  {
    id: 9,
    text: "How often have you been so unhappy that you have been crying?",
    options: [
      { label: "Yes, most of the time", value: 3 },
      { label: "Yes, quite often", value: 2 },
      { label: "Only occasionally", value: 1 },
      { label: "No, never", value: 0 },
    ],
  },
  {
    id: 10,
    text: "How often has the thought of harming yourself occurred to you?",
    options: [
      { label: "Yes, quite often", value: 3 },
      { label: "Sometimes", value: 2 },
      { label: "Hardly ever", value: 1 },
      { label: "Never", value: 0 },
    ],
  },
  
]
