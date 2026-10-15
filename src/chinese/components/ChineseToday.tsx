import React from 'react'
import { useI18n } from '../../i18n/i18n'
import { chineseTeachingCopy } from '../teachingCopy'
import type { ChineseNavSection } from './ChineseSidebar'

interface Props {
  xp: number
  onNavigate: (section: ChineseNavSection) => void
}

const modules: Array<{
  section: ChineseNavSection
  icon: string
  title: string
  description: string
  action: string
}> = [
  {
    section: 'pinyin',
    icon: '🗣️',
    title: '拼音・注音與四聲聲調',
    description: '五度標記法による四声の高さの可視化と有気音・そり舌音のカタカナ発音ガイド。',
    action: '進入發音實驗室 →',
  },
  {
    section: 'false-friends',
    icon: '⛩️',
    title: '日中同形異義語 (偽友詞)',
    description: '「手紙＝トイレットペーパー」「汽車＝乗用車」など日本人が必ず陥る落とし穴を撃退。',
    action: '進入偽友詞庫 →',
  },
  {
    section: 'signals',
    icon: '⚡',
    title: '3秒文法動作決策樹',
    description: '把字句・被字句・了1/了2・是…的・過など、文法シグナルからの直感秒殺ルール。',
    action: '進入文法決策樹 →',
  },
  {
    section: 'conversations',
    icon: '💬',
    title: '實用情境會話',
    description: 'ドリンクスタンドの甘さ・氷指定から夜市小吃、台北MRT乗車まで生きた台湾華語。',
    action: '進入情境會話 →',
  },
]

export const ChineseToday: React.FC<Props> = ({ xp, onNavigate }) => {
  const { locale } = useI18n()
  const text = (value: string) => chineseTeachingCopy(locale, value)

  return (
    <div className="chinese-today-view">
      <div className="signal-hero-card chinese-today-hero">
        <span lang={locale === 'en' ? 'en' : 'ja'} className="signal-badge">
          {text('🌸 台湾華語・繁体字中国語スタジオ')}
        </span>
        <h2>
          {text('歡迎來到臺灣華語學習空間！')}
        </h2>
        <p lang={locale === 'en' ? 'en' : 'ja'} className="hero-desc">
          {text('日本語母語者の視点に立ち、四声の音高カーブ・日中漢字の落とし穴・3秒文法直感判断・リアル台湾会話を最短ルートで完全攻略。')}
        </p>
      </div>

      <div className="chinese-module-grid">
        {modules.map((module) => (
          <button
            key={module.section}
            type="button"
            className="practice-card chinese-module-card"
            onClick={() => onNavigate(module.section)}
          >
            <div aria-hidden="true" className="chinese-module-icon">{module.icon}</div>
            <strong>{text(module.title)}</strong>
            <p lang={locale === 'en' ? 'en' : 'ja'}>
              {text(module.description)}
            </p>
            <span className="chinese-module-action">
              {text(module.action)}
            </span>
          </button>
        ))}
      </div>

      <div className="chinese-achievement">
        <div>
          <span className="chinese-achievement-label">{text('今日成就達成')}</span>
          <strong>{xp} {text('XP 累積')}</strong>
        </div>
        <div className="chinese-achievement-goal">
          {text('🎯 建議今日目標：完成 1 組聲調練習與 1 組偽友詞避坑！')}
        </div>
      </div>
    </div>
  )
}
