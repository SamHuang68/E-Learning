/**
 * 台灣華語：高頻繁體漢字筆順、部首與字形演變資料庫 (Traditional Chinese Stroke Order Database)
 * 專為日本語母語者提供標準筆順口訣、部首意義與注音拼讀。
 */

export interface ChineseStrokeItem {
  id: string
  char: string
  pinyin: string
  bopomofo: string
  meaningJa: string
  radical: string
  strokeCount: number
  strokeSequence: string[]
  strokeRuleJa: string
  exampleSentenceZh: string
  exampleSentenceJa: string
}

export const STROKE_CHARACTERS: ChineseStrokeItem[] = [
  {
    id: 'char-tai',
    char: '臺',
    pinyin: 'tái',
    bopomofo: 'ㄊㄞˊ',
    meaningJa: '台（台湾の「台」の正体字・繁体字）',
    radical: '至',
    strokeCount: 14,
    strokeSequence: ['一', '厶', '口', '吉', '冖', '至'],
    strokeRuleJa: '上から下へ、外側を先に書いてから中を埋める原則。',
    exampleSentenceZh: '歡迎來到臺灣！',
    exampleSentenceJa: '台湾へようこそ！',
  },
  {
    id: 'char-wan',
    char: '灣',
    pinyin: 'wān',
    bopomofo: 'ㄨㄢ',
    meaningJa: '湾（台湾の「湾」の正体字・繁体字）',
    radical: '水 (氵)',
    strokeCount: 25,
    strokeSequence: ['氵', '糹', '言', '糹', '弓'],
    strokeRuleJa: 'さんずい（氵）を左に書き、右側の「䜌」を上から、最後に「弓」を底に書く。',
    exampleSentenceZh: '臺灣的水果非常好吃。',
    exampleSentenceJa: '台湾のフルーツはとても美味しいです。',
  },
  {
    id: 'char-xie',
    char: '謝',
    pinyin: 'xiè',
    bopomofo: 'ㄒㄧㄝˋ',
    meaningJa: '感謝する、ありがとう（謝謝）',
    radical: '言 (訁)',
    strokeCount: 17,
    strokeSequence: ['訁', '身', '寸'],
    strokeRuleJa: '左（言）中（身）右（寸）の順序で左から右へ均等にバランスよく配置する。',
    exampleSentenceZh: '謝謝你的幫忙！',
    exampleSentenceJa: '手伝ってくれてありがとうございます！',
  },
  {
    id: 'char-qing',
    char: '請',
    pinyin: 'qǐng',
    bopomofo: 'ㄑㄧㄥˇ',
    meaningJa: '〜してください、どうぞ（丁寧な依頼）',
    radical: '言 (訁)',
    strokeCount: 15,
    strokeSequence: ['訁', '靑'],
    strokeRuleJa: 'ごんべん（訁）を細めに左に書き、右側の「靑」は上部の「龶」から順に書く。',
    exampleSentenceZh: '請給我一杯半糖微冰的珍珠奶茶。',
    exampleSentenceJa: 'タピオカミルクティーを半糖・微氷で1杯ください。',
  },
  {
    id: 'char-cha',
    char: '茶',
    pinyin: 'chá',
    bopomofo: 'ㄔㄚˊ',
    meaningJa: 'お茶（台湾烏龍茶、タピオカティー等）',
    radical: '艸 (艹)',
    strokeCount: 9,
    strokeSequence: ['艹', '人', '木'],
    strokeRuleJa: 'くさかんむり（艹）を書き、次に「人」の屋根を広げ、中央に「ホ/木」を配置。',
    exampleSentenceZh: '這杯阿里山烏龍茶很香。',
    exampleSentenceJa: 'この阿里山烏龍茶はとても香りが良いです。',
  },
  {
    id: 'char-ren',
    char: '人',
    pinyin: 'rén',
    bopomofo: 'ㄖㄣˊ',
    meaningJa: '人',
    radical: '人 (亻)',
    strokeCount: 2,
    strokeSequence: ['ノ', '丶'],
    strokeRuleJa: '左払い（ノ）を先に、右点（丶）を後に。',
    exampleSentenceZh: '人是萬物之靈。',
    exampleSentenceJa: '人は万物の霊である。',
  },
  {
    id: 'char-da',
    char: '大',
    pinyin: 'dà',
    bopomofo: 'ㄉㄚˋ',
    meaningJa: '大きい',
    radical: '大',
    strokeCount: 3,
    strokeSequence: ['一', '人', '人'],
    strokeRuleJa: '横（一）を底に、左右の払いを均等に。',
    exampleSentenceZh: '臺灣很大，很美。',
    exampleSentenceJa: '台湾は大きくて美しい。',
  },
  {
    id: 'char-zhong',
    char: '中',
    pinyin: 'zhōng',
    bopomofo: 'ㄓㄨㄥ',
    meaningJa: '中（中央、中國）',
    radical: '丨',
    strokeCount: 4,
    strokeSequence: ['丨', '口', '一'],
    strokeRuleJa: '縦線を貫通させてから口を閉じる。',
    exampleSentenceZh: '我們住在中國。',
    exampleSentenceJa: '私たちは中国に住んでいます。',
  },
  {
    id: 'char-guo',
    char: '國',
    pinyin: 'guó',
    bopomofo: 'ㄍㄨㄛˊ',
    meaningJa: '国',
    radical: '囗',
    strokeCount: 11,
    strokeSequence: ['囗', '戈', '口', '一'],
    strokeRuleJa: '囲み枠（囗）を先に、外側の戈を最後に。',
    exampleSentenceZh: '中華民國萬歲！',
    exampleSentenceJa: '中華民国万歳！',
  },
  {
    id: 'char-xue',
    char: '學',
    pinyin: 'xué',
    bopomofo: 'ㄒㄩㄝˊ',
    meaningJa: '学ぶ、学ぶ',
    radical: '子',
    strokeCount: 16,
    strokeSequence: ['爫', '冖', '子', '一', '丿'],
    strokeRuleJa: '上部の爪を先に、下部の子をバランスよく。',
    exampleSentenceZh: '我們一起學習中文。',
    exampleSentenceJa: '一緒に中国語を勉強しましょう。',
  },
]
