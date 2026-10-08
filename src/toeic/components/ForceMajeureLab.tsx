import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { FORCE_MAJEURE_SCENARIOS } from '../data/forceMajeureDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function ForceMajeureLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => FORCE_MAJEURE_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="force-majeure-lab"
      icon="🌪️"
      playingIcon="📜"
      accentColor="#0284c7"
      accentBackground="rgba(14, 165, 233, 0.15)"
      buttonBackground="linear-gradient(135deg, #0284c7, #0369a1)"
      title={{ en: "TOEIC Force Majeure and Cargo-Claim Listening Lab", zh: "TOEIC 商務不可抗力與保險理賠聽力實驗室", ja: "TOEIC 不可抗力条項＆保険損害査定特訓" }}
      description={{ en: "Practise prompt-notice requirements, excusable delay, cargo insurance, and deductible calculations.", zh: "多益高頻商務法規考點：合約不可抗力免責條款、天災履約寬限、保險自負額與公證理賠！", ja: "ビジネス契約・Part 3＆Part 7頻出！「不可抗力（force majeure）・天変地異（act of God）・損害査定人（claims adjuster）・免責額（deductible）」を完全制覇！" }}
      tipsKey="forceMajeureKeywordsTipsJa"
    />
  )
}
