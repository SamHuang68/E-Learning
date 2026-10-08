import {
  computeAobaRadar,
  computeCalculusRadar,
  computeChemistryRadar,
  computeChineseRadar,
  computeCsRadar,
  computeMathRadar,
  computePhysicsRadar,
  computeToeicRadar,
} from './engine/radar'
import { calculateLevelProgress } from './engine/gamification'
import { dailyProgress, todayKey } from './engine/habits'
import {
  dueCountBySrsItems,
  dueCountFromFsrsMap,
  pickTodaySuggestion,
} from './engine/todaySuggestion'
import { isLeech } from './engine/fsrs'
import { rollupEightTrackXp, safeIdList, safeXp } from './engine/trackProgressRollup'
import {
  loadKanaProgress,
  loadLearningMeta,
  loadPreferredTrack,
  loadProgress,
  loadToeicProgress,
  type LangId,
  type LearningMeta,
} from './utils/storage'
import { loadMathProgress } from './math/utils/mathStorage'
import { loadPhysicsProgress } from './physics/utils/physicsStorage'
import { loadChemistryProgress } from './chemistry/utils/chemistryStorage'
import { loadCsProgress } from './cs/utils/csStorage'
import { loadChineseProgress } from './chinese/utils/chineseStorage'

type HubSnapshot = {
  mathProgress: ReturnType<typeof loadMathProgress>
  physicsProgress: ReturnType<typeof loadPhysicsProgress>
  chemistryProgress: ReturnType<typeof loadChemistryProgress>
  csProgress: ReturnType<typeof loadCsProgress>
  jaProgress: ReturnType<typeof loadProgress>
  kanaProgress: ReturnType<typeof loadKanaProgress>
  toeicProgress: ReturnType<typeof loadToeicProgress>
  chineseProgress: ReturnType<typeof loadChineseProgress>
  learningMeta: LearningMeta
  preferred: ReturnType<typeof loadPreferredTrack>
}

type RadarTab = LangId

export function weekStudyFlags(meta: LearningMeta): boolean[] {
  const today = new Date()
  const mondayOffset = (today.getDay() + 6) % 7
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset)
  const dates = new Set<string>()
  if (meta.lastActiveDate) dates.add(meta.lastActiveDate)
  if (meta.dailyDoneDate && meta.dailyDoneCards > 0) dates.add(meta.dailyDoneDate)
  for (const ev of meta.events ?? []) {
    if (typeof ev.t === 'string' && ev.t.length >= 10) dates.add(ev.t.slice(0, 10))
  }
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return dates.has(todayKey(d))
  })
}

export function loadHubSnapshot(): HubSnapshot {
  return {
    mathProgress: loadMathProgress(),
    physicsProgress: loadPhysicsProgress(),
    chemistryProgress: loadChemistryProgress(),
    csProgress: loadCsProgress(),
    jaProgress: loadProgress(),
    kanaProgress: loadKanaProgress(),
    toeicProgress: loadToeicProgress(),
    chineseProgress: loadChineseProgress(),
    learningMeta: loadLearningMeta(),
    preferred: loadPreferredTrack(),
  }
}

