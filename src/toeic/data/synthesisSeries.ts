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

export type PrepRow = {
  relation: SeriesPoint
  at: string
  on: string
  in: string
  note: SeriesPoint
}

export const PREPOSITION_ROWS: PrepRow[] = [
  {
    relation: { zh: '時間', en: 'Time', ja: '時間' },
    at: 'at 7, at noon',
    on: 'on Monday, on May 1',
    in: 'in May, in 2026, in the morning',
    note: { zh: 'at 點、on 一天、in 較長時段。', en: 'at a point, on a day, in a longer span.', ja: 'at は時点、on は一日、in は長い期間。' },
  },
  {
    relation: { zh: '空間', en: 'Place', ja: '空間' },
    at: 'at the desk, at the door',
    on: 'on the desk, on the wall',
    in: 'in the room, in Taipei',
    note: { zh: 'at 點、on 面、in 範圍。', en: 'at a point, on a surface, in a volume.', ja: 'at は点、on は面、in は範囲。' },
  },
  {
    relation: { zh: '方向', en: 'Direction', ja: '方向' },
    at: 'look at, arrive at',
    on: 'onto the shelf',
    in: 'into the room',
    note: { zh: 'to 朝向；into / onto 進入範圍或面。', en: 'to is toward; into / onto enter a volume or surface.', ja: 'to は向かう。into / onto は中や面に入る。' },
  },
  {
    relation: { zh: '抽象', en: 'Abstract', ja: '抽象' },
    at: 'good at, at risk',
    on: 'on purpose, on time',
    in: 'in charge, in trouble',
    note: { zh: '抽象用法要整組記，不能用空間公式硬套。', en: 'Abstract uses are chunks. Do not force the space formula.', ja: '抽象は塊で覚える。空間の公式を無理に当てない。' },
  },
]

export const PREP_PAIRS: SeriesPoint[] = [
  { zh: 'depend on / rely on', en: 'depend on / rely on', ja: 'depend on / rely on' },
  { zh: 'interested in / good at / familiar with', en: 'interested in / good at / familiar with', ja: 'interested in / good at / familiar with' },
  { zh: 'responsible for / consist of / wait for', en: 'responsible for / consist of / wait for', ja: 'responsible for / consist of / wait for' },
  { zh: 'arrive at 小地點；arrive in 城市或國家。', en: 'arrive at a small point; arrive in a city or country.', ja: 'arrive at は小さい地点。arrive in は都市や国。' },
  { zh: 'look at 看；look for 找；look forward to + V-ing。', en: 'look at, look for, look forward to + V-ing.', ja: 'look at は見る。look for は探す。look forward to の後は V-ing。' },
]

export type PunctRow = { mark: string; job: SeriesPoint; pitfall: SeriesPoint }

export const PUNCTUATION_MARKS: PunctRow[] = [
  { mark: '.', job: { zh: '句末陳述。', en: 'Ends a statement.', ja: '平叙文の終わり。' }, pitfall: { zh: '縮寫的句點（Mr.）不是句末。', en: 'Mr. is an abbreviation, not a new sentence.', ja: 'Mr. の点は文末ではない。' } },
  { mark: '?', job: { zh: '直接問句。', en: 'Direct question.', ja: '直接疑問。' }, pitfall: { zh: '間接問句用句點：I asked where it was.', en: 'Indirect questions take a period: I asked where it was.', ja: '間接疑問はピリオド。' } },
  { mark: '!', job: { zh: '強烈語氣或命令。', en: 'Strong tone or a command.', ja: '強い調子や命令。' }, pitfall: { zh: '正式信少用。', en: 'Rare in formal mail.', ja: '正式なメールでは少ない。' } },
  { mark: ',', job: { zh: '停頓、列舉、附屬句前。', en: 'Pause, list, or before some clauses.', ja: '区切り・列挙・従属節の前。' }, pitfall: { zh: '不要只用逗號接兩個完整句。', en: 'Do not splice two full sentences with only a comma.', ja: '完全な二文をコンマだけでつなぐな。' } },
  { mark: ';', job: { zh: '兩個相關完整句。', en: 'Two related full sentences.', ja: '関係する二つの完全文。' }, pitfall: { zh: '分號後面通常不接連接詞 and。', en: 'A semicolon usually does not take and.', ja: 'セミコロンの後に and は普通置かない。' } },
  { mark: ':', job: { zh: '引出說明或清單。', en: 'Introduces an explanation or a list.', ja: '説明やリストを導く。' }, pitfall: { zh: '冒號前要是完整句。', en: 'What comes before the colon should be a full sentence.', ja: 'コロンの前は完全文。' } },
  { mark: '-', job: { zh: '連字號，接複合詞。', en: 'Hyphen, joins a compound.', ja: 'ハイフン。複合語。' }, pitfall: { zh: '不要拿來代替破折號。', en: 'Do not use it as a dash.', ja: 'ダッシュの代わりにしない。' } },
  { mark: "'", job: { zh: '縮寫或所有格。', en: 'Contraction or possessive.', ja: '短縮または所有格。' }, pitfall: { zh: 'its 無撇號；it\'s = it is。', en: 'its has none; it\'s means it is.', ja: 'its に記号なし。it\'s は it is。' } },
  { mark: '"', job: { zh: '直接引語。', en: 'Direct quotation.', ja: '直接引用。' }, pitfall: { zh: '引號裡的句末符號位置全篇一致。', en: 'Keep end marks inside or outside quotes consistently.', ja: '引用符と終止符の位置を統一。' } },
  { mark: '()', job: { zh: '補充，拿掉仍成句。', en: 'An aside. The sentence still works without it.', ja: '補足。外しても文は立つ。' }, pitfall: { zh: '括號不能當主句的唯一動詞。', en: 'Parentheses cannot hold the only verb of the main clause.', ja: '括弧だけに本動詞を置かない。' } },
]

export const STUDY_STAGES: SeriesPoint[] = [
  { zh: '第 1 段：語音與高頻語塊（系列 6、5）。先聽得見、說得出口。', en: 'Stage 1: sound and high-frequency chunks (series 6 and 5). Hear it, then say it.', ja: '第1段：音声と高頻度の塊（6 と 5）。' },
  { zh: '第 2 段：詞類與介系詞（系列 1）。先分角色，再記 in/on/at 與固定搭配。', en: 'Stage 2: word class and prepositions (series 1). Role first, then in/on/at and fixed pairs.', ja: '第2段：品詞と前置詞（1）。' },
  { zh: '第 3 段：五句型與十二時態（系列 2、3）。用表，不背散句。', en: 'Stage 3: five patterns and the twelve tense frames (series 2 and 3). Use the grid.', ja: '第3段：五文型と12時制（2 と 3）。' },
  { zh: '第 4 段：標點與銜接（系列 4）。先避免逗號接兩句。', en: 'Stage 4: punctuation and cohesion (series 4). Stop comma splices first.', ja: '第4段：句読点と結束（4）。' },
  { zh: '第 5 段：語域與溝通功能（系列 5、8）。郵件、同意拒絕、短說明。', en: 'Stage 5: register and functions (series 5 and 8). Mail, agree or refuse, a short explanation.', ja: '第5段：レジスターと機能（5 と 8）。' },
  { zh: '順序只是建議。可跳著查。不是多益分數進度。', en: 'The order is a suggestion. Skip around. It is not a TOEIC score path.', ja: '順番は提案。飛ばしてよい。TOEIC の得点ではない。' },
]

export const NOTE_FOLDERS: SeriesPoint[] = [
  { zh: '每個系列一個資料夾。筆記只放定義、對照表、自己的錯句。', en: 'One folder per series. Store definitions, grids, and your own wrong sentences.', ja: 'シリーズごとに一つのフォルダ。定義・表・自分の誤文。' },
  { zh: '介系詞夾：時間／空間／方向／抽象四表，加固定搭配，不另開「全部介系詞」散頁。', en: 'Preposition folder: four tables plus fixed pairs. No loose page of every preposition.', ja: '前置詞は四表と固定ペアだけ。' },
  { zh: '標點夾：符號、工作、避坑三欄。', en: 'Punctuation folder: mark, job, pitfall.', ja: '句読点は記号・働き・注意の三列。' },
  { zh: '不要在筆記裡寫假分數、假正確率或「已通過」。', en: 'Do not write fake scores, fake accuracy, or "passed".', ja: '偽の点数や「合格」は書かない。' },
]

