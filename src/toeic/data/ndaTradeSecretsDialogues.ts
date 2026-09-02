/**
 * TOEIC 多益英語：商務保密協議 NDA、營業秘密洩漏與違約金特訓題庫 (Mutual NDA & Trade Secrets Protection)
 * 涵蓋多益 Part 3/4/7 最常出現的雙向保密協議 (Mutual Non-Disclosure Agreement / NDA)、核心營業秘密 (Trade Secrets and Proprietary Source Code)、五年存續保密條款 (Five-Year Confidentiality Term)、預定損害賠償與懲罰性違約金 (Liquidated Damages Clause)、禁止拉攏客戶與挖角員工 (Non-Solicitation Covenant) 及文件返還銷毀證明 (Written Certificate of Destruction)。
 */

export interface NdaTradeSecretsScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    corporateLegalCounsel: string
    businessDevelopmentDirector: string
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
  ndaTradeSecretsKeywordsTipsJa: string
}

export const NDA_TRADE_SECRETS_SCENARIOS: NdaTradeSecretsScenarioItem[] = [
  {
    id: 'nda-trade-secrets-breach',
    title: '跨國戰略聯盟前置協議：雙向 NDA 保密期限與預定損害賠償條款',
    titleJa: '戦略的提携前の秘密保持契約（NDA）：有効期間と予定損害賠償金（違約金）条項',
    icon: '🤝',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Corporate Legal Counsel: Marcus, before we demonstrate our proprietary autonomous driving neural network to Orion Robotics next Tuesday, we must execute our standard mutual non-disclosure agreement.\nMarcus: Certainly, Evelyn. I already forwarded their legal department our draft. However, Orion's counsel requested reducing the confidentiality duration from five years down to two years.\nCorporate Legal Counsel: That is unacceptable. Our core algorithmic architecture represents ten million dollars in cumulative R&D. We cannot compromise on less than a five-year confidentiality period, and we must retain the liquidated damages clause of two million dollars per unauthorized disclosure.\nMarcus: Understood. I will also make sure the covenant requiring a certified destruction of all digital technical specifications upon termination of partnership discussions remains non-negotiable.`,
    dialogueRoles: {
      corporateLegalCounsel: 'Evelyn (Corporate Legal Counsel)',
      businessDevelopmentDirector: 'Marcus (Business Development Director)',
    },
    questions: [
      {
        id: 'nda-1',
        question: 'What modification requested by the prospective partner Orion Robotics was deemed unacceptable?',
        questionJa: '提携先であるオリオン・ロボティクス社が要求した修正のうち、受け入れられないとされたものはどれですか？',
        options: [
          'Switching the meeting location from Chicago to Tokyo',
          'Reducing the confidentiality duration from five years to two years',
          'Requiring an in-person live presentation rather than a virtual one',
          'Replacing the chief executive officer before signing',
        ],
        correctIndex: 1,
        explanationZh: 'Marcus 指出 Orion 要求「reducing the confidentiality duration from five years down to two years（將保密期限由五年縮減為兩年）」，法務長 Evelyn 明確表示無法接受。',
        explanationJa: '「秘密保持期間を5年から2年に短縮すること（reducing confidentiality duration from five to two years）」を拒絶しました。',
      },
      {
        id: 'nda-2',
        question: 'What remedy does the agreement specify in the event of an unauthorized disclosure of trade secrets?',
        questionJa: '企業秘密の無断開示が発生した場合、本契約にはどのような救済措置が規定されていますか？',
        options: [
          'A mandatory verbal apology published on a newspaper',
          'A liquidated damages clause of two million dollars per disclosure',
          'An automatic forfeiture of company shares to the government',
          'Free lifetime software subscription licenses',
        ],
        correctIndex: 1,
        explanationZh: 'Evelyn 強調必須保留「liquidated damages clause of two million dollars per unauthorized disclosure（每起未經授權洩密 200 萬美元之預定損害賠償條款）」。',
        explanationJa: '「不正開示1件につき200万ドルの予定損害賠償金（liquidated damages of $2,000,000）」条項を維持すると説明されています。',
      },
    ],
    ndaTradeSecretsKeywordsTipsJa: 'TOEICでは「mutual NDA（双務的秘密保持契約）」「proprietary（独自の・専有の）」「trade secret（営業秘密）」「liquidated damages（予定損害賠償額・違約金）」「covenant（誓約条項）」「destruction upon termination（終了時の破棄義務）」が頻出です。',
  },
]
