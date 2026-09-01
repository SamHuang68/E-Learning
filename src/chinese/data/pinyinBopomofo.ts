/**
 * 台湾華語・中国語：拼音、注音符號與四聲聲調對照資料庫 (Pinyin & Bopomofo Guide)
 * 專為日本語母語者設計：提供聲母/韻母/注音對照、カタカナ発音の目安、四聲調値曲線與發音避坑技巧。
 */

export interface ToneData {
  tone: number
  nameZh: string
  nameJa: string
  mark: string
  pitchValue: string
  pitchDescriptionJa: string
  exampleChar: string
  examplePinyin: string
  exampleZh: string
  exampleJa: string
}

export interface PhonemeData {
  id: string
  pinyin: string
  bopomofo: string
  katakana: string
  categoryJa: string
  audioText: string
  tipsJa: string
  exampleChar: string
  exampleMeaningJa: string
}

export const CHINESE_TONES: ToneData[] = [
  {
    tone: 1,
    nameZh: '第一聲 (高平調)',
    nameJa: '第一声（高平調 55）',
    mark: 'ˉ (例: mā)',
    pitchValue: '55',
    pitchDescriptionJa: '高い音を平らにまっすぐ伸ばす（「ソ」の音の高さで「マー」）。',
    exampleChar: '媽',
    examplePinyin: 'mā',
    exampleZh: '媽媽 (お母さん)',
    exampleJa: '高く一定の高さで発音。日本語の「高」よりもさらに高めにキープ。',
  },
  {
    tone: 2,
    nameZh: '第二聲 (高升調)',
    nameJa: '第二声（上昇調 35）',
    mark: 'ˊ (例: má)',
    pitchValue: '35',
    pitchDescriptionJa: '中間の高さから一気に高く引き上げる（「えっ？」と聞き返すイメージ）。',
    exampleChar: '麻',
    examplePinyin: 'má',
    exampleZh: '麻煩 (面倒・お手数)',
    exampleJa: '下から上へシャープに上げる。尻すぼみにならないよう注意。',
  },
  {
    tone: 3,
    nameZh: '第三聲 (低降升調)',
    nameJa: '第三声（低降昇調 214 / 半三声 21）',
    mark: 'ˇ (例: mǎ)',
    pitchValue: '214',
    pitchDescriptionJa: '最も低い音までしっかり落とし、軽く上げる（日常会話では低く落とす半三声が多用）。',
    exampleChar: '馬',
    examplePinyin: 'mǎ',
    exampleZh: '馬上 (すぐに・直ちに)',
    exampleJa: 'しっかり低音部まで喉を緩めて沈み込ませるのがコツ。',
  },
  {
    tone: 4,
    nameZh: '第四聲 (全降調)',
    nameJa: '第四声（全下降調 51）',
    mark: 'ˋ (例: mà)',
    pitchValue: '51',
    pitchDescriptionJa: '一番高い音から一気に最も低い音へ急降下（カラスの「カーッ！」と叫ぶ勢い）。',
    exampleChar: '罵',
    examplePinyin: 'mà',
    exampleZh: '罵人 (叱る・悪口を言う)',
    exampleJa: 'ためらわずに高いところから真下へ叩き落とすように発音。',
  },
  {
    tone: 5,
    nameJa: '軽声（短軽調）',
    nameZh: '輕聲 (短輕調)',
    mark: '· (例: ma)',
    pitchValue: '0',
    pitchDescriptionJa: '前の音に添えて軽く短く添えるように発音。',
    exampleChar: '嗎',
    examplePinyin: 'ma',
    exampleZh: '你好嗎？ (お元気ですか？)',
    exampleJa: '力を抜いて短く添える。前の声調によって音の高さが自然に決まる。',
  },
]

