import type { JlptLevel, Unit } from '../data/course'
import type { UiLocale } from './locale'
import type { MessageKey } from './messages'

const TIER_KEYS: Record<string, MessageKey> = {
  基礎: 'ja.tier.beginner',
  初級: 'ja.tier.beginner',
  中級: 'ja.tier.intermediate',
  進階: 'ja.tier.advanced',
}

const MAP_TITLE_KEYS: Record<string, MessageKey> = {
  n5n4: 'ja.map.n5n4',
  n3: 'ja.map.n3',
  n2n1: 'ja.map.n2n1',
}

const MAP_DESC_KEYS: Record<string, MessageKey> = {
  n5n4: 'ja.mapDesc.n5n4',
  n3: 'ja.mapDesc.n3',
  n2n1: 'ja.mapDesc.n2n1',
}

export function jlptTierKey(tier: string): MessageKey | undefined {
  return TIER_KEYS[tier]
}

export function jlptTierLabel(tier: string, t: (key: MessageKey) => string): string {
  const key = jlptTierKey(tier)
  return key ? t(key) : tier
}

export function aobaLevelOptionLabel(
  level: Pick<JlptLevel, 'band' | 'tier'>,
  t: (key: MessageKey) => string,
): string {
  return `${level.band} · ${jlptTierLabel(level.tier, t)}`
}

export function aobaUnitChromeTitle(locale: UiLocale, unit: Pick<Unit, 'title' | 'titleJa'>): string {
  return locale === 'en' ? unit.titleJa : unit.title
}

export function jlptMapTitleKey(levelId: string): MessageKey | undefined {
  return MAP_TITLE_KEYS[levelId]
}

export function jlptMapDescKey(levelId: string): MessageKey | undefined {
  return MAP_DESC_KEYS[levelId]
}

export function jlptMapTitle(
  level: Pick<JlptLevel, 'id' | 'mapTitle'>,
  t: (key: MessageKey) => string,
): string {
  const key = jlptMapTitleKey(level.id)
  return key ? t(key) : level.mapTitle
}

export function jlptMapDesc(
  level: Pick<JlptLevel, 'id' | 'mapDesc'>,
  t: (key: MessageKey) => string,
): string {
  const key = jlptMapDescKey(level.id)
  return key ? t(key) : level.mapDesc
}
