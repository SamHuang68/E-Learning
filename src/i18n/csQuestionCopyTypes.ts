export type CsQuestionEnglishCopy = {
  question: string
  options: readonly string[]
  solution: readonly string[]
  explanation: string
  tags: readonly string[]
}

export type CsQuestionEnglishRegistry = Readonly<Record<string, CsQuestionEnglishCopy>>