/** 聲母 (21 Initials) */
export const INITIALS_DATA: PhonemeData[] = [
  { id: 'b', pinyin: 'b', bopomofo: 'ㄅ', katakana: 'ボー', categoryJa: '双唇音（無気音）', audioText: '波', tipsJa: '唇を閉じて破裂。息を出さない「濁らないバ行」。', exampleChar: '包', exampleMeaningJa: '包む・パン' },
  { id: 'p', pinyin: 'p', bopomofo: 'ㄆ', katakana: 'ポー', categoryJa: '双唇音（有気音）', audioText: '坡', tipsJa: '唇を弾いてティッシュが揺れるほど強い息を吹き出す。', exampleChar: '票', exampleMeaningJa: 'チケット' },
  { id: 'm', pinyin: 'm', bopomofo: 'ㄇ', katakana: 'モー', categoryJa: '双唇音（鼻音）', audioText: '摸', tipsJa: '日本語のマ行と同じ鼻音。', exampleChar: '買', exampleMeaningJa: '買う' },
  { id: 'f', pinyin: 'f', bopomofo: 'ㄈ', katakana: 'フォー', categoryJa: '唇歯音', audioText: '佛', tipsJa: '上の前歯を下唇に軽く当てて息を摩擦させる。', exampleChar: '飯', exampleMeaningJa: 'ご飯' },
  { id: 'd', pinyin: 'd', bopomofo: 'ㄉ', katakana: 'ドゥア', categoryJa: '舌尖音（無気音）', audioText: '得', tipsJa: '舌先を上の歯茎につけて息を出さずに弾く。', exampleChar: '大', exampleMeaningJa: '大きい' },
  { id: 't', pinyin: 't', bopomofo: 'ㄊ', katakana: 'トゥア', categoryJa: '舌尖音（有気音）', audioText: '特', tipsJa: '舌先を強く弾き、激しい息を一気に出す。', exampleChar: '太', exampleMeaningJa: '〜すぎる' },
  { id: 'n', pinyin: 'n', bopomofo: 'ㄋ', katakana: 'ヌア', categoryJa: '舌尖音（鼻音）', audioText: '訥', tipsJa: '舌先を上の歯茎につけて鼻から声を抜く。', exampleChar: '你', exampleMeaningJa: 'あなた' },
  { id: 'l', pinyin: 'l', bopomofo: 'ㄌ', katakana: 'ルア', categoryJa: '舌尖音（側音）', audioText: '勒', tipsJa: '舌先を歯茎につけて両脇から声を出す。', exampleChar: '來', exampleMeaningJa: '来る' },
  { id: 'g', pinyin: 'g', bopomofo: 'ㄍ', katakana: 'グア', categoryJa: '舌根音（無気音）', audioText: '哥', tipsJa: '舌の奥を軟口蓋につけて息をこらえる（濁らない）。', exampleChar: '高', exampleMeaningJa: '高い' },
  { id: 'k', pinyin: 'k', bopomofo: 'ㄎ', katakana: 'クア', categoryJa: '舌根音（有気音）', audioText: '科', tipsJa: '舌の奥から勢いよく息を吹き出す。', exampleChar: '看', exampleMeaningJa: '見る' },
  { id: 'h', pinyin: 'h', bopomofo: 'ㄏ', katakana: 'フア', categoryJa: '舌根音（摩擦音）', audioText: '喝', tipsJa: '喉の奥を軽く摩擦させて息を吐く。', exampleChar: '好', exampleMeaningJa: '良い' },
  { id: 'j', pinyin: 'j', bopomofo: 'ㄐ', katakana: 'ジー', categoryJa: '舌面音（無気音）', audioText: '基', tipsJa: '舌の前半分を上あごに密着させて息を漏らさない。', exampleChar: '家', exampleMeaningJa: '家・家族' },
  { id: 'q', pinyin: 'q', bopomofo: 'ㄑ', katakana: 'チー', categoryJa: '舌面音（有気音）', audioText: '欺', tipsJa: '舌面から鋭く強い息を吹き出す（チー）。', exampleChar: '去', exampleMeaningJa: '行く' },
  { id: 'x', pinyin: 'x', bopomofo: 'ㄒ', katakana: 'シー', categoryJa: '舌面音（摩擦音）', audioText: '希', tipsJa: '舌面と上あごの間から息を擦り出す。', exampleChar: '謝', exampleMeaningJa: '感謝する' },
  { id: 'zh', pinyin: 'zh', bopomofo: 'ㄓ', katakana: 'ジー(そり舌)', categoryJa: 'そり舌音（無気音）', audioText: '知', tipsJa: '舌先をスプーン状に後ろに反らせ、上あごに当てて発音。', exampleChar: '這', exampleMeaningJa: 'これ' },
  { id: 'ch', pinyin: 'ch', bopomofo: 'ㄔ', katakana: 'チー(そり舌)', categoryJa: 'そり舌音（有気音）', audioText: '吃', tipsJa: '反らせた舌先から強い息を爆発させる。', exampleChar: '茶', exampleMeaningJa: 'お茶' },
  { id: 'sh', pinyin: 'sh', bopomofo: 'ㄕ', katakana: 'シー(そり舌)', categoryJa: 'そり舌音（摩擦音）', audioText: '詩', tipsJa: '舌先を反らせた隙間から摩擦音を出す。', exampleChar: '是', exampleMeaningJa: '〜である' },
  { id: 'r', pinyin: 'r', bopomofo: 'ㄖ', katakana: '日(そり舌)', categoryJa: 'そり舌音（有声音）', audioText: '日', tipsJa: '舌先を反らせたまま喉の声を震わせる（日本語のラ行と異なる）。', exampleChar: '熱', exampleMeaningJa: '熱い' },
  { id: 'z', pinyin: 'z', bopomofo: 'ㄗ', katakana: 'ズー', categoryJa: '舌尖前音（無気音）', audioText: '資', tipsJa: '舌先を上の前歯の裏に当てて発音。息を出さない。', exampleChar: '在', exampleMeaningJa: '〜にいる・ある' },
  { id: 'c', pinyin: 'c', bopomofo: 'ㄘ', katakana: 'ツー', categoryJa: '舌尖前音（有気音）', audioText: '雌', tipsJa: '舌先から前歯の裏へ強く息を吹き出す。', exampleChar: '菜', exampleMeaningJa: '料理・野菜' },
  { id: 's', pinyin: 's', bopomofo: 'ㄙ', katakana: 'スー', categoryJa: '舌尖前音（摩擦音）', audioText: '思', tipsJa: '舌先と前歯の間から鋭く息を擦り出す。', exampleChar: '四', exampleMeaningJa: '四' },
]

