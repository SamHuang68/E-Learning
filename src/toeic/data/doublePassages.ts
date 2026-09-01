/**
 * TOEIC 多益英語：Part 7 雙篇與多篇閱讀對照資料庫 (Double Passage Practice Data)
 * 專門訓練橫跨 Passage 1 (如合約/廣告) 與 Passage 2 (如電子郵件/發票) 的交叉推論與同義替換。
 */

export interface DoublePassageSet {
  id: string
  title: string
  titleJa: string
  scenario: string
  passage1: {
    type: 'Advertisement' | 'Email' | 'Contract' | 'Schedule' | 'Policy'
    heading: string
    content: string
  }
  passage2: {
    type: 'Email' | 'Invoice' | 'Review' | 'Memo'
    heading: string
    content: string
  }
  questions: Array<{
    id: string
    question: string
    questionJa: string
    options: string[]
    correctIndex: number
    clueLocation: string
    explanationZh: string
    explanationJa: string
  }>
  synonymMatches: Array<{
    wordInP1: string
    wordInP2: string
    meaningZh: string
    meaningJa: string
  }>
}

export const DOUBLE_PASSAGE_SETS: DoublePassageSet[] = [
  {
    id: 'dp-procurement-logistics',
    title: '辦公設備採購合約與配送變更通知',
    titleJa: 'オフィス設備購入契約と配送変更通知（Passage 1 & 2）',
    scenario: 'Corporate Purchasing & Logistics Cross-referencing',
    passage1: {
      type: 'Contract',
      heading: 'Standard Supply Agreement · Section 4 (Delivery Terms)',
      content: `Apex Office Solutions agrees to deliver 50 ergonomic executive chairs (Model EX-200) to Nexus Tech Headquarters by October 15. All shipments exceeding $5,000 qualify for complimentary expedited freight. If the receiving party requests standard weekend delivery, an additional handling surcharge of $150 will be assessed. Payment is due within 30 days of receiving the final shipment.`,
    },
    passage2: {
      type: 'Email',
      heading: 'From: logistics@nexus-tech.com | To: orders@apex-solutions.com',
      content: `Dear Apex Team,\n\nRegarding our purchase order #NX-8842 for the 50 executive chairs, our new office renovation has concluded ahead of schedule. We would like to request that the shipment be delivered on Saturday, October 11 instead of the original date. Please confirm whether the complimentary freight still applies and include any necessary surcharge on the final invoice.\n\nBest regards,\nClara Vance\nProcurement Lead, Nexus Tech`,
    },
    questions: [
      {
        id: 'dp-q1',
        question: 'What is the total delivery surcharge that Nexus Tech will incur for the revised date?',
        questionJa: '配送日変更に伴い、Nexus Techに発生する追加手数料はいくらですか？',
        options: ['$0', '$50', '$150', '$200'],
        correctIndex: 2,
        clueLocation: 'Passage 1 mentions weekend delivery surcharge is $150; Passage 2 requests delivery on Saturday, Oct 11.',
        explanationZh: '第1篇提及週末配送需加收 $150 手續費；第2篇 Clara 請求改在 10/11 (週六) 送達，故需支付 $150。',
        explanationJa: '第1文で週末配送には150ドルの追加手数料が発生するとあり、第2文で土曜日（10月11日）への変更を依頼しているため、150ドルが正解です。',
      },
      {
        id: 'dp-q2',
        question: 'Why does Clara Vance request an earlier delivery?',
        questionJa: 'Clara Vanceが早期配送を依頼した理由は何ですか？',
        options: [
          'The old chairs were damaged',
          'Office renovation was completed early',
          'A corporate audit was scheduled',
          'Apex offered a special discount',
        ],
        correctIndex: 1,
        clueLocation: 'Passage 2: "our new office renovation has concluded ahead of schedule."',
        explanationZh: '第2篇明確說明「辦公室裝修提前完工 (renovation concluded ahead of schedule)」。',
        explanationJa: '第2文に「オフィス改装が予定より早く完了したため」と明記されています。',
      },
    ],
    synonymMatches: [
      {
        wordInP1: 'conclude',
        wordInP2: 'finish / complete',
        meaningZh: '完成、結束',
        meaningJa: '完了する、終わる',
      },
      {
        wordInP1: 'complimentary',
        wordInP2: 'free of charge',
        meaningZh: '免費贈送的',
        meaningJa: '無料の',
      },
    ],
  },
]
