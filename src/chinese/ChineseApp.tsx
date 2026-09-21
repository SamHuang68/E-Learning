import React, { Suspense, useState } from 'react'
import { ChineseSidebar, type ChineseNavSection } from './components/ChineseSidebar'
import { ChineseToday } from './components/ChineseToday'
import { loadChineseProgress, saveChineseProgress } from './utils/chineseStorage'
import type { LangId } from '../utils/storage'
import { useI18n } from '../i18n/i18n'

const PinyinLab = React.lazy(() =>
  import('./components/PinyinLab').then((m) => ({ default: m.PinyinLab })),
)
const FalseFriendsLab = React.lazy(() =>
  import('./components/FalseFriendsLab').then((m) => ({ default: m.FalseFriendsLab })),
)
const ChineseSignalsView = React.lazy(() =>
  import('./components/ChineseSignalsView').then((m) => ({ default: m.ChineseSignalsView })),
)
const ChineseConversationLab = React.lazy(() =>
  import('./components/ChineseConversationLab').then((m) => ({ default: m.ChineseConversationLab })),
)
const TaiwanMenuLab = React.lazy(() =>
  import('./components/TaiwanMenuLab').then((m) => ({ default: m.TaiwanMenuLab })),
)
const BopomofoStrokeLab = React.lazy(() =>
  import('./components/BopomofoStrokeLab').then((m) => ({ default: m.BopomofoStrokeLab })),
)
const ToneListeningLab = React.lazy(() =>
  import('./components/ToneListeningLab').then((m) => ({ default: m.ToneListeningLab })),
)
const IdiomsLab = React.lazy(() =>
  import('./components/IdiomsLab').then((m) => ({ default: m.IdiomsLab })),
)
const SynonymsLab = React.lazy(() =>
  import('./components/SynonymsLab').then((m) => ({ default: m.SynonymsLab })),
)
const MeasureWordsLab = React.lazy(() =>
  import('./components/MeasureWordsLab').then((m) => ({ default: m.MeasureWordsLab })),
)
const TransitLab = React.lazy(() =>
  import('./components/TransitLab').then((m) => ({ default: m.TransitLab })),
)
const HousingLab = React.lazy(() =>
  import('./components/HousingLab').then((m) => ({ default: m.HousingLab })),
)
const BankingLab = React.lazy(() =>
  import('./components/BankingLab').then((m) => ({ default: m.BankingLab })),
)
const MedicalLab = React.lazy(() =>
  import('./components/MedicalLab').then((m) => ({ default: m.MedicalLab })),
)
const PostLab = React.lazy(() =>
  import('./components/PostLab').then((m) => ({ default: m.PostLab })),
)
const TravelZhLab = React.lazy(() =>
  import('./components/TravelZhLab').then((m) => ({ default: m.TravelZhLab })),
)
const FoodZhLab = React.lazy(() =>
  import('./components/FoodZhLab').then((m) => ({ default: m.FoodZhLab })),
)
const UtilitiesZhLab = React.lazy(() =>
  import('./components/UtilitiesZhLab').then((m) => ({ default: m.UtilitiesZhLab })),
)
const FestivalZhLab = React.lazy(() =>
  import('./components/FestivalZhLab').then((m) => ({ default: m.FestivalZhLab })),
)
const CraftsZhLab = React.lazy(() =>
  import('./components/CraftsZhLab').then((m) => ({ default: m.CraftsZhLab })),
)
const RoadTripZhLab = React.lazy(() =>
  import('./components/RoadTripZhLab').then((m) => ({ default: m.RoadTripZhLab })),
)
const RepairZhLab = React.lazy(() =>
  import('./components/RepairZhLab').then((m) => ({ default: m.RepairZhLab })),
)
const PetZhLab = React.lazy(() =>
  import('./components/PetZhLab').then((m) => ({ default: m.PetZhLab })),
)
const RechaoZhLab = React.lazy(() =>
  import('./components/RechaoZhLab').then((m) => ({ default: m.RechaoZhLab })),
)
const ConvenienceAtmZhLab = React.lazy(() =>
  import('./components/ConvenienceAtmZhLab').then((m) => ({ default: m.ConvenienceAtmZhLab })),
)
const YouBikeZhLab = React.lazy(() =>
  import('./components/YouBikeZhLab').then((m) => ({ default: m.YouBikeZhLab })),
)
const BobaZhLab = React.lazy(() =>
  import('./components/BobaZhLab').then((m) => ({ default: m.BobaZhLab })),
)
const WeddingZhLab = React.lazy(() =>
  import('./components/WeddingZhLab').then((m) => ({ default: m.WeddingZhLab })),
)
const LotteryZhLab = React.lazy(() =>
  import('./components/LotteryZhLab').then((m) => ({ default: m.LotteryZhLab })),
)
const WeiyaZhLab = React.lazy(() =>
  import('./components/WeiyaZhLab').then((m) => ({ default: m.WeiyaZhLab })),
)
const ZhuazhouZhLab = React.lazy(() =>
  import('./components/ZhuazhouZhLab').then((m) => ({ default: m.ZhuazhouZhLab })),
)
const GhostFestivalZhLab = React.lazy(() =>
  import('./components/GhostFestivalZhLab').then((m) => ({ default: m.GhostFestivalZhLab })),
)
const TangyuanZhLab = React.lazy(() =>
  import('./components/TangyuanZhLab').then((m) => ({ default: m.TangyuanZhLab })),
)
const DragonBoatZhLab = React.lazy(() =>
  import('./components/DragonBoatZhLab').then((m) => ({ default: m.DragonBoatZhLab })),
)
const MidAutumnZhLab = React.lazy(() =>
  import('./components/MidAutumnZhLab').then((m) => ({ default: m.MidAutumnZhLab })),
)
const LanternFestivalZhLab = React.lazy(() =>
  import('./components/LanternFestivalZhLab').then((m) => ({ default: m.LanternFestivalZhLab })),
)
const QingmingPopiahZhLab = React.lazy(() =>
  import('./components/QingmingPopiahZhLab').then((m) => ({ default: m.QingmingPopiahZhLab })),
)
const YuelaoLoveZhLab = React.lazy(() =>
  import('./components/YuelaoLoveZhLab').then((m) => ({ default: m.YuelaoLoveZhLab })),
)
const DoubleNinthZhLab = React.lazy(() =>
  import('./components/DoubleNinthZhLab').then((m) => ({ default: m.DoubleNinthZhLab })),
)
const StartOfWinterZhLab = React.lazy(() =>
  import('./components/StartOfWinterZhLab').then((m) => ({ default: m.StartOfWinterZhLab })),
)
const GuabaoSishenZhLab = React.lazy(() =>
  import('./components/GuabaoSishenZhLab').then((m) => ({ default: m.GuabaoSishenZhLab })),
)
const ChineseMockExam = React.lazy(() =>
  import('./components/ChineseMockExam').then((m) => ({ default: m.ChineseMockExam })),
)
const ChineseErrorVault = React.lazy(() =>
  import('./components/ChineseErrorVault').then((m) => ({ default: m.ChineseErrorVault })),
)

