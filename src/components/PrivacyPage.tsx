type Props = {
  onBack: () => void
}

export function PrivacyPage({ onBack }: Props) {
  return (
    <main className="privacy-page">
      <button type="button" className="hub-back privacy-back" onClick={onBack}>
        ← 回 Hub
      </button>
      <header className="hub-hero">
        <p className="eyebrow">PRIVACY</p>
        <h1>隱私與資料說明</h1>
        <p className="lede">
          本站為靜態前端（GitHub Pages）＋可選的 Supabase 帳號同步。以下說明我們存什麼、不存什麼。
        </p>
      </header>

      <section className="privacy-block">
        <h2>本機快取（localStorage）</h2>
        <p>
          未登入時，學習進度只存在你的瀏覽器。登入後仍會以本機作為快取，並與雲端同步。
        </p>
        <ul>
          <li>日語 JLPT、五十音、多益、數學、物理、化學的進度、錯題、實驗與模擬考紀錄</li>
          <li>學習事件摘要、連續學習、上次選擇軌道，以及各科 3 秒破題訊號卡狀態</li>
          <li>無障礙顯示與音效偏好（只留在本機，不包含於進度 JSON）</li>
          <li>使用本機帳號時：Email、本機 session、帳號識別碼、密碼驗證值與該帳號的進度列；請勿重複使用真實帳號密碼</li>
          <li>課程設計器預設組（僅本機，不上雲）</li>
          <li>你自行貼上的 Groq API 金鑰（僅本機，不上雲、不匯出）</li>
        </ul>
      </section>

      <section className="privacy-block">
        <h2>雲端進度（登入後）</h2>
        <p>
          若已設定 Supabase，登入帳號後會在資料庫保存你的學習進度列（RLS：僅本人可讀寫）。
        </p>
        <ul>
          <li>欄位：aoba / kana / toeic / math / physics / chemistry（JSON）、lang、meta、updated_at</li>
          <li>首次登入：若雲端尚無資料，會上傳目前本機進度；若已有資料，以雲端為準</li>
        </ul>
      </section>

      <section className="privacy-block">
        <h2>不會上傳的內容</h2>
        <ul>
          <li>Groq API key（BYOK，只留在本機）</li>
          <li>課程設計器 presets（可能含個人提示詞）</li>
          <li>無障礙與音效偏好、本機帳號密碼驗證資料</li>
        </ul>
      </section>

      <section className="privacy-block">
        <h2>第三方</h2>
        <ul>
          <li>Google Fonts：載入網頁字型時可能向 Google 發出請求</li>
          <li>Supabase：帳號驗證與進度儲存（僅在設定並登入時）</li>
          <li>Groq：僅在你於課程設計器貼上金鑰並產生內容時，由瀏覽器直接呼叫</li>
        </ul>
      </section>

      <section className="privacy-block">
        <h2>你的控制</h2>
        <p>
          在 Hub 可匯出／匯入八軌進度 JSON、清除全部學習進度；這不會刪除本機帳號、顯示／音效偏好、API 金鑰或課程設計器 presets。登入使用者可重設帳號進度；本機帳號也可從帳號卡永久刪除。
        </p>
      </section>
      <section className="privacy-block">
        <h2>開發者與專案授權</h2>
        <p>
          本 E-Learning 平台為 Sam Huang 開發之開源教育科技專案（MIT License）。源碼庫請訪問：
        </p>
        <p>
          👉 <a href="https://github.com/SamHuang68/E-Learning" target="_blank" rel="noopener noreferrer"><strong>GitHub 專案開源庫 (SamHuang68/E-Learning) ↗</strong></a>
        </p>
      </section>
    </main>
  )
}
