export type KanaScript = 'hiragana' | 'katakana'

export type KanaCell = {
  char: string
  romaji: string
  /** IPA-ish tip for beginners */
  tip?: string
}

export type KanaRow = {
  id: string
  label: string
  labelZh: string
  cells: (KanaCell | null)[]
}

const H_BASIC: KanaRow[] = [
  {
    id: 'a',
    label: 'あ行',
    labelZh: '母音',
    cells: [
      { char: 'あ', romaji: 'a', tip: '張口「啊」' },
      { char: 'い', romaji: 'i', tip: '微笑「衣」' },
      { char: 'う', romaji: 'u', tip: '嘴唇微圓「嗚」' },
      { char: 'え', romaji: 'e', tip: '「欸」' },
      { char: 'お', romaji: 'o', tip: '「喔」' },
    ],
  },
  {
    id: 'ka',
    label: 'か行',
    labelZh: 'K 音',
    cells: [
      { char: 'か', romaji: 'ka' },
      { char: 'き', romaji: 'ki' },
      { char: 'く', romaji: 'ku' },
      { char: 'け', romaji: 'ke' },
      { char: 'こ', romaji: 'ko' },
    ],
  },
  {
    id: 'sa',
    label: 'さ行',
    labelZh: 'S 音',
    cells: [
      { char: 'さ', romaji: 'sa' },
      { char: 'し', romaji: 'shi', tip: '接近「西」不是 si' },
      { char: 'す', romaji: 'su' },
      { char: 'せ', romaji: 'se' },
      { char: 'そ', romaji: 'so' },
    ],
  },
  {
    id: 'ta',
    label: 'た行',
    labelZh: 'T 音',
    cells: [
      { char: 'た', romaji: 'ta' },
      { char: 'ち', romaji: 'chi', tip: '接近「奇」不是 ti' },
      { char: 'つ', romaji: 'tsu', tip: '「滋」帶一點摩擦' },
      { char: 'て', romaji: 'te' },
      { char: 'と', romaji: 'to' },
    ],
  },
  {
    id: 'na',
    label: 'な行',
    labelZh: 'N 音',
    cells: [
      { char: 'な', romaji: 'na' },
      { char: 'に', romaji: 'ni' },
      { char: 'ぬ', romaji: 'nu' },
      { char: 'ね', romaji: 'ne' },
      { char: 'の', romaji: 'no' },
    ],
  },
  {
    id: 'ha',
    label: 'は行',
    labelZh: 'H 音',
    cells: [
      { char: 'は', romaji: 'ha', tip: '助詞時讀 wa' },
      { char: 'ひ', romaji: 'hi' },
      { char: 'ふ', romaji: 'fu', tip: '接近「夫」不是 hu' },
      { char: 'へ', romaji: 'he', tip: '助詞時讀 e' },
      { char: 'ほ', romaji: 'ho' },
    ],
  },
  {
    id: 'ma',
    label: 'ま行',
    labelZh: 'M 音',
    cells: [
      { char: 'ま', romaji: 'ma' },
      { char: 'み', romaji: 'mi' },
      { char: 'む', romaji: 'mu' },
      { char: 'め', romaji: 'me' },
      { char: 'も', romaji: 'mo' },
    ],
  },
  {
    id: 'ya',
    label: 'や行',
    labelZh: 'Y 音',
    cells: [
      { char: 'や', romaji: 'ya' },
      null,
      { char: 'ゆ', romaji: 'yu' },
      null,
      { char: 'よ', romaji: 'yo' },
    ],
  },
  {
    id: 'ra',
    label: 'ら行',
    labelZh: 'R 音',
    cells: [
      { char: 'ら', romaji: 'ra', tip: '舌尖輕彈，介於 l/r' },
      { char: 'り', romaji: 'ri' },
      { char: 'る', romaji: 'ru' },
      { char: 'れ', romaji: 're' },
      { char: 'ろ', romaji: 'ro' },
    ],
  },
  {
    id: 'wa',
    label: 'わ行',
    labelZh: 'W／撥音',
    cells: [
      { char: 'わ', romaji: 'wa' },
      null,
      null,
      null,
      { char: 'を', romaji: 'o', tip: '助詞「を」讀 o' },
    ],
  },
  {
    id: 'n',
    label: 'ん',
    labelZh: '撥音',
    cells: [{ char: 'ん', romaji: 'n', tip: '唯一的單輔音假名' }, null, null, null, null],
  },
]

