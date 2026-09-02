import React, { useState } from 'react'
import { ChineseSidebar, type ChineseNavSection } from './components/ChineseSidebar'
import { PinyinLab } from './components/PinyinLab'
import { FalseFriendsLab } from './components/FalseFriendsLab'
import { ChineseSignalsView } from './components/ChineseSignalsView'
import { ChineseConversationLab } from './components/ChineseConversationLab'
import { ChineseToday } from './components/ChineseToday'
import { TaiwanMenuLab } from './components/TaiwanMenuLab'
import { BopomofoStrokeLab } from './components/BopomofoStrokeLab'
import { ToneListeningLab } from './components/ToneListeningLab'
import { IdiomsLab } from './components/IdiomsLab'
import { SynonymsLab } from './components/SynonymsLab'
import { MeasureWordsLab } from './components/MeasureWordsLab'
import { TransitLab } from './components/TransitLab'
import { HousingLab } from './components/HousingLab'
import { BankingLab } from './components/BankingLab'
import { MedicalLab } from './components/MedicalLab'
import { PostLab } from './components/PostLab'
import { TravelZhLab } from './components/TravelZhLab'
import { FoodZhLab } from './components/FoodZhLab'
import { UtilitiesZhLab } from './components/UtilitiesZhLab'
import { FestivalZhLab } from './components/FestivalZhLab'
import { CraftsZhLab } from './components/CraftsZhLab'
import { RoadTripZhLab } from './components/RoadTripZhLab'
import { RepairZhLab } from './components/RepairZhLab'
import { PetZhLab } from './components/PetZhLab'
import { RechaoZhLab } from './components/RechaoZhLab'
import { ChineseMockExam } from './components/ChineseMockExam'
import { ChineseErrorVault } from './components/ChineseErrorVault'
import { loadChineseProgress, saveChineseProgress } from './utils/chineseStorage'
import type { LangId } from '../utils/storage'

interface Props {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

export const ChineseApp: React.FC<Props> = ({ onBackHub, onSwitchLang }) => {
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
    <div className="math-app-shell chinese-app-shell" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 左側導覽列 */}
      <ChineseSidebar
        activeSection={section}
        onSelectSection={setSection}
        onBackHub={onBackHub}
        xp={progress.xp}
        errorCount={progress.errorQuestions.length}
      />

      {/* 右側主要內容區：嚴格 100vh 內部平滑滾動，零外捲 */}
      <main
        className="content chinese-main-content"
        style={{
          flex: 1,
          height: '100vh',
          overflowY: 'auto',
          padding: '1.2rem 1.5rem',
          minWidth: 0,
          background: 'var(--bg)',
        }}
      >
        {/* 頂部語言學習方向切換膠囊 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            paddingBottom: '0.6rem',
            borderBottom: '1px solid var(--line)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 600 }}>🌐 語言學習方向：</span>
            <span style={{ fontSize: '0.74rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>
              🇯🇵 日本語 ➜ 🇹🇼 台湾華語・繁體中文
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>切換其他語言：</span>
            <button
              type="button"
              className="pill-btn"
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}
              onClick={() => onSwitchLang('ja')}
            >
              あおば日語
            </button>
            <button
              type="button"
              className="pill-btn"
              style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}
              onClick={() => onSwitchLang('en')}
            >
              TOEIC 英語
            </button>
          </div>
        </div>

        {/* 根據 section 渲染不同模組 */}
        {section === 'today' && <ChineseToday xp={progress.xp} onNavigate={setSection} />}
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
        {section === 'utilities' && <UtilitiesZhLab onEarnXp={earnXp} />}
        {section === 'festivals' && <FestivalZhLab onEarnXp={earnXp} />}
        {section === 'crafts' && <CraftsZhLab onEarnXp={earnXp} />}
        {section === 'road-trip' && <RoadTripZhLab onEarnXp={earnXp} />}
        {section === 'repair' && <RepairZhLab onEarnXp={earnXp} />}
        {section === 'pet' && <PetZhLab onEarnXp={earnXp} />}
        {section === 'rechao' && <RechaoZhLab onEarnXp={earnXp} />}
        {section === 'menu' && <TaiwanMenuLab onEarnXp={earnXp} />}
        {section === 'mock' && <ChineseMockExam onEarnXp={earnXp} onRecordError={recordError} />}
        {section === 'errors' && (
          <ChineseErrorVault
            errorQuestionIds={progress.errorQuestions}
            onRemoveError={removeError}
            onEarnXp={earnXp}
          />
        )}
      </main>
    </div>
  )
}