export type ChunkRow = { chunk: string; use: SeriesPoint; avoid: SeriesPoint }

export const COLLOCATION_ROWS: ChunkRow[] = [
  { chunk: 'make a decision', use: { zh: '做決定。', en: 'Make a decision.', ja: '決定する。' }, avoid: { zh: '不要寫 do a decision。', en: 'Do not write do a decision.', ja: 'do a decision は書かない。' } },
  { chunk: 'heavy rain', use: { zh: '大雨。', en: 'Heavy rain.', ja: '大雨。' }, avoid: { zh: '不要寫 strong rain。', en: 'Do not write strong rain.', ja: 'strong rain は書かない。' } },
  { chunk: 'give up', use: { zh: '放棄。受詞可放中間或後面。', en: 'Stop trying. The object can split it or follow it.', ja: 'あきらめる。目的語は間にも後にも。' }, avoid: { zh: 'give up to do 不是這個意思。', en: 'give up to do is not this meaning.', ja: 'give up to do はこの意味ではない。' } },
  { chunk: 'look forward to', use: { zh: '期待。後面接名詞或 V-ing。', en: 'Expect with pleasure. Follow with a noun or V-ing.', ja: '楽しみにする。後は名詞か V-ing。' }, avoid: { zh: '不要接 to + 原形。', en: 'Do not follow with to + base verb.', ja: 'to + 原形は続かない。' } },
  { chunk: 'turn down', use: { zh: '拒絕，或把音量調小。', en: 'Refuse, or lower the volume.', ja: '断る、または音量を下げる。' }, avoid: { zh: '先看上下文，不要只背一個中文。', en: 'Read the context. Do not keep only one gloss.', ja: '文脈を見る。訳は一つに固定しない。' } },
]

export type TeachTable = {
  caption: SeriesPoint
  columns: [SeriesPoint, SeriesPoint, SeriesPoint]
  rows: { id: string; cells: [SeriesPoint, SeriesPoint, SeriesPoint] }[]
}

const colClass: SeriesPoint = { zh: '項目', en: 'Item', ja: '項目' }
const colSort: SeriesPoint = { zh: '怎麼分', en: 'How to sort it', ja: '分け方' }
const colWatch: SeriesPoint = { zh: '注意', en: 'Watch', ja: '注意' }
const colExample: SeriesPoint = { zh: '例句', en: 'Example', ja: '例' }

function en(text: string): SeriesPoint {
  return { zh: text, en: text, ja: text }
}

export const POS_TABLE: TeachTable = {
  caption: { zh: '詞類怎麼分', en: 'How to sort word classes', ja: '品詞の分け方' },
  columns: [colClass, colSort, colWatch],
  rows: [
    { id: 'noun', cells: [
      { zh: '名詞', en: 'Noun', ja: '名詞' },
      { zh: '可數／不可數、單複數、具體／抽象。', en: 'Count or mass, singular or plural, concrete or abstract.', ja: '可算・不可算、単複、具体・抽象。' },
      { zh: '集合名詞的單複數看語意，不要背死。', en: 'Collective nouns follow meaning. Do not freeze one number.', ja: '集合名詞の数は意味で決まる。' },
    ] },
    { id: 'pronoun', cells: [
      { zh: '代名詞', en: 'Pronoun', ja: '代名詞' },
      { zh: '人稱、反身、指示、不定、關係。', en: 'Personal, reflexive, demonstrative, indefinite, relative.', ja: '人称・再帰・指示・不定・関係。' },
      { zh: '關係代名詞先找先行詞。', en: 'Find the antecedent before the relative pronoun.', ja: '関係代名詞は先行詞を先に探す。' },
    ] },
    { id: 'verb', cells: [
      { zh: '動詞', en: 'Verb', ja: '動詞' },
      { zh: '及物／不及物、連綴、情態、使役。', en: 'Transitive or not, linking, modal, causative.', ja: '他動・自動、連結、法助動、使役。' },
      { zh: '情態動詞後面用原形。', en: 'A modal takes a base verb.', ja: '法助動詞の後は原形。' },
    ] },
    { id: 'adj', cells: [
      { zh: '形容詞', en: 'Adjective', ja: '形容詞' },
      { zh: '位置、比較級、最高級。', en: 'Position, comparative, superlative.', ja: '位置、比較、最上級。' },
      { zh: '形容詞順序是習慣，不是必考公式。', en: 'Adjective order is a habit, not a required formula.', ja: '形容詞の順は習慣であり公式ではない。' },
    ] },
    { id: 'adv', cells: [
      { zh: '副詞', en: 'Adverb', ja: '副詞' },
      { zh: '時間、地方、頻率、程度、連接副詞。', en: 'Time, place, frequency, degree, conjunctive adverb.', ja: '時・場所・頻度・程度・接続副詞。' },
      { zh: 'however 是連接副詞，不是 and。', en: 'however is a conjunctive adverb, not and.', ja: 'however は接続副詞であり and ではない。' },
    ] },
    { id: 'conj', cells: [
      { zh: '連接詞', en: 'Conjunction', ja: '接続詞' },
      { zh: '對等（and, but, or）、從屬、相關（both...and）。', en: 'Coordinating, subordinating, and correlative pairs.', ja: '等位・従属・相関。' },
      { zh: '對等連接詞兩邊的詞性要對得上。', en: 'The two sides of a coordinating conjunction should match.', ja: '等位接続詞の両側は形を揃える。' },
    ] },
    { id: 'det', cells: [
      { zh: '限定詞', en: 'Determiner', ja: '限定詞' },
      { zh: 'a/an、the、零冠詞、some/any。', en: 'a/an, the, no article, some/any.', ja: 'a/an、the、無冠詞、some/any。' },
      { zh: 'some/any 不只要看肯定或否定。', en: 'some/any is not only positive versus negative.', ja: 'some/any は肯定・否定だけでは決まらない。' },
    ] },
    { id: 'interj', cells: [
      { zh: '感嘆與標記', en: 'Interjection and marker', ja: '感嘆と標識' },
      { zh: '情緒（wow）與填充（well, you know）。', en: 'Emotion (wow) and fillers (well, you know).', ja: '感情（wow）と埋草（well, you know）。' },
      { zh: '填充詞不是文法錯誤本身。', en: 'A filler is not itself a grammar error.', ja: '埋草自体は文法の誤りではない。' },
    ] },
  ],
}

export const PATTERN_TABLE: TeachTable = {
  caption: { zh: '五大句型', en: 'Five clause patterns', ja: '五文型' },
  columns: [colClass, colExample, colWatch],
  rows: [
    { id: 'sv', cells: [
      { zh: 'S+V', en: 'S+V', ja: 'S+V' },
      en('Birds fly.'),
      { zh: '不及物。不要硬加受詞。', en: 'Intransitive. Do not force an object.', ja: '自動詞。目的語を無理に足さない。' },
    ] },
    { id: 'svo', cells: [
      { zh: 'S+V+O', en: 'S+V+O', ja: 'S+V+O' },
      en('She sent the file.'),
      { zh: '受詞是名詞性成分。', en: 'The object is noun-like.', ja: '目的語は名詞相当。' },
    ] },
    { id: 'svc', cells: [
      { zh: 'S+V+C', en: 'S+V+C', ja: 'S+V+C' },
      en('The report is late.'),
      { zh: '補語說明主詞。be 這裡不是動作。', en: 'The complement describes the subject. be is not an action here.', ja: '補語は主語を説明する。ここでの be は動作ではない。' },
    ] },
    { id: 'svoo', cells: [
      { zh: 'S+V+O+O', en: 'S+V+O+O', ja: 'S+V+O+O' },
      en('She sent me the file.'),
      { zh: '人在前、物在後很常見，但不是唯一寫法。', en: 'Person then thing is common, not the only order.', ja: '人・物の順は多いが唯一ではない。' },
    ] },
    { id: 'svoc', cells: [
      { zh: 'S+V+O+C', en: 'S+V+O+C', ja: 'S+V+O+C' },
      en('They made the plan public.'),
      { zh: '補語說明受詞，不是第二個受詞。', en: 'The complement describes the object. It is not a second object.', ja: '補語は目的語を説明する。第二目的語ではない。' },
    ] },
  ],
}