const H_DAKUTEN: KanaRow[] = [
  {
    id: 'ga',
    label: 'が行',
    labelZh: '濁音 G',
    cells: [
      { char: 'が', romaji: 'ga' },
      { char: 'ぎ', romaji: 'gi' },
      { char: 'ぐ', romaji: 'gu' },
      { char: 'げ', romaji: 'ge' },
      { char: 'ご', romaji: 'go' },
    ],
  },
  {
    id: 'za',
    label: 'ざ行',
    labelZh: '濁音 Z',
    cells: [
      { char: 'ざ', romaji: 'za' },
      { char: 'じ', romaji: 'ji', tip: '接近「機」' },
      { char: 'ず', romaji: 'zu' },
      { char: 'ぜ', romaji: 'ze' },
      { char: 'ぞ', romaji: 'zo' },
    ],
  },
  {
    id: 'da',
    label: 'だ行',
    labelZh: '濁音 D',
    cells: [
      { char: 'だ', romaji: 'da' },
      { char: 'ぢ', romaji: 'ji', tip: '少用，音近 じ' },
      { char: 'づ', romaji: 'zu', tip: '少用，音近 ず' },
      { char: 'で', romaji: 'de' },
      { char: 'ど', romaji: 'do' },
    ],
  },
  {
    id: 'ba',
    label: 'ば行',
    labelZh: '濁音 B',
    cells: [
      { char: 'ば', romaji: 'ba' },
      { char: 'び', romaji: 'bi' },
      { char: 'ぶ', romaji: 'bu' },
      { char: 'べ', romaji: 'be' },
      { char: 'ぼ', romaji: 'bo' },
    ],
  },
  {
    id: 'pa',
    label: 'ぱ行',
    labelZh: '半濁音 P',
    cells: [
      { char: 'ぱ', romaji: 'pa' },
      { char: 'ぴ', romaji: 'pi' },
      { char: 'ぷ', romaji: 'pu' },
      { char: 'ぺ', romaji: 'pe' },
      { char: 'ぽ', romaji: 'po' },
    ],
  },
]

const K_BASIC: KanaRow[] = [
  {
    id: 'a',
    label: 'ア行',
    labelZh: '母音',
    cells: [
      { char: 'ア', romaji: 'a' },
      { char: 'イ', romaji: 'i' },
      { char: 'ウ', romaji: 'u' },
      { char: 'エ', romaji: 'e' },
      { char: 'オ', romaji: 'o' },
    ],
  },
  {
    id: 'ka',
    label: 'カ行',
    labelZh: 'K 音',
    cells: [
      { char: 'カ', romaji: 'ka' },
      { char: 'キ', romaji: 'ki' },
      { char: 'ク', romaji: 'ku' },
      { char: 'ケ', romaji: 'ke' },
      { char: 'コ', romaji: 'ko' },
    ],
  },
  {
    id: 'sa',
    label: 'サ行',
    labelZh: 'S 音',
    cells: [
      { char: 'サ', romaji: 'sa' },
      { char: 'シ', romaji: 'shi' },
      { char: 'ス', romaji: 'su' },
      { char: 'セ', romaji: 'se' },
      { char: 'ソ', romaji: 'so' },
    ],
  },
  {
    id: 'ta',
    label: 'タ行',
    labelZh: 'T 音',
    cells: [
      { char: 'タ', romaji: 'ta' },
      { char: 'チ', romaji: 'chi' },
      { char: 'ツ', romaji: 'tsu' },
      { char: 'テ', romaji: 'te' },
      { char: 'ト', romaji: 'to' },
    ],
  },
  {
    id: 'na',
    label: 'ナ行',
    labelZh: 'N 音',
    cells: [
      { char: 'ナ', romaji: 'na' },
      { char: 'ニ', romaji: 'ni' },
      { char: 'ヌ', romaji: 'nu' },
      { char: 'ネ', romaji: 'ne' },
      { char: 'ノ', romaji: 'no' },
    ],
  },
  {
    id: 'ha',
    label: 'ハ行',
    labelZh: 'H 音',
    cells: [
      { char: 'ハ', romaji: 'ha' },
      { char: 'ヒ', romaji: 'hi' },
      { char: 'フ', romaji: 'fu' },
      { char: 'ヘ', romaji: 'he' },
      { char: 'ホ', romaji: 'ho' },
    ],
  },
  {
    id: 'ma',
    label: 'マ行',
    labelZh: 'M 音',
    cells: [
      { char: 'マ', romaji: 'ma' },
      { char: 'ミ', romaji: 'mi' },
      { char: 'ム', romaji: 'mu' },
      { char: 'メ', romaji: 'me' },
      { char: 'モ', romaji: 'mo' },
    ],
  },
  {
    id: 'ya',
    label: 'ヤ行',
    labelZh: 'Y 音',
    cells: [
      { char: 'ヤ', romaji: 'ya' },
      null,
      { char: 'ユ', romaji: 'yu' },
      null,
      { char: 'ヨ', romaji: 'yo' },
    ],
  },
  {
    id: 'ra',
    label: 'ラ行',
    labelZh: 'R 音',
    cells: [
      { char: 'ラ', romaji: 'ra' },
      { char: 'リ', romaji: 'ri' },
      { char: 'ル', romaji: 'ru' },
      { char: 'レ', romaji: 're' },
      { char: 'ロ', romaji: 'ro' },
    ],
  },
  {
    id: 'wa',
    label: 'ワ行',
    labelZh: 'W／撥音',
    cells: [
      { char: 'ワ', romaji: 'wa' },
      null,
      null,
      null,
      { char: 'ヲ', romaji: 'o' },
    ],
  },
  {
    id: 'n',
    label: 'ン',
    labelZh: '撥音',
    cells: [{ char: 'ン', romaji: 'n' }, null, null, null, null],
  },
]

