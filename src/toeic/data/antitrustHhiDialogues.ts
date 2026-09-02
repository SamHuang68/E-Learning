/**
 * TOEIC 多益英語：反托拉斯司法審查、HHI 市場集中度指數與併購禁制令特訓題庫 (Antitrust HHI Index & Merger Challenge)
 * 涵蓋多益 Part 3/4/7 最常出現的跨國反壟斷司法審查 (DOJ Antitrust Division & FTC Merger Guidelines)、赫芬達爾-赫希曼指數 (Herfindahl-Hirschman Index / HHI)、市場份額平方和精算 (Sum of Squared Market Shares)、高集中市場門檻 (HHI > 1800)、增幅超過100點推定壟斷 (Presumption of Enhanced Market Power ΔHHI > 100)、初步禁制令 (Preliminary Injunction) 及結構性資產剝離 (Structural Asset Divestiture)。
 */

export interface AntitrustHhiScenarioItem {
  id: string
  title: string
  titleJa: string
  icon: string
  targetAccent: 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  accentLabel: string
  audioScript: string
  dialogueRoles: {
    chiefLegalCounsel: string
    seniorAntitrustEconomist: string
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
  antitrustHhiKeywordsTipsJa: string
}

export const ANTITRUST_HHI_SCENARIOS: AntitrustHhiScenarioItem[] = [
  {
    id: 'antitrust-hhi-merger-review',
    title: '電信巨頭合併案反壟斷審查：HHI 指數激增 340 點與司法部訴訟風險',
    titleJa: '通信大手合併の反トラスト審査：HHI指数340ポイント急増と司法省の提訴リスク',
    icon: '📊',
    targetAccent: 'en-US',
    accentLabel: '美式口音 🇺🇸',
    audioScript: `Chief Legal Counsel: Marcus, have you received the preliminary economic assessment from our antitrust consulting firm regarding our proposed acquisition of Celldyne Telecom?\nMarcus: Yes, Eleanor. The econometric data indicates severe regulatory hurdles from the Department of Justice. Our relevant geographic market is already moderately concentrated with a baseline Herfindahl-Hirschman Index of 1,950.\nChief Legal Counsel: And what is the projected change in market concentration post-merger?\nMarcus: The transaction would combine our thirty percent market share with Celldyne's twelve percent, yielding an HHI surge of seven百 and twenty points, well above the hundred-point threshold that triggers an automatic presumption of anticompetitive harm.\nChief Legal Counsel: In that case, the DOJ will almost certainly file a civil lawsuit seeking a preliminary injunction in federal district court unless we propose substantial structural divestitures of our regional wireless spectrum holdings.`,
    dialogueRoles: {
      chiefLegalCounsel: 'Eleanor (Chief Legal Counsel)',
      seniorAntitrustEconomist: 'Marcus (Senior Regulatory Economist)',
    },
    questions: [
      {
        id: 'hhi-1',
        question: 'Why does the proposed merger face an immediate presumption of anticompetitive harm?',
        questionJa: '提案された合併が「反競争的被害の法的推定（presumption of harm）」を直ちに受けるのはなぜですか？',
        options: [
          'Because both companies failed to submit their quarterly balance sheets on time',
          'Because the post-merger HHI increase exceeds the regulatory threshold in an already concentrated market',
          'Because the chief executive officers gave inaccurate testimony to the senate',
          'Because foreign sovereign wealth funds hold controlling equity stakes in both firms',
        ],
        correctIndex: 1,
        explanationZh: 'Marcus 指出基準 HHI 已達 1950（高度集中），而合併後 HHI 增幅遠超過引發反競爭假定的 100 點門檻（`well above the hundred-point threshold that triggers an automatic presumption of anticompetitive harm`）。',
        explanationJa: 'すでに高度に集中した市場（HHI 1,950）において、合併によるHHIの増加が規制上の基準値（100ポイント）を大幅に超過したためです。',
      },
      {
        id: 'hhi-2',
        question: 'What remedial action does Eleanor propose to prevent the Department of Justice from blocking the deal?',
        questionJa: '司法省による取引差し止めを防ぐために、エレノアはどのような救済措置を提案していますか？',
        options: [
          'Offering substantial structural divestitures of regional wireless spectrum holdings',
          'Paying a voluntary ten-million-dollar civil penalty to the federal trade commission',
          'Replacing the entire senior executive board of Celldyne Telecom',
          'Switching the company\'s operational headquarters to a tax haven',
        ],
        correctIndex: 0,
        explanationZh: 'Eleanor 提議透過「propose substantial structural divestitures of our regional wireless spectrum holdings（承諾實質結構性剝離部分區域無線頻譜資產）」以化解司法部的阻擋。',
        explanationJa: '「地域的な無線周波数帯の保有資産を大幅に構造的売却・分離（structural divestitures）すること」を提案しています。',
      },
    ],
    antitrustHhiKeywordsTipsJa: 'TOEICでは「Herfindahl-Hirschman Index / HHI（市場集中度指数）」「Department of Justice / DOJ（米司法省反トラスト局）」「preliminary injunction（仮差止命令）」「structural divestiture（構造的資産売却・事業分離）」「market share（市場占有率）」が頻出です。',
  },
]
