import { describe, expect, it } from 'vitest'
import { loadHubSnapshot, selectHubDerived } from '../Hub'
import { calculateLevel, calculateLevelProgress } from './gamification'
import { clampPct, rollupEightTrackXp, safeIdList, safeXp } from './trackProgressRollup'

describe('eight-track progress rollup', () => {
  it('treats empty, missing, NaN, and negative XP as 0 and never concatenates strings', () => {
    expect(safeXp(undefined)).toBe(0)
    expect(safeXp(null)).toBe(0)
    expect(safeXp(Number.NaN)).toBe(0)
    expect(safeXp(-12)).toBe(0)
    expect(safeXp(Infinity)).toBe(0)
    expect(safeXp('10')).toBe(10)
    expect(safeIdList(undefined)).toEqual([])
    expect(safeIdList(null)).toEqual([])
    expect(safeIdList(['a', 1, 'b'])).toEqual(['a', 'b'])
    expect(clampPct(Number.NaN)).toBe(0)
    expect(clampPct(-4)).toBe(0)
    expect(clampPct(150)).toBe(100)
    expect(
      rollupEightTrackXp({
        math: Number.NaN,
        physics: undefined,
        chemistry: -3,
        cs: '8',
        ja: 2,
        toeic: null,
        chinese: 0,
      }),
    ).toBe(10)
  })

  it('Hub derived stays finite 0-100 when tracks are empty or corrupt', () => {
    const empty = selectHubDerived(loadHubSnapshot())
    expect(empty.totalXp).toBe(0)
    expect(Number.isFinite(empty.levelInfo.progressPct)).toBe(true)
    expect(empty.levelInfo.progressPct).toBeGreaterThanOrEqual(0)
    expect(empty.levelInfo.progressPct).toBeLessThanOrEqual(100)

    const corrupt = loadHubSnapshot()
    Object.assign(corrupt.mathProgress, { xp: Number.NaN, completedQuestions: null, labCompleted: undefined })
    Object.assign(corrupt.physicsProgress, { xp: -9, completedQuestions: 'nope' })
    Object.assign(corrupt.jaProgress, { xp: '4', readingDone: Number.NaN })
    Object.assign(corrupt.kanaProgress, { mastered: undefined })
    Object.assign(corrupt.chineseProgress, { xp: Infinity, masteredFalseFriends: null })
    const derived = selectHubDerived(corrupt)
    expect(Number.isFinite(derived.totalXp)).toBe(true)
    expect(derived.totalXp).toBeGreaterThanOrEqual(0)
    expect(derived.mathDoneCount).toBe(0)
    expect(derived.physicsDoneCount).toBe(0)
    expect(derived.kanaCount).toBe(0)
    expect(derived.levelInfo.progressPct).toBeGreaterThanOrEqual(0)
    expect(derived.levelInfo.progressPct).toBeLessThanOrEqual(100)
    expect(Number.isNaN(derived.levelInfo.currentLevel)).toBe(false)
  })

  it('level math does not emit NaN for non-finite XP', () => {
    expect(calculateLevel(Number.NaN)).toBe(1)
    expect(calculateLevel(-20)).toBe(1)
    expect(calculateLevelProgress(Number.NaN).progressPct).toBe(0)
    expect(calculateLevelProgress(Number.NaN).currentLevel).toBe(1)
  })
})
