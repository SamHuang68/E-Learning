/**
 * TOEIC 多益英語：商務國際空運物流、冷鏈溫控與危化品運輸特訓題庫 (Air Freight & Cold Chain Logistics)
 * 涵蓋多益 Part 3/4/7 最常出現的主空運提單 (Master Air Waybill / MAWB Tracking)、超低溫溫控生醫物流 (Ultra-Cold Storage -70°C)、冷鏈溫度失控處置規範 (Temperature Excursion Protocol)、急件優先清關 (Expedited Customs Clearance) 與貨運責任保險理賠 (Cargo Damage & Liability Insurance Claim)。
 */

export interface ColdChainScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    freightOperationsDirector: string
    coldChainLogisticsManager: string
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
  coldChainKeywordsTipsJa: string
}

export const COLD_CHAIN_SCENARIOS: ColdChainScenarioItem[] = [
  {
    id: 'cold-chain-air-freight',
    title: '跨國生技疫苗超低溫空運提單追蹤與冷鏈溫控通報',
    titleJa: 'バイオワクチンの超低温航空貨物追蹤とコールドチェーン温度異常プロトコル',
    icon: '❄️',
    targetAccent: 'en-GB',
    accentLabel: '英式口音 🇬🇧',
    audioScript: `Freight Operations Director: Good morning, Alistair. Have you tracked the priority consignment of pharmaceutical vaccines shipped via flight BA-178?\nAlistair: Yes, Eleanor. According to the Master Air Waybill telemetry logs, the dry-ice cryogenic containers maintained the required minus seventy degrees Celsius throughout the transatlantic transit.\nFreight Operations Director: Splendid. What about customs pre-clearance at Frankfurt International Airport?\nAlistair: Our bonded broker has already submitted the expedited regulatory documentation. However, if the digital data logger registers any temperature excursion exceeding minus sixty degrees, our protocol mandates immediate quarantine and filing a claim with our marine and air cargo underwriter.`,
    dialogueRoles: {
      freightOperationsDirector: 'Eleanor (Global Freight Operations Director)',
      coldChainLogisticsManager: 'Alistair (Lead Cold Chain Logistics Manager)',
    },
    questions: [
      {
        id: 'cq-1',
        question: 'What temperature requirement was monitored during the transatlantic flight?',
        questionJa: '大西洋横断フライト中に監視されていた温度要件は何ですか？',
        options: [
          'Minus seventy degrees Celsius',
          'Room temperature of twenty-five degrees Celsius',
          'Freezing temperature of zero degrees Celsius',
          'Boiling temperature of one hundred degrees Celsius',
        ],
        correctIndex: 0,
        explanationZh: 'Alistair 說明「cryogenic containers maintained the required minus seventy degrees Celsius（超低溫乾冰容器全程維持在規定的攝氏負 70 度）」。',
        explanationJa: '「極低温ドライアイスコンテナが要求されたマイナス70度を維持した」と述べています。',
      },
      {
        id: 'cq-2',
        question: 'What immediate action is required if a temperature excursion occurs?',
        questionJa: 'もし許容温度を超える異常（温度逸脱）が発生した場合、どのような即時対応が必要ですか？',
        options: [
          'Immediately discard the vaccines into municipal waste bins',
          'Discount the retail price of the shipment by fifty percent',
          'Immediate quarantine and filing a claim with the cargo underwriter',
          'Reroute the shipment by standard road freight',
        ],
        correctIndex: 2,
        explanationZh: 'Alistair 指出「protocol mandates immediate quarantine and filing a claim with our marine and air cargo underwriter（規範要求立即隔離貨品並向貨運保險承保人提出理賠）」。',
        explanationJa: '「即時隔離（クアランティン）と航空貨物保険会社への損害賠償請求」が義務付けられています。',
      },
    ],
    coldChainKeywordsTipsJa: 'TOEICでは「consignment（託送貨物）」「air waybill（航空貨物運送状・AWB）」「temperature excursion（温度逸脱・温度異常）」「quarantine（隔離・留め置き）」「underwriter（保険引受会社）」が頻出です。',
  },
]
