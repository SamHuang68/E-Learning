import { describe, it, expect } from 'vitest'
import {
  diagnoseError,
  summarizeErrorDiagnoses,
  type ErrorDiagnosisInput,
  type ErrorDiagnosisResult,
} from './errorTaxonomy'

describe('Error Taxonomy & Cognitive Diagnostics Engine', () => {
  it('diagnoses fast response (< 1.5s) as blind guess', () => {
    const input: ErrorDiagnosisInput = {
      itemId: 'math-1',
      conceptTag: 'linear_equation',
      selectedAnswer: 'B',
      correctAnswer: 'A',
      responseTimeSec: 0.8,
      userTheta: 0.0,
      itemDifficulty: 0.0,
    }
    const result = diagnoseError(input)
    expect(result.errorType).toBe('blind_guess')
    expect(result.suggestedAction).toBe('scaffolded_hint')
  })

  it('diagnoses high-ability learner careless mistake as slip', () => {
    const input: ErrorDiagnosisInput = {
      itemId: 'math-2',
      conceptTag: 'arithmetic',
      selectedAnswer: 'C',
      correctAnswer: 'A',
      responseTimeSec: 3.2,
      userTheta: 1.5, // 能力高於題目 1.5 個標準差
      itemDifficulty: 0.0,
      previousLapses: 0,
    }
    const result = diagnoseError(input)
    expect(result.errorType).toBe('slip')
    expect(result.suggestedAction).toBe('check_careless')
  })

  it('diagnoses known distractor category as misconception', () => {
    const input: ErrorDiagnosisInput = {
      itemId: 'toeic-1',
      conceptTag: 'part5_grammar',
      selectedAnswer: 'inform',
      correctAnswer: 'information',
      distractorCategory: 'part_of_speech_trap',
      responseTimeSec: 6.5,
      userTheta: 0.2,
      itemDifficulty: 0.5,
    }
    const result = diagnoseError(input)
    expect(result.errorType).toBe('misconception')
    expect(result.suggestedAction).toBe('visual_lab')
  })

  it('diagnoses sufficient thinking time on new topic as unlearned', () => {
    const input: ErrorDiagnosisInput = {
      itemId: 'math-calculus-1',
      conceptTag: 'riemann_integral',
      selectedAnswer: 'D',
      correctAnswer: 'B',
      responseTimeSec: 12.0,
      userTheta: -0.5,
      itemDifficulty: 1.2,
      previousLapses: 0,
    }
    const result = diagnoseError(input)
    expect(result.errorType).toBe('unlearned')
    expect(result.suggestedAction).toBe('review_prompt')
  })

  it('summarizes multiple diagnoses and identifies dominant error pattern', () => {
    const diagnoses: ErrorDiagnosisResult[] = [
      diagnoseError({
        itemId: 'q1',
        conceptTag: 'tag1',
        selectedAnswer: 'A',
        correctAnswer: 'B',
        responseTimeSec: 0.9,
      }),
      diagnoseError({
        itemId: 'q2',
        conceptTag: 'tag2',
        selectedAnswer: 'C',
        correctAnswer: 'B',
        responseTimeSec: 1.1,
      }),
      diagnoseError({
        itemId: 'q3',
        conceptTag: 'tag3',
        selectedAnswer: 'D',
        correctAnswer: 'B',
        responseTimeSec: 8.0,
      }),
    ]

    const summary = summarizeErrorDiagnoses(diagnoses)
    expect(summary.totalErrors).toBe(3)
    expect(summary.byType.blind_guess).toBe(2)
    expect(summary.dominantPattern).toBe('blind_guess')
    expect(summary.overallRemediation).toContain('放慢節奏')
  })
})
