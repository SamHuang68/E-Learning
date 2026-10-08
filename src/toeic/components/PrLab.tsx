import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { PR_SCENARIOS } from '../data/prDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function PrLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => PR_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="pr-lab"
      icon="📰"
      playingIcon="🎤"
      accentColor="#0284c7"
      accentBackground="rgba(56, 189, 248, 0.15)"
      buttonBackground="linear-gradient(135deg, #0284c7, #0369a1)"
      title={{ en: "TOEIC Public-Relations and Media-Embargo Listening Lab", zh: "TOEIC 商務公共關係與媒體新聞發布聽力實驗室", ja: "TOEIC 広報・プレスリリース＆記者会見特訓" }}
      description={{ en: "Practise press releases, embargo times, media kits, spokesperson duties, and product-launch communications.", zh: "多益高頻公關媒體題型：新聞稿最終簽核、報導解禁時間限制、媒體新聞包與記者會現場提問！", ja: "Part 4アナウンス・Part 7文書頻出！「プレスリリース（press release）・情報解禁（embargo）・プレスキット（media kit）・広報官（spokesperson）」を完全網羅！" }}
      tipsKey="prKeywordsTipsJa"
    />
  )
}
