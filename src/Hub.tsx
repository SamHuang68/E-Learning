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
      <nav className="hub-portal-bar" aria-label="全域專案入口導覽">
        <a
          href="https://samhuang68.github.io/"
          className="portal-brand-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="portal-monogram">SH</span>
          <span className="portal-title-text">
            <strong>Sam Huang</strong> · PROJECT PORTAL ↗
          </span>
        </a>
        <div className="portal-links-right">
          <a
            href="https://github.com/SamHuang68/E-Learning"
            className="portal-sublink"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repo ↗
          </a>
        </div>
      </nav>

      <header className="hub-hero">
        <p className="eyebrow">E-LEARNING HUB</p>
        <h1>選擇學習軌道</h1>
        <p className="lede">
          同一個學習系統，三大專業軌道。臺灣 108 課綱數學（國小／國中／高中）、日語 JLPT 與多益英語；未登入可本機試用，登入後進度各自雲端同步。
        </p>
      </header>

      <AuthPanel />

      <div className="hub-grid">
        <button
          type="button"
          className="hub-card math"
          onClick={() => onChoose('math')}
        >
          <div className="hub-card-mark math-mark">∑</div>
          <p className="eyebrow">TAIWAN · 108 CURRICULUM</p>
          <h2>臺灣數學 (K-12)</h2>
          <p>
            依據臺灣 108 課綱打造：國小 1~6 年級、國中三年、高中三年全學段。含 KaTeX 算式、互動幾何實驗室與會考／學測模考。
          </p>
          <ul>
            <li>國小 G1~G6：數與量、分數圓盤、幾何積木</li>
            <li>國中 G7~G9：代數坐標、畢氏定理、國中會考 (CAP)</li>
            <li>高中 G10~G12：數A/數B、微積分、大學學測 (GSAT)</li>
            <li>互動教具：7 大動態幾何與函數實驗室</li>
          </ul>
          <b>開始數學學習 →</b>
        </button>

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
        <a
          href="https://samhuang68.github.io/"
          className="hub-link portal-footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          🏛️ Sam Huang 專案總入口 ↗
        </a>
        <button type="button" className="hub-link" onClick={onOpenPrivacy}>
          隱私與資料說明
        </button>
        <span>MIT License · Sam Huang</span>
      </footer>
    </div>
  )
}
