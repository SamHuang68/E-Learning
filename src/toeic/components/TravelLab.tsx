import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { TRAVEL_SCENARIOS } from '../data/travelDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function TravelLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => TRAVEL_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="travel-lab"
      icon="✈️"
      idleIcon="🛫"
      playingIcon="🎧"
      accentColor="#0ea5e9"
      accentBackground="rgba(14, 165, 233, 0.15)"
      buttonBackground="linear-gradient(135deg, #0284c7, #0ea5e9)"
      title={{ en: "TOEIC Business-Travel and Airport Listening Lab", zh: "TOEIC 商務差旅、機場登機與住宿聽力實驗室", ja: "TOEIC 出張・フライト＆ホテル特訓ラボ" }}
      description={{ en: "Practise check-in, loyalty upgrades, checked-through baggage, seating requests, and boarding passes.", zh: "多益高頻商務差旅行程：登機手續、座艙升等、行李直掛與出差報銷關鍵字秒殺！", ja: "Part 3/4/7で頻出する「空港チェックイン・座席アップグレード・手荷物スルー（checked through）・経費精算」を攻略！" }}
      tipsKey="businessExpenseTipsJa"
    />
  )
}
