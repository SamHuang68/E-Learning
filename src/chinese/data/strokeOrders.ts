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
]