interface Props {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

export const ChineseApp: React.FC<Props> = ({ onBackHub, onSwitchLang }) => {
  const { t } = useI18n()
  const [section, setSection] = useState<ChineseNavSection>('today')
  const [progress, setProgress] = useState(() => loadChineseProgress())

  function earnXp(amount: number) {
    setProgress((prev) => {
      const next = { ...prev, xp: prev.xp + amount }
      saveChineseProgress(next)
      return next
    })
  }

  function recordError(questionId: string) {
    setProgress((prev) => {
      if (prev.errorQuestions.includes(questionId)) return prev
      const next = { ...prev, errorQuestions: [...prev.errorQuestions, questionId] }
      saveChineseProgress(next)
      return next
    })
  }

  function removeError(questionId: string) {
    setProgress((prev) => {
      const next = {
        ...prev,
        errorQuestions: prev.errorQuestions.filter((id) => id !== questionId),
      }
      saveChineseProgress(next)
      return next
    })
  }

  return (
    <div className="math-app-shell chinese-app-shell">
      {/* 左側導覽列 */}
      <ChineseSidebar
        activeSection={section}
        onSelectSection={setSection}
        onBackHub={onBackHub}
        onSwitchLang={onSwitchLang}
        xp={progress.xp}
        errorCount={progress.errorQuestions.length}
      />

      {/* 右側主要內容區 */}
      <main className="content chinese-main-content">
        {/* 頂部語言學習方向切換膠囊 */}
        <div className="chinese-lang-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 600 }}>{t('zh.learnDir')}</span>
            <span style={{ fontSize: '0.74rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>
              {t('zh.learnDirValue')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{t('zh.switchOther')}</span>
            <button
              type="button"
              className="pill-btn"
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}
              onClick={() => onSwitchLang('ja')}
            >
              {t('zh.toJa')}
            </button>
            <button
              type="button"
              className="pill-btn"
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}
              onClick={() => onSwitchLang('en')}
            >
              {t('zh.toEn')}
            </button>
          </div>
        </div>

        {section === 'today' && <ChineseToday xp={progress.xp} onNavigate={setSection} />}
        <Suspense fallback={<div className="module-fallback" role="status">{t('common.loadingModule')}</div>}>
          {section === 'pinyin' && <PinyinLab onEarnXp={earnXp} />}
          {section === 'tones-lab' && <ToneListeningLab onEarnXp={earnXp} />}
          {section === 'stroke' && <BopomofoStrokeLab onEarnXp={earnXp} />}
          {section === 'false-friends' && <FalseFriendsLab onEarnXp={earnXp} />}
          {section === 'synonyms' && <SynonymsLab onEarnXp={earnXp} />}
          {section === 'measure-words' && <MeasureWordsLab onEarnXp={earnXp} />}
          {section === 'signals' && <ChineseSignalsView onEarnXp={earnXp} />}
          {section === 'idioms' && <IdiomsLab onEarnXp={earnXp} />}
          {section === 'conversations' && <ChineseConversationLab onEarnXp={earnXp} />}
          {section === 'transit' && <TransitLab onEarnXp={earnXp} />}
          {section === 'housing' && <HousingLab onEarnXp={earnXp} />}
          {section === 'banking' && <BankingLab onEarnXp={earnXp} />}
          {section === 'medical' && <MedicalLab onEarnXp={earnXp} />}
          {section === 'post' && <PostLab onEarnXp={earnXp} />}
          {section === 'railway' && <TravelZhLab onEarnXp={earnXp} />}
          {section === 'food' && <FoodZhLab onEarnXp={earnXp} />}
          {section === 'festivals' && <FestivalZhLab onEarnXp={earnXp} />}
          {section === 'utilities' && <UtilitiesZhLab onEarnXp={earnXp} />}
          {section === 'crafts' && <CraftsZhLab onEarnXp={earnXp} />}
          {section === 'road-trip' && <RoadTripZhLab onEarnXp={earnXp} />}
          {section === 'repair' && <RepairZhLab onEarnXp={earnXp} />}
          {section === 'pet' && <PetZhLab onEarnXp={earnXp} />}
          {section === 'rechao' && <RechaoZhLab onEarnXp={earnXp} />}
          {section === 'convenience-atm' && <ConvenienceAtmZhLab onEarnXp={earnXp} />}
          {section === 'youbike' && <YouBikeZhLab onEarnXp={earnXp} />}
          {section === 'boba' && <BobaZhLab onEarnXp={earnXp} />}
          {section === 'wedding' && <WeddingZhLab onEarnXp={earnXp} />}
          {section === 'lottery' && <LotteryZhLab onEarnXp={earnXp} />}
          {section === 'weiya' && <WeiyaZhLab onEarnXp={earnXp} />}
          {section === 'zhuazhou' && <ZhuazhouZhLab onEarnXp={earnXp} />}
          {section === 'ghost-festival' && <GhostFestivalZhLab onEarnXp={earnXp} />}
          {section === 'tangyuan' && <TangyuanZhLab onEarnXp={earnXp} />}
          {section === 'dragon-boat' && <DragonBoatZhLab onEarnXp={earnXp} />}
          {section === 'mid-autumn' && <MidAutumnZhLab onEarnXp={earnXp} />}
          {section === 'lantern-festival' && <LanternFestivalZhLab onEarnXp={earnXp} />}
          {section === 'qingming-popiah' && <QingmingPopiahZhLab onEarnXp={earnXp} />}
          {section === 'yuelao-love' && <YuelaoLoveZhLab onEarnXp={earnXp} />}
          {section === 'double-ninth' && <DoubleNinthZhLab onEarnXp={earnXp} />}
          {section === 'start-of-winter' && <StartOfWinterZhLab onEarnXp={earnXp} />}
          {section === 'guabao-sishen' && <GuabaoSishenZhLab onEarnXp={earnXp} />}
          {section === 'menu' && <TaiwanMenuLab onEarnXp={earnXp} />}
          {section === 'mock' && <ChineseMockExam onEarnXp={earnXp} onRecordError={recordError} />}
          {section === 'errors' && (
            <ChineseErrorVault
              errorQuestionIds={progress.errorQuestions}
              onRemoveError={removeError}
              onEarnXp={earnXp}
            />
          )}
        </Suspense>
      </main>
    </div>
  )
}
