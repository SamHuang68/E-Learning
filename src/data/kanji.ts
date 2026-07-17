export type KanjiEntry = {
  id: string
  char: string
  readings: string[]
  meaning: string
  words: string[]
}

export const n5Kanji: KanjiEntry[] = [
  { id: 'k-001', char: '日', readings: ['にち', 'ひ', 'び'], meaning: 'day; sun', words: ['日本', '日曜日'] },
  { id: 'k-002', char: '月', readings: ['げつ', 'つき'], meaning: 'month; moon', words: ['月曜日', '一月'] },
  { id: 'k-003', char: '火', readings: ['か', 'ひ'], meaning: 'fire', words: ['火曜日', '火山'] },
  { id: 'k-004', char: '水', readings: ['すい', 'みず'], meaning: 'water', words: ['水曜日', '水'] },
  { id: 'k-005', char: '木', readings: ['もく', 'き'], meaning: 'tree; wood', words: ['木曜日', '木'] },
  { id: 'k-006', char: '金', readings: ['きん', 'かね'], meaning: 'gold; money', words: ['金曜日', 'お金'] },
  { id: 'k-007', char: '土', readings: ['ど', 'つち'], meaning: 'earth; soil', words: ['土曜日', '土地'] },
  { id: 'k-008', char: '人', readings: ['じん', 'にん', 'ひと'], meaning: 'person', words: ['日本人', '一人'] },
  { id: 'k-009', char: '大', readings: ['だい', 'おお'], meaning: 'big', words: ['大学', '大きい'] },
  { id: 'k-010', char: '小', readings: ['しょう', 'ちい', 'こ'], meaning: 'small', words: ['小学校', '小さい'] },
  { id: 'k-011', char: '中', readings: ['ちゅう', 'なか'], meaning: 'middle; inside', words: ['中国', '中'] },
  { id: 'k-012', char: '上', readings: ['じょう', 'うえ', 'あ'], meaning: 'up; above', words: ['上手', '上'] },
  { id: 'k-013', char: '下', readings: ['か', 'した', 'さ'], meaning: 'down; below', words: ['地下鉄', '下'] },
  { id: 'k-014', char: '左', readings: ['さ', 'ひだり'], meaning: 'left', words: ['左手', '左'] },
  { id: 'k-015', char: '右', readings: ['う', 'みぎ'], meaning: 'right', words: ['右手', '右'] },
  { id: 'k-016', char: '山', readings: ['さん', 'やま'], meaning: 'mountain', words: ['富士山', '山'] },
  { id: 'k-017', char: '川', readings: ['せん', 'かわ'], meaning: 'river', words: ['川', '小川'] },
  { id: 'k-018', char: '田', readings: ['でん', 'た'], meaning: 'rice field', words: ['田中', '田んぼ'] },
  { id: 'k-019', char: '本', readings: ['ほん', 'もと'], meaning: 'book; origin', words: ['本', '日本'] },
  { id: 'k-020', char: '語', readings: ['ご', 'かた'], meaning: 'language; word', words: ['日本語', '英語'] },
  { id: 'k-021', char: '学', readings: ['がく', 'まな'], meaning: 'study', words: ['学生', '大学'] },
  { id: 'k-022', char: '校', readings: ['こう'], meaning: 'school', words: ['学校', '高校'] },
  { id: 'k-023', char: '生', readings: ['せい', 'い', 'なま'], meaning: 'life; birth', words: ['学生', '先生'] },
  { id: 'k-024', char: '先', readings: ['せん', 'さき'], meaning: 'previous; ahead', words: ['先生', '先月'] },
  { id: 'k-025', char: '私', readings: ['し', 'わたし'], meaning: 'I; private', words: ['私', '私立'] },
  { id: 'k-026', char: '友', readings: ['ゆう', 'とも'], meaning: 'friend', words: ['友だち', '親友'] },
  { id: 'k-027', char: '名', readings: ['めい', 'な'], meaning: 'name', words: ['名前', '有名'] },
  { id: 'k-028', char: '前', readings: ['ぜん', 'まえ'], meaning: 'front; before', words: ['名前', '午前'] },
  { id: 'k-029', char: '後', readings: ['ご', 'あと', 'うし'], meaning: 'after; behind', words: ['午後', '後ろ'] },
  { id: 'k-030', char: '午', readings: ['ご'], meaning: 'noon', words: ['午前', '午後'] },
  { id: 'k-031', char: '時', readings: ['じ', 'とき'], meaning: 'time; hour', words: ['時間', '何時'] },
  { id: 'k-032', char: '間', readings: ['かん', 'あいだ'], meaning: 'interval; between', words: ['時間', '一週間'] },
  { id: 'k-033', char: '毎', readings: ['まい'], meaning: 'every', words: ['毎日', '毎週'] },
  { id: 'k-034', char: '年', readings: ['ねん', 'とし'], meaning: 'year', words: ['今年', '来年'] },
  { id: 'k-035', char: '今', readings: ['こん', 'いま'], meaning: 'now', words: ['今日', '今月'] },
  { id: 'k-036', char: '何', readings: ['なに', 'なん'], meaning: 'what', words: ['何時', '何人'] },
  { id: 'k-037', char: '行', readings: ['こう', 'い'], meaning: 'go; line', words: ['行きます', '銀行'] },
  { id: 'k-038', char: '来', readings: ['らい', 'く'], meaning: 'come', words: ['来ます', '来年'] },
  { id: 'k-039', char: '食', readings: ['しょく', 'た'], meaning: 'eat; food', words: ['食べます', '食堂'] },
  { id: 'k-040', char: '飲', readings: ['いん', 'の'], meaning: 'drink', words: ['飲みます', '飲食'] },
]