export const NONFINITE_TABLE: TeachTable = {
  caption: { zh: '非限定動詞', en: 'Non-finite verbs', ja: '非定形動詞' },
  columns: [colClass, colSort, colWatch],
  rows: [
    { id: 'inf', cells: [
      { zh: '不定詞 to V', en: 'Infinitive to V', ja: '不定詞 to V' },
      { zh: '目的，或 want / decide 之後。', en: 'Purpose, or after want / decide.', ja: '目的、または want / decide の後。' },
      { zh: '不是每個動詞後面都接 to。', en: 'Not every verb takes to.', ja: 'すべての動詞が to を取るわけではない。' },
    ] },
    { id: 'ger', cells: [
      { zh: '動名詞 V-ing', en: 'Gerund V-ing', ja: '動名詞 V-ing' },
      { zh: '當主詞，或 enjoy / finish 之後。', en: 'As a subject, or after enjoy / finish.', ja: '主語、または enjoy / finish の後。' },
      { zh: 'look forward to 後面是 V-ing，不是原形。', en: 'look forward to takes V-ing, not a base verb.', ja: 'look forward to の後は V-ing。' },
    ] },
    { id: 'part', cells: [
      { zh: '分詞', en: 'Participle', ja: '分詞' },
      { zh: '修飾名詞，或分詞構句。', en: 'Modifies a noun, or a participle clause.', ja: '名詞を修飾する、または分詞構文。' },
      { zh: '分詞構句的主詞要跟主句一致，否則先寫完整句。', en: 'The participle subject should match the main clause. Else write a full clause.', ja: '分詞の主語は主節と揃える。揃わないなら完全文にする。' },
    ] },
  ],
}

export const TRANSITION_TABLE: TeachTable = {
  caption: { zh: '銜接詞', en: 'Transitions', ja: 'つなぎ語' },
  columns: [colClass, colSort, colWatch],
  rows: [
    { id: 'add', cells: [
      { zh: '補充', en: 'Addition', ja: '追加' },
      en('furthermore, in addition'),
      { zh: '前面要已經有一句。', en: 'A sentence has to come first.', ja: '前に文が必要。' },
    ] },
    { id: 'contrast', cells: [
      { zh: '對比', en: 'Contrast', ja: '対比' },
      en('however, nevertheless'),
      { zh: 'however 常用句點或分號，不要只用逗號接兩個完整句。', en: 'however usually wants a period or semicolon, not a comma splice.', ja: 'however はピリオドかセミコロン。コンマつなぎにしない。' },
    ] },
    { id: 'cause', cells: [
      { zh: '因果', en: 'Cause', ja: '因果' },
      en('therefore, consequently'),
      { zh: '先寫原因，再寫結果。', en: 'Write the cause, then the result.', ja: '原因を先に、結果を後に。' },
    ] },
    { id: 'sum', cells: [
      { zh: '總結', en: 'Summary', ja: 'まとめ' },
      en('in conclusion, to sum up'),
      { zh: '不要在第一句就總結。', en: 'Do not summarize in the first sentence.', ja: '最初の文でまとめない。' },
    ] },
  ],
}

export const SOUND_TABLE: TeachTable = {
  caption: { zh: '語音怎麼聽', en: 'What to listen for', ja: '音声の聞き方' },
  columns: [colClass, colSort, colWatch],
  rows: [
    { id: 'word', cells: [
      { zh: '字重音', en: 'Word stress', ja: '語強勢' },
      en('REcord (noun) / reCORD (verb)'),
      { zh: '重音可以改詞性。不要只記一個讀音。', en: 'Stress can change the word class. Do not store only one pronunciation.', ja: '強勢で品詞が変わる。読みは一つではない。' },
    ] },
    { id: 'sent', cells: [
      { zh: '句重音', en: 'Sentence stress', ja: '文強勢' },
      { zh: '新資訊通常較重。', en: 'New information is usually heavier.', ja: '新しい情報は通常強い。' },
      { zh: '不是每個字都要重讀。', en: 'Not every word is stressed.', ja: 'すべての語を強くしない。' },
    ] },
    { id: 'tone', cells: [
      { zh: '語調', en: 'Intonation', ja: 'イントネーション' },
      { zh: '降調常是確定；升調常是未完或客氣。', en: 'A fall often marks certainty. A rise often marks unfinished or polite.', ja: '下降は確定、上昇は未完や丁寧。' },
      { zh: '問句不一定升調。', en: 'A question is not always a rise.', ja: '疑問は必ず上昇とは限らない。' },
    ] },
    { id: 'weak', cells: [
      { zh: '弱讀', en: 'Weak forms', ja: '弱形' },
      en('a, of, to → /ə/'),
      { zh: '字典音不是語流音。', en: 'A dictionary vowel is not the vowel in fast speech.', ja: '辞書の母音は速い話の母音ではない。' },
    ] },
    { id: 'link', cells: [
      { zh: '連音', en: 'Linking', ja: '連音' },
      en('pick it up'),
      { zh: '聽力不要按字母切開。', en: 'Do not slice listening by letters.', ja: '聞き取りを文字で切らない。' },
    ] },
  ],
}

export const FUNCTION_TABLE: TeachTable = {
  caption: { zh: '溝通功能句', en: 'Functional frames', ja: '機能の型' },
  columns: [colClass, colExample, colWatch],
  rows: [
    { id: 'greet', cells: [
      { zh: '問候／道別', en: 'Greet / leave', ja: '挨拶・別れ' },
      en('Good morning. Thanks for your time.'),
      { zh: '正式信不要用 hey 當開頭。', en: 'Do not open formal mail with hey.', ja: '正式なメールを hey で始めない。' },
    ] },
    { id: 'sorry', cells: [
      { zh: '致歉', en: 'Apologize', ja: '謝罪' },
      en('I am sorry for the delay.'),
      { zh: '先說事情，再補原因。', en: 'Name the fact, then the reason.', ja: '事実を先に、理由を後に。' },
    ] },
    { id: 'agree', cells: [
      { zh: '同意', en: 'Agree', ja: '同意' },
      en('I agree with the plan.'),
      { zh: 'agree 後面接 with，不是直接接 me。', en: 'agree takes with. It does not take me directly.', ja: 'agree の後は with。' },
    ] },
    { id: 'disagree', cells: [
      { zh: '不同意', en: 'Disagree', ja: '反対' },
      en('I see it differently.'),
      { zh: '先不要寫 you are wrong。', en: 'Do not start with you are wrong.', ja: 'you are wrong から始めない。' },
    ] },
    { id: 'suggest', cells: [
      { zh: '建議', en: 'Suggest', ja: '提案' },
      en('I suggest that we wait.'),
      { zh: 'suggest that 後面常用原形。', en: 'suggest that often takes a base verb.', ja: 'suggest that の後は原形が多い。' },
    ] },
    { id: 'refuse', cells: [
      { zh: '委婉拒絕', en: 'Soft refusal', ja: '婉曲な断り' },
      en('I am afraid we cannot meet that date.'),
      { zh: '拒絕後給一個替代，不要只寫 no。', en: 'Offer an alternative. Do not stop at no.', ja: '代わりを出す。no だけで終わらない。' },
    ] },
    { id: 'clarify', cells: [
      { zh: '請對方再說', en: 'Ask to repeat', ja: '言い直しを頼む' },
      en('Could you say that again?'),
      { zh: '這是要求重述，不是承認自己全錯。', en: 'This asks for a repeat. It does not admit you were entirely wrong.', ja: '繰り返しの依頼であり、全誤りではない。' },
    ] },
    { id: 'mail', cells: [
      { zh: '郵件頭尾', en: 'Mail open / close', ja: 'メールの頭と締め' },
      en('Thank you for your email. Best regards,'),
      { zh: '練習句，不是公司範本或認證。', en: 'Practice lines, not a company template or a certificate.', ja: '練習文であり社内ひな型や資格ではない。' },
    ] },
  ],
}

