/**
 * TOEIC 多益英語：國際信用狀 UCP 600 單證瑕疵、拒付通知與提貨擔保特訓題庫 (Letter of Credit & Discrepancy Claim)
 * 涵蓋多益 Part 3/4/7 最常出現的跟單信用狀國際金融結算 (Documentary Letter of Credit under ICC UCP 600)、單證嚴格相符原則 (Doctrine of Strict Compliance)、五個銀行工作日審查期 (Five Banking Days Standard for Document Examination)、單證重大瑕疵 (Discrepancy: Late Shipment Date on Bill of Lading & Commercial Invoice Description Inconsistency)、開證行發出拒付通知 (Notice of Refusal) 及出具銀行提貨擔保書 (Shipping Guarantee to Expedite Customs Clearance)。
 */

export interface LetterOfCreditScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    tradeFinanceDirector: string
    documentaryCreditOfficer: string
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
  letterOfCreditKeywordsTipsJa: string
}

export const LETTER_OF_CREDIT_SCENARIOS: LetterOfCreditScenarioItem[] = [
  {
    id: 'lc-discrepancy-late-shipment',
    title: '信用狀單證審核瑕疵：提單裝船日期晚於規定期限與開證行拒付抗辯',
    titleJa: '信用状（L/C）書類の不一致（ディスクレ）：船積期日超過と開設銀行の支払拒絶通知',
    icon: '📜',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Documentary Credit Officer: Good afternoon, Ms. Thornton. Our trade operations division has completed the document examination for the eight-hundred-thousand-dollar irrevocable letter of credit issued for your solar module shipment.\nTrade Finance Director: Good afternoon, Julian. Were the shipping documents found to be strictly compliant under UCP 600 guidelines?\nDocumentary Credit Officer: Unfortunately, we discovered two critical discrepancies. First, the onboard bill of lading indicates an ocean lading date of August twenty-fourth, which is four days after the latest shipment date specified in field 44C. Second, the commodity description on the commercial invoice omits the model number listed in the credit.\nTrade Finance Director: That means the issuing bank will issue a formal notice of refusal unless our buyer agrees to waive these discrepancies.\nDocumentary Credit Officer: Precisely. If the applicant declines to authorize payment against discrepant documents, we can coordinate with their bank to issue a shipping guarantee so they can still take delivery of the containers at the port pending final financial settlement.`,
    dialogueRoles: {
      tradeFinanceDirector: 'Ms. Thornton (Trade Finance Director)',
      documentaryCreditOfficer: 'Julian (Senior Documentary Credit Officer)',
    },
    questions: [
      {
        id: 'lc-1',
        question: 'What specific discrepancy was discovered on the ocean bill of lading?',
        questionJa: '船荷証券（B/L）上で発見された具体的な不一致（ディスクレパンシー）は何ですか？',
        options: [
          'The shipping vessel sank during transit in the Indian Ocean',
          'The onboard lading date was four days after the latest permissible shipment date',
          'The shipping company was not officially certified by the international maritime organization',
          'The bill of lading was printed on non-standard watermark paper',
        ],
        correctIndex: 1,
        explanationZh: 'Julian 指出提單上的裝船日期（8月24日）比信用狀 44C 欄位規定的最後裝運日晚了整整四天（`four days after the latest shipment date specified in field 44C`），構成嚴重的遲延裝運瑕疵。',
        explanationJa: '「本船積載日（8月24日）が信用状44C欄に指定された最終船積期日より4日遅れていた」ことが明確なディスクレとなります。',
      },
      {
        id: 'lc-2',
        question: 'What arrangement is suggested if the buyer wishes to collect the cargo before resolving the payment dispute?',
        questionJa: '買主が支払い紛争の解決前に貨物を引き取りたい場合、どのような措置が提案されていますか？',
        options: [
          'Issuing a shipping guarantee through their bank to release the containers at the port',
          'Filing an emergency arbitration claim with the international court of justice',
          'Immediately auctioning off the solar modules to third-party scrap recyclers',
          'Demanding that the carrier return the cargo back to the originating port at their own cost',
        ],
        correctIndex: 0,
        explanationZh: 'Julian 建議可透過銀行開立「提貨擔保書（shipping guarantee）」，讓買方在最終金融款項結算前先行在港口提領貨櫃。',
        explanationJa: '「銀行を通じて荷渡保証書（shipping guarantee）を発行し、港でコンテナを引き取れるようにする」ことが提案されています。',
      },
    ],
    letterOfCreditKeywordsTipsJa: 'TOEICでは「irrevocable letter of credit / L/C（取消不能信用状）」「UCP 600（信用状統一規則）」「discrepancy / discrepant documents（書類不一致・ディスクレ）」「bill of lading / B/L（船荷証券）」「notice of refusal（支払拒絶通知）」「shipping guarantee（荷渡保証書・L/G）」が頻出です。',
  },
]