/** 韻母 (16 Core Finals & Medials) */
export const FINALS_DATA: PhonemeData[] = [
  { id: 'a', pinyin: 'a', bopomofo: 'ㄚ', katakana: 'アー', categoryJa: '単母音', audioText: '啊', tipsJa: '口を大きく丸く開けて日本語の「ア」より深く発音。', exampleChar: '八', exampleMeaningJa: '八' },
  { id: 'o', pinyin: 'o', bopomofo: 'ㄛ', katakana: 'ウォー', categoryJa: '単母音', audioText: '喔', tipsJa: '口をすぼめて丸くし「オ」と発音。', exampleChar: '我', exampleMeaningJa: '私' },
  { id: 'e', pinyin: 'e', bopomofo: 'ㄜ', katakana: 'ウァー', categoryJa: '単母音', audioText: '鵝', tipsJa: '「エ」の口の形のまま喉の奥から「ウ」と声を出す。日本人最難関。', exampleChar: '熱', exampleMeaningJa: '熱い' },
  { id: 'i', pinyin: 'i', bopomofo: 'ㄧ', katakana: 'イー', categoryJa: '単母音（介音）', audioText: '衣', tipsJa: '口を左右にしっかり引いて「イー」と発音。', exampleChar: '一', exampleMeaningJa: '一' },
  { id: 'u', pinyin: 'u', bopomofo: 'ㄨ', katakana: 'ウー', categoryJa: '単母音（介音）', audioText: '烏', tipsJa: '唇を前に突き出して丸く窄めて発音。', exampleChar: '五', exampleMeaningJa: '五' },
  { id: 'yu', pinyin: 'ü', bopomofo: 'ㄩ', katakana: 'ユィー', categoryJa: '単母音（円唇）', audioText: '魚', tipsJa: '「イー」と言いながら唇だけを「ウ」の形にすぼめる。', exampleChar: '雨', exampleMeaningJa: '雨' },
  { id: 'ai', pinyin: 'ai', bopomofo: 'ㄞ', katakana: 'アイ', categoryJa: '複母音', audioText: '愛', tipsJa: '大きく「ア」から滑らかに「イ」へ移行。', exampleChar: '愛', exampleMeaningJa: '愛する' },
  { id: 'ei', pinyin: 'ei', bopomofo: 'ㄟ', katakana: 'エイ', categoryJa: '複母音', audioText: '欸', tipsJa: '「エ」から軽く「イ」へ。', exampleChar: '杯', exampleMeaningJa: 'コップ' },
  { id: 'ao', pinyin: 'ao', bopomofo: 'ㄠ', katakana: 'アオ', categoryJa: '複母音', audioText: '熬', tipsJa: '「ア」から口を丸めて「オ」へ。', exampleChar: '高', exampleMeaningJa: '高い' },
  { id: 'ou', pinyin: 'ou', bopomofo: 'ㄡ', katakana: 'オウ', categoryJa: '複母音', audioText: '歐', tipsJa: '「オ」から窄めて「ウ」へ。', exampleChar: '狗', exampleMeaningJa: '犬' },
  { id: 'an', pinyin: 'an', bopomofo: 'ㄢ', katakana: 'アン(前鼻音)', categoryJa: '鼻母音', audioText: '安', tipsJa: '舌先を上の前歯の裏につけて終わる「アン」（案内）。', exampleChar: '三', exampleMeaningJa: '三' },
  { id: 'en', pinyin: 'en', bopomofo: 'ㄣ', katakana: 'エン(前鼻音)', categoryJa: '鼻母音', audioText: '恩', tipsJa: '曖昧な「ウ」から舌先を前歯につけて「ン」。', exampleChar: '門', exampleMeaningJa: 'ドア・門' },
  { id: 'ang', pinyin: 'ang', bopomofo: 'ㄤ', katakana: 'アン(後鼻音)', categoryJa: '鼻母音', audioText: '昂', tipsJa: '舌の奥を持ち上げて喉を響かせる「アン」（案外）。', exampleChar: '湯', exampleMeaningJa: 'スープ' },
  { id: 'eng', pinyin: 'eng', bopomofo: 'ㄥ', katakana: 'エン(後鼻音)', categoryJa: '鼻母音', audioText: '鞥', tipsJa: '喉の奥から響かせる鼻音。', exampleChar: '冷', exampleMeaningJa: '冷たい' },
  { id: 'er', pinyin: 'er', bopomofo: 'ㄦ', katakana: 'アール(捲舌)', categoryJa: '巻舌母音', audioText: '兒', tipsJa: '「ア」を発音しながら舌先を奥へ巻き上げる。', exampleChar: '二', exampleMeaningJa: '二' },
]