export const SEMANTICS_TABLE: TeachTable = {
  caption: { zh: '語意怎麼記差別', en: 'How to record a meaning difference', ja: '意味の差の書き方' },
  columns: [colClass, colExample, colWatch],
  rows: [
    { id: 'syn', cells: [
      { zh: '近義', en: 'Near synonym', ja: '類義' },
      en('say the words / tell a person'),
      { zh: '寫使用對象，不要寫完全相同。', en: 'Write who or what it takes. Do not write that they are identical.', ja: '対象を書く。同一とは書かない。' },
    ] },
    { id: 'ant', cells: [
      { zh: '反義', en: 'Antonym', ja: '反義' },
      en('light / heavy, light / dark'),
      { zh: '一個字可以有不只一個相反。先標是哪一個意思。', en: 'One word can have more than one opposite. Mark which sense.', ja: '反対は一つとは限らない。どの意味かを書く。' },
    ] },
    { id: 'homo', cells: [
      { zh: '同音', en: 'Homophone', ja: '同音' },
      en('their / there / they are'),
      { zh: '讀音一樣不代表能互換。', en: 'The same sound does not mean they swap.', ja: '同じ音でも入れ替えられない。' },
    ] },
    { id: 'poly', cells: [
      { zh: '多義', en: 'Polysemy', ja: '多義' },
      en('run a race / run a team'),
      { zh: '先寫本義，再寫延伸義。', en: 'Write the core sense, then the extension.', ja: '本義を先に、派生を後に。' },
    ] },
    { id: 'homonym', cells: [
      { zh: '同形異義', en: 'Homonym', ja: '同形異義' },
      en('bank of a river / a bank account'),
      { zh: '分成兩條，不要寫成一個字的兩個翻譯。', en: 'Two entries. Not one word with two glosses jammed together.', ja: '二項目に分ける。一つの訳に混ぜない。' },
    ] },
    { id: 'meta', cells: [
      { zh: '空間比喻', en: 'Spatial metaphor', ja: '空間の比喩' },
      en('in trouble, on time'),
      { zh: '這是比喻，不是 in/on/at 的空間公式。', en: 'This is a metaphor, not the in/on/at space formula.', ja: '比喩であり、in/on/at の空間公式ではない。' },
    ] },
  ],
}

export const CAPITAL_TABLE: TeachTable = {
  caption: { zh: '大寫', en: 'Capitals', ja: '大文字' },
  columns: [colClass, colExample, colWatch],
  rows: [
    { id: 'start', cells: [
      { zh: '句首', en: 'Sentence start', ja: '文頭' },
      en('The file is ready.'),
      { zh: '第一個詞大寫。', en: 'Capitalize the first word.', ja: '最初の語を大文字にする。' },
    ] },
    { id: 'proper', cells: [
      { zh: '專有名詞', en: 'Proper noun', ja: '固有名詞' },
      en('Taipei, Monday, the Pacific'),
      { zh: '月份、星期、地名大寫。普通名詞不大寫。', en: 'Months, weekdays, and place names. Ordinary nouns stay lower case.', ja: '月・曜日・地名。普通名詞は小文字。' },
    ] },
    { id: 'title', cells: [
      { zh: '標題', en: 'Title case', ja: 'タイトル' },
      en('A Guide to the Report'),
      { zh: '主要詞大寫即可，全篇一致。', en: 'Capitalize the main words, and stay consistent.', ja: '主な語を大文字にし、全体で統一。' },
    ] },
    { id: 'i', cells: [
      { zh: '人稱 I', en: 'The pronoun I', ja: '代名詞 I' },
      en('I sent it.'),
      { zh: 'I 永遠大寫。不要把一般名詞也大寫。', en: 'I is always a capital. Do not capitalize ordinary nouns.', ja: 'I は常に大文字。普通名詞まで大文字にしない。' },
    ] },
  ],
}

export type PrepDrill = {
  id: string
  stem: SeriesPoint
  choices: string[]
  answer: string
  why: SeriesPoint
}

export const PREP_DRILLS: PrepDrill[] = [
  {
    id: 'depend',
    stem: { zh: 'We depend ___ the weather.', en: 'We depend ___ the weather.', ja: 'We depend ___ the weather.' },
    choices: ['on', 'in', 'at'],
    answer: 'on',
    why: { zh: 'depend on 整組記。', en: 'Learn depend on as a pair.', ja: 'depend on はセット。' },
  },
  {
    id: 'interested',
    stem: { zh: 'She is interested ___ the plan.', en: 'She is interested ___ the plan.', ja: 'She is interested ___ the plan.' },
    choices: ['in', 'on', 'at'],
    answer: 'in',
    why: { zh: 'interested in。', en: 'interested in.', ja: 'interested in。' },
  },
  {
    id: 'good',
    stem: { zh: 'He is good ___ writing reports.', en: 'He is good ___ writing reports.', ja: 'He is good ___ writing reports.' },
    choices: ['at', 'in', 'on'],
    answer: 'at',
    why: { zh: 'good at + 名詞或 V-ing。', en: 'good at plus a noun or V-ing.', ja: 'good at の後は名詞か V-ing。' },
  },
  {
    id: 'city',
    stem: { zh: 'They arrive ___ Taipei on Monday.', en: 'They arrive ___ Taipei on Monday.', ja: 'They arrive ___ Taipei on Monday.' },
    choices: ['in', 'at', 'on'],
    answer: 'in',
    why: { zh: '城市用 arrive in。', en: 'A city takes arrive in.', ja: '都市は arrive in。' },
  },
  {
    id: 'station',
    stem: { zh: 'She arrives ___ the station at noon.', en: 'She arrives ___ the station at noon.', ja: 'She arrives ___ the station at noon.' },
    choices: ['at', 'in', 'on'],
    answer: 'at',
    why: { zh: '車站這種點用 arrive at。', en: 'A station is a point: arrive at.', ja: '駅のような点は arrive at。' },
  },
  {
    id: 'forward',
    stem: { zh: 'I look forward ___ seeing you.', en: 'I look forward ___ seeing you.', ja: 'I look forward ___ seeing you.' },
    choices: ['to', 'for', 'at'],
    answer: 'to',
    why: { zh: 'look forward to 後面是 V-ing。', en: 'look forward to is followed by V-ing.', ja: 'look forward to の後は V-ing。' },
  },
  {
    id: 'responsible',
    stem: { zh: 'Who is responsible ___ this report?', en: 'Who is responsible ___ this report?', ja: 'Who is responsible ___ this report?' },
    choices: ['for', 'of', 'to'],
    answer: 'for',
    why: { zh: 'responsible for。', en: 'responsible for.', ja: 'responsible for。' },
  },
  {
    id: 'consist',
    stem: { zh: 'The kit consists ___ three parts.', en: 'The kit consists ___ three parts.', ja: 'The kit consists ___ three parts.' },
    choices: ['of', 'in', 'with'],
    answer: 'of',
    why: { zh: 'consist of。', en: 'consist of.', ja: 'consist of。' },
  },
]

