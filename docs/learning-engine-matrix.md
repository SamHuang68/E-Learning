# 八軌學習引擎對照表

本表說明目前**實際接線**，不是產品願景。Hub／軌道 UI 不得把未持久化的估計值說成正式能力鑑定。

| 軌道 | `LearningTrackId` | 間隔複習 | 適性／IRT | 主要檢索練習 | 持久化位置 |
|------|-------------------|----------|-----------|--------------|------------|
| 臺灣數學 | `math` | 破題訊號掌握標記（非 FSRS 排程） | 無正式 CAT；雷達為作答覆蓋 | 題庫、教具、3 秒訊號卡 | `math-learning-progress`、`math_signals_mastery_v1` |
| 微積分 | `calculus` | **FSRS 4.5**（`LearningCoordinator` 作答後寫入） | **2PL IRT θ** 本機估計／顯示（非正式鑑定）；4 階練習目前由使用者手動選題，θ **不**驅動出題順序 | 幾何實驗室、推導步驟、4 階練習題 | 寫入數學進度的 `calculusTheta` / `calculusFsrs` / `calculusResponses` |
| 物理 | `physics` | 破題訊號掌握標記 | 無正式 CAT | 題庫、實驗室、訊號卡 | `physics-learning-progress`、`physics_signals_mastery_v1` |
| 化學 | `chemistry` | 破題訊號掌握標記 | 無正式 CAT | 題庫、實驗室、訊號卡 | `chemistry-learning-progress`、`chemistry_signals_mastery_v1` |
| 計算機概論 | `cs` | 破題訊號掌握標記 | 無正式 CAT | 題庫、Archify 架構圖、實驗室 | `cs-learning-progress`、`cs_signals_mastery_v1` |
| 日語 | `ja` | **SM-2**（`learningMeta.items`，鍵 `ja:…`） | 分級／模考事件；非 FSRS 主路徑 | 五十音、JLPT 卡包、文法訊號 | `aoba-progress`、`aoba-kana-progress`、`e-learning-meta` |
| 多益英語 | `en` | **SM-2**（`learningMeta.items`，鍵 `en:…`） | 證書級距／模考事件；非 FSRS 主路徑 | 語塊、聽力、破題訊號 | `toeic-progress`、`e-learning-meta` |
| 台湾華語 | `zh` | 聲調／偽友／文法訊號掌握清單 | 無正式 CAT | 四聲、對話、情境實驗室 | `chinese_learning_progress_v1` |

## 引擎名實對照

| 名稱 | 實際用途 |
|------|----------|
| SM-2（`src/engine/srs.ts`） | 日語／多益卡包主複習排程；Hub「語文間隔複習」讀的就是這份 `meta.items`。 |
| FSRS 4.5（`src/engine/fsrs.ts`） | `LearningCoordinator.processSubmission` 使用；微積分作答會持久化到數學進度。語文主路徑**尚未**改接 FSRS。 |
| 2PL IRT（`src/engine/adaptive.ts`） | 微積分 4 階練習的本機 θ 估計與顯示。UI 仍從第 1 題起、列出全部題目供手動挑選；**尚未**接上自適應選題。必須標「本機估計／非正式鑑定」。 |
| 檢索練習（retrieval） | 各軌題庫、訊號卡翻轉、實驗室操作。訊號掌握是標記，不是間隔排程。 |
| 雷達圖 | 依本機作答／實驗室次數換算覆蓋度，不是能力測驗。 |

雲端列（登入後）除八軌 JSON 與 `meta` 外，另有 `math_signals` / `physics_signals` / `chemistry_signals` / `cs_signals`。微積分工作台滑桿參數仍為本次工作階段，不含於匯出 JSON。
