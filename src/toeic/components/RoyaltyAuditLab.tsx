import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { ROYALTY_AUDIT_SCENARIOS } from '../data/royaltyAuditDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function RoyaltyAuditLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => ROYALTY_AUDIT_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="royalty-audit-lab"
      icon="📊"
      playingIcon="📜"
      accentColor="#ea580c"
      accentBackground="rgba(234, 88, 12, 0.15)"
      buttonBackground="linear-gradient(135deg, #ea580c, #c2410c)"
      title={{ en: "TOEIC Royalty-Audit Listening Lab", zh: "TOEIC 專利權利金審計與追補條款聽力實驗室", ja: "TOEIC ライセンス料監査特訓" }}
      description={{ en: "Practise sales underreporting, contractual thresholds, forensic accounting, and audit-fee-shifting clauses.", zh: "多益高階智財授權法務考點：專利權利金審計、短報銷售額追討、延遲利息與審計成本移轉！", ja: "知財ライセンス・Part 3＆Part 7頻出！「ロイヤルティ監査（royalty audit）・過少申告（underreported）・監査費用転嫁条項」を完全制覇！" }}
      tipsKey="royaltyAuditKeywordsTipsJa"
    />
  )
}
