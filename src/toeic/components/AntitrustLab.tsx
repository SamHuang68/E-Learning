import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { ANTITRUST_SCENARIOS } from '../data/antitrustDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function AntitrustLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => ANTITRUST_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="antitrust-lab"
      icon="⚖️"
      playingIcon="📜"
      accentColor="#ca8a04"
      accentBackground="rgba(234, 179, 8, 0.15)"
      buttonBackground="linear-gradient(135deg, #eab308, #ca8a04)"
      title={{ en: "TOEIC Antitrust and Cartel-Prevention Listening Lab", zh: "TOEIC 商務反托拉斯壟斷與價格合謀防範聽力實驗室", ja: "TOEIC 独占禁止法＆カルテル防止特訓" }}
      description={{ en: "Practise antitrust compliance, price-fixing prevention, market-allocation restrictions, and whistleblower reporting procedures.", zh: "多益高階商務法規與監管考點：反托拉斯合規、價格合謀防範、產能分配限制與吹哨者通報程序！", ja: "ビジネス法務・Part 3＆Part 7頻出！「独占禁止法（antitrust）・価格カルテル（price-fixing）・市場分割（market allocation）・内部通報（whistleblower）」を完全制覇！" }}
      tipsKey="antitrustKeywordsTipsJa"
    />
  )
}
