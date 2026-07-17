export type ToeicUnit = {
  id: number
  title: string
  titleEn: string
  color: string
  words: number
  listening: number
  grammar: string
}

export type ToeicCertificate = {
  id: 'orange' | 'green' | 'blue' | 'gold'
  name: string
  nameEn: string
  scoreMin: number
  scoreMax: number
  color: string
  colorSoft: string
  audience: string
  mapTitle: string
  mapDesc: string
  units: ToeicUnit[]
}

export const toeicCertificates: ToeicCertificate[] = [
  {
    id: 'orange',
    name: '橘／棕證書',
    nameEn: 'Orange / Brown',
    scoreMin: 10,
    scoreMax: 465,
    color: '#c47a4a',
    colorSoft: '#f7ebe3',
    audience:
      '具備基礎單字量，但長篇溝通與複雜商業語境尚有不足。適合從字母發音與高頻字起步的學員。',
    mapTitle: '基礎起步課程地圖',
    mapDesc: '字母與發音 → 高頻字 → 短句聽辨，打好多益入門底子。',
    units: [
      {
        id: 1,
        title: '字母與發音',
        titleEn: 'Alphabet & Sounds',
        color: '#c47a4a',
        words: 40,
        listening: 12,
        grammar: 'Be verbs',
      },
      {
        id: 2,
        title: '日常高頻字',
        titleEn: 'High-frequency Words',
        color: '#3f8f7a',
        words: 40,
        listening: 12,
        grammar: 'Present simple',
      },
      {
        id: 3,
        title: '自我介紹短句',
        titleEn: 'Self-intro Sentences',
        color: '#4f91c7',
        words: 40,
        listening: 12,
        grammar: 'Subject + verb',
      },
      {
        id: 4,
        title: '購物與數字',
        titleEn: 'Shopping & Numbers',
        color: '#6b7fd7',
        words: 40,
        listening: 12,
        grammar: 'How much / many',
      },
      {
        id: 5,
        title: '時間與行程',
        titleEn: 'Time & Schedule',
        color: '#5a9b8a',
        words: 40,
        listening: 12,
        grammar: 'Prepositions of time',
      },
      {
        id: 6,
        title: '短聽力辨識',
        titleEn: 'Short Listening',
        color: '#7a8f4f',
        words: 40,
        listening: 12,
        grammar: 'Wh- questions',
      },
    ],
  },
  {
    id: 'green',
    name: '綠色證書',
    nameEn: 'Green',
    scoreMin: 470,
    scoreMax: 725,
    color: '#2f9e6b',
    colorSoft: '#e4f6ee',
    audience:
      '多數台灣大學畢業標準與多數本土企業新進人員門檻。能應付一般工作文件與例行溝通。',
    mapTitle: '綠色證書課程地圖',
    mapDesc: '辦公室日常、郵件與 Part 5/6 文法，對齊畢業與初入職場門檻。',
    units: [
      {
        id: 1,
        title: '辦公室日常',
        titleEn: 'Office Basics',
        color: '#2f9e6b',
        words: 40,
        listening: 12,
        grammar: 'Modals (can/should)',
      },
      {
        id: 2,
        title: '商務郵件入門',
        titleEn: 'Email Basics',
        color: '#4f91c7',
        words: 40,
        listening: 12,
        grammar: 'Polite requests',
      },
      {
        id: 3,
        title: '行程與預約',
        titleEn: 'Appointments',
        color: '#c47a4a',
        words: 40,
        listening: 12,
        grammar: 'Future forms',
      },
      {
        id: 4,
        title: 'Part 5 文法精練',
        titleEn: 'Part 5 Grammar',
        color: '#6b7fd7',
        words: 40,
        listening: 12,
        grammar: 'Word forms',
      },
      {
        id: 5,
        title: '短篇商務閱讀',
        titleEn: 'Short Business Reading',
        color: '#5a9b8a',
        words: 40,
        listening: 12,
        grammar: 'Relative clauses',
      },
      {
        id: 6,
        title: '綠色級總測',
        titleEn: 'Green Checkpoint',
        color: '#7a8f4f',
        words: 40,
        listening: 12,
        grammar: 'Mixed review',
      },
    ],
  },
  {
    id: 'blue',
    name: '藍色證書',
    nameEn: 'Blue',
    scoreMin: 730,
    scoreMax: 855,
    color: '#2f6fad',
    colorSoft: '#e7f0f8',
    audience:
      '可應付社交與例行業務需求，為多數外商與外派職缺的基礎門檻。',
    mapTitle: '藍色證書課程地圖',
    mapDesc: '會議、客戶溝通與聽力 Part 3/4，對齊外商／外派門檻。',
    units: [
      {
        id: 1,
        title: '會議用語',
        titleEn: 'Meeting Language',
        color: '#2f6fad',
        words: 40,
        listening: 12,
        grammar: 'Reporting verbs',
      },
      {
        id: 2,
        title: '客戶溝通',
        titleEn: 'Client Communication',
        color: '#3f8f7a',
        words: 40,
        listening: 12,
        grammar: 'Conditionals',
      },
      {
        id: 3,
        title: '簡報與說明',
        titleEn: 'Presentations',
        color: '#c47a4a',
        words: 40,
        listening: 12,
        grammar: 'Signposting',
      },
      {
        id: 4,
        title: 'Part 3 對話聽力',
        titleEn: 'Part 3 Conversations',
        color: '#6b7fd7',
        words: 40,
        listening: 12,
        grammar: 'Inference',
      },
      {
        id: 5,
        title: 'Part 4 短講',
        titleEn: 'Part 4 Talks',
        color: '#5a9b8a',
        words: 40,
        listening: 12,
        grammar: 'Main idea',
      },
      {
        id: 6,
        title: '藍色級總測',
        titleEn: 'Blue Checkpoint',
        color: '#7a8f4f',
        words: 40,
        listening: 12,
        grammar: 'Mixed advanced',
      },
    ],
  },
  {
    id: 'gold',
    name: '金色證書',
    nameEn: 'Gold',
    scoreMin: 860,
    scoreMax: 990,
    color: '#c9a227',
    colorSoft: '#f8f1d8',
    audience:
      '英語能力等同母語人士，能流利主持會議與協商。目標外商高階、跨國談判與複雜商務文本。',
    mapTitle: '金色證書課程地圖',
    mapDesc: '主持會議、談判話術與高階閱讀／聽力，對齊近母語商務表現。',
    units: [
      {
        id: 1,
        title: '主持會議',
        titleEn: 'Chairing Meetings',
        color: '#c9a227',
        words: 40,
        listening: 12,
        grammar: 'Diplomatic language',
      },
      {
        id: 2,
        title: '協商與談判',
        titleEn: 'Negotiation',
        color: '#2f6fad',
        words: 40,
        listening: 12,
        grammar: 'Hedging & concessions',
      },
      {
        id: 3,
        title: '複雜商務文件',
        titleEn: 'Complex Documents',
        color: '#3f8f7a',
        words: 40,
        listening: 12,
        grammar: 'Nominalization',
      },
      {
        id: 4,
        title: '高階聽力推斷',
        titleEn: 'Advanced Listening',
        color: '#6b7fd7',
        words: 40,
        listening: 12,
        grammar: 'Implied meaning',
      },
      {
        id: 5,
        title: '跨文化溝通',
        titleEn: 'Cross-cultural Talk',
        color: '#c47a4a',
        words: 40,
        listening: 12,
        grammar: 'Register control',
      },
      {
        id: 6,
        title: '金色級總測',
        titleEn: 'Gold Checkpoint',
        color: '#7a8f4f',
        words: 40,
        listening: 12,
        grammar: 'Full review',
      },
    ],
  },
]

