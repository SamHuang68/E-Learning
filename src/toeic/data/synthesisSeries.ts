/** Teaching map only. Not a TOEIC score, certificate, or official item bank. */

export type SeriesPoint = { zh: string; en: string; ja: string }

export type SynthesisSeries = {
  id: string
  n: string
  zh: string
  en: string
  ja: string
  zhLead: string
  enLead: string
  jaLead: string
  points: SeriesPoint[]
}

export const SYNTHESIS_SERIES: SynthesisSeries[] = [
  {
    id: 'pos',
    n: '1',
    zh: '詞類與構詞',
    en: 'Parts of speech and morphology',
    ja: '品詞と語形成',
    zhLead: '詞在句中的角色，以及字是怎麼長出來的。',
    enLead: 'What job a word does, and how words are built.',
    jaLead: '語の役割と、語がどう作られるか。',
    points: [
      { zh: '名詞、代名詞、動詞、形容詞、副詞、介系詞、連接詞、感嘆詞，再加上限定詞與冠詞。', en: 'Nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions, interjections, plus determiners and articles.', ja: '名詞・代名詞・動詞・形容詞・副詞・前置詞・接続詞・感嘆詞に、限定詞と冠詞。' },
      { zh: '構詞：前綴、字根、後綴、複合詞。後綴常決定詞性（-tion、-able、-ly）。', en: 'Morphology: prefixes, roots, suffixes, compounds. Suffixes often set the part of speech.', ja: '接頭辞・語根・接尾辞・複合語。接尾辞が品詞を決めることが多い。' },
      { zh: '介系詞先分四類：時間、空間、方向、抽象（原因、方式、工具）。', en: 'Split prepositions into time, place, direction, and abstract relations.', ja: '前置詞は時間・空間・方向・抽象関係に分ける。' },
      { zh: 'in / on / at：at 是點，on 是面或某一天，in 是範圍（月、年、城市、容器）。', en: 'in / on / at: at is a point, on is a surface or a day, in is a container (month, year, city).', ja: 'at は点、on は面や日付、in は範囲。' },
      { zh: '固定搭配要整組記：depend on、good at、interested in。不要只背介系詞表。', en: 'Learn fixed pairs: depend on, good at, interested in. Do not memorize prepositions alone.', ja: 'depend on / good at / interested in はセットで覚える。' },
    ],
  },
  {
    id: 'syntax',
    n: '2',
    zh: '句法與句構',
    en: 'Syntax and sentence structure',
    ja: '統語と文型',
    zhLead: '把詞收成合乎規則的句子。',
    enLead: 'How words become a grammatical sentence.',
    jaLead: '語を文法どおりの文にする規則。',
    points: [
      { zh: '五大句型：S+V、S+V+O、S+V+C、S+V+IO+DO、S+V+O+C。', en: 'Five patterns: SV, SVO, SVC, SV IO DO, SVOC.', ja: '五文型：SV、SVO、SVC、SVOO、SVOC。' },
      { zh: '複雜度：簡單句、對等複合句、從屬複雜句、兩者都有的複合複雜句。', en: 'Simple, compound, complex, and compound-complex sentences.', ja: '単文・重文・複文・混文。' },
      { zh: '三種子句：名詞子句、關係子句、副詞子句（時間、條件、讓步、因果）。', en: 'Noun clauses, relative clauses, and adverb clauses.', ja: '名詞節・関係節・副詞節。' },
      { zh: '特殊句：倒裝、分裂強調句、祈使句、省略。先確認主詞動詞還在。', en: 'Inversion, clefts, imperatives, ellipsis. Check that subject and verb are still there.', ja: '倒置・強調・命令・省略。主語と動詞は残っているか確認。' },
    ],
  },
  {
    id: 'verbal',
    n: '3',
    zh: '動詞系統',
    en: 'Verbal system',
    ja: '動詞システム',
    zhLead: '時態、語態、語氣、非限定動詞、主謂一致。密度最高，用對照表整理。',
    enLead: 'Tense, voice, mood, non-finite verbs, and agreement. Use a grid, not a word list.',
    jaLead: '時制・態・法・非定形・一致。一覧表で整理する。',
    points: [
      { zh: '十二時態是四個時間乘四種貌：簡單、進行、完成、完成進行。', en: 'Twelve forms: four times by four aspects (simple, progressive, perfect, perfect progressive).', ja: '12時制は四つの時と四つの相。' },
      { zh: '被動：be + p.p.。使役被動與授與動詞被動要另列，不要跟一般被動混。', en: 'Passive is be + past participle. Causative and ditransitive passives are separate rows.', ja: '受動態は be + 過去分詞。使役受動は別枠。' },
      { zh: '假設語氣分三格：與現在、過去、未來事實相反。建議／要求動詞後面用原形。', en: 'Subjunctive: contrary to present, past, or future. Suggest/demand take a base verb.', ja: '仮定法は現在・過去・未来の事実と反対。提案・要求は原形。' },
      { zh: '非限定：to V、V-ing、分詞構句。先問它是主詞、受詞，還是修飾。', en: 'Infinitive, gerund, participle. Ask whether it is subject, object, or modifier.', ja: '不定詞・動名詞・分詞。主語か目的語か修飾か。' },
    ],
  },
  {
    id: 'mechanics',
    n: '4',
    zh: '標點、大小寫與篇章銜接',
    en: 'Mechanics and discourse',
    ja: '表記と談話',
    zhLead: '書面清楚，以及句子之間怎麼接。',
    enLead: 'Clear writing marks, and how sentences stay connected.',
    jaLead: '表記の規則と、文と文のつなぎ。',
    points: [
      { zh: '句末：句點、問號、驚嘆號。停頓：逗號、分號、冒號。', en: 'End marks: period, question mark, exclamation. Pauses: comma, semicolon, colon.', ja: '終止符と、読点・セミコロン・コロン。' },
      { zh: '連字號連複合詞；破折號插入說明。撇號用於縮寫與所有格，its 不是 it is。', en: 'Hyphen joins words. A dash inserts a remark. Apostrophe is contraction or possessive; its is not it is.', ja: 'ハイフンとダッシュを分ける。its は it is ではない。' },
      { zh: '大寫：句首、專有名詞、月份星期、標題的主要詞。', en: 'Capitals: sentence start, proper nouns, months and weekdays, main words in titles.', ja: '文頭・固有名詞・月曜日・タイトル。' },
      { zh: '銜接：furthermore、however、therefore、in conclusion。照應：this / one / do so，以及省略。', en: 'Transitions and reference: furthermore, however, therefore; this, one, do so, ellipsis.', ja: 'つなぎ語と照応（this / one / do so）。' },
    ],
  },
  {
    id: 'lexicon',
    n: '5',
    zh: '詞彙與搭配',
    en: 'Lexicon and phraseology',
    ja: '語彙とコロケーション',
    zhLead: '字不是單張卡片，是成組使用。',
    enLead: 'Words travel in chunks, not as isolated cards.',
    jaLead: '語は単独ではなく塊で使う。',
    points: [
      { zh: '片語動詞先標可不可拆：give up、turn down、look forward to。', en: 'Mark phrasal verbs as separable or not: give up, turn down, look forward to.', ja: '句動詞は分離できるかを先に印。' },
      { zh: '搭配：heavy rain、make a decision。不要用母語直譯成 strong rain、do a decision。', en: 'Collocations: heavy rain, make a decision. Do not translate word by word.', ja: 'heavy rain / make a decision。直訳しない。' },
      { zh: '同義、反義、同音（their / there）、一詞多義，要寫差別不只寫等於。', en: 'Synonyms, antonyms, homophones, and polysemy: write the difference, not just an equals sign.', ja: '類義・反義・同音・多義は差を書く。' },
      { zh: '語域：正式、中性、口語、俚語。商務信不要用 gonna。', en: 'Register: formal, neutral, casual, slang. Business mail does not use gonna.', ja: 'レジスター。ビジネスメールに gonna は使わない。' },
    ],
  },
  {
    id: 'sound',
    n: '6',
    zh: '語音與韻律',
    en: 'Phonetics and phonology',
    ja: '音声と韻律',
    zhLead: '單音、重音、語調，以及連起來之後的音變。',
    enLead: 'Sounds, stress, intonation, and what happens in real speech.',
    jaLead: '音・強勢・イントネーションと、つながったときの変化。',
    points: [
      { zh: '音素：子音清濁、母音長短與雙母音。自然拼讀是規則，不是每個字都規則。', en: 'Phonemes: voicing, vowel length, diphthongs. Phonics is a pattern, not a promise for every word.', ja: '音素とフォニックス。例外もある。' },
      { zh: '語流：連音、弱讀 schwa、同化、省略、gonna / wanna 這類縮讀。', en: 'Connected speech: linking, schwa, assimilation, elision, contractions such as gonna.', ja: '連音・弱化・同化・省略。' },
      { zh: '重音在字，也在句。語調升降改的是語氣，不是只改音量。', en: 'Stress is on the word and on the sentence. Intonation changes attitude, not only volume.', ja: '語強勢と文強勢。イントネーションは態度。' },
    ],
  },
  {
    id: 'semantics',
    n: '7',
    zh: '語意與認知',
    en: 'Semantics',
    ja: '意味論',
    zhLead: '字面以外，概念怎麼對應。',
    enLead: 'Meaning beyond a glossary line.',
    jaLead: '辞書の一行を超えた意味。',
    points: [
      { zh: '同義詞寫使用場合，不寫完全相同。', en: 'Near-synonyms need a situation, not a claim that they are identical.', ja: '類義語は場面つきで。同一とは書かない。' },
      { zh: '多義詞列出本義與延伸義。同形同音異義要分開條目。', en: 'Polysemy: core sense and extensions. Homonyms get separate entries.', ja: '多義は本義と派生。同音異義は別項。' },
      { zh: '介系詞的空間意象可以映到時間與狀態，但先標這是比喻，不是公式。', en: 'Spatial prepositions can map onto time and state. Label that as a metaphor, not a formula.', ja: '空間の前置詞が時間や状態に写る。比喩であって公式ではない。' },
    ],
  },
  {
    id: 'function',
    n: '8',
    zh: '溝通功能',
    en: 'Functional English',
    ja: '機能英語',
    zhLead: '依目的打包：社交、表態、專業寫說。',
    enLead: 'Pack language by purpose: social, stance, and workplace or study tasks.',
    jaLead: '目的別にまとめる：社交・意見・実務。',
    points: [
      { zh: '社交：問候、道別、致歉、感謝、短寒暄。', en: 'Social: greet, leave, apologize, thank, small talk.', ja: '挨拶・別れ・謝罪・感謝・雑談。' },
      { zh: '觀點：同意、反對、建議、委婉拒絕、要求對方再說一次。', en: 'Stance: agree, disagree, suggest, refuse softly, ask for clarification.', ja: '同意・反対・提案・婉曲な断り・確認。' },
      { zh: '應用：郵件、簡報順序、會議、短篇說明。這是練習架構，不是職場認證。', en: 'Applied frames: email, a short talk order, meetings, a short explanation. Practice frames, not a workplace certificate.', ja: 'メール・発表・会議。練習用の型であり資格ではない。' },
    ],
  },
]

