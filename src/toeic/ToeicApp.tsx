import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import {
  loadToeicProgress,
  saveToeicProgress,
  type LangId,
  type ToeicProgress,
} from '../utils/storage'
import { toeicCertificates } from './data/certificates'
import { PhonicsLab } from './components/PhonicsLab'
import { ToeicBuilder } from './components/ToeicBuilder'
import { ToeicPractice } from './components/ToeicPractice'
import { ToeicSidebar, type ToeicNavId } from './components/ToeicSidebar'
import { ToeicToday } from './components/ToeicToday'

type Props = {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

export function ToeicApp({ onBackHub, onSwitchLang }: Props) {
  const { user, syncStatus } = useAuth()
  const [nav, setNav] = useState<ToeicNavId>('today')
  const [progress, setProgress] = useState<ToeicProgress>(() => loadToeicProgress())
  const [practice, setPractice] = useState<
    'vocab' | 'listening' | 'grammar' | null
  >(null)

  const cert =
    toeicCertificates.find((c) => c.id === progress.certificateId) ??
    toeicCertificates[0]
  const unit = cert.units.find((u) => u.id === progress.unitId) ?? cert.units[0]

  const progressPct = useMemo(() => {
    const v = (progress.vocabDone / unit.words) * 100
    const l = (progress.listeningDone / unit.listening) * 100
    const g = progress.grammarStarted ? 40 : 0
    return Math.round((v + l + g) / 3)
  }, [progress, unit])

  useEffect(() => {
    saveToeicProgress(progress)
  }, [progress])

  useEffect(() => {
    const onHydrated = () => setProgress(loadToeicProgress())
    window.addEventListener('e-learning:progress-hydrated', onHydrated)
    return () =>
      window.removeEventListener('e-learning:progress-hydrated', onHydrated)
  }, [])

  function patch(p: Partial<ToeicProgress>) {
    setProgress((prev) => ({ ...prev, ...p }))
  }

  function handleNav(id: ToeicNavId) {
    setPractice(null)
    setNav(id)
  }

  const title = practice
    ? practice === 'vocab'
      ? '單字練習'
      : practice === 'listening'
        ? '聽力練習'
        : '文法教室'
    : nav === 'phonics'
      ? '發音基礎'
      : nav === 'builder'
        ? '課程設計器'
        : nav === 'vocab'
          ? '單字練習'
          : nav === 'listening'
            ? '聽力練習'
            : nav === 'grammar'
              ? '文法教室'
              : '今日學習'

  function renderContent() {
    if (practice) {
      return (
        <ToeicPractice
          kind={practice}
          certificateId={progress.certificateId}
          unit={unit}
          onBack={() => {
            setPractice(null)
            setNav('today')
          }}
          onProgress={() => {
            if (practice === 'vocab') {
              patch({
                vocabDone: Math.min(unit.words, progress.vocabDone + 1),
                xp: progress.xp + 5,
              })
            } else if (practice === 'listening') {
              patch({
                listeningDone: Math.min(
                  unit.listening,
                  progress.listeningDone + 1,
                ),
                xp: progress.xp + 8,
              })
            } else {
              patch({ grammarStarted: true, xp: progress.xp + 10 })
            }
          }}
        />
      )
    }
    if (nav === 'phonics') {
      return (
        <PhonicsLab
          mastered={progress.phonicsMastered}
          onMaster={(id) => {
            if (progress.phonicsMastered.includes(id)) return
            patch({ phonicsMastered: [...progress.phonicsMastered, id] })
          }}
          onXp={(n) => patch({ xp: progress.xp + n })}
        />
      )
    }
    if (nav === 'builder') return <ToeicBuilder />
    if (nav === 'vocab' || nav === 'listening' || nav === 'grammar') {
      const kind =
        nav === 'vocab' ? 'vocab' : nav === 'listening' ? 'listening' : 'grammar'
      return (
        <ToeicPractice
          kind={kind}
          certificateId={progress.certificateId}
          unit={unit}
          onBack={() => setNav('today')}
          onProgress={() => {
            if (kind === 'vocab') {
              patch({
                vocabDone: Math.min(unit.words, progress.vocabDone + 1),
                xp: progress.xp + 5,
              })
            } else if (kind === 'listening') {
              patch({
                listeningDone: Math.min(
                  unit.listening,
                  progress.listeningDone + 1,
                ),
                xp: progress.xp + 8,
              })
            } else {
              patch({ grammarStarted: true, xp: progress.xp + 10 })
            }
          }}
        />
      )
    }

    return (
      <ToeicToday
        cert={cert}
        unit={unit}
        progress={progress}
        onOpenPhonics={() => setNav('phonics')}
        onOpenBuilder={() => setNav('builder')}
        onStartVocab={() => setPractice('vocab')}
        onStartListening={() => setPractice('listening')}
        onStartGrammar={() => setPractice('grammar')}
        onSelectUnit={(id) =>
          patch({
            unitId: id,
            vocabDone: 0,
            listeningDone: 0,
            grammarStarted: false,
          })
        }
      />
    )
  }

  return (
    <main className="app-shell toeic-shell">
      <ToeicSidebar
        nav={practice ? 'today' : nav}
        onNav={handleNav}
        cert={cert}
        unit={unit}
        progressPct={progressPct}
        phonicsCount={progress.phonicsMastered.length}
        onBackHub={onBackHub}
        onSwitchLang={onSwitchLang}
      />

      <section className="content">
        <div className="mobile-brand">
          <div className="brand-mark">T</div>
          <strong>TOEIC Path</strong>
        </div>

        <header className="topbar">
          <div>
            <p className="eyebrow">
              TOEIC · {cert.nameEn.toUpperCase()}
            </p>
            <h1>{title}</h1>
          </div>
          <div className="header-actions">
            <label className="unit-select">
              <span>證書級距</span>
              <select
                value={progress.certificateId}
                onChange={(e) =>
                  patch({
                    certificateId: e.target
                      .value as ToeicProgress['certificateId'],
                    unitId: 1,
                    vocabDone: 0,
                    listeningDone: 0,
                    grammarStarted: false,
                  })
                }
              >
                {toeicCertificates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}（{c.scoreMin}–{c.scoreMax}）
                  </option>
                ))}
              </select>
            </label>
            <label className="unit-select">
              <span>單元</span>
              <select
                value={progress.unitId}
                onChange={(e) =>
                  patch({
                    unitId: Number(e.target.value),
                    vocabDone: 0,
                    listeningDone: 0,
                    grammarStarted: false,
                  })
                }
              >
                {cert.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    Unit {u.id} · {u.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="xp">
              <span>★</span>
              <strong>{progress.xp} XP</strong>
            </div>
          </div>
        </header>

        <div className="alignment-note">
          <strong>
            {cert.name} · {cert.scoreMin}–{cert.scoreMax}
          </strong>
          <span>{cert.audience}</span>
        </div>

        {renderContent()}

        <footer>
          <span>
            最上層以多益四色證書分數級距分級；橘／棕級含字母與高頻字語音導讀。
          </span>
          <span>
            {user
              ? syncStatus === 'synced'
                ? 'Progress synced to cloud'
                : syncStatus === 'syncing'
                  ? 'Syncing…'
                  : syncStatus === 'error'
                    ? 'Cloud sync failed (local still works)'
                    : 'Signed in · local cache'
              : 'Guest · progress saved on this device'}
          </span>
        </footer>
      </section>
    </main>
  )
}