/** 常用基礎單字拼音練習 */
export const PINYIN_DRILL_WORDS = [
  { zh: '你好', pinyin: 'nǐ hǎo', bopomofo: 'ㄋㄧˇ ㄏㄠˇ', ja: 'こんにちは', tipJa: '第3声＋第3声 ➜ 前の「你」が第2声（ní hǎo）に変調！' },
  { zh: '謝謝', pinyin: 'xiè xie', bopomofo: 'ㄒㄧㄝˋ ˙ㄒㄧㄝ', ja: 'ありがとう', tipJa: '第4声＋軽声。後ろの音は短く軽く添える。' },
  { zh: '珍珠奶茶', pinyin: 'zhēn zhū nǎi chá', bopomofo: 'ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ', ja: 'タピオカミルクティー', tipJa: 'zh(そり舌) ➜ zh(そり舌) ➜ nǎi(第3声) ➜ chá(第2声上昇)。' },
  { zh: '好吃', pinyin: 'hǎo chī', bopomofo: 'ㄏㄠˇ ㄔ', ja: '美味しい', tipJa: 'chī はそり舌有気音。口を丸めずにしっかり息を出す。' },
  { zh: '多少錢？', pinyin: 'duō shǎo qián?', bopomofo: 'ㄉㄨㄛ ㄕㄠˇ ㄑㄧㄢˊ', ja: 'いくらですか？', tipJa: 'qián は有気音 q ＋ 前鼻音 ián。' },
  { zh: '不客氣', pinyin: 'bú kè qi', bopomofo: 'ㄅㄨˊ ㄎㄜˋ ˙ㄑㄧ', ja: 'どういたしまして', tipJa: '「不」は第4声の前で第2声（bú）に変調！' },
  { zh: '對不起', pinyin: 'duì bu qǐ', bopomofo: 'ㄉㄨㄟˋ ˙ㄅㄨ ㄑㄧˇ', ja: 'すみません・ごめんなさい', tipJa: '真ん中の「不」は軽声で短く発音。' },
  { zh: '捷運站', pinyin: 'jié yùn zhàn', bopomofo: 'ㄐㄧㄝˊ ㄩㄣˋ ㄓㄢˋ', ja: 'MRT（地下鉄）の駅', tipJa: 'jié(第2声) ➜ yùn(第4声) ➜ zhàn(そり舌第4声)。' },
]
