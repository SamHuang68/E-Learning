/**
 * TOEIC 多益英語：跨國技術移轉、原始碼第三方託管與專有技術保密協議特訓題庫 (Tech Transfer & Source Code Escrow)
 * 涵蓋多益 Part 3/4/7 最常出現的技術移轉協議 (Technology Transfer Agreement)、原始碼第三方中立託管 (Neutral Third-Party Source Code Escrow)、破產觸發釋出條款 (Release Trigger in Insolvency or Liquidation)、專有商業機密保護 (Protection of Proprietary Trade Secrets) 與雙向非揭露保密協議 (Mutual Non-Disclosure Agreement / NDA)。
 */

export interface TechTransferScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    chiefLegalCounsel: string
    ipLicensingNegotiator: string
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
  techTransferKeywordsTipsJa: string
}

export const TECH_TRANSFER_SCENARIOS: TechTransferScenarioItem[] = [
  {
    id: 'tech-transfer-escrow',
    title: '跨國半導體製程技術移轉：原始碼第三方信託託管與破產釋出保護',
    titleJa: '半導体プロセスの技術移転：ソースコードのエスクロー寄託と破産保護',
    icon: '🔐',
    targetAccent: 'en-CA',
    accentLabel: '加式口音 🇨🇦',
    audioScript: `Chief Legal Counsel: Good morning, Douglas. How did yesterday's closing session on the cross-border technology transfer agreement conclude?\nDouglas: Excellent, Genevieve. Both engineering and legal teams agreed on the final licensing terms. To mitigate operational risk, the licensor agreed to deposit all proprietary compiler source code and architectural blueprints into an independent third-party escrow account.\nChief Legal Counsel: What specific trigger conditions govern the release of the escrowed materials to our engineering division?\nDouglas: The depositary will release the full codebase exclusively if the licensor enters liquidation, declares bankruptcy, or fails to deliver contractually mandated bug patches for ninety consecutive calendar days. Furthermore, our mutual non-disclosure agreement extends confidentiality protections for seven years post-termination.`,
    dialogueRoles: {
      chiefLegalCounsel: 'Genevieve (Chief Legal Counsel)',
      ipLicensingNegotiator: 'Douglas (Senior IP Licensing Negotiator)',
    },
    questions: [
      {
        id: 'tq-1',
        question: 'Where will the licensor deposit the proprietary source code and architectural blueprints?',
        questionJa: 'ライセンサーはプロプライエタリなソースコードと設計図面をどこに寄託しますか？',
        options: [
          'Directly onto a public GitHub open-source repository',
          'Into an independent third-party escrow account',
          'Within the personal safe of the chief legal officer',
          'At the local municipal tax assessment registry',
        ],
        correctIndex: 1,
        explanationZh: 'Douglas 指出授權方同意將原始碼與設計藍圖寄託至「independent third-party escrow account（獨立第三方託管帳戶）」。',
        explanationJa: '「独立した第三者エスクロー口座（third-party escrow account）に寄託する」と合意しています。',
      },
      {
        id: 'tq-2',
        question: 'Under what specific condition will the escrowed codebase be released to the licensee?',
        questionJa: 'エスクローされたコードベースがライセンシーに引き渡される具体的な条件は何ですか？',
        options: [
          'If the stock price of the licensor doubles within six months',
          'If the licensor enters liquidation, declares bankruptcy, or misses patches for 90 days',
          'Whenever requested by any junior software developer on the team',
          'Only after the complete expiration of the five-year fiscal warranty',
        ],
        correctIndex: 1,
        explanationZh: 'Douglas 說明只有在授權方「enters liquidation, declares bankruptcy, or fails to deliver bug patches for ninety consecutive calendar days（進入清算、宣告破產或連續 90 天未提供漏洞修補程式）」時才會釋出。',
        explanationJa: '「ライセンサーが清算・破産に入るか、あるいは90日連続でパッチ提供を怠った場合」に引き渡されるためです。',
      },
    ],
    techTransferKeywordsTipsJa: 'TOEICでは「technology transfer（技術移転）」「escrow（第三者預託・エスクロー）」「liquidation / bankruptcy（清算・破産）」「confidentiality / NDA（秘密保持）」「trade secret（企業秘密）」が頻出です。',
  },
]