export const PUNCT_DRILLS: PrepDrill[] = [
  {
    id: 'splice',
    stem: { zh: 'The report is late, the client is waiting. 兩個完整句之間該用什麼？', en: 'The report is late, the client is waiting. What can replace that comma splice?', ja: 'The report is late, the client is waiting. コンマの代わりは？' },
    choices: [';', '-', '?'],
    answer: ';',
    why: { zh: '兩個完整句用分號、句點，或連接詞。連字號不行。', en: 'Two full sentences take a semicolon, a period, or a conjunction. Not a hyphen.', ja: '完全な二文はセミコロン、ピリオド、または接続詞。ハイフンではない。' },
  },
  {
    id: 'its',
    stem: { zh: 'The printer lost ___ cover.', en: 'The printer lost ___ cover.', ja: 'The printer lost ___ cover.' },
    choices: ['its', "it's", "its'"],
    answer: 'its',
    why: { zh: '所有格不加撇號。', en: 'The possessive has no apostrophe.', ja: '所有格にアポストロフィはない。' },
  },
  {
    id: 'its-is',
    stem: { zh: '___ raining, so we waited.', en: '___ raining, so we waited.', ja: '___ raining, so we waited.' },
    choices: ["It's", 'Its', "Its'"],
    answer: "It's",
    why: { zh: '這裡是 it is。', en: 'This one means it is.', ja: 'ここは it is。' },
  },
  {
    id: 'indirect',
    stem: { zh: 'I asked where the file was___', en: 'I asked where the file was___', ja: 'I asked where the file was___' },
    choices: ['.', '?', '!'],
    answer: '.',
    why: { zh: '間接問句用句點。', en: 'An indirect question ends with a period.', ja: '間接疑問はピリオド。' },
  },
  {
    id: 'hyphen',
    stem: { zh: 'a well___known delay', en: 'a well___known delay', ja: 'a well___known delay' },
    choices: ['-', ';', ':'],
    answer: '-',
    why: { zh: '複合詞用連字號，不是分號。', en: 'A compound takes a hyphen, not a semicolon.', ja: '複合語はハイフン。セミコロンではない。' },
  },
  {
    id: 'shout',
    stem: { zh: '正式信結尾：Thanks for the update___', en: 'Formal close: Thanks for the update___', ja: '正式な結び：Thanks for the update___' },
    choices: ['.', '!', '?'],
    answer: '.',
    why: { zh: '正式信少用驚嘆號。', en: 'Formal mail rarely needs an exclamation mark.', ja: '正式なメールに感嘆符は少ない。' },
  },
  {
    id: 'colon',
    stem: { zh: 'We need three files___ the brief, the draft, and the receipt.', en: 'We need three files___ the brief, the draft, and the receipt.', ja: 'We need three files___ the brief, the draft, and the receipt.' },
    choices: [':', '-', '?'],
    answer: ':',
    why: { zh: '冒號引出清單，而且前面已是完整句。', en: 'A colon introduces the list, and a full sentence comes before it.', ja: 'コロンはリストを導く。前は完全文。' },
  },
  {
    id: 'abbr',
    stem: { zh: 'Mr___ Chen sent the file yesterday.', en: 'Mr___ Chen sent the file yesterday.', ja: 'Mr___ Chen sent the file yesterday.' },
    choices: ['.', '?', '!'],
    answer: '.',
    why: { zh: 'Mr. 的句點是縮寫，句子還沒結束。', en: 'The period in Mr. is an abbreviation. The sentence is not over.', ja: 'Mr. の点は略語。文はまだ終わっていない。' },
  },
]

export const CHUNK_DRILLS: PrepDrill[] = [
  {
    id: 'decision',
    stem: { zh: '做決定。', en: 'Decide.', ja: '決定する。' },
    choices: ['make a decision', 'do a decision', 'make a rain'],
    answer: 'make a decision',
    why: { zh: '整組是 make a decision，不是 do。', en: 'The chunk is make a decision, not do.', ja: 'make a decision。do ではない。' },
  },
  {
    id: 'rain',
    stem: { zh: '大雨。', en: 'A lot of rain.', ja: '大雨。' },
    choices: ['heavy rain', 'strong rain', 'hard rain'],
    answer: 'heavy rain',
    why: { zh: '大雨是 heavy rain。', en: 'Heavy rain, not strong rain.', ja: '大雨は heavy rain。' },
  },
  {
    id: 'give-up',
    stem: { zh: '放棄這個計畫。', en: 'Stop this plan.', ja: 'この計画をあきらめる。' },
    choices: ['give up the plan', 'give up to the plan', 'give on the plan'],
    answer: 'give up the plan',
    why: { zh: 'give up 後面直接接受詞，不是 give up to do。', en: 'give up takes the object. It is not give up to do.', ja: 'give up は目的語を取る。give up to do ではない。' },
  },
  {
    id: 'forward',
    stem: { zh: '期待見到你。', en: 'Expect to see you with pleasure.', ja: 'お会いするのを楽しみにする。' },
    choices: ['look forward to seeing you', 'look forward to see you', 'look forward for seeing you'],
    answer: 'look forward to seeing you',
    why: { zh: 'to 後面是 V-ing。', en: 'After to, use V-ing.', ja: 'to の後は V-ing。' },
  },
  {
    id: 'turn-down',
    stem: { zh: 'She turned ___ the offer.（拒絕）', en: 'She turned ___ the offer. (refused)', ja: 'She turned ___ the offer.（断った）' },
    choices: ['down', 'up', 'on'],
    answer: 'down',
    why: { zh: '這裡是拒絕。調音量也用 turn down，要看上下文。', en: 'Here it means refuse. Volume uses the same chunk. Read the context.', ja: 'ここは断り。音量も turn down。文脈を見る。' },
  },
  {
    id: 'tea',
    stem: { zh: '濃茶。', en: 'Tea with a strong flavor.', ja: '濃いお茶。' },
    choices: ['strong tea', 'powerful tea', 'heavy tea'],
    answer: 'strong tea',
    why: { zh: '濃茶是 strong tea，不是 powerful。', en: 'Strong tea, not powerful tea.', ja: '濃いお茶は strong tea。' },
  },
  {
    id: 'mistake',
    stem: { zh: '犯錯。', en: 'Make an error.', ja: '間違いをする。' },
    choices: ['make a mistake', 'do a mistake', 'take a mistake'],
    answer: 'make a mistake',
    why: { zh: 'make a mistake，不是 do。', en: 'make a mistake, not do a mistake.', ja: 'make a mistake。do ではない。' },
  },
  {
    id: 'photo',
    stem: { zh: '拍照。', en: 'Capture a picture.', ja: '写真を撮る。' },
    choices: ['take a photo', 'make a photo', 'do a photo'],
    answer: 'take a photo',
    why: { zh: '拍照是 take a photo。', en: 'take a photo, not make a photo.', ja: '写真は take a photo。' },
  },
]

export const PATTERN_DRILLS: PrepDrill[] = [
  {
    id: 'sv-fly',
    stem: en('Birds fly.'),
    choices: ['S+V', 'S+V+O', 'S+V+C'],
    answer: 'S+V',
    why: { zh: '不及物。不要硬加受詞。', en: 'Intransitive. Do not force an object.', ja: '自動詞。目的語を無理に足さない。' },
  },
  {
    id: 'svo-file',
    stem: en('She sent the file.'),
    choices: ['S+V+O', 'S+V', 'S+V+C'],
    answer: 'S+V+O',
    why: { zh: 'file 是受詞。', en: 'file is the object.', ja: 'file が目的語。' },
  },
  {
    id: 'svc-late',
    stem: en('The report is late.'),
    choices: ['S+V+C', 'S+V+O', 'S+V+O+C'],
    answer: 'S+V+C',
    why: { zh: 'late 說明主詞。be 這裡不是動作。', en: 'late describes the subject. be is not an action here.', ja: 'late は主語を説明する。ここでの be は動作ではない。' },
  },
  {
    id: 'svoo-me',
    stem: en('She sent me the file.'),
    choices: ['S+V+O+O', 'S+V+O', 'S+V+O+C'],
    answer: 'S+V+O+O',
    why: { zh: 'me 和 the file 都是受詞。', en: 'me and the file are both objects.', ja: 'me と the file はどちらも目的語。' },
  },
  {
    id: 'svoc-public',
    stem: en('They made the plan public.'),
    choices: ['S+V+O+C', 'S+V+O+O', 'S+V+C'],
    answer: 'S+V+O+C',
    why: { zh: 'public 說明 the plan，不是第二個受詞。', en: 'public describes the plan. It is not a second object.', ja: 'public は the plan を説明する。第二目的語ではない。' },
  },
  {
    id: 'sv-arrive',
    stem: en('The file arrived.'),
    choices: ['S+V', 'S+V+O', 'S+V+O+O'],
    answer: 'S+V',
    why: { zh: 'arrived 不及物。', en: 'arrived is intransitive.', ja: 'arrived は自動詞。' },
  },
  {
    id: 'svc-manager',
    stem: en('She is the manager.'),
    choices: ['S+V+C', 'S+V+O', 'S+V'],
    answer: 'S+V+C',
    why: { zh: 'manager 說明她是誰，不是動作的受詞。', en: 'manager says who she is. It is not an action object.', ja: 'manager は彼女が誰かを述べる。動作の目的語ではない。' },
  },
  {
    id: 'svoc-urgent',
    stem: en('They called the meeting urgent.'),
    choices: ['S+V+O+C', 'S+V+O+O', 'S+V+O'],
    answer: 'S+V+O+C',
    why: { zh: 'urgent 說明 meeting。', en: 'urgent describes the meeting.', ja: 'urgent は meeting を説明する。' },
  },
]

