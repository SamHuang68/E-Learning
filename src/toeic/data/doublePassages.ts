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
        explanationZh: '第2篇明確說明「辦公室裝修提前完工 (renovation concluded ahead of schedule)」。此為直接事實推論，其他選項在兩篇中均無提及，屬 distractor。',
        explanationJa: '第2文に「オフィス改装が予定より早く完了したため」と明記されています。他の選択肢は両パッセージに記載なし。',
      },
      {
        id: 'dp-q3',
        question: 'Does the complimentary expedited freight still apply after the date change?',
        questionJa: '配送日変更後も無料の速達配送は適用されますか？',
        options: ['Yes, always', 'No, because it is now weekend', 'Only if over $10,000', 'It depends on payment terms'],
        correctIndex: 1,
        clueLocation: 'P1: "All shipments exceeding $5,000 qualify for complimentary expedited freight." P2 requests weekend which triggers surcharge instead.',
        explanationZh: '第1篇指出超過 $5000 免 expedited freight，但第2篇請求週六配送，明確觸發 "additional handling surcharge of $150"，故免費不適用。深度：條件式優惠 vs 特定 surcharge 的優先順序。',
        explanationJa: '第1文で$5000超で無料速達とあるが、第2文の土曜配送は$150 surchargeをトリガーするため無料適用外。条件付き特典と特定手数料の優先順位を理解。',
      },
      {
        id: 'dp-q4',
        question: 'What is the original scheduled delivery date mentioned implicitly?',
        questionJa: '暗黙的に言及されている元の配送予定日はいつですか？',
        options: ['October 11', 'October 15', 'October 30', 'November 1'],
        correctIndex: 1,
        clueLocation: 'P1 states "by October 15"; P2 says "instead of the original date".',
        explanationZh: '第1篇明訂 "by October 15" 為原期限，第2篇 "instead of the original date" 確認此為基準日。需跨篇推論原日期與變更。',
        explanationJa: '第1文に「10月15日まで」とあり、第2文の「元の予定日ではなく」から原予定日を推論。',
      },
      {
        id: 'dp-q5',
        question: 'Which party is responsible for confirming the surcharge on the invoice?',
        questionJa: '請求書に手数料を記載して確認するのはどの当事者ですか？',
        options: ['Nexus Tech', 'Apex Solutions', 'Both equally', 'Neither'],
        correctIndex: 1,
        clueLocation: 'P2: "Please confirm whether the complimentary freight still applies and include any necessary surcharge on the final invoice." Addressed to Apex.',
        explanationZh: '第2篇 Clara 直接要求 Apex Team 確認並將 surcharge 列入最終 invoice，顯示 Apex 負責處理與確認費用。',
        explanationJa: '第2文でApex Teamに確認とsurchargeの記載を依頼しているため、Apexが責任を負う。',
      },
      {
        id: 'dp-q6',
        question: 'What inference can be drawn about the total order value?',
        questionJa: '注文総額についてどのような推論ができますか？',
        options: ['Under $5,000', 'Exactly $5,000', 'Over $5,000', 'Cannot be determined'],
        correctIndex: 2,
        clueLocation: 'P1 qualifies shipments >$5000 for free freight; P2 requests change implying they expect possible free but get surcharge.',
        explanationZh: '第1篇免費條件為超過 $5000，第2篇請求變更卻討論 surcharge，推論訂單價值超過門檻但週末例外。深度：隱含價值推論與例外處理。',
        explanationJa: '第1文の無料条件$5000超と第2文のsurcharge議論から、総額は$5000超と推論。',
      },
      {
        id: 'dp-q7',
        question: 'How does the payment term interact with the delivery change?',
        questionJa: '支払い条件は配送変更とどのように連動しますか？',
        options: ['Payment due in 15 days', 'Payment due within 30 days of final shipment', 'No payment until delivery', 'Payment in advance only'],
        correctIndex: 1,
        clueLocation: 'P1: "Payment is due within 30 days of receiving the final shipment." Unchanged by date request.',
        explanationZh: '第1篇支付條款 "within 30 days of receiving the final shipment" 獨立於配送日期變更，顯示合約條款模組化。跨篇確認支付不受影響。',
        explanationJa: '第1文の支払い条件は配送日変更に影響されず30日以内。',
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
