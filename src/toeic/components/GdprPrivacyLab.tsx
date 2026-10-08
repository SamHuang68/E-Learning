import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { GDPR_PRIVACY_SCENARIOS } from '../data/gdprPrivacyDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function GdprPrivacyLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => GDPR_PRIVACY_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="gdpr-privacy-lab"
      icon="🛡️"
      playingIcon="📜"
      accentColor="#3b82f6"
      accentBackground="rgba(59, 130, 246, 0.15)"
      buttonBackground="linear-gradient(135deg, #3b82f6, #2563eb)"
      title={{ en: "TOEIC GDPR and Cross-Border Privacy Listening Lab", zh: "TOEIC 歐盟 GDPR 隱私保護與合規聽力實驗室", ja: "TOEIC GDPR データプライバシー特訓" }}
      description={{ en: "Practise 72-hour breach reporting, supervisory authorities, transfer-impact assessments, and Standard Contractual Clauses.", zh: "多益高階資訊法務考點：標準合約條款 SCCs、72 小時重大個資外洩通報、DPO 職責與全球營業額 4% 鉅額罰款！", ja: "国際法務・Part 3＆Part 7頻出！「標準契約条項（SCCs）・72時間漏洩通知（72-hr breach notification）・データ保護責任者（DPO）」を完全制覇！" }}
      tipsKey="gdprPrivacyKeywordsTipsJa"
    />
  )
}
