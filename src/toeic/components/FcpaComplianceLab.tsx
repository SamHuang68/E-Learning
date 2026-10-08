import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { FCPA_COMPLIANCE_SCENARIOS } from '../data/fcpaComplianceDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function FcpaComplianceLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => FCPA_COMPLIANCE_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="fcpa-compliance-lab"
      icon="⚖️"
      playingIcon="📜"
      accentColor="#6366f1"
      accentBackground="rgba(99, 102, 241, 0.15)"
      buttonBackground="linear-gradient(135deg, #6366f1, #4f46e5)"
      title={{ en: "TOEIC FCPA and Anti-Bribery Compliance Listening Lab", zh: "TOEIC 反海外腐敗法 (FCPA) 企業合規聽力實驗室", ja: "TOEIC FCPA・反贈賄コンプライアンス特訓" }}
      description={{ en: "Practise third-party due diligence, beneficial-ownership red flags, fair-market-value controls, and anti-bribery undertakings.", zh: "多益高階跨國法規考點：FCPA 反貪腐審查、第三方顧問紅旗警訊、禁止疏通費與企業誠信！", ja: "企業法務・Part 3＆Part 7頻出！「米FCPA（海外腐敗行為防止法）・贈賄レッドフラッグ・代理店デューデリジェンス」を完全制覇！" }}
      tipsKey="fcpaComplianceKeywordsTipsJa"
    />
  )
}
