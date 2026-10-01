import type { UiLocale } from './locale'

export const STEM_VAULT_EN: Readonly<Record<string, string>> = {
  "化學進階複習題目 ({id})": "Advanced chemistry review question ({id})",
  "物理進階複習題目 ({id})": "Advanced physics review question ({id})",
  "本題為歷次練習之重點錯題，請檢視化學反應式與計量推導並前往實驗室重溫觀念。": "This item was missed in earlier practice. Review chemical equations and stoichiometric reasoning, then revisit the concepts in the lab.",
  "請回顧化學反應式配平、莫耳數計量守恆與平衡常數定義進行推導。": "Review balanced chemical equations, mole conservation and stoichiometry, and equilibrium-constant definitions to work through the solution.",
  "本題為歷次練習之重點錯題，請檢視推導公式並前往實驗室重溫觀念。": "This item was missed in earlier practice. Review the formula derivation and revisit the concepts in the lab.",
  "請回顧牛頓運動定律、能量守恆與電磁基本關係式進行推導。": "Review Newton's laws, energy conservation, and fundamental electromagnetic relationships to work through the solution.",
  "【破題特徵】": "Problem cues: ",
  "鎖定本題化學主軸【{strand}】，精確分析化學反應平衡與物質莫耳關係。": "Focus on the chemistry strand [{strand}]. Analyze reaction equilibrium and the mole relationships between substances.",
  "鎖定本題物理主軸【{strand}】，釐清已知物理量與待求未知量之函數關係。": "Focus on the physics strand [{strand}]. Identify the relationships between known quantities and the unknowns.",
  "⚠️ 常見盲區：": "⚠️ Common pitfalls: ",
  "注意限量試劑判斷（需莫耳數除以係數）、沉澱溶解度例外規則、酸鹼中和當量係數以及有效數字。": "Check the limiting reagent (divide moles by stoichiometric coefficients), exceptions to solubility rules, acid-base neutralization equivalents, and significant figures.",
  "列出平衡化學方程式與計量關係（如 $n = \\frac{W}{M} = C_M \\times V$, $PV = nRT$, $K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$）。": "Write balanced chemical equations and quantitative relationships, such as $n = \\frac{W}{M} = C_M \\times V$, $PV = nRT$, and $K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$.",
  "依據物理定律列出方程式（如 $F = ma$, $E_k = \\frac{1}{2}mv^2$, $n_1\\sin\\theta_1 = n_2\\sin\\theta_2$, $V = IR$）。": "Write equations using physical laws, such as $F = ma$, $E_k = \\frac{1}{2}mv^2$, $n_1\\sin\\theta_1 = n_2\\sin\\theta_2$, and $V = IR$.",
  "⚠️ 常見盲區：注意 SI 單位制換算（如 $\\text{cm} \\rightarrow \\text{m}$、$\\text{gw} \\rightarrow \\text{N}$），向量方向性正負號，以及能量守恆中的散熱損失。": "⚠️ Common pitfalls: Check SI unit conversions (such as $\\text{cm} \\rightarrow \\text{m}$ and $\\text{gw} \\rightarrow \\text{N}$), signs for vector directions, and heat loss in energy-conservation calculations.",
  "必修": "Required",
  "國中必修": "Junior high required",
  "選修": "Elective",
  "📐 畢氏勾股定理教具": "📐 Pythagorean theorem lab",
  "📐 關鍵反應方程式與定量公式 (Chemical Formulas)": "📐 Key reaction equations and quantitative formulas",
  "✓ 正確": "✓ Correct",
  "💡 正確解析與化學步驟推導": "💡 Solution and chemical reasoning",
  "📐 關鍵化學方程式與定理 (Formula Formulation)": "📐 Key chemical equations and principles",
  "🔍 步驟推導與化學計量 (Step-by-Step Derivation)": "🔍 Derivation and stoichiometry",
  "💡 易錯盲點與概念辨析 (Pitfall Warnings)": "💡 Common pitfalls and conceptual distinctions",
  "⚠️ 考點提示：": "⚠️ Problem cue:",
  "💡 觀念仍不清楚？透過動態化學教具模擬驗證：": "💡 Explore the concept in an interactive chemistry lab:",
  "司乃耳折射與透鏡光學實驗室": "Snell's law and lenses lab",
  "直流電路歐姆定律實驗室": "DC circuits and Ohm's law lab",
  "阿基米德浮力與密度實驗室": "Buoyancy and density lab",
  "酸鹼滴定與 pH 曲線實驗室": "Acid-base titration and pH curves lab",
  "元素週期表探測器": "Periodic table explorer",
  "VSEPR 分子空間幾何實驗室": "VSEPR molecular geometry lab",
  "理想氣體定律 PV=nRT 實驗室": "Ideal gas law lab (PV=nRT)",
  "溶解度與結晶析出實驗室": "Solubility and crystallization lab",
  "力學 (運動、平衡、流體與能量)": "Mechanics (motion, equilibrium, fluids, and energy)",
  "熱學 (溫度、熱量與分子動力論)": "Thermodynamics (temperature, heat, and kinetic theory)",
  "波動與光學 (聲、光現象與物理光學)": "Waves and optics (sound, light, and physical optics)",
  "電磁學 (電路、電場、磁場與電磁感應)": "Electromagnetism (circuits, fields, and induction)",
  "近代物理 (微觀世界、量子現象與原子結構)": "Modern physics (quantum phenomena and atomic structure)",
  "⚙️ 力學運動與能量": "⚙️ Mechanics and energy",
  "🔥 熱學與分子動力": "🔥 Heat and kinetic theory",
  "🌈 波動與幾何光學": "🌈 Waves and geometrical optics",
  "⚡ 電磁學與電路": "⚡ Electromagnetism and circuits",
  "⚛️ 近代物理與原子": "⚛️ Modern physics and atoms",
  "物理綜合強化題庫": "Physics review bank",
  "化學綜合強化題庫": "Chemistry review bank",
  "力學 (綜合強化)": "Mechanics (review)",
  "📏 畢氏定理教具": "📏 Pythagorean theorem lab",
  "待強化錯題總數": "Items to review",
  "可直通實驗室": "Related labs",
  "目前篩選顯示": "Filtered items",
  "5 大動態模擬": "5 interactive simulations",
  "錯題來源篩選": "Filter by source",
  "錯題難度篩選": "Filter by difficulty",
  "全部來源 (單元練習 + 模擬考)": "All sources (units and mock exams)",
  "僅單元練習題目": "Unit practice only",
  "僅大考模擬試卷": "Mock exams only",
  "全難度星級": "All difficulties",
  "★ 難度 1 (基礎題)": "★ Level 1 (foundation)",
  "★★ 難度 2 (會考標準)": "★★ Level 2 (CAP standard)",
  "★★★ 難度 3 (學測素養)": "★★★ Level 3 (GSAT literacy)",
  "★★★★ 難度 4 (分科進階)": "★★★★ Level 4 (AST advanced)",
  "★★★★★ 難度 5 (競賽挑戰)": "★★★★★ Level 5 (competition)",
  "🔼 全部收起步驟": "🔼 Collapse all steps",
  "📖 全部展開步驟": "📖 Expand all steps",
  "📑 匯出 Anki 牌組": "📑 Export Anki deck",
  "移出錯題筆記本": "Remove from error notebook",
  "✓ 我已掌握 (移出)": "✓ Mastered (remove)",
  "💡 正確解析與公式推導": "💡 Solution and formula derivation",
  "🔼 收起深度拆解": "🔼 Collapse detailed steps",
  "📖 展開 5 步深度拆解與盲點診斷 ▾": "📖 Expand detailed steps and pitfalls ▾",
  "🎯 審題與 3 秒破題訊號 (Diagnosis)": "🎯 Read the problem and identify its cues",
  "📐 關鍵公式與物理定律 (Formula Formulation)": "📐 Key formulas and physical laws",
  "🔍 步驟推導與數值求解 (Step-by-Step Derivation)": "🔍 Derivation and numerical solution",
  "💡 易錯盲點與常犯陷阱 (Pitfall Warnings)": "💡 Common pitfalls",
  "⚠️ 考點警示：": "⚠️ Problem cue:",
  "📝 108 課綱核心素養指引 (Competency)": "📝 Taiwan curriculum competency guidance",
  "💡 觀念仍不清楚？透過動態畫布模擬驗證：": "💡 Explore the concept in an interactive simulation:",
  "全部主軸": "All strands",
  "【破題訊號】": "Problem cue: ",
  "搜尋物理錯題": "Search physics errors",
  "🔍 搜尋錯題關鍵字、公式或考點...": "🔍 Search keywords, formulas, or topics...",
  "搜尋化學錯題": "Search chemistry errors",
  "🔍 搜尋化學錯題關鍵字、反應式或考點...": "🔍 Search keywords, reactions, or topics...",
  "太棒了！物理錯題本目前空空如也": "Your physics error notebook is empty!",
  "太棒了！化學錯題本目前空空如也": "Your chemistry error notebook is empty!",
  "你在單元基礎練習與大考模擬試卷中答錯的物理考題都會自動歸納在此。隨時歡迎透過模擬考或單元練習挑戰自我！": "Missed physics items from unit practice and mock exams appear here. Try another unit or mock exam.",
  "你在單元基礎練習與大考模擬試卷中答錯的化學考題都會自動歸納在此。隨時歡迎透過模擬考或單元練習挑戰自我！": "Missed chemistry items from unit practice and mock exams appear here. Try another unit or mock exam.",
  "沒有符合當前篩選條件的錯題項目。": "No errors match these filters.",
  "沒有符合當前篩選條件的化學錯題項目。": "No chemistry errors match these filters.",
  "一鍵匯出當前篩選錯題至 Anki 記憶牌組": "Export filtered errors to an Anki deck",
  "一鍵匯出當前篩選化學錯題至 Anki 記憶牌組": "Export filtered chemistry errors to an Anki deck",
  "國中基礎": "Junior high foundation",
  "國中進階": "Junior high intermediate",
  "國中衝刺": "Junior high review",
  "高中必修": "Senior high required",
  "高中選修": "Senior high electives",
  "斜向拋體運動實驗室": "Projectile motion lab",
  "簡諧運動與單擺實驗室": "Simple harmonic motion and pendulum lab",
  "波動與光學實驗室": "Waves and optics lab",
  "電路與電磁感應實驗室": "Circuits and electromagnetic induction lab",
  "氣體分子動力論實驗室": "Gas kinetic theory lab",
  "🧮 勾股定理教具": "🧮 Pythagorean theorem lab",
  "📐 勾股定理教具": "📐 Pythagorean theorem lab",
  "🔴 三角函數單位圓教具": "🔴 Trigonometric unit circle",
  "📊 平面坐標系幾何板": "📊 Coordinate geometry board",
  "🍰 分數概念可視化板": "🍰 Fraction visualization board",
  "🔢 九九乘法陣列盤": "🔢 Multiplication array"
}

