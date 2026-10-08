import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { MNA_SCENARIOS } from '../data/mnaDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function MnaLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => MNA_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="mna-lab"
      icon="🤝"
      idleIcon="💼"
      playingIcon="📊"
      accentColor="#6366f1"
      accentBackground="rgba(99, 102, 241, 0.15)"
      buttonBackground="linear-gradient(135deg, #6366f1, #4f46e5)"
      title={{ en: "TOEIC Mergers and Acquisitions Listening Lab", zh: "TOEIC 商務企業併購與盡職調查聽力實驗室", ja: "TOEIC M&A（企業買収・合併）＆デューデリ特訓" }}
      description={{ en: "Practise financial due diligence, manufacturing synergies, tender milestones, and antitrust clearance.", zh: "多益高階商務重頭戲：企業併購盡職調查、反壟斷主管機關核准、保密協議與股東大會表決！", ja: "最難関Part 7長文・Part 3対話頻出！「デューデリジェンス（due diligence）・秘密保持（NDA）・独禁法審査（antitrust）・シナジー（synergies）」を完全制覇！" }}
      tipsKey="mnaKeywordsTipsJa"
    />
  )
}