export const NONFINITE_DRILLS: PrepDrill[] = [
  {
    id: 'want',
    stem: { zh: 'I want ___ the file.', en: 'I want ___ the file.', ja: 'I want ___ the file.' },
    choices: ['to send', 'sending', 'send'],
    answer: 'to send',
    why: { zh: 'want 後面常用 to V。', en: 'want often takes to V.', ja: 'want の後は to V が多い。' },
  },
  {
    id: 'decide',
    stem: { zh: 'She decided ___ early.', en: 'She decided ___ early.', ja: 'She decided ___ early.' },
    choices: ['to leave', 'leaving', 'leave'],
    answer: 'to leave',
    why: { zh: 'decide 後面常用 to V。', en: 'decide often takes to V.', ja: 'decide の後は to V が多い。' },
  },
  {
    id: 'enjoy',
    stem: { zh: 'She enjoys ___ reports.', en: 'She enjoys ___ reports.', ja: 'She enjoys ___ reports.' },
    choices: ['writing', 'to write', 'write'],
    answer: 'writing',
    why: { zh: 'enjoy 後面是 V-ing。', en: 'enjoy takes V-ing.', ja: 'enjoy の後は V-ing。' },
  },
  {
    id: 'finish',
    stem: { zh: 'We finished ___ the draft.', en: 'We finished ___ the draft.', ja: 'We finished ___ the draft.' },
    choices: ['reading', 'to read', 'read'],
    answer: 'reading',
    why: { zh: 'finish 後面是 V-ing。', en: 'finish takes V-ing.', ja: 'finish の後は V-ing。' },
  },
  {
    id: 'subject',
    stem: { zh: '___ late is a problem.', en: '___ late is a problem.', ja: '___ late is a problem.' },
    choices: ['Arriving', 'Arrive', 'Arrived'],
    answer: 'Arriving',
    why: { zh: '這裡用 V-ing 當主詞。', en: 'V-ing is the subject here.', ja: 'ここは V-ing が主語。' },
  },
  {
    id: 'forward',
    stem: { zh: 'I look forward to ___ you.', en: 'I look forward to ___ you.', ja: 'I look forward to ___ you.' },
    choices: ['seeing', 'see', 'saw'],
    answer: 'seeing',
    why: { zh: 'look forward to 後面是 V-ing，不是原形。', en: 'look forward to takes V-ing, not a base verb.', ja: 'look forward to の後は V-ing。原形ではない。' },
  },
  {
    id: 'participle',
    stem: { zh: 'The ___ file is on the desk.（檔案是被收到的）', en: 'The ___ file is on the desk. (the file was received)', ja: 'The ___ file is on the desk.（受け取られたファイル）' },
    choices: ['received', 'receiving', 'receive'],
    answer: 'received',
    why: { zh: '過去分詞修飾名詞：檔案是被收到的。', en: 'A past participle modifies the noun: the file was received.', ja: '過去分詞が名詞を修飾する。ファイルは受け取られた。' },
  },
  {
    id: 'dangling',
    stem: { zh: 'Leaving the office, the file was missing. 哪一句比較清楚？', en: 'Leaving the office, the file was missing. Which rewrite is clearer?', ja: 'Leaving the office, the file was missing. どれがはっきりする？' },
    choices: ['After I left, the file was missing.', 'Leaving the office, the file was missing.', 'Left the office, the file was missing.'],
    answer: 'After I left, the file was missing.',
    why: { zh: '分詞的主詞不能變成 the file。主詞對不上就寫完整句。', en: 'The participle subject cannot become the file. If it does not match, write a full clause.', ja: '分詞の主語を the file にしてはいけない。揃わないなら完全文。' },
  },
]

export const TRANSITION_DRILLS: PrepDrill[] = [
  {
    id: 'add',
    stem: { zh: 'The file is late. ___, we sent a copy.（補充）', en: 'The file is late. ___, we sent a copy. (add)', ja: 'The file is late. ___, we sent a copy.（追加）' },
    choices: ['Furthermore', 'However', 'In conclusion'],
    answer: 'Furthermore',
    why: { zh: '補充。前面已經有一句。', en: 'Addition. A sentence already came first.', ja: '追加。前に文がある。' },
  },
  {
    id: 'however',
    stem: { zh: 'The file is late, however we sent it. 哪一句清楚？', en: 'The file is late, however we sent it. Which is clearer?', ja: 'The file is late, however we sent it. どれがはっきりする？' },
    choices: ['The file is late. However, we sent it.', 'The file is late, however we sent it.', 'The file is late however, we sent it.'],
    answer: 'The file is late. However, we sent it.',
    why: { zh: 'however 常用句點或分號，不要只用逗號接兩個完整句。', en: 'however usually wants a period or semicolon, not a comma splice.', ja: 'however はピリオドかセミコロン。コンマつなぎにしない。' },
  },
  {
    id: 'therefore',
    stem: { zh: 'We missed the train. ___, we took a taxi.', en: 'We missed the train. ___, we took a taxi.', ja: 'We missed the train. ___, we took a taxi.' },
    choices: ['Therefore', 'Furthermore', 'In conclusion'],
    answer: 'Therefore',
    why: { zh: '先原因，再結果。', en: 'Cause first, then the result.', ja: '原因を先に、結果を後に。' },
  },
  {
    id: 'first',
    stem: { zh: '這是信件第一句。哪一句比較穩？', en: 'This is the first sentence of a mail. Which is safer?', ja: 'メールの最初の文。どれが安定する？' },
    choices: ['The report is late.', 'In conclusion, the report is late.', 'To sum up, the report is late.'],
    answer: 'The report is late.',
    why: { zh: '不要在第一句就總結。', en: 'Do not summarize in the first sentence.', ja: '最初の文でまとめない。' },
  },
  {
    id: 'nevertheless',
    stem: { zh: 'The budget is tight. ___, we kept the deadline.（對比）', en: 'The budget is tight. ___, we kept the deadline. (contrast)', ja: 'The budget is tight. ___, we kept the deadline.（対比）' },
    choices: ['Nevertheless', 'Furthermore', 'Therefore'],
    answer: 'Nevertheless',
    why: { zh: '這是對比，不是補充，也不是結果。', en: 'This is contrast, not addition and not a result.', ja: '対比であり、追加でも結果でもない。' },
  },
  {
    id: 'addition',
    stem: { zh: 'We booked the room. ___, we ordered lunch.', en: 'We booked the room. ___, we ordered lunch.', ja: 'We booked the room. ___, we ordered lunch.' },
    choices: ['In addition', 'In conclusion', 'Therefore'],
    answer: 'In addition',
    why: { zh: '第二句是補充，不是總結。', en: 'The second sentence adds. It does not conclude.', ja: '二文目は追加。まとめではない。' },
  },
  {
    id: 'order',
    stem: { zh: '因果順序哪一句對？', en: 'Which cause-result order is sound?', ja: '因果の順はどれ？' },
    choices: ['The file was late. Consequently, we waited.', 'Consequently, we waited. The file was late.', 'We waited consequently the file was late.'],
    answer: 'The file was late. Consequently, we waited.',
    why: { zh: '先寫原因，再寫結果。', en: 'Write the cause, then the result.', ja: '原因を先に、結果を後に。' },
  },
  {
    id: 'semi',
    stem: { zh: 'however 接兩個完整句，哪一句清楚？', en: 'however joins two full sentences. Which is clearer?', ja: 'however で二文をつなぐ。どれがはっきりする？' },
    choices: ['The room is small; however, it is quiet.', 'The room is small, however it is quiet.', 'The room is small however it is quiet.'],
    answer: 'The room is small; however, it is quiet.',
    why: { zh: '分號或句點都可以。逗號單獨接兩個完整句不行。', en: 'A semicolon or a period works. A comma alone does not join two full sentences.', ja: 'セミコロンかピリオド。コンマだけでは二文をつなげない。' },
  },
]

