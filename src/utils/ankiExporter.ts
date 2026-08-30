/**
 * Anki / CSV 題庫匯出模組 (AnkiExporter)
 * 支援將各模組之單字、商務語塊、日語文法動作訊號、數學破題卡與錯題本一鍵匯出為標準 CSV / Anki 匯入格式。
 */

import { TOEIC_CHUNK_WEEKS } from '../toeic/data/chunks'
import { JAPANESE_SIGNAL_GROUPS } from '../aoba/data/grammarSignals'
import { MATH_SOLVING_SIGNALS } from '../math/data/solvingSignals'

export type AnkiCard = {
  front: string
  back: string
  tags: string
}

/**
 * 將卡片陣列轉換為標準 RFC4180 CSV 字串（相容 Anki 匯入格式）
 */
export function exportToAnkiCsv(cards: AnkiCard[]): string {
  const header = '#separator:Comma\n#html:true\n#tags column:3\nFront,Back,Tags\n'
  const rows = cards.map((c) => {
    const safeFront = `"${c.front.replace(/"/g, '""')}"`
    const safeBack = `"${c.back.replace(/"/g, '""')}"`
    const safeTags = `"${c.tags.replace(/"/g, '""')}"`
    return `${safeFront},${safeBack},${safeTags}`
  })
  return header + rows.join('\n')
}

/**
 * 觸發瀏覽器下載 CSV 檔案
 */
export function triggerCsvDownload(filename: string, csvContent: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 匯出 TOEIC 商務語塊 Anki Deck
 */
export function exportToeicChunksToAnki(): void {
  const cards: AnkiCard[] = []
  TOEIC_CHUNK_WEEKS.forEach((week) => {
    week.chunks.forEach((chunk) => {
      const front = `
        <div style="font-size: 20px; font-weight: bold; color: #1e3a8a;">${chunk.chunk}</div>
        <div style="font-size: 14px; color: #475569; margin-top: 4px;">重音提示：<b>${chunk.rhythmHint.stress}</b></div>
        <div style="font-size: 13px; color: #64748b;">${chunk.rhythmHint.note}</div>
      `.trim()

      const back = `
        <div style="font-size: 18px; font-weight: bold; color: #047857;">${chunk.meaningZh}</div>
        <div style="margin: 8px 0; padding: 6px; background: #f8fafc; border-left: 3px solid #3b82f6;">
          🎯 <b>動作訊號：</b>${chunk.actionSignal}
        </div>
        <div style="font-size: 13px; color: #334155;"><b>例句：</b>${chunk.examples[0].en}<br/><i>${chunk.examples[0].zh}</i></div>
        <div style="font-size: 12px; color: #dc2626; margin-top: 6px;">⚠ <b>避坑：</b>${chunk.pitfall.reason}</div>
      `.trim()

      cards.push({
        front,
        back,
        tags: `TOEIC Business_Chunks Week_${week.weekId} ${week.certificateBand}`,
      })
    })
  })

  const csv = exportToAnkiCsv(cards)
  triggerCsvDownload(`TOEIC_Business_Chunks_Anki_${new Date().toISOString().slice(0, 10)}.csv`, csv)
}

/**
 * 匯出日語文法動作訊號 Anki Deck
 */
export function exportJapaneseSignalsToAnki(): void {
  const cards: AnkiCard[] = []
  JAPANESE_SIGNAL_GROUPS.forEach((grp) => {
    grp.signals.forEach((sig) => {
      const front = `
        <div style="font-size: 20px; font-weight: bold; color: #7c2d12;">${sig.pattern}</div>
        <div style="font-size: 14px; color: #9a3412;">分類：${sig.category}</div>
        <div style="margin-top: 6px; font-size: 14px;">🔍 <b>情境訊號：</b>${sig.signalTrigger}</div>
      `.trim()

      const back = `
        <div style="font-size: 18px; font-weight: bold; color: #047857;">${sig.meaningZh}</div>
        <div style="margin: 6px 0; padding: 6px; background: #fffbeb; border-left: 3px solid #d97706;">
          💡 <b>3秒判斷口訣：</b>${sig.threeSecondRule}
        </div>
        <div style="font-size: 13px;"><b>接續公式：</b><code>${sig.formula}</code></div>
        <div style="font-size: 13px; margin-top: 4px;"><b>例句：</b>${sig.contrastExample.ja} (${sig.contrastExample.zh})</div>
        <div style="font-size: 12px; color: #dc2626; margin-top: 4px;">⚠ <b>避坑：</b>${sig.pitfall.wrong} - ${sig.pitfall.reason}</div>
      `.trim()

      cards.push({
        front,
        back,
        tags: `Aoba Japanese_Grammar_Signals ${grp.id}`,
      })
    })
  })

  const csv = exportToAnkiCsv(cards)
  triggerCsvDownload(`Aoba_Japanese_Signals_Anki_${new Date().toISOString().slice(0, 10)}.csv`, csv)
}

/**
 * 匯出臺灣數學 3 秒破題訊號 Anki Deck
 */
export function exportMathSignalsToAnki(): void {
  const cards: AnkiCard[] = MATH_SOLVING_SIGNALS.map((sig) => {
    const front = `
      <div style="font-size: 18px; font-weight: bold; color: #1e3a8a;">${sig.topic} (${sig.gradeBand})</div>
      <div style="margin-top: 8px; font-size: 14px;">🔍 <b>題目出現訊號：</b><br/>${sig.problemSignal}</div>
    `.trim()

    const back = `
      <div style="font-size: 16px; font-weight: bold; color: #b45309;">${sig.threeSecondRule}</div>
      <div style="margin: 8px 0; font-family: monospace; font-size: 14px; background: #f1f5f9; padding: 6px; border-radius: 4px;">
        公式：${sig.firstStepFormula}
      </div>
      <div style="font-size: 13px;"><b>示範：</b>${sig.exampleProblem.question} ➜ <b>${sig.exampleProblem.quickSolve}</b></div>
    `.trim()

    return {
      front,
      back,
      tags: `Taiwan_Math 108_Curriculum ${sig.stage} ${sig.gradeBand}`,
    }
  })

  const csv = exportToAnkiCsv(cards)
  triggerCsvDownload(`Taiwan_Math_Signals_Anki_${new Date().toISOString().slice(0, 10)}.csv`, csv)
}
