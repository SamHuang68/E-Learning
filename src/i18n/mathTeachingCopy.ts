import type { UiLocale } from './locale'

const EN: Record<string, string> = {
  "國小低年級": "Lower elementary",
  "國小中年級": "Middle elementary",
  "國小高年級": "Upper elementary",
  "國中基礎": "Junior high foundation",
  "國中進階": "Junior high intermediate",
  "國中衝刺": "Junior high review",
  "高中必修": "Senior high required",
  "高中選組": "Senior high pathways",
  "高中選修": "Senior high electives",
  "國小一年級": "Grade 1",
  "國小五年級": "Grade 5",
  "國小六年級": "Grade 6",
  "10 以內的數與加減": "Numbers, addition, and subtraction within 10",
  "100 以內的數與二位數加減": "Numbers within 100 and two-digit operations",
  "生活中的時鐘與長度": "Clocks and length in everyday life",
  "100 以內的數、位值、基礎加減法、生活長度比較、整點與半點時鐘。": "Numbers within 100, place value, basic operations, comparing lengths, and clocks at the hour and half hour.",
  "認識數的順序、分與合，以及生活中的加法與減法": "Number order, composing and decomposing numbers, and everyday operations",
  "十進位結構、十位與個位、簡單進位加法與退位減法": "Base ten, tens and ones, and addition and subtraction with regrouping",
  "認識時針與分針、整點與半點、比長短與厚薄": "Hour and minute hands, hours and half hours, comparing length and thickness",
  "1~10 的順序與比大小": "Order and compare numbers from 1 to 10",
  "數的分與合（例如 7 可以分成 3 和 4）": "Compose and decompose numbers (for example, 7 is 3 plus 4)",
  "加法算式：$3 + 4 = 7$": "Addition: $3 + 4 = 7$",
  "減法算式：$8 - 5 = 3$": "Subtraction: $8 - 5 = 3$",
  "十進位積木計數器": "Base-ten blocks",
  "透過拖曳 1 與 10 的積木，理解位值與進退位。": "Drag blocks of 1 and 10 to explore place value and regrouping.",
  "互動時鐘實驗室": "Interactive clock lab",
  "操作時針與分針，認識整點與半點。": "Move the hour and minute hands to explore hours and half hours.",
  "開啟教具 →": "Open lab →",
  "臺灣 K-12 數學練習 · 十二個年級各有教學題，不是完整課綱，也不是會考或學測分數": "Taiwan K-12 math practice: teaching items for 12 grades, not the complete curriculum or a CAP / GSAT score.",
  "進度儲存於本機 · 支援離線學習": "Progress saved locally · offline learning supported",
  "看到條件，先寫第一步": "Recognize the condition and write the first step",
  "這些卡片只把條件對上公式。看過不等於會算。": "These cards connect conditions to formulas. Reading them does not demonstrate solving ability.",
  "國小訊號 (G1~G6)": "Elementary signals (G1-G6)",
  "國中訊號 (G7~G9)": "Junior high signals (G7-G9)",
  "高中訊號 (G10~G12)": "Senior high signals (G10-G12)",
  "🔍 看到題目訊號：": "🔍 Problem cue:",
  "口訣：": "Rule of thumb:",
  "破題第一步算式：": "First-step formula:",
  "查看例題": "Show example",
  "題目：": "Problem:",
  "怎麼想：": "Reasoning:"
}

export function mathTeachingCopy(locale: UiLocale, text: string): string {
  return locale === 'en' ? EN[text] ?? text : text
}