export const FUNCTION_DRILLS: PrepDrill[] = [
  {
    id: 'greet',
    stem: { zh: '正式信開頭。', en: 'Open a formal mail.', ja: '正式なメールの書き出し。' },
    choices: ['Good morning.', 'Hey,', 'Yo,'],
    answer: 'Good morning.',
    why: { zh: '正式信不要用 hey 當開頭。', en: 'Do not open formal mail with hey.', ja: '正式なメールを hey で始めない。' },
  },
  {
    id: 'sorry',
    stem: { zh: '為延遲致歉。哪一句先說事情？', en: 'Apologize for a delay. Which names the fact first?', ja: '遅れを謝る。事実が先なのは？' },
    choices: ['I am sorry for the delay. The file arrived late.', 'Because the train was late, sorry.', 'Sorry!!!'],
    answer: 'I am sorry for the delay. The file arrived late.',
    why: { zh: '先說事情，再補原因。', en: 'Name the fact, then the reason.', ja: '事実を先に、理由を後に。' },
  },
  {
    id: 'agree',
    stem: { zh: 'I agree ___ the plan.', en: 'I agree ___ the plan.', ja: 'I agree ___ the plan.' },
    choices: ['with', 'to me', 'me'],
    answer: 'with',
    why: { zh: 'agree 後面接 with。', en: 'agree takes with.', ja: 'agree の後は with。' },
  },
  {
    id: 'disagree',
    stem: { zh: '不同意，但不攻擊對方。', en: 'Disagree without attacking the person.', ja: '相手を攻撃せず反対する。' },
    choices: ['I see it differently.', 'You are wrong.', 'No way.'],
    answer: 'I see it differently.',
    why: { zh: '先不要寫 you are wrong。', en: 'Do not start with you are wrong.', ja: 'you are wrong から始めない。' },
  },
  {
    id: 'suggest',
    stem: { zh: 'I suggest that we ___ .', en: 'I suggest that we ___ .', ja: 'I suggest that we ___ .' },
    choices: ['wait', 'waiting', 'to waited'],
    answer: 'wait',
    why: { zh: 'suggest that 後面常用原形。', en: 'suggest that often takes a base verb.', ja: 'suggest that の後は原形が多い。' },
  },
  {
    id: 'refuse',
    stem: { zh: '委婉拒絕日期。', en: 'Refuse a date softly.', ja: '日程を婉曲に断る。' },
    choices: ['I am afraid we cannot meet that date. Friday works.', 'No.', 'Impossible.'],
    answer: 'I am afraid we cannot meet that date. Friday works.',
    why: { zh: '拒絕後給一個替代，不要只寫 no。', en: 'Offer an alternative. Do not stop at no.', ja: '代わりを出す。no だけで終わらない。' },
  },
  {
    id: 'clarify',
    stem: { zh: '沒聽清，請對方再說。', en: 'You did not hear it. Ask for a repeat.', ja: '聞き取れなかった。言い直しを頼む。' },
    choices: ['Could you say that again?', 'I was entirely wrong.', 'You are unclear.'],
    answer: 'Could you say that again?',
    why: { zh: '這是要求重述，不是承認自己全錯。', en: 'This asks for a repeat. It does not admit you were entirely wrong.', ja: '繰り返しの依頼であり、全誤りではない。' },
  },
  {
    id: 'mail',
    stem: { zh: '練習用的郵件收尾。', en: 'A practice mail close.', ja: '練習用のメール締め。' },
    choices: ['Best regards,', 'Certified TOEIC close', 'Company template #1'],
    answer: 'Best regards,',
    why: { zh: '練習句，不是公司範本或認證。', en: 'Practice lines, not a company template or a certificate.', ja: '練習文であり社内ひな型や資格ではない。' },
  },
]

export const SOUND_DRILLS: PrepDrill[] = [
  {
    id: 'noun',
    stem: { zh: '名詞「紀錄」的重音。', en: 'Stress on the noun record.', ja: '名詞 record の強勢。' },
    choices: ['REcord', 'reCORD', 'same stress'],
    answer: 'REcord',
    why: { zh: '重音可以改詞性。不要只記一個讀音。這不是發音認證。', en: 'Stress can change the word class. Do not store only one pronunciation. Not a pronunciation certificate.', ja: '強勢で品詞が変わる。読みは一つではない。発音の資格ではない。' },
  },
  {
    id: 'verb',
    stem: { zh: '動詞「錄下」的重音。', en: 'Stress on the verb record.', ja: '動詞 record の強勢。' },
    choices: ['reCORD', 'REcord', 'same stress'],
    answer: 'reCORD',
    why: { zh: '動詞常把重音放後面。名詞和動詞不要共用一個重音。', en: 'The verb often stresses the later syllable. Do not share one stress with the noun.', ja: '動詞は後ろに強勢が来やすい。名詞と同じ強勢にしない。' },
  },
  {
    id: 'new',
    stem: { zh: 'I need the FILE. 哪個通常較重？（FILE 是新資訊）', en: 'I need the FILE. Which is usually heavier? (FILE is new)', ja: 'I need the FILE. どれが通常強い？（FILE が新しい情報）' },
    choices: ['FILE', 'the', 'I'],
    answer: 'FILE',
    why: { zh: '新資訊通常較重。不是每個字都要重讀。', en: 'New information is usually heavier. Not every word is stressed.', ja: '新しい情報は通常強い。すべての語を強くしない。' },
  },
  {
    id: 'light',
    stem: { zh: '語流裡哪個常不重讀？', en: 'Which is often unstressed in a sentence?', ja: '文の中で強くしないことが多いのは？' },
    choices: ['of', 'deadline', 'report'],
    answer: 'of',
    why: { zh: '功能詞常輕。內容詞才常重。', en: 'Function words are often light. Content words carry the weight.', ja: '機能語は軽いことが多い。内容語が重い。' },
  },
  {
    id: 'fall',
    stem: { zh: 'The file is ready. 說完、確定時常見什麼？', en: 'The file is ready. What is common when it is finished and sure?', ja: 'The file is ready. 言い切って確定のとき多いのは？' },
    choices: ['a fall', 'must rise', 'no tone'],
    answer: 'a fall',
    why: { zh: '降調常是確定。', en: 'A fall often marks certainty.', ja: '下降は確定が多い。' },
  },
  {
    id: 'wh',
    stem: { zh: 'Where is the file? 問句一定升調嗎？', en: 'Where is the file? Must a question rise?', ja: 'Where is the file? 疑問は必ず上昇？' },
    choices: ['not always', 'always a rise', 'never a fall'],
    answer: 'not always',
    why: { zh: '問句不一定升調。', en: 'A question is not always a rise.', ja: '疑問は必ず上昇とは限らない。' },
  },
  {
    id: 'weak',
    stem: { zh: 'to / of 在快語流裡常變成什麼？', en: 'What do to and of often become in fast speech?', ja: '速い発話で to と of は何になりやすい？' },
    choices: ['a weak schwa', 'the dictionary vowel', 'silent'],
    answer: 'a weak schwa',
    why: { zh: '字典音不是語流音。', en: 'A dictionary vowel is not the vowel in fast speech.', ja: '辞書の母音は速い話の母音ではない。' },
  },
  {
    id: 'link',
    stem: { zh: 'pick it up 怎麼聽？', en: 'How should you hear pick it up?', ja: 'pick it up はどう聞く？' },
    choices: ['as one chunk', 'letter by letter', 'only pick'],
    answer: 'as one chunk',
    why: { zh: '聽力不要按字母切開。', en: 'Do not slice listening by letters.', ja: '聞き取りを文字で切らない。' },
  },
]

