import type { LangId } from '../utils/storage'

type Props = {
  current: LangId
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

const TRACKS: Array<{ id: LangId; label: string }> = [
  { id: 'ja', label: 'あ 日語' },
  { id: 'en', label: 'TOEIC 英語' },
  { id: 'math', label: '∑ 數學' },
  { id: 'calculus', label: '∫ 微積分' },
  { id: 'physics', label: '⚛ 物理' },
  { id: 'chemistry', label: '🧪 化學' },
]

export function TrackSwitcher({ current, onBackHub, onSwitchLang }: Props) {
  return (
    <div className="sidebar-top-actions">
      <button type="button" className="hub-back" onClick={onBackHub}>
        ← 學習主頁
      </button>
      <label className="sidebar-track-select">
        <span className="sr-only">切換學習軌道</span>
        <select
          aria-label="切換學習軌道"
          value={current}
          onChange={(event) => onSwitchLang(event.target.value as LangId)}
        >
          {TRACKS.map((track) => (
            <option key={track.id} value={track.id}>{track.label}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
