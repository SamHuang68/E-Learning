/**
 * TOEIC 多益英語：商務談判、合約議價與職場社交高頻語塊庫 (Negotiation & Networking Chunks)
 * 專為多益 Part 3/4 聽力對話與 Part 7 商務書信往來設計的實戰語塊。
 */

export interface NegotiationChunkItem {
  id: string
  chunk: string
  phonetic: string
  category: 'Negotiation' | 'Contract' | 'Networking' | 'Strategy'
  meaningZh: string
  meaningJa: string
  businessContextZh: string
  businessContextJa: string
  exampleSentenceEn: string
  exampleSentenceZh: string
  exampleSentenceJa: string
}

export const NEGOTIATION_CHUNKS: NegotiationChunkItem[] = [
  {
    id: 'chunk-meet-halfway',
    chunk: 'meet someone halfway',
    phonetic: '/miːt ˈsʌmwʌn ˌhɑːfˈweɪ/',
    category: 'Negotiation',
    meaningZh: '各退一步、互相妥協折衷',
    meaningJa: '歩み寄る、妥協する、折半する',
    businessContextZh: '議價或合約條款陷入僵局時，提出雙方各退讓一定幅度的妥協提議。',
    businessContextJa: '価格交渉や納期調整で双方が合意点を見つけるために歩み寄る際によく使われる定番表現。',
    exampleSentenceEn: 'If you can increase the order volume to 500 units, we are willing to meet you halfway on the unit price.',
    exampleSentenceZh: '如果您能將訂購量增加至 500 件，我們願意在單價上各退一步。',
    exampleSentenceJa: '発注数を500個に増やしていただけるなら、単価において歩み寄る用意がございます。',
  },
  {
    id: 'chunk-contingent-upon',
    chunk: 'contingent upon',
    phonetic: '/kənˈtɪndʒənt əˈpɒn/',
    category: 'Contract',
    meaningZh: '取決於、以...為先決條件',
    meaningJa: '〜を条件として、〜次第で（法的・契約的拘束力）',
    businessContextZh: '合約條款中宣告某項義務或履約生效之前提條件。',
    businessContextJa: '契約の有効性や合意内容が取締役会の承認や外部監査の結果に依存することを示す表現。',
    exampleSentenceEn: 'The final contract approval is strictly contingent upon executive committee review.',
    exampleSentenceZh: '合約的最終核准完全取決於執行委員會的審查結果。',
    exampleSentenceJa: '最終的な契約承認は、経営委員会の審査を前提条件とします。',
  },
  {
    id: 'chunk-bottom-line',
    chunk: 'the bottom line',
    phonetic: '/ðə ˈbɒtəm laɪn/',
    category: 'Strategy',
    meaningZh: '底線、最終盈虧、核心要點',
    meaningJa: '最終損益（純利益）、最も重要な結論・ボトムライン',
    businessContextZh: '財務報表的最末行淨利，或談判中不可退讓之底線。',
    businessContextJa: '損益計算書の最終行（純利益）、あるいは交渉における「譲れない最低ライン」。',
    exampleSentenceEn: 'Our bottom line is that delivery must be completed before the end of the fiscal quarter.',
    exampleSentenceZh: '我們的底線是交貨必須在財政季度結束前完成。',
    exampleSentenceJa: '弊社の絶対条件（ボトムライン）は、今四半期末までに納品が完了することです。',
  },
  {
    id: 'chunk-touch-base',
    chunk: 'touch base with',
    phonetic: '/tʌtʃ beɪs wɪð/',
    category: 'Networking',
    meaningZh: '保持聯絡、碰面小聊、更新進度',
    businessContextZh: '商務社交或專案進度追蹤時，以輕鬆且專業的方式與客戶或主管確認最新狀況。',
    meaningJa: '連絡を取る、近況を報告し合う、すり合わせる',
    businessContextJa: 'ビジネスで手短に進捗確認や情報共有を行う際に非常に好まれる口語表現。',
    exampleSentenceEn: 'Let us touch base next Monday to finalize the marketing timeline.',
    exampleSentenceZh: '我們下週一再來碰頭確認行銷時程表的最終版本。',
    exampleSentenceJa: 'マーケティングのスケジュールを確定させるため、来週月曜日に連絡を取り合いましょう。',
  },
]
