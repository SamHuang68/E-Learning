/**
 * TOEIC 多益英語：商用房地產、辦公室租賃與企業擴遷特訓題庫 (Real Estate & Office Relocation)
 * 涵蓋多益 Part 3/4/7 最常出現的商業租約 (Commercial Lease)、免租裝修期 (Rent-Free Fit-out Period)、每平方英尺租金 (Square Footage / Sq Ft Rate) 與大樓物業設施 (Building Amenities & Utilities)。
 */

export interface RealEstateScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    propertyBroker: string
    operationsDirector: string
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
  realEstateKeywordsTipsJa: string
}

export const REAL_ESTATE_SCENARIOS: RealEstateScenarioItem[] = [
  {
    id: 're-office-expansion',
    title: '市中心商業大樓辦公室租賃與免租裝修期協商',
    titleJa: '都心オフィスビル賃貸契約とフリーレント（内装期間）交渉',
    icon: '🏢',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Property Broker: Welcome, Ms. Warren. This fourteenth-floor suite offers forty-five hundred square feet of open-concept office space with floor-to-ceiling windows overlooking downtown.\nMs. Warren: The layout and natural light are impressive. Our engineering team has expanded rapidly, and we need dedicated acoustic meeting pods and a server room. What is the landlord's proposed square-footage rate?\nProperty Broker: The base rate is forty-two dollars per square foot annually on a five-year lease. However, the landlord is willing to grant a two-month rent-free fit-out period so your contractors can install internal partitions and specialized wiring.\nMs. Warren: That is a generous concession. Does the gross lease also include round-the-clock HVAC operation and janitorial services?`,
    dialogueRoles: {
      propertyBroker: 'Brian (Commercial Leasing Specialist)',
      operationsDirector: 'Ms. Warren (VP of Operations)',
    },
    questions: [
      {
        id: 'rq-1',
        question: 'What concession has the landlord offered to assist with the tenant\'s renovations?',
        questionJa: 'テナントの内装工事を支援するため、家主が提案した譲歩は何ですか？',
        options: [
          'Purchasing all office furniture upfront',
          'Providing a two-month rent-free fit-out period',
          'Waiving the security deposit entirely',
          'Offering free legal services for incorporation',
        ],
        correctIndex: 1,
        explanationZh: '房仲表示房東願意給予「two-month rent-free fit-out period（兩個月的免租金裝修期）」。',
        explanationJa: '「2ヶ月間の内装工事用フリーレント（rent-free fit-out period）の提供」と述べています。',
      },
      {
        id: 'rq-2',
        question: 'Why does Ms. Warren need dedicated meeting pods and custom wiring?',
        questionJa: 'Warren氏が防音会議ポッドや専用配線を必要としている理由は何ですか？',
        options: [
          'Her engineering team is expanding rapidly',
          'The building has no existing electrical wiring',
          'The city municipal codes require acoustic pods',
          'The company plans to sublet the space immediately',
        ],
        correctIndex: 0,
        explanationZh: 'Warren 提到「Our engineering team has expanded rapidly（我們的研發工程團隊正在迅速擴張）」。',
        explanationJa: '「エンジニアリングチームが急速に拡大しているため」です。',
      },
    ],
    realEstateKeywordsTipsJa: 'TOEICでは「commercial lease（商業用賃貸契約）」「rent-free fit-out period（内装フリーレント）」「square footage（床面積・坪数）」「concession（譲歩・優遇措置）」が頻出です。',
  },
]
