import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { BONDED_WAREHOUSE_SCENARIOS } from '../data/bondedWarehouseDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function BondedWarehouseLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => BONDED_WAREHOUSE_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="bonded-warehouse-lab"
      icon="🏛️"
      playingIcon="📜"
      accentColor="#d97706"
      accentBackground="rgba(217, 119, 6, 0.15)"
      buttonBackground="linear-gradient(135deg, #d97706, #b45309)"
      title={{ en: "TOEIC Customs and Bonded-Warehouse Listening Lab", zh: "TOEIC 商務海關報關與保稅倉庫聽力實驗室", ja: "TOEIC 通関申告＆保税倉庫（関税繰延）特訓" }}
      description={{ en: "Practise HS classification, tariff deferral, bonded warehousing, and digital customs-document controls.", zh: "多益高頻國際貿易題型：保稅倉庫關稅遞延、海關進口申報、HS 稅則編碼與通關稽核！", ja: "国際貿易・Part 3＆Part 7頻出！「保税倉庫（bonded warehouse）・関税繰延（duty deferral）・HSコード・通関士（customs broker）」を完全制覇！" }}
      tipsKey="bondedWarehouseKeywordsTipsJa"
    />
  )
}
