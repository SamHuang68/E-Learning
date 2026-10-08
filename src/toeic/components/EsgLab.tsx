import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { ESG_SCENARIOS } from '../data/esgDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function EsgLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => ESG_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="esg-lab"
      icon="🌱"
      playingIcon="🌍"
      accentColor="#059669"
      accentBackground="rgba(5, 150, 105, 0.15)"
      buttonBackground="linear-gradient(135deg, #059669, #047857)"
      title={{ en: "TOEIC ESG and Carbon-Accounting Listening Lab", zh: "TOEIC 商務企業永續 ESG 與碳盤查聽力實驗室", ja: "TOEIC ESG・脱炭素＆カーボンオフセット特訓" }}
      description={{ en: "Practise Scope 1, 2, and 3 emissions, assurance, carbon declarations, and supply-chain measurement.", zh: "多益高頻綠色商務考點：範疇一二三溫室氣體排放盤查、歐盟碳邊境稅、第三方獨立永續報告查證！", ja: "最先端Part 4・Part 7必須！「Scope 1/2/3排出量算定・炭素国境調整（CBAM）・カーボンクレジット（offset credits）」を徹底マスター！" }}
      tipsKey="esgKeywordsTipsJa"
    />
  )
}
