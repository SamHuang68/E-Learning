import type { RadarDimension, TrackRadar } from '../engine/radar'
import type { UiLocale } from './locale'
import { pickUi } from './pickUi'

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
