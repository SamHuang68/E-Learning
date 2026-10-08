import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { CYBERSECURITY_SCENARIOS } from '../data/cybersecurityDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function CybersecurityLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => CYBERSECURITY_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="cybersecurity-lab"
      icon="🛡️"
      idleIcon="🔐"
      playingIcon="🛡️"
      accentColor="#ef4444"
      accentBackground="rgba(239, 68, 68, 0.15)"
      buttonBackground="linear-gradient(135deg, #ef4444, #dc2626)"
      title={{ en: "TOEIC Cybersecurity and Two-Factor Authentication Listening Lab", zh: "TOEIC 商務資訊技術與網路資安聽力實驗室", ja: "TOEIC IT・サイバーセキュリティ＆保守管理特訓" }}
      description={{ en: "Practise phishing-response policy, hardware two-factor authentication, backups, and scheduled downtime.", zh: "多益高頻現代職場 IT 題目：釣魚防護、硬體雙因子驗證 2FA、伺服器停機維護與檔案異地備份！", ja: "近年のTOEIC Part 3/4/7で急増！「フィッシング演習・2要素認証（2FA）・システム停止（downtime）・事前バックアップ」を完全網羅！" }}
      tipsKey="itKeywordsTipsJa"
    />
  )
}
