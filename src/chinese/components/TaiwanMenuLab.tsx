import React, { useState } from 'react'
import { TAIWANESE_LOANWORDS, type LoanwordItem } from '../data/taiwaneseLoanwords'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface FoodItem {
  nameZh: string
  pinyin: string
  bopomofo: string
  nameJa: string
  descriptionJa: string
  orderCustomizationJa: string
  emoji: string
  category: '夜市小吃' | '傳統正餐' | '台灣甜品'
}

const TAIWAN_FOODS: FoodItem[] = [
  {
    nameZh: '小籠包',
    pinyin: 'xiǎo lóng bāo',
    bopomofo: 'ㄒㄧㄠˇ ㄌㄨㄥˊ ㄅㄠ',
    nameJa: 'ショーロンポー（スープ入り蒸し餃子）',
    descriptionJa: '薄い皮の中にジューシーな豚肉餡とアツアツのスープがたっぷり入った台湾グルメの代表格。',
    orderCustomizationJa: '「要一籠 / 薑絲醬油（ショウガと醤油）」で注文。レンゲに乗せて皮を破りスープを味わう。',
    emoji: '🥟',
    category: '傳統正餐',
  },
  {
    nameZh: '大雞排',
    pinyin: 'dà jī pái',
    bopomofo: 'ㄉㄚˋ ㄐㄧ ㄆㄞˊ',
    nameJa: 'ダージーパイ（台湾特大フライドチキン）',
    descriptionJa: '人の顔ほどある巨大な鶏むね肉に五香粉やスパイスを効かせてサクサクに揚げた人気夜市グルメ。',
    orderCustomizationJa: '「要切（カット）/ 不切（そのまま）」、「微辣（ピリ辛）/ 不加辣（辛味なし）」を指定。',
    emoji: '🍗',
    category: '夜市小吃',
  },
  {
    nameZh: '滷肉飯',
    pinyin: 'lǔ ròu fàn',
    bopomofo: 'ㄌㄨˇ ㄖㄡˋ ㄈㄢˋ',
    nameJa: 'ルーローハン（豚肉の甘辛煮込みご飯）',
    descriptionJa: '細かく刻んだ豚バラ肉を醤油、エシャロット（紅蔥頭）、五香粉でじっくり煮込みご飯にかけたソウルフード。',
    orderCustomizationJa: '「加一顆滷蛋（煮卵追加）/ 燙青菜（茹で野菜）」を一緒に頼むのが定番。',
    emoji: '🍚',
    category: '傳統正餐',
  },
  {
    nameZh: '珍珠奶茶',
    pinyin: 'zhēn zhū nǎi chá',
    bopomofo: 'ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ',
    nameJa: 'タピオカミルクティー（ボバティー）',
    descriptionJa: 'もちもちのブラックタピオカ（粉圓）が入った濃厚なミルクティー。台湾発祥の世界的人気ドリンク。',
    orderCustomizationJa: '甘さ（微糖30% / 無糖0%）、氷（去冰＝氷なし / 微冰＝少なめ）を指定。',
    emoji: '🧋',
    category: '台灣甜品',
  },
  {
    nameZh: '芒果雪花冰',
    pinyin: 'máng guǒ xuě huā bīng',
    bopomofo: 'ㄇㄤˊ ㄍㄨㄛˇ ㄒㄩㄝˇ ㄏㄨㄚ ㄅㄧㄥ',
    nameJa: 'マンゴーかき氷（雪花氷）',
    descriptionJa: 'ミルク味のふわふわ氷の上に、新鮮な愛文マンゴーと練乳・マンゴーアイスを贅沢に乗せた夏の定番。',
    orderCustomizationJa: '夏季限定（5月〜10月が旬）。シェアして食べるのがおすすめ。',
    emoji: '🍧',
    category: '台灣甜品',
  },
  {
    nameZh: '臭豆腐',
    pinyin: 'chòu dòu fū',
    bopomofo: 'ㄔㄡˋ ㄉㄡˋ ㄈㄨ',
    nameJa: 'チョウドウフ（発酵揚げ豆腐）',
    descriptionJa: '独特の発酵臭を持つが、カリッと揚げて甘酸っぱい台湾風キムチ（台式泡菜）と一緒に食べると絶品。',
    orderCustomizationJa: '「炸的（揚げ）」が初心者におすすめ。「加辣（辛味追加）」で泡菜と一緒に一口で。',
    emoji: '🥢',
    category: '夜市小吃',
  },
]

interface Props {
  onEarnXp: (amount: number) => void
}

