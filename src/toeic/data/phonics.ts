export type PhonicsItem = {
  id: string
  label: string
  speak: string
  tip: string
  tipEn?: string
}

export const alphabet: PhonicsItem[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch) => ({
  id: ch,
  label: ch,
  speak: ch,
  tip: `Letter ${ch}`,
}))

export const starterWords: PhonicsItem[] = [
  { id: 'hello', label: 'hello', speak: 'hello', tip: '問候', tipEn: 'A greeting' },
  { id: 'name', label: 'name', speak: 'name', tip: '名字', tipEn: 'A person’s name' },
  { id: 'office', label: 'office', speak: 'office', tip: '辦公室', tipEn: 'A workplace or workroom' },
  { id: 'meeting', label: 'meeting', speak: 'meeting', tip: '會議', tipEn: 'A scheduled business discussion' },
  { id: 'email', label: 'email', speak: 'email', tip: '電子郵件', tipEn: 'An electronic message' },
  { id: 'please', label: 'please', speak: 'please', tip: '請', tipEn: 'A polite request word' },
  { id: 'thank', label: 'thank you', speak: 'thank you', tip: '謝謝', tipEn: 'An expression of gratitude' },
  { id: 'schedule', label: 'schedule', speak: 'schedule', tip: '行程', tipEn: 'A timetable or plan' },
  { id: 'client', label: 'client', speak: 'client', tip: '客戶', tipEn: 'A customer of a professional service' },
  { id: 'report', label: 'report', speak: 'report', tip: '報告', tipEn: 'A written or spoken account' },
  { id: 'price', label: 'price', speak: 'price', tip: '價格', tipEn: 'The amount something costs' },
  { id: 'deadline', label: 'deadline', speak: 'deadline', tip: '截止日期', tipEn: 'The latest time work must be completed' },
]
