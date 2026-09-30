import type { RadarDimension, TrackRadar } from '../engine/radar'
import type { UiLocale } from './locale'
import { pickUi } from './pickUi'
import { RADAR_DIM_COPY } from './radarDimCopy'

type Pair = [string, string]

const TRACK_NAME: Record<TrackRadar['track'], Pair> = {
  math: ['臺灣 108 課綱數學', 'Taiwan 108 math'],
  ja: ['あおば日語 (JLPT)', 'Aoba Japanese (JLPT)'],
  en: ['TOEIC 多益商務英語', 'TOEIC business English'],
  calculus: ['∫ 微積分互動專題 (Calculus)', '∫ Calculus studio'],
  physics: ['⚛️ 臺灣物理 (國中+高中)', '⚛️ Taiwan physics'],
  chemistry: ['🧪 臺灣化學 (國中+高中)', '🧪 Taiwan chemistry'],
  zh: ['🇹🇼 台湾華語 (日本語で学ぶ)', '🇹🇼 Taiwan Mandarin'],
  cs: ['💻 計算機概論 (硬體+軟體+AI)', '💻 CS survey'],
}

function localizeDimension(track: TrackRadar['track'], dim: RadarDimension, locale: UiLocale): RadarDimension {
  const copy = RADAR_DIM_COPY[track]?.[dim.key]
  if (!copy) return dim
  return {
    ...dim,
    label: pickUi(locale, copy.label[0], copy.label[1]),
    description: pickUi(locale, copy.description[0], copy.description[1]),
  }
}

export function localizeTrackRadar(radar: TrackRadar, locale: UiLocale): TrackRadar {
  const name = TRACK_NAME[radar.track]
  const dimensions = radar.dimensions.map((dim) => localizeDimension(radar.track, dim, locale))
  const byKey = Object.fromEntries(dimensions.map((dim) => [dim.key, dim]))
  return {
    ...radar,
    trackName: name ? pickUi(locale, name[0], name[1]) : radar.trackName,
    dimensions,
    strongestDimension: byKey[radar.strongestDimension.key] ?? radar.strongestDimension,
    weakestDimension: byKey[radar.weakestDimension.key] ?? radar.weakestDimension,
  }
}
