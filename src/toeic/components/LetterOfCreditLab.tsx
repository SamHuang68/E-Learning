import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { LETTER_OF_CREDIT_SCENARIOS } from '../data/letterOfCreditDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function LetterOfCreditLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => LETTER_OF_CREDIT_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="letter-of-credit-lab"
      icon="📜"
      idleIcon="⚖️"
      playingIcon="📜"
      accentColor="#3b82f6"
      accentBackground="rgba(59, 130, 246, 0.15)"
      buttonBackground="linear-gradient(135deg, #3b82f6, #2563eb)"
      title={{ en: "TOEIC Letter-of-Credit and Shipping-Document Listening Lab", zh: "TOEIC 國際信用狀 UCP 600 單證瑕疵聽力實驗室", ja: "TOEIC 信用状（L/C）・ディスクレ特訓" }}
      description={{ en: "Practise UCP 600 discrepancies, late shipment dates, refusal notices, and shipping guarantees.", zh: "多益高階國際貿易考點：跟單信用狀嚴格相符原則、提單遲延裝運、開證行拒付與銀行擔保提貨！", ja: "貿易金融＆決済・Part 3＆Part 7頻出！「信用状（L/C）・書類不一致（discrepancy）・荷渡保証書（shipping guarantee）」を完全制覇！" }}
      tipsKey="letterOfCreditKeywordsTipsJa"
    />
  )
}
