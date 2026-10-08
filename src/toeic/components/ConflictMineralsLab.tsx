import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { CONFLICT_MINERALS_SCENARIOS } from '../data/conflictMineralsDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function ConflictMineralsLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => CONFLICT_MINERALS_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="conflict-minerals-lab"
      icon="💎"
      playingIcon="📜"
      accentColor="#0ea5e9"
      accentBackground="rgba(14, 165, 233, 0.15)"
      buttonBackground="linear-gradient(135deg, #0ea5e9, #0284c7)"
      title={{ en: "TOEIC Conflict-Minerals and Supplier-Audit Listening Lab", zh: "TOEIC 供應鏈無衝突礦產與勞工人權聽力實驗室", ja: "TOEIC 紛争鉱物＆労働監査特訓" }}
      description={{ en: "Practise 3TG due diligence, conflict-free smelter validation, labour audits, and remediation deadlines.", zh: "多益高階供應鏈與社會責任考點：無衝突礦產驗證、RMI 冶煉廠認證、ILO 勞工準則與突擊稽核！", ja: "ESGサプライチェーン・Part 3＆Part 7頻出！「紛争鉱物（conflict-free 3TG）・精錬所認証（smelters）・労働監査（ILO audit）・是正措置（remediation）」を完全制覇！" }}
      tipsKey="conflictMineralsKeywordsTipsJa"
    />
  )
}
