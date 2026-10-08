import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { PATENT_LITIGATION_SCENARIOS } from '../data/patentLitigationDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function PatentLitigationLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => PATENT_LITIGATION_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="patent-litigation-lab"
      icon="⚖️"
      playingIcon="📜"
      accentColor="#a855f7"
      accentBackground="rgba(168, 85, 247, 0.15)"
      buttonBackground="linear-gradient(135deg, #a855f7, #9333ea)"
      title={{ en: "TOEIC Patent-Litigation Listening Lab", zh: "TOEIC 商務專利侵權訴訟與禁制令聽力實驗室", ja: "TOEIC 特許侵害訴訟＆仮差止命令特訓" }}
      description={{ en: "Practise preliminary injunctions, irreparable harm, prior art, invalidity arguments, and inter partes review.", zh: "多益高階智慧財產訴訟考點：初步禁制令動議、無法彌補之損害、先前技術無效抗辯與 IPR 專利多方複審！", ja: "知財法務・Part 3＆Part 7頻出！「特許侵害（patent infringement）・仮差止命令（preliminary injunction）・回復不能な損害（irreparable harm）・先行技術（prior art）」を完全制覇！" }}
      tipsKey="patentLitigationKeywordsTipsJa"
    />
  )
}