export const SEMANTICS_DRILLS: PrepDrill[] = [
  {
    id: 'tell',
    stem: { zh: 'Please ___ me the time.', en: 'Please ___ me the time.', ja: 'Please ___ me the time.' },
    choices: ['tell', 'say', 'speak'],
    answer: 'tell',
    why: { zh: 'tell 接人。不要寫成和 say 完全相同。', en: 'tell takes a person. Do not write that it is identical to say.', ja: 'tell は人を取る。say と同一ではない。' },
  },
  {
    id: 'say',
    stem: { zh: 'Please ___ the words again.', en: 'Please ___ the words again.', ja: 'Please ___ the words again.' },
    choices: ['say', 'tell', 'talk'],
    answer: 'say',
    why: { zh: 'say 接話，不接人當間接受詞。', en: 'say takes the words, not a person as an indirect object.', ja: 'say は言葉を取る。人を間接目的語にしない。' },
  },
  {
    id: 'heavy',
    stem: { zh: 'a light bag 的相反。', en: 'The opposite of a light bag.', ja: 'a light bag の反対。' },
    choices: ['heavy', 'dark', 'late'],
    answer: 'heavy',
    why: { zh: '先標是重量。light 也可以對 dark，那是另一個意思。', en: 'Mark the weight sense. light can also oppose dark. That is another sense.', ja: '重さの意味と書く。light は dark とも対になる。別の意味。' },
  },
  {
    id: 'their',
    stem: { zh: '___ bag is here.（他們的）', en: '___ bag is here. (belonging to them)', ja: '___ bag is here.（彼らの）' },
    choices: ['Their', 'There', "They're"],
    answer: 'Their',
    why: { zh: '讀音一樣不代表能互換。', en: 'The same sound does not mean they swap.', ja: '同じ音でも入れ替えられない。' },
  },
  {
    id: 'theyre',
    stem: { zh: '___ late.（他們遲到）', en: '___ late. (they are late)', ja: '___ late.（彼らは遅れている）' },
    choices: ["They're", 'Their', 'There'],
    answer: "They're",
    why: { zh: '這裡是 they are。', en: 'This one means they are.', ja: 'ここは they are。' },
  },
  {
    id: 'run',
    stem: { zh: 'She will ___ the team.（管理，不是跑步）', en: 'She will ___ the team. (manage, not race)', ja: 'She will ___ the team.（運営。走るではない）' },
    choices: ['run', 'race', 'sit'],
    answer: 'run',
    why: { zh: '先寫本義「移動」，再寫延伸義「管理」。', en: 'Write the core sense, move, then the extension, manage.', ja: '本義は移動。派生は運営。' },
  },
  {
    id: 'bank',
    stem: { zh: '河岸的 bank 和銀行的 bank 怎麼記？', en: 'How do you record river bank and a bank account?', ja: '川岸の bank と銀行の bank はどう書く？' },
    choices: ['two entries', 'one gloss', 'the same place'],
    answer: 'two entries',
    why: { zh: '分成兩條，不要寫成一個字的兩個翻譯。', en: 'Two entries. Not one word with two glosses jammed together.', ja: '二項目に分ける。一つの訳に混ぜない。' },
  },
  {
    id: 'trouble',
    stem: { zh: '哪一個是比喻，不是 in/on/at 的空間公式？', en: 'Which is a metaphor, not the in/on/at space formula?', ja: 'どれが比喩で、in/on/at の空間公式ではない？' },
    choices: ['in trouble', 'in the box', 'in Taipei'],
    answer: 'in trouble',
    why: { zh: '這是比喻，不是空間公式。', en: 'This is a metaphor, not the space formula.', ja: '比喩であり、空間公式ではない。' },
  },
]

export const TENSE_DRILLS: PrepDrill[] = [
  {
    id: 'habit',
    stem: { zh: 'She ___ to the office every day.（習慣）', en: 'She ___ to the office every day. (habit)', ja: 'She ___ to the office every day.（習慣）' },
    choices: ['goes', 'is going', 'has gone'],
    answer: 'goes',
    why: { zh: '重複的習慣用現在簡單式。', en: 'A repeated habit uses the simple present.', ja: '繰り返す習慣は現在形。' },
  },
  {
    id: 'now',
    stem: { zh: 'She ___ the file right now.', en: 'She ___ the file right now.', ja: 'She ___ the file right now.' },
    choices: ['is sending', 'sends', 'has sent'],
    answer: 'is sending',
    why: { zh: '此刻正在做，用現在進行。', en: 'Happening at this moment: present progressive.', ja: '今していることは現在進行。' },
  },
  {
    id: 'perfect',
    stem: { zh: 'She ___ the file already.（結果還在）', en: 'She ___ the file already. (the result still matters)', ja: 'She ___ the file already.（結果が残る）' },
    choices: ['has sent', 'sent', 'is sending'],
    answer: 'has sent',
    why: { zh: 'have / has + 過去分詞。不要把每個過去都寫成完成式。', en: 'have / has + past participle. Do not write every past event as a perfect.', ja: 'have / has + 過去分詞。過去を全部完了にしない。' },
  },
  {
    id: 'yesterday',
    stem: { zh: 'She ___ the file yesterday.', en: 'She ___ the file yesterday.', ja: 'She ___ the file yesterday.' },
    choices: ['sent', 'has sent', 'had sent'],
    answer: 'sent',
    why: { zh: 'yesterday 是結束的時間，用過去簡單式。', en: 'yesterday is a finished time. Use the simple past.', ja: 'yesterday は終わった時。過去形。' },
  },
  {
    id: 'earlier',
    stem: { zh: 'She ___ the file before the meeting started.', en: 'She ___ the file before the meeting started.', ja: 'She ___ the file before the meeting started.' },
    choices: ['had sent', 'has sent', 'sends'],
    answer: 'had sent',
    why: { zh: '兩個過去裡較早的那個用 had + 過去分詞。', en: 'The earlier of two past times uses had + past participle.', ja: '二つの過去のうち早い方は had + 過去分詞。' },
  },
  {
    id: 'will',
    stem: { zh: 'She ___ the file tomorrow.', en: 'She ___ the file tomorrow.', ja: 'She ___ the file tomorrow.' },
    choices: ['will send', 'sent', 'has sent'],
    answer: 'will send',
    why: { zh: '明天用 will + 原形。這不是唯一的未來寫法。', en: 'Tomorrow can use will + base verb. It is not the only future form.', ja: '明日は will + 原形で書ける。未来の唯一の形ではない。' },
  },
  {
    id: 'present-if',
    stem: { zh: 'If she ___ here, she would help.（與現在事實相反）', en: 'If she ___ here, she would help. (contrary to now)', ja: 'If she ___ here, she would help.（今の事実と反対）' },
    choices: ['were', 'is', 'will be'],
    answer: 'were',
    why: { zh: '與現在相反：If + 過去式，would + 原形。', en: 'Contrary to the present: If + past, would + base verb.', ja: '現在と反対：If + 過去、would + 原形。' },
  },
  {
    id: 'insist',
    stem: { zh: 'I suggest that she ___ the file.', en: 'I suggest that she ___ the file.', ja: 'I suggest that she ___ the file.' },
    choices: ['send', 'sends', 'sent'],
    answer: 'send',
    why: { zh: '建議：that + 主詞 + 原形。', en: 'A suggestion: that + subject + base verb.', ja: '提案：that + 主語 + 原形。' },
  },
]