let contentCopy: Readonly<Record<string, string>> = {}
let contentCopyPromise: Promise<Readonly<Record<string, string>>> | undefined

export function loadStemVaultContentCopy() {
  return contentCopyPromise ??= import('./stemVaultContentEn').then(({ STEM_VAULT_CONTENT_EN }) => {
    contentCopy = STEM_VAULT_CONTENT_EN
    return contentCopy
  })
}

export function stemVaultCopy(locale: UiLocale, text: string, vars?: Record<string, string | number>): string {
  let translated = text
  if (locale === 'en') {
    if (Object.hasOwn(STEM_VAULT_EN, text)) translated = STEM_VAULT_EN[text]
    else if (Object.hasOwn(contentCopy, text)) translated = contentCopy[text]
    else throw new Error('缺少錯題庫英文介面翻譯：' + text)
  }
  if (vars) translated = translated.replace(/\{(\w+)\}/g, (_match, key: string) => {
    if (!Object.hasOwn(vars, key)) throw new Error('缺少錯題庫插值：' + key)
    return String(vars[key])
  })
  if (locale === 'en' && (!translated.trim() || /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/.test(translated))) {
    throw new Error('錯題庫英文翻譯無效：' + text)
  }
  return translated
}

/** 只建立顯示用副本，原始題目仍用於解題訊號與實驗室關鍵字比對。 */
export function localizeStemVaultQuestion<T extends {
  id: string; title: string; question: string; solution: string
  options?: string[]; hint?: string; competency?: string
}>(locale: UiLocale, question: T): T {
  return {
    ...question,
    title: stemVaultCopy(locale, question.title, { id: question.id }),
    question: stemVaultCopy(locale, question.question),
    solution: stemVaultCopy(locale, question.solution),
    ...(question.options && { options: question.options.map(text => stemVaultCopy(locale, text)) }),
    ...(question.hint && { hint: stemVaultCopy(locale, question.hint) }),
    ...(question.competency && { competency: stemVaultCopy(locale, question.competency) }),
  }
}
