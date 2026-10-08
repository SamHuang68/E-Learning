import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { INTERVIEW_SCENARIOS } from '../data/interviewDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function InterviewLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => INTERVIEW_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="interview-lab"
      icon="👔"
      playingIcon="🗣️"
      accentColor="#f59e0b"
      accentBackground="rgba(245, 158, 11, 0.15)"
      buttonBackground="linear-gradient(135deg, #f59e0b, #d97706)"
      title={{ en: "TOEIC Job Interview and Benefits Listening Lab", zh: "TOEIC 商務求職面試與人資福利聽力實驗室", ja: "TOEIC 採用面接・HR福利厚生特訓ラボ" }}
      description={{ en: "Practise interview evidence, quantified achievements, probationary periods, compensation, and benefits vocabulary.", zh: "多益高頻 HR 人資場景：專案成就主導（spearhead）、試用期條款與薪資福利 package 速記！", ja: "Part 3/4/7の超頻出ジャンル！「採用面接での自己PR・職務経歴・試用期間（probationary period）・福利厚生」を徹底攻略！" }}
      tipsKey="hrKeywordsTipsJa"
    />
  )
}
