import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { ANTITRUST_HHI_SCENARIOS } from '../data/antitrustHhiDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function AntitrustHhiLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => ANTITRUST_HHI_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="antitrust-hhi-lab"
      icon="📊"
      playingIcon="📜"
      accentColor="#3b82f6"
      accentBackground="rgba(59, 130, 246, 0.15)"
      buttonBackground="linear-gradient(135deg, #3b82f6, #2563eb)"
      title={{ en: "TOEIC Merger Review and HHI Analysis Listening Lab", zh: "TOEIC 反托拉斯 HHI 市場集中度指數聽力實驗室", ja: "TOEIC 反トラスト・HHI市場集中度特訓" }}
      description={{ en: "Practise market-concentration analysis, HHI thresholds, injunction risk, and structural divestiture remedies.", zh: "多益高階企業併購考點：HHI 赫芬達爾指數精算、反競爭推定、司法部初步禁制令與資產剝離！", ja: "企業法務＆M&A・Part 3＆Part 7頻出！「HHI指数（市場集中度）・DOJ（司法省）差し止め訴訟・資産売却（divestiture）」を完全制覇！" }}
      tipsKey="antitrustHhiKeywordsTipsJa"
    />
  )
}
