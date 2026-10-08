import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { CLOUD_SLA_SCENARIOS } from '../data/cloudSlaDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function CloudSlaLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => CLOUD_SLA_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="cloud-sla-lab"
      icon="☁️"
      playingIcon="📜"
      accentColor="#0ea5e9"
      accentBackground="rgba(14, 165, 233, 0.15)"
      buttonBackground="linear-gradient(135deg, #0ea5e9, #0284c7)"
      title={{ en: "TOEIC Cloud SLA and Service-Credit Listening Lab", zh: "TOEIC 雲端服務協議 (SLA) 與停機補償聽力實驗室", ja: "TOEIC クラウドSLA＆障害補償特訓" }}
      description={{ en: "Practise uptime guarantees, unplanned outages, failover delays, and service-credit calculations.", zh: "多益高階雲端運算考點：SLA 99.99% 承諾、非計畫停機補償、服務點數折抵與容錯備援！", ja: "クラウドIT契約・Part 3＆Part 7頻出！「SLA 99.99%稼働率保証（uptime commitment）・サービスクレジット（service credits）・フェイルオーバー（failover）」を完全制覇！" }}
      tipsKey="cloudSlaKeywordsTipsJa"
    />
  )
}
