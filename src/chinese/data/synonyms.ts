/**
 * 台灣華語：高頻近義詞辨析與語法搭配資料庫 (Synonyms Distinction Database)
 * 專門幫助日本語母語者釐清中文同義/近義詞的細微語義差別、詞性搭配與常見語病陷阱。
 */

export interface SynonymItem {
  id: string
  titleJa: string
  wordA: {
    zh: string
    pinyin: string
    posJa: string // 品詞
    definitionJa: string
    patternZh: string
    exampleZh: string
    exampleJa: string
  }
  wordB: {
    zh: string
    pinyin: string
    posJa: string
    definitionJa: string
    patternZh: string
    exampleZh: string
    exampleJa: string
  }
  coreDifferenceJa: string
  quiz: {
    questionZh: string
    options: string[]
    correctIndex: number
    explanationJa: string
  }
}

export const SYNONYM_ITEMS: SynonymItem[] = [
  {
    id: 'syn-heshi-shihe',
    titleJa: '合適（形容詞）vs 適合（動詞）',
    wordA: {
      zh: '合適',
      pinyin: 'héshì',
      posJa: '形容詞（ちょうどいい、適切だ）',
      definitionJa: '状態を表す。目的語を取ることはできない。',
      patternZh: '這件衣服很合適。/ 時間不太合適。',
      exampleZh: '這雙鞋子穿起來大小剛好，非常合適。',
      exampleJa: 'この靴はサイズがぴったりで、とても合っています。',
    },
    wordB: {
      zh: '適合',
      pinyin: 'shìhé',
      posJa: '動詞（〜に合っている、適している）',
      definitionJa: '動作・関係を表す。後ろに目的語（人・目的など）を伴う。',
      patternZh: '這件衣服很適合你。/ 這份工作適合新人。',
      exampleZh: '臺灣的冬天氣候溫和，非常適合旅遊。',
      exampleJa: '台湾の冬は気候が穏やかで、旅行にとても適しています。',
    },
    coreDifferenceJa: '「適合」は後ろに目的語を置く（適合＋人/事）！「合適」は単独で文末や修飾語として使う（很合適）。',
    quiz: {
      questionZh: '這件外套的顏色非常____你，看起來很年輕！',
      options: ['適合', '合適', '適用', '配合'],
      correctIndex: 0,
      explanationJa: '後ろに目的語「你」があるため、他動詞である「適合」が正解です（「合適」は目的語を取れません）。',
    },
  },
  {
    id: 'syn-changchang-wangwang',
    titleJa: '常常（頻度副詞）vs 往往（規則・条件）',
    wordA: {
      zh: '常常',
      pinyin: 'chángcháng',
      posJa: '副詞（よく、しばしば）',
      definitionJa: '単に動作の発生頻度が高いことを示す。主観的な希望や未来のことにも使える。',
      patternZh: '我常常去夜市吃小吃。',
      exampleZh: '放假時我常常和朋友去爬陽明山。',
      exampleJa: '休みの日はよく友達と陽明山に登りに行きます。',
    },
    wordB: {
      zh: '往往',
      pinyin: 'wǎngwǎng',
      posJa: '副詞（往々にして、〜しがちである）',
      definitionJa: '一定の条件や前提のもとで規則的に発生する傾向を表す。必ず前提条件を伴う。',
      patternZh: '一到週末，九份往往會塞車。',
      exampleZh: '工作壓力大時，人往往容易睡不好。',
      exampleJa: '仕事のプレッシャーが大きい時、人は往々にして睡眠が浅くなりがちです。',
    },
    coreDifferenceJa: '「往往」は「〜の条件の時、往々にしてこうなる」という規則的傾向に使い、前提条件が必要。「常常」は純粋な頻度。',
    quiz: {
      questionZh: '一到連續假期，雪山隧道____會大塞車。',
      options: ['往往', '常常', '時常', '平常'],
      correctIndex: 0,
      explanationJa: '「一到連續假期（連休になると）」という前提条件のもとで規則的に発生する傾向なので「往往」が最も適切です。',
    },
  },
  {
    id: 'syn-yiwei-renwei',
    titleJa: '以為（誤認）vs 認為（理性判断）',
    wordA: {
      zh: '以為',
      pinyin: 'yǐwéi',
      posJa: '動詞（〜と思い込んでいた）',
      definitionJa: '事実とは異なることを主観的に思い込んでいた場合に使う（実際は違っていた）。',
      patternZh: '我以為今天是星期六（結果不是）。',
      exampleZh: '我以為臺灣冬天很熱，結果寒流來時也很冷！',
      exampleJa: '台湾の冬はずっと暖かいと思い込んでいましたが、寒波が来るととても寒かったです！',
    },
    wordB: {
      zh: '認為',
      pinyin: 'rènwéi',
      posJa: '動詞（〜と考える、判断する）',
      definitionJa: '理性的・客観的な見解や判断を表す。',
      patternZh: '我認為這個方案最可行。',
      exampleZh: '專家認為每天睡滿七小時對健康最有幫助。',
      exampleJa: '専門家は毎日7時間寝ることが健康に最も有益であると考えています。',
    },
    coreDifferenceJa: '「以為」は過去の思い込み（実は違っていた）！「認為」は現在の真面目な意見・見解。',
    quiz: {
      questionZh: '我____他已經回日本了，沒想到剛才在捷運站遇到他。',
      options: ['以為', '認為', '覺得', '想著'],
      correctIndex: 0,
      explanationJa: '「日本に帰ったと思い込んでいた（が、実際にはまだ台湾にいた）」という事実と異なる思い込みなので「以為」が正解です。',
    },
  },
]