export const SERIES_CROSSWALK: SeriesPoint[] = [
  { zh: '書寫與標點 → 系列 4', en: 'Mechanics and punctuation → series 4', ja: '表記・句読点 → 4' },
  { zh: '語音與韻律 → 系列 6', en: 'Phonetics and prosody → series 6', ja: '音声・韻律 → 6' },
  { zh: '詞彙與構詞 → 系列 1 與 5', en: 'Morphology and vocabulary → series 1 and 5', ja: '語形成・語彙 → 1 と 5' },
  { zh: '詞類 → 系列 1', en: 'Parts of speech → series 1', ja: '品詞 → 1' },
  { zh: '句法與動詞 → 系列 2 與 3', en: 'Syntax and the verb system → series 2 and 3', ja: '統語・動詞 → 2 と 3' },
  { zh: '篇章銜接 → 系列 4', en: 'Discourse cohesion → series 4', ja: '談話の結束 → 4' },
  { zh: '語用與文體 → 系列 5 與 8', en: 'Pragmatics and style → series 5 and 8', ja: '語用・文体 → 5 と 8' },
]

export const TENSE_ROWS: { time: SeriesPoint; cells: string[] }[] = [
  { time: { zh: '現在', en: 'Present', ja: '現在' }, cells: ['do / does', 'am / is / are doing', 'have / has done', 'have / has been doing'] },
  { time: { zh: '過去', en: 'Past', ja: '過去' }, cells: ['did', 'was / were doing', 'had done', 'had been doing'] },
  { time: { zh: '未來', en: 'Future', ja: '未来' }, cells: ['will do', 'will be doing', 'will have done', 'will have been doing'] },
  { time: { zh: '過去未來', en: 'Future in the past', ja: '過去から見た未来' }, cells: ['would do', 'would be doing', 'would have done', 'would have been doing'] },
]