const K_DAKUTEN: KanaRow[] = [
  {
    id: 'ga',
    label: 'ガ行',
    labelZh: '濁音 G',
    cells: [
      { char: 'ガ', romaji: 'ga' },
      { char: 'ギ', romaji: 'gi' },
      { char: 'グ', romaji: 'gu' },
      { char: 'ゲ', romaji: 'ge' },
      { char: 'ゴ', romaji: 'go' },
    ],
  },
  {
    id: 'za',
    label: 'ザ行',
    labelZh: '濁音 Z',
    cells: [
      { char: 'ザ', romaji: 'za' },
      { char: 'ジ', romaji: 'ji' },
      { char: 'ズ', romaji: 'zu' },
      { char: 'ゼ', romaji: 'ze' },
      { char: 'ゾ', romaji: 'zo' },
    ],
  },
  {
    id: 'da',
    label: 'ダ行',
    labelZh: '濁音 D',
    cells: [
      { char: 'ダ', romaji: 'da' },
      { char: 'ヂ', romaji: 'ji' },
      { char: 'ヅ', romaji: 'zu' },
      { char: 'デ', romaji: 'de' },
      { char: 'ド', romaji: 'do' },
    ],
  },
  {
    id: 'ba',
    label: 'バ行',
    labelZh: '濁音 B',
    cells: [
      { char: 'バ', romaji: 'ba' },
      { char: 'ビ', romaji: 'bi' },
      { char: 'ブ', romaji: 'bu' },
      { char: 'ベ', romaji: 'be' },
      { char: 'ボ', romaji: 'bo' },
    ],
  },
  {
    id: 'pa',
    label: 'パ行',
    labelZh: '半濁音 P',
    cells: [
      { char: 'パ', romaji: 'pa' },
      { char: 'ピ', romaji: 'pi' },
      { char: 'プ', romaji: 'pu' },
      { char: 'ペ', romaji: 'pe' },
      { char: 'ポ', romaji: 'po' },
    ],
  },
]

export const VOWEL_HEADERS = ['a', 'i', 'u', 'e', 'o'] as const

export function getKanaRows(
  script: KanaScript,
  includeDakuten = true,
): KanaRow[] {
  if (script === 'hiragana') {
    return includeDakuten ? [...H_BASIC, ...H_DAKUTEN] : H_BASIC
  }
  return includeDakuten ? [...K_BASIC, ...K_DAKUTEN] : K_BASIC
}

export function flattenKana(rows: KanaRow[]): KanaCell[] {
  return rows.flatMap((row) => row.cells.filter((c): c is KanaCell => c !== null))
}

export function getRowById(script: KanaScript, rowId: string): KanaRow | undefined {
  return getKanaRows(script, true).find((r) => r.id === rowId)
}

/** Recommended zero-to-hero unlock order */
export const LEARN_ORDER = [
  'a',
  'ka',
  'sa',
  'ta',
  'na',
  'ha',
  'ma',
  'ya',
  'ra',
  'wa',
  'n',
  'ga',
  'za',
  'da',
  'ba',
  'pa',
] as const

export type LearnRowId = (typeof LEARN_ORDER)[number]