export const toeicThemes = [
  { id: 'meeting', label: '會議主持', labelEn: 'Meetings' },
  { id: 'email', label: '商務郵件', labelEn: 'Email' },
  { id: 'travel', label: '出差旅行', labelEn: 'Travel' },
  { id: 'negotiation', label: '協商談判', labelEn: 'Negotiation' },
  { id: 'listening', label: '聽力衝刺', labelEn: 'Listening' },
  { id: 'grammar', label: '文法填空', labelEn: 'Grammar' },
]

export type ToeicHost = {
  name: string
  gender: string
  tone: string
  persona: string
}

export type ToeicBuilderConfig = {
  topic: string
  theme: string
  certificateId: ToeicCertificate['id']
  mode: string
  hostA: ToeicHost
  hostB: ToeicHost
}

export const defaultToeicConfig: ToeicBuilderConfig = {
  topic: 'Quarterly review meeting agenda',
  theme: 'meeting',
  certificateId: 'blue',
  mode: 'conversation',
  hostA: {
    name: 'Alex',
    gender: 'neutral',
    tone: 'Clear, professional, coaching',
    persona: 'TOEIC coach focusing on business English and meeting phrases.',
  },
  hostB: {
    name: 'Sam',
    gender: 'neutral',
    tone: 'Curious learner',
    persona: 'Taiwanese professional preparing for Blue/Gold certificate goals.',
  },
}

export const toeicTemplates = [
  {
    id: 'orange-basics',
    title: '基礎自我介紹',
    desc: '字母＋短句聽辨',
    icon: 'ABC',
    config: {
      topic: 'Introduce yourself in 8 sentences',
      theme: 'travel',
      certificateId: 'orange' as const,
      mode: 'flashcards',
    },
  },
  {
    id: 'green-email',
    title: '綠色郵件',
    desc: '預約與禮貌請求',
    icon: 'Mail',
    config: {
      topic: 'Write a polite meeting-request email',
      theme: 'email',
      certificateId: 'green' as const,
      mode: 'grammar',
    },
  },
  {
    id: 'blue-meeting',
    title: '藍色會議',
    desc: '例行業務與客戶對話',
    icon: 'Meet',
    config: {
      topic: 'Handle a client status-update call',
      theme: 'meeting',
      certificateId: 'blue' as const,
      mode: 'conversation',
    },
  },
  {
    id: 'gold-negotiate',
    title: '金色談判',
    desc: '主持會議與協商',
    icon: 'Deal',
    config: {
      topic: 'Chair a negotiation and close next steps',
      theme: 'negotiation',
      certificateId: 'gold' as const,
      mode: 'conversation',
    },
  },
]
