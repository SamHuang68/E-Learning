import { AuthPanel } from './auth/AuthPanel'
import { DataControls } from './components/DataControls'
import type { LangId } from './utils/storage'

type Props = {
  onChoose: (lang: LangId) => void
  onOpenPrivacy: () => void
}

export function Hub({ onChoose, onOpenPrivacy }: Props) {
  return (
    <div className="hub">
      <header className="hub-hero">
        <p className="eyebrow">E-LEARNING HUB</p>
        <h1>選擇學習語言</h1>
        <p className="lede">
          同一個學習殼，兩條語言軌道。選日語走 JLPT 級距，選英語走多益證書色帶；未登入可本機試用，登入後進度各自雲端同步。
        </p>
      </header>

      <AuthPanel />

      <div className="hub-grid">
        <button
          type="button"
          className="hub-card jp"
          onClick={() => onChoose('ja')}
        >
          <div className="hub-card-mark">あ</div>
          <p className="eyebrow">JAPANESE</p>
          <h2>日本語</h2>
          <p>
            JLPT 級距（N5/N4 基礎 → N3 中級 → N2/N1 進階）。
            另保留五十音平／片假名，補足非學校必修的起步缺口。
          </p>
          <ul>
            <li>N5 / N4：生活詞彙與短句</li>
            <li>N3：稍複雜文章與常速對話</li>
            <li>N2 / N1：求職／留學門檻</li>
            <li>五十音：語音點讀＋聽辨</li>
          </ul>
          <b>開始日語學習 →</b>
        </button>

        <button
          type="button"
          className="hub-card en"
          onClick={() => onChoose('en')}
        >
          <div className="hub-card-mark toeic">T</div>
          <p className="eyebrow">ENGLISH · TOEIC</p>
          <h2>English</h2>
          <p>
            多益四色證書（橘／綠／藍／金）對照分數帶與職場門檻，循序往上衝分。
          </p>
          <ul>
            <li>金色 860–990：會議主持與協商</li>
            <li>藍色 730–855：外商／外派門檻</li>
            <li>綠色 470–725：畢業／本土企業</li>
            <li>橘棕 10–465：基礎字彙起步</li>
          </ul>
          <b>開始英語學習 →</b>
        </button>
      </div>

      <DataControls />

      <footer className="hub-footer">
        <button type="button" className="hub-link" onClick={onOpenPrivacy}>
          隱私與資料說明
        </button>
        <span>MIT License</span>
      </footer>
    </div>
  )
}
