/**
 * TOEIC 多益英語：商務反托拉斯法規、反壟斷調查與價格合謀防範特訓題庫 (Antitrust & Cartel Compliance)
 * 涵蓋多益 Part 3/4/7 最常出現的反壟斷法規 (Antitrust Regulations / Sherman Act)、聯邦貿易委員會與司法部併購審查 (FTC & Department of Justice Merger Review)、橫向價格合謀卡特爾 (Horizontal Price-Fixing Cartel)、市場劃分協議 (Market Allocation Conspiracy)、內部吹哨者保護熱線 (Confidential Whistleblower Hotline) 與企業法規遵循年訓 (Mandatory Antitrust Compliance Refresher)。
 */

export interface AntitrustScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    chiefComplianceOfficer: string
    seniorLegalCounsel: string
  }
  questions: Array<{
    id: string
    question: string
    questionJa: string
    options: string[]
    correctIndex: number
    explanationZh: string
    explanationJa: string
  }>
  antitrustKeywordsTipsJa: string
}

export const ANTITRUST_SCENARIOS: AntitrustScenarioItem[] = [
  {
    id: 'antitrust-cartel-compliance',
    title: '跨國半導體產業公會會議：反托拉斯合規、價格合謀防範與吹哨者通報',
    titleJa: '半導体業界団体会合：独占禁止法コンプライアンス・価格カルテル防止と内部通報',
    icon: '⚖️',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Chief Compliance Officer: Good morning, Raymond. Ahead of this afternoon's global trade association summit in Chicago, did our legal team review the competition guidelines for our sales executives?\nRaymond: Absolutely, Meredith. We circulated strict antitrust compliance protocols. Our representatives are strictly forbidden from discussing production capacity allocations, future pricing strategies, or customer division with competing manufacturers.\nChief Compliance Officer: Excellent. What should an executive do if another vendor initiates conversations bordering on price-fixing?\nRaymond: They are instructed to immediately state their objection on the formal record, leave the room, and report the incident directly to our anonymous whistleblower compliance hotline within twenty-four hours to ensure prompt legal documentation.`,
    dialogueRoles: {
      chiefComplianceOfficer: 'Meredith (Chief Compliance Officer)',
      seniorLegalCounsel: 'Raymond (Senior Regulatory & Antitrust Counsel)',
    },
    questions: [
      {
        id: 'aq-1',
        question: 'What specific topics are sales representatives strictly forbidden from discussing with competitors?',
        questionJa: '営業担当者が競合他社と議論することを厳格に禁じられている内容はどれですか？',
        options: [
          'Publicly available software user manuals',
          'Production capacity allocations and future pricing strategies',
          'General tourist accommodations in the host city',
          'Standard charitable community sponsorships',
        ],
        correctIndex: 1,
        explanationZh: 'Raymond 指出業務主管被嚴格禁止與競業討論「production capacity allocations, future pricing strategies, or customer division（產能配額分配、未來定價策略或瓜分客戶）」。',
        explanationJa: '「生産能力の割当、将来の価格戦略、顧客の分割」について議論することが固く禁じられています。',
      },
      {
        id: 'aq-2',
        question: 'What immediate action must an executive take if a competitor initiates a price-fixing conversation?',
        questionJa: '競合他社が価格カルテルに抵触する会話を持ちかけた場合、役員は直ちにどのような行動をとるべきですか？',
        options: [
          'Agree verbally to the proposal while refusing to sign documents',
          'Object on the record, leave the room, and notify the compliance hotline',
          'Offer an immediate price concession of ten percent',
          'Convene an emergency press conference in the hotel lobby',
        ],
        correctIndex: 1,
        explanationZh: 'Raymond 說明正確程序是「state their objection on the formal record, leave the room, and report the incident to our anonymous whistleblower compliance hotline（正式記錄提出異議、離席並於 24 小時內通報吹哨者合規專線）」。',
        explanationJa: '「公式記録に反対の旨を残して退席し、24時間以内に内部通報ホットラインに報告する」ことが求められます。',
      },
    ],
    antitrustKeywordsTipsJa: 'TOEICでは「antitrust / competition law（独占禁止法・競争法）」「price-fixing（価格カルテル）」「market allocation（市場分割協定）」「trade association（業界団体）」「whistleblower hotline（内部通報ホットライン）」が頻出です。',
  },
]
