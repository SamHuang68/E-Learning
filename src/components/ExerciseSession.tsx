import { useEffect, useState, type ReactNode } from 'react'
import {
  gradeAnswer,
  type Exercise,
  type ExerciseKind,
} from '../engine/exercises'
import { SpeakButton } from './SpeakButton'
import { playCorrectSound } from '../engine/audioSynthesizer'

type ItemResult = { id: string; cardId: string; correct: boolean }

type Props = {
  title: string
  lang: 'ja' | 'en'
  exercises: Exercise[]
  onComplete: (result: {
    correct: number
    total: number
    itemResults: ItemResult[]
  }) => void
  onExit: () => void
}

const KIND_LABELS: Record<ExerciseKind, string> = {
  recognize: 'Recognize',
  meaningToHead: 'Meaning → Word',
  listenSelect: 'Listening',
  fillBlank: 'Fill blank',
  orderWords: 'Order words',
  registerPick: 'Register',
  passageQuiz: 'Passage quiz',
}

export function ExerciseSession({
  title,
  lang,
  exercises,
  onComplete,
  onExit,
}: Props) {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const [selectedChoice, setSelectedChoice] = useState('')
  const [textAnswer, setTextAnswer] = useState('')
  const [order, setOrder] = useState<number[]>([])
  const [results, setResults] = useState<ItemResult[]>([])

  const total = exercises.length
  const exercise = exercises[index]
  const completedResults = results.filter(
    (result): result is ItemResult => Boolean(result),
  )
  const correct = completedResults.filter((result) => result.correct).length
  const copy = uiCopy(lang)

  useEffect(() => {
    setIndex(0)
    setDone(false)
    setResults([])
  }, [exercises])

  useEffect(() => {
    setFeedback(null)
    setSelectedChoice('')
    setTextAnswer('')
    setOrder([])
  }, [exercise?.id])

  function submitAnswer(answer: string) {
    if (!exercise || feedback !== null) return

    const isCorrect = gradeAnswer(exercise, answer)
    setFeedback(isCorrect)
    if (isCorrect) {
      playCorrectSound()
    }
    setSelectedChoice(answer)
    setResults((previous) => {
      const next = [...previous]
      next[index] = {
        id: exercise.id,
        cardId: exercise.card.id,
        correct: isCorrect,
      }
      return next
    })
  }

  function handleNext() {
    if (index >= total - 1) {
      setDone(true)
      return
    }
    setIndex((current) => Math.min(total - 1, current + 1))
  }

  function handleFinish() {
    onComplete({
      correct,
      total,
      itemResults: completedResults,
    })
  }

  if (total === 0 || !exercise) {
    return (
      <section className="practice-view exercise-session">
        <button type="button" className="ghost back" onClick={onExit}>
          {copy.exit}
        </button>
        <p className="eyebrow">EXERCISES</p>
        <h1>{title}</h1>
        <div className="practice-card">
          <div className="flash-face">
            <strong>{copy.emptyTitle}</strong>
            <p>{copy.emptyBody}</p>
          </div>
          <div className="flash-actions">
            <button type="button" className="primary-btn inline" onClick={handleFinish}>
              {copy.finish}
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (done) {
    return (
      <section className="practice-view exercise-session">
        <p className="eyebrow">EXERCISES</p>
        <h1>{title}</h1>
        <div className="practice-card">
          <div className="flash-face">
            <strong>
              {correct} / {total}
            </strong>
            <span className="flash-meaning">{copy.completeTitle}</span>
            <p>{copy.completeBody}</p>
          </div>
          <div className="flash-actions">
            <button type="button" className="ghost" onClick={onExit}>
              {copy.exit}
            </button>
            <button type="button" className="primary-btn inline" onClick={handleFinish}>
              {copy.finish}
            </button>
          </div>
        </div>
      </section>
    )
  }

  const progress = Math.round(((index + 1) / total) * 100)

  return (
    <section className="practice-view exercise-session">
      <button type="button" className="ghost back" onClick={onExit}>
        {copy.exit}
      </button>

      <p className="eyebrow">{KIND_LABELS[exercise.kind]}</p>
      <h1>
        {title}
        <span>
          {index + 1} / {total}
        </span>
      </h1>

      <div className="progress-bar-track" aria-hidden="true">
        <span className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="practice-card">
        <div className="flash-face">
          {renderPrompt(exercise, copy)}
          {exercise.promptZh && (
            <span className="flash-sentence-zh">{exercise.promptZh}</span>
          )}
          {renderSpeakButton(exercise, lang, copy)}
        </div>

        {renderAnswerArea({
          exercise,
          feedback,
          selectedChoice,
          textAnswer,
          order,
          copy,
          setTextAnswer,
          setOrder,
          submitAnswer,
        })}

        {feedback !== null && (
          <p className="status-line">
            {feedback ? copy.correct : `${copy.wrong} ${exercise.answer}`}
          </p>
        )}

        <div className="flash-actions">
          <button
            type="button"
            className="primary-btn inline"
            disabled={feedback === null}
            onClick={handleNext}
          >
            {index >= total - 1 ? copy.showScore : copy.next}
          </button>
        </div>
      </div>
    </section>
  )
}

function renderPrompt(
  exercise: Exercise,
  copy: ReturnType<typeof uiCopy>,
): ReactNode {
  if (exercise.kind === 'listenSelect') {
    return (
      <>
        <strong>{copy.listenPrompt}</strong>
        <p>{exercise.prompt}</p>
      </>
    )
  }

  if (exercise.kind === 'fillBlank') {
    return (
      <>
        <strong>{copy.fillPrompt}</strong>
        <p>{exercise.prompt}</p>
      </>
    )
  }

  if (exercise.kind === 'orderWords') {
    return (
      <>
        <strong>{copy.orderPrompt}</strong>
        <p>{exercise.prompt}</p>
      </>
    )
  }

  if (exercise.kind === 'registerPick') {
    return (
      <>
        <strong>{copy.registerPrompt}</strong>
        <p>{exercise.prompt}</p>
      </>
    )
  }

  if (exercise.kind === 'passageQuiz') {
    return (
      <>
        <strong>{exercise.prompt}</strong>
        <p>{copy.passagePrompt}</p>
      </>
    )
  }

  return (
    <>
      <strong>{exercise.prompt}</strong>
      {exercise.card.reading && (
        <span className="flash-meaning">{exercise.card.reading}</span>
      )}
    </>
  )
}

function renderSpeakButton(
  exercise: Exercise,
  lang: 'ja' | 'en',
  copy: ReturnType<typeof uiCopy>,
) {
  if (exercise.kind !== 'listenSelect' && exercise.kind !== 'recognize') {
    return null
  }

  return (
    <div className="flash-actions">
      <SpeakButton
        lang={lang}
        text={exercise.speakText ?? exercise.prompt}
        label={exercise.kind === 'listenSelect' ? copy.playAudio : copy.speakPrompt}
      />
    </div>
  )
}

function renderAnswerArea({
  exercise,
  feedback,
  selectedChoice,
  textAnswer,
  order,
  copy,
  setTextAnswer,
  setOrder,
  submitAnswer,
}: {
  exercise: Exercise
  feedback: boolean | null
  selectedChoice: string
  textAnswer: string
  order: number[]
  copy: ReturnType<typeof uiCopy>
  setTextAnswer: (value: string) => void
  setOrder: (value: number[] | ((previous: number[]) => number[])) => void
  submitAnswer: (answer: string) => void
}) {
  if (exercise.kind === 'fillBlank') {
    return (
      <div className="flash-actions">
        <input
          type="text"
          value={textAnswer}
          onChange={(event) => setTextAnswer(event.target.value)}
          disabled={feedback !== null}
          placeholder={copy.typeAnswer}
        />
        <button
          type="button"
          className="primary-btn inline"
          disabled={feedback !== null || !textAnswer.trim()}
          onClick={() => submitAnswer(textAnswer)}
        >
          {copy.check}
        </button>
      </div>
    )
  }

  if (exercise.kind === 'orderWords') {
    const tokens = exercise.choices ?? []
    const selectedAnswer = order.map((tokenIndex) => tokens[tokenIndex]).join(' ')
    const remaining = tokens
      .map((token, tokenIndex) => ({ token, tokenIndex }))
      .filter(({ tokenIndex }) => !order.includes(tokenIndex))

    return (
      <>
        <div className="order-bank" aria-label={copy.currentOrder}>
          {order.length > 0 ? (
            order.map((tokenIndex, selectedIndex) => (
              <button
                type="button"
                className="choice-btn"
                disabled={feedback !== null}
                key={`${tokenIndex}:${selectedIndex}`}
                onClick={() =>
                  setOrder((previous) =>
                    previous.filter((_, index) => index !== selectedIndex),
                  )
                }
              >
                {tokens[tokenIndex]}
              </button>
            ))
          ) : (
            <span>{copy.tapWords}</span>
          )}
        </div>
        <div className="order-bank">
          {remaining.map(({ token, tokenIndex }) => (
            <button
              type="button"
              className="choice-btn"
              disabled={feedback !== null}
              key={`${token}:${tokenIndex}`}
              onClick={() => setOrder((previous) => [...previous, tokenIndex])}
            >
              {token}
            </button>
          ))}
        </div>
        <div className="flash-actions">
          <button
            type="button"
            className="ghost"
            disabled={feedback !== null || order.length === 0}
            onClick={() => setOrder([])}
          >
            {copy.reset}
          </button>
          <button
            type="button"
            className="primary-btn inline"
            disabled={feedback !== null || order.length !== tokens.length}
            onClick={() => submitAnswer(selectedAnswer)}
          >
            {copy.check}
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="choice-grid">
      {(exercise.choices ?? []).map((choice) => (
        <button
          type="button"
          className={choiceButtonClass(choice, exercise.answer, selectedChoice, feedback)}
          disabled={feedback !== null}
          key={choice}
          onClick={() => submitAnswer(choice)}
        >
          {choice}
        </button>
      ))}
    </div>
  )
}

function choiceButtonClass(
  choice: string,
  answer: string,
  selectedChoice: string,
  feedback: boolean | null,
) {
  if (feedback === null) return 'choice-btn'
  if (choice === answer) return 'choice-btn correct'
  if (choice === selectedChoice) return 'choice-btn wrong'
  return 'choice-btn'
}

function uiCopy(lang: 'ja' | 'en') {
  if (lang === 'ja') {
    return {
      check: '確認',
      completeBody: '點擊完成即可保存本次練習結果。',
      completeTitle: '練習完成',
      correct: '答對了！',
      currentOrder: '目前排序',
      emptyBody: '本單元尚未產生可練習的題目。',
      emptyTitle: '沒有題目',
      exit: '← 返回',
      fillPrompt: '填入空格',
      finish: '完成',
      listenPrompt: '聽音選答案',
      next: '下一題 →',
      orderPrompt: '排出正確句子',
      passagePrompt: '請選出這段內容的意思。',
      playAudio: '播放',
      registerPrompt: '選擇語體',
      reset: '重排',
      showScore: '查看成績',
      speakPrompt: '播放題目',
      tapWords: '點選下方詞塊組句',
      typeAnswer: '輸入答案',
      wrong: '再確認一次。正解：',
    }
  }

  return {
    check: 'Check',
    completeBody: 'Finish to save this exercise result.',
    completeTitle: 'Session complete',
    correct: 'Correct!',
    currentOrder: 'Current order',
    emptyBody: 'No exercises have been generated for this unit yet.',
    emptyTitle: 'No exercises',
    exit: '← Exit',
    fillPrompt: 'Fill in the blank',
    finish: 'Finish',
    listenPrompt: 'Listen and answer',
    next: 'Next →',
    orderPrompt: 'Build the sentence',
    passagePrompt: 'Choose the meaning of this passage.',
    playAudio: 'Play audio',
    registerPrompt: 'Choose the register',
    reset: 'Reset',
    showScore: 'Show score',
    speakPrompt: 'Speak prompt',
    tapWords: 'Tap words below to build your answer',
    typeAnswer: 'Type your answer',
    wrong: 'Not quite. Answer:',
  }
}