export function selectHubDerived(snapshot: HubSnapshot) {
  const {
    mathProgress,
    physicsProgress,
    chemistryProgress,
    csProgress,
    jaProgress,
    kanaProgress,
    toeicProgress,
    chineseProgress,
    learningMeta,
    preferred,
  } = snapshot

  const mathDone = safeIdList(mathProgress?.completedQuestions)
  const physicsDone = safeIdList(physicsProgress?.completedQuestions)
  const chemistryDone = safeIdList(chemistryProgress?.completedQuestions)
  const csDone = safeIdList(csProgress?.completedQuestions)
  const mathLabs = safeIdList(mathProgress?.labCompleted)
  const physicsLabs = safeIdList(physicsProgress?.labCompleted)
  const chemistryLabs = safeIdList(chemistryProgress?.labCompleted)
  const csLabs = safeIdList(csProgress?.labCompleted)
  const mathExams =
    mathProgress?.examScores && typeof mathProgress.examScores === 'object' ? mathProgress.examScores : {}
  const physicsExams =
    physicsProgress?.examScores && typeof physicsProgress.examScores === 'object' ? physicsProgress.examScores : {}
  const chemistryExams =
    chemistryProgress?.examScores && typeof chemistryProgress.examScores === 'object'
      ? chemistryProgress.examScores
      : {}
  const csExams =
    csProgress?.examScores && typeof csProgress.examScores === 'object' ? csProgress.examScores : {}

  const totalXp = rollupEightTrackXp({
    math: mathProgress?.xp,
    physics: physicsProgress?.xp,
    chemistry: chemistryProgress?.xp,
    cs: csProgress?.xp,
    ja: jaProgress?.xp,
    toeic: toeicProgress?.xp,
    chinese: chineseProgress?.xp,
  })
  const levelInfo = calculateLevelProgress(totalXp)
  const daily = dailyProgress(learningMeta)

  const mathRadar = computeMathRadar(mathDone, mathExams, mathLabs)
  const calculusDoneCount = mathDone.filter((id) => id.startsWith('calc-prob-')).length
  const calculusLabCount = mathLabs.includes('calculus') ? 1 : 0
  const calculusRadar = computeCalculusRadar(
    safeXp(mathProgress?.calculusTheta),
    calculusDoneCount,
    calculusLabCount,
  )
  const physicsRadar = computePhysicsRadar(physicsDone, physicsExams, physicsLabs)
  const chemistryRadar = computeChemistryRadar(chemistryDone, chemistryExams, chemistryLabs)
  const csRadar = computeCsRadar(csDone, csExams, csLabs)
  const kanaMastered =
    kanaProgress?.mastered && typeof kanaProgress.mastered === 'object' ? Object.keys(kanaProgress.mastered) : []
  const kanaCount = kanaMastered.length
  const jaRadar = computeAobaRadar(
    Math.max(daily.done, safeXp(jaProgress?.readingDone)),
    Array.isArray(learningMeta.kanjiMastered) ? learningMeta.kanjiMastered.length : 0,
    safeXp(learningMeta.speakingDone),
    safeXp(learningMeta.streak),
  )
  const toeicDoneCount = safeXp(toeicProgress?.vocabDone) + safeXp(toeicProgress?.listeningDone)
  const toeicRadar = computeToeicRadar(
    Math.max(daily.done, toeicDoneCount),
    toeicDoneCount,
    0,
  )
  const chineseRadar = computeChineseRadar(
    safeXp(chineseProgress?.xp),
    safeIdList(chineseProgress?.masteredFalseFriends).length,
    safeIdList(chineseProgress?.masteredGrammarSignals).length,
    safeIdList(chineseProgress?.completedDialogues).length,
    safeIdList(chineseProgress?.errorQuestions).length,
  )

  const radarMap: Record<RadarTab, typeof mathRadar> = {
    math: mathRadar,
    calculus: calculusRadar,
    physics: physicsRadar,
    chemistry: chemistryRadar,
    cs: csRadar,
    ja: jaRadar,
    en: toeicRadar,
    zh: chineseRadar,
  }

  const mathDoneCount = mathDone.length
  const physicsDoneCount = physicsDone.length
  const chemistryDoneCount = chemistryDone.length
  const csDoneCount = csDone.length

  const hasProgress =
    totalXp > 0 ||
    learningMeta.streak > 0 ||
    mathDoneCount > 0 ||
    physicsDoneCount > 0 ||
    chemistryDoneCount > 0 ||
    csDoneCount > 0 ||
    kanaCount > 0 ||
    toeicDoneCount > 0 ||
    (chineseProgress.xp || 0) > 0 ||
    Object.keys(learningMeta.items).length > 0

  const catalogFirst = !hasProgress
  const weekFlags = weekStudyFlags(learningMeta)
  const longIntervalCount = Object.values(learningMeta.items).filter(
    (it) => (it.intervalDays || 0) >= 21 || (it.correctStreak || 0) >= 3,
  ).length
  const scheduledCount = Object.keys(learningMeta.items).length
  const leechCount = Object.values(learningMeta.items).filter((it) =>
    isLeech(it.lapses ?? 0),
  ).length
  const dueByTrack = dueCountBySrsItems(learningMeta.items)
  const calculusDue = dueCountFromFsrsMap(mathProgress.calculusFsrs)
  if (calculusDue > 0) dueByTrack.calculus = (dueByTrack.calculus ?? 0) + calculusDue
  const todaySuggestion = pickTodaySuggestion({
    preferred,
    dueByTrack,
    hasProgress,
  })

  return {
    totalXp,
    levelInfo,
    daily,
    radarMap,
    calculusDoneCount,
    kanaCount,
    mathDoneCount,
    physicsDoneCount,
    chemistryDoneCount,
    csDoneCount,
    toeicDoneCount,
    hasProgress,
    catalogFirst,
    weekFlags,
    longIntervalCount,
    scheduledCount,
    leechCount,
    todaySuggestion,
  }
}
