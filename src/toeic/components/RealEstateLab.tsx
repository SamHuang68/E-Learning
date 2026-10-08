import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { REAL_ESTATE_SCENARIOS } from '../data/realEstateDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function RealEstateLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => REAL_ESTATE_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="real-estate-lab"
      icon="🏢"
      idleIcon="🔑"
      playingIcon="🏢"
      accentColor="#f59e0b"
      accentBackground="rgba(245, 158, 11, 0.15)"
      buttonBackground="linear-gradient(135deg, #f59e0b, #d97706)"
      title={{ en: "TOEIC Commercial-Lease Negotiation Listening Lab", zh: "TOEIC 商務房地產租賃與辦公室擴遷聽力實驗室", ja: "TOEIC 不動産・オフィス賃貸＆移転交渉特訓" }}
      description={{ en: "Practise rent-free fit-out periods, square footage, tenant requirements, and landlord concessions.", zh: "多益高頻商辦題目：辦公室租賃合約、免租裝修期、每平方英尺租金、全天候空調與物業設施！", ja: "ビジネス読解・リスニング必須！「オフィス賃貸契約（commercial lease）・フリーレント（rent-free period）・坪単価（sq ft rate）・空調（HVAC）」を完全攻略！" }}
      tipsKey="realEstateKeywordsTipsJa"
    />
  )
}
