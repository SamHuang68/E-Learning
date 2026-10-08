import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { BUSINESS_INTERRUPTION_SCENARIOS } from '../data/businessInterruptionDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function BusinessInterruptionLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => BUSINESS_INTERRUPTION_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="business-interruption-lab"
      icon="🏭"
      playingIcon="📜"
      accentColor="#d97706"
      accentBackground="rgba(217, 119, 6, 0.15)"
      buttonBackground="linear-gradient(135deg, #d97706, #b45309)"
      title={{ en: "TOEIC Business-Interruption Insurance Listening Lab", zh: "TOEIC 商業營業中斷險 (BII) 理賠聽力實驗室", ja: "TOEIC 休業損害保険（BII）理賠特訓" }}
      description={{ en: "Practise waiting-period deductibles, lost-profit coverage, continuing expenses, and mitigation-cost claims.", zh: "多益高階企業風險管理考點：營業中斷毛利損失、72小時免賠等待期、法證理賠公估與臨時移地開銷！", ja: "企業リスク管理・Part 3＆Part 7頻出！「休業損害保険（BII）・72時間免責期間・固定費補償（continuing expenses）」を完全制覇！" }}
      tipsKey="businessInterruptionKeywordsTipsJa"
    />
  )
}
