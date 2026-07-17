export type PlacementQuestion = {
  id: string
  prompt: string
  choices: string[]
  answer: string
  tag: string
}

export type PlacementAnswers = Record<string, string> | string[]

export type PlacementResult =
  | { score: number; levelId: 'n5n4' | 'n3' | 'n2n1'; band: string }
  | {
      score: number
      certificateId: 'orange' | 'green' | 'blue' | 'gold'
      band: string
    }

function answerFor(
  answers: PlacementAnswers,
  question: PlacementQuestion,
  index: number,
): string | undefined {
  return Array.isArray(answers) ? answers[index] : answers[question.id]
}

function percent(score: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((score / total) * 100)
}

function isEnglishPlacement(questions: PlacementQuestion[]): boolean {
  return questions.some(
    (question) =>
      question.id.startsWith('en-') ||
      question.tag === 'part5' ||
      question.tag === 'listening',
  )
}

export function scorePlacement(
  answers: PlacementAnswers,
  questions: PlacementQuestion[],
): PlacementResult {
  const score = questions.reduce((total, question, index) => {
    return total + (answerFor(answers, question, index) === question.answer ? 1 : 0)
  }, 0)
  const pct = percent(score, questions.length)

  if (isEnglishPlacement(questions)) {
    if (pct >= 85) return { score, certificateId: 'gold', band: 'Gold' }
    if (pct >= 65) return { score, certificateId: 'blue', band: 'Blue' }
    if (pct >= 40) return { score, certificateId: 'green', band: 'Green' }
    return { score, certificateId: 'orange', band: 'Orange / Brown' }
  }

  if (pct >= 75) return { score, levelId: 'n2n1', band: 'N2 / N1' }
  if (pct >= 50) return { score, levelId: 'n3', band: 'N3' }
  return { score, levelId: 'n5n4', band: 'N5 / N4' }
}
