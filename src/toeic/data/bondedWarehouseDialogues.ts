/**
 * TOEIC 多益英語：商務國際海關報關、保稅倉庫運作與關稅遞延特訓題庫 (Customs Clearance & Bonded Warehouse)
 * 涵蓋多益 Part 3/4/7 最常出現的保稅倉庫貨物儲存 (Bonded Warehouse Duty Deferral)、國際商品統一分類代碼 (Harmonized System / HS Code Classification)、海關進口報單 (Customs Entry Form)、自由貿易區 (Foreign Trade Zone / FTZ) 與持照報關行合規審查 (Licensed Customs Broker Compliance Audit)。
 */

export interface BondedWarehouseScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    importComplianceDirector: string
    customsBrokerageManager: string
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
  bondedWarehouseKeywordsTipsJa: string
}

export const BONDED_WAREHOUSE_SCENARIOS: BondedWarehouseScenarioItem[] = [
  {
    id: 'bonded-warehouse-customs',
    title: '跨國電子零組件進口報關、HS 稅則編號與保稅倉庫關稅遞延',
    titleJa: '電子部品の税関輸入申告・HSコード分類と保税倉庫（関税繰延）',
    icon: '🏛️',
    targetAccent: 'en-AU',
    accentLabel: '澳式口音 🇦🇺',
    audioScript: `Import Compliance Director: Good afternoon, Lachlan. Have we reviewed the entry summary declarations for our high-value semiconductor shipment arriving at Port Botany?\nLachlan: Yes, Matilda. Our licensed customs broker has matched the bill of lading with the ten-digit Harmonized Tariff Schedule code. By routing the consignment directly into a Class 3 bonded warehouse, we can defer all import tariffs and value-added taxes until the inventory is officially withdrawn for domestic distribution.\nImport Compliance Director: That provides immense working capital flexibility. How are we prepared for a potential Australian Border Force random audit?\nLachlan: All commercial invoices, packing lists, and country-of-origin certificates are digitally archived in our automated customs management portal, ready for immediate electronic verification.`,
    dialogueRoles: {
      importComplianceDirector: 'Matilda (Import Compliance Director)',
      customsBrokerageManager: 'Lachlan (Customs Brokerage Operations Manager)',
    },
    questions: [
      {
        id: 'bq-1',
        question: 'What is the primary financial benefit of routing the shipment into a bonded warehouse?',
        questionJa: '貨物を保税倉庫（bonded warehouse）に搬入する主な財務的メリットは何ですか？',
        options: [
          'Immediate exemption from all maritime shipping charges',
          'Deferral of import tariffs and taxes until official withdrawal',
          'Free storage provided indefinitely by local port authorities',
          'Automatic waiver of product safety testing regulations',
        ],
        correctIndex: 1,
        explanationZh: 'Lachlan 說明保稅倉庫能「defer all import tariffs and value-added taxes until the inventory is officially withdrawn（暫緩遞延所有進口關稅與加值稅，直到貨品正式出庫用於國內配銷）」。',
        explanationJa: '「国内流通のために正式に出庫されるまで、輸入関税および付加価値税の支払いを繰り延べできる」と述べています。',
      },
      {
        id: 'bq-2',
        question: 'How is the company prepared in the event of a customs compliance audit?',
        questionJa: '税関のコンプライアンス監査に備えて、企業はどのように準備していますか？',
        options: [
          'By destroying all historical transaction paperwork',
          'By requesting an extension of three calendar months',
          'By digitally archiving invoices and certificates in a customs portal',
          'By relocating the corporate headquarters overseas',
        ],
        correctIndex: 2,
        explanationZh: 'Lachlan 指出「commercial invoices, packing lists, and country-of-origin certificates are digitally archived in our automated customs management portal（商業發票、裝箱單與原產地證明皆數位封存在報關入口網站）」。',
        explanationJa: '「インボイスや原産地証明書などの書類を税関ポータルに電子保管し、即時検証できるようにしている」ためです。',
      },
    ],
    bondedWarehouseKeywordsTipsJa: 'TOEICでは「bonded warehouse（保税倉庫）」「tariff deferral（関税繰延）」「Harmonized Tariff Schedule / HS code（関税分類番号）」「customs broker（通関業者・乙仲）」「declaration（申告）」が頻出です。',
  },
]
