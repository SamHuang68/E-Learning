import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { IP_SCENARIOS } from '../data/ipDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function IpLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => IP_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="ip-lab"
      icon="⚖️"
      playingIcon="📜"
      accentColor="#f43f5e"
      accentBackground="rgba(244, 63, 94, 0.15)"
      buttonBackground="linear-gradient(135deg, #f43f5e, #e11d48)"
      title={{ en: "TOEIC Intellectual-Property Licensing Listening Lab", zh: "TOEIC 商務智慧財產權與專利授權聽力實驗室", ja: "TOEIC 知財・特許ライセンス＆訴訟特訓" }}
      description={{ en: "Practise upfront licence fees, running royalties, non-exclusive licences, and settlement of patent disputes.", zh: "多益高階法務題型：專利侵權和解、非專屬技術授權、預付金與銷售權利金提撥計算！", ja: "Part 4通知・Part 7契約書頻出！「特許侵害（patent infringement）・ロイヤルティ（royalty fee）・非独占的実施権（non-exclusive license）」を完全網羅！" }}
      tipsKey="ipKeywordsTipsJa"
    />
  )
}