export const SUBJUNCTIVE_ROWS: SeriesPoint[] = [
  { zh: '與現在事實相反：If + 過去式，would + 原形。', en: 'Contrary to present: If + past, would + base verb.', ja: '現在の事実と反対：If + 過去、would + 原形。' },
  { zh: '與過去事實相反：If + had + p.p.，would have + p.p.。', en: 'Contrary to past: If + had + past participle, would have + past participle.', ja: '過去の事実と反対：If + had + p.p.、would have + p.p.。' },
  { zh: '與未來事實相反：If + were to / should，would + 原形。', en: 'Contrary to future: If + were to / should, would + base verb.', ja: '未来の事実と反対：If + were to / should、would + 原形。' },
  { zh: '建議、要求、命令：that + 主詞 + 原形。', en: 'Suggest, demand, insist: that + subject + base verb.', ja: '提案・要求・命令：that + 主語 + 原形。' },
]

export const PUNCTUATION_PITFALLS: SeriesPoint[] = [
  { zh: '兩個完整句不要只靠逗號接在一起。用句點、分號，或連接詞。', en: 'Do not join two full sentences with only a comma. Use a period, semicolon, or a conjunction.', ja: '完全な二文をコンマだけでつながない。' },
  { zh: 'it is 寫成 it\'s。所有格 its 不加撇號。', en: 'it is becomes it\'s. The possessive its has no apostrophe.', ja: 'it is は it\'s。所有格 its にアポストロフィはない。' },
  { zh: '連字號與破折號分開。標題大小寫全篇一致即可。', en: 'Keep hyphen and dash apart. Title case only needs to stay consistent.', ja: 'ハイフンとダッシュを混ぜない。タイトルの大文字は統一。' },
]
