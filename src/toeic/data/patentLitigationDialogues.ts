/**
 * TOEIC 多益英語：專利侵權訴訟、初步禁制令與先前技術無效抗辯特訓題庫 (Patent Litigation & Preliminary Injunction)
 * 涵蓋多益 Part 3/4/7 最常出現的聯邦專利侵權訴訟 (Patent Infringement Lawsuit)、初步禁制令緊急動議 (Motion for a Preliminary Injunction to Block Sales)、先前技術無效抗辯 (Prior Art Defense regarding Anticipation and Obviousness)、多方複審程序 (Inter Partes Review / IPR)、合理權利金損害賠償 (Reasonable Royalty Damages) 與全球專利交叉授權和解 (Global Cross-Licensing Settlement)。
 */

export interface PatentLitigationScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    chiefLegalOfficer: string
    ipLitigationPartner: string
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
  patentLitigationKeywordsTipsJa: string
}

export const PATENT_LITIGATION_SCENARIOS: PatentLitigationScenarioItem[] = [
  {
    id: 'patent-litigation-injunction',
    title: '半導體光刻專利侵權訴訟：初步禁制令動議與先前技術專利無效抗辯',
    titleJa: '半導体露光特許侵害訴訟：仮差止命令申立てと先行技術による無効抗弁',
    icon: '⚖️',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Chief Legal Officer: Good morning, Harrison. What is the status of the emergency preliminary injunction filed against us by Vanguard Microelectronics regarding our lithography patent?\nHarrison: Good news, Patricia. The federal district judge denied Vanguard's motion for an immediate preliminary injunction because they failed to establish irreparable harm. Our sales team may continue shipping our flagship processor lineup uninterrupted throughout the fiscal quarter.\nChief Legal Officer: That is a tremendous relief. How is our formal invalidity defense progressing before the Patent Trial and Appeal Board?\nHarrison: Our technical experts successfully identified three critical prior art research papers published eighteen months prior to Vanguard's priority filing date. We filed a petition for inter partes review, and we anticipate their independent claims will be declared completely invalid due to obviousness.`,
    dialogueRoles: {
      chiefLegalOfficer: 'Patricia (Chief Legal Officer)',
      ipLitigationPartner: 'Harrison (Lead IP Litigation Partner)',
    },
    questions: [
      {
        id: 'pl-1',
        question: 'Why did the federal district judge deny the plaintiff\'s motion for a preliminary injunction?',
        questionJa: '連邦地裁判事が原告の仮差止命令申立てを却下した理由は何ですか？',
        options: [
          'Because the plaintiff failed to pay the statutory filing fee',
          'Because the plaintiff failed to demonstrate irreparable harm',
          'Because the defendant agreed to shut down all manufacturing plants',
          'Because the patent had already expired twenty years ago',
        ],
        correctIndex: 1,
        explanationZh: 'Harrison 指出聯邦法院法官駁回了禁制令聲請，因為原告「failed to establish irreparable harm（未能證明存在無法彌補之實質損害）」。',
        explanationJa: '「原告が回復不能な損害（irreparable harm）を証明できなかったため」と説明されています。',
      },
      {
        id: 'pl-2',
        question: 'What evidence did the defense team uncover to petition for inter partes review?',
        questionJa: '弁護側は多方再審査（IPR）を申し立てるためにどのような証拠を発見しましたか？',
        options: [
          'Confidential marketing presentations from an unrelated retail distributor',
          'Three prior art papers published 18 months before the priority filing date',
          'A handwritten letter from the inventor admitting non-infringement',
          'An anonymous message on a public community bulletin board',
        ],
        correctIndex: 1,
        explanationZh: 'Harrison 說明技術專家找到了「three critical prior art research papers published eighteen months prior to Vanguard\'s priority filing date（原告專利優先權日 18 個月前發表的三篇關鍵先前技術文獻）」。',
        explanationJa: '「優先権日の18ヶ月前に公表された3本の先行技術論文（prior art papers）」を発見したためです。',
      },
    ],
    patentLitigationKeywordsTipsJa: 'TOEICでは「infringement（権利侵害）」「preliminary injunction（仮差止命令）」「irreparable harm（回復不能な損害）」「prior art（先行技術）」「invalidity / obviousness（無効・自明性）」「inter partes review / IPR（当事者系レビュー）」が頻出です。',
  },
]