export const TaiwanMenuLab: React.FC<Props> = ({ onEarnXp }) => {
  const [activeTab, setActiveTab] = useState<'food' | 'loanwords'>('food')
  const [selectedFood, setSelectedFood] = useState<FoodItem>(TAIWAN_FOODS[0])
  const [selectedLoanword, setSelectedLoanword] = useState<LoanwordItem>(TAIWANESE_LOANWORDS[0])

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="math-lab taiwan-menu-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🏮</span> 台灣夜市美食菜單圖鑑與生活文化實驗室 (Taiwan Food & Culture Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            夜市でそのまま使える台湾ローカルフードの注文フレーズ＆台湾人が日常で使う定番台湾語（閩南語）借用語を攻略！
          </p>
        </div>
      </div>

      {/* 分頁切換 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem' }}>
        <button
          type="button"
          className={`pill-btn ${activeTab === 'food' ? 'active' : ''}`}
          onClick={() => setActiveTab('food')}
        >
          🍜 經典美食菜單圖鑑 (Food Menu)
        </button>
        <button
          type="button"
          className={`pill-btn ${activeTab === 'loanwords' ? 'active' : ''}`}
          onClick={() => setActiveTab('loanwords')}
        >
          🗣️ 日常生活台灣語借詞 (Taiwanese Slang)
        </button>
      </div>

      {activeTab === 'food' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
          {/* 左側：美食卡片網格 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.4rem' }}>
            {TAIWAN_FOODS.map((food, idx) => (
              <button
                key={idx}
                type="button"
                className="practice-card"
                style={{
                  padding: '0.6rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  borderRadius: '10px',
                  borderColor: selectedFood.nameZh === food.nameZh ? '#f59e0b' : 'var(--line)',
                  background: selectedFood.nameZh === food.nameZh ? 'rgba(245, 158, 11, 0.12)' : 'var(--surface)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                onClick={() => {
                  setSelectedFood(food)
                  speakChinese(food.nameZh)
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>{food.emoji}</span>
                <strong style={{ fontSize: '0.9rem' }}>{food.nameZh}</strong>
                <span style={{ fontSize: '0.68rem', color: '#f59e0b' }}>{food.pinyin}</span>
              </button>
            ))}
          </div>

          {/* 右側：詳細點餐指南 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '2rem' }}>{selectedFood.emoji}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedFood.nameZh}</h3>
                  <div style={{ fontSize: '0.76rem', color: '#f59e0b' }}>{selectedFood.pinyin} · {selectedFood.bopomofo}</div>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                onClick={() => {
                  speakChinese(selectedFood.nameZh)
                  onEarnXp(5)
                  playCorrectSound()
                }}
              >
                🔊 聽發音
              </button>
            </div>

            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>🇯🇵 日本語名・料理の特徴：</span>
              <strong style={{ fontSize: '0.86rem', display: 'block', margin: '0.15rem 0 0.3rem' }}>{selectedFood.nameJa}</strong>
              <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.45, color: 'var(--muted)' }}>{selectedFood.descriptionJa}</p>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, display: 'block' }}>💡 屋台・店頭での注文カスタムのコツ：</span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', lineHeight: 1.45 }}>{selectedFood.orderCustomizationJa}</p>
            </div>
          </div>
        </div>
      ) : (
        /* 生活台灣語借詞 */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {TAIWANESE_LOANWORDS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="practice-card"
                style={{
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '10px',
                  borderColor: selectedLoanword.id === item.id ? '#10b981' : 'var(--line)',
                  background: selectedLoanword.id === item.id ? 'rgba(16, 185, 129, 0.12)' : 'var(--surface)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => setSelectedLoanword(item)}
              >
                <div>
                  <strong style={{ fontSize: '1rem' }}>{item.wordZh}</strong>
                  <div style={{ fontSize: '0.74rem', color: '#10b981' }}>{item.taiwanesePinyin}</div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{item.meaningJa.split('・')[0]}</span>
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#10b981' }}>{selectedLoanword.wordZh}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.15rem' }}>
                台湾語読み：<strong>{selectedLoanword.taiwanesePinyin}</strong>
              </div>
            </div>

            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>意味：</span>
              <strong style={{ fontSize: '0.88rem', display: 'block', margin: '0.2rem 0' }}>{selectedLoanword.meaningJa}</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>華語同義語：{selectedLoanword.meaningZh}</div>
            </div>

            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>どんな場面で使う？：</span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', lineHeight: 1.45 }}>{selectedLoanword.usageSituationJa}</p>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>例文：</span>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, margin: '0.2rem 0' }}>{selectedLoanword.exampleZh}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{selectedLoanword.exampleJa}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
