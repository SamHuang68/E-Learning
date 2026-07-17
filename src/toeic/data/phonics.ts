export type PhonicsItem = {
  id: string
  label: string
  speak: string
  tip: string
}

export const alphabet: PhonicsItem[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch) => ({
  id: ch,
  label: ch,
  speak: ch,
  tip: `Letter ${ch}`,
}))

export const starterWords: PhonicsItem[] = [
  { id: 'hello', label: 'hello', speak: 'hello', tip: '問候' },
  { id: 'name', label: 'name', speak: 'name', tip: '名字' },
  { id: 'office', label: 'office', speak: 'office', tip: '辦公室' },
  { id: 'meeting', label: 'meeting', speak: 'meeting', tip: '會議' },
  { id: 'email', label: 'email', speak: 'email', tip: '電子郵件' },
  { id: 'please', label: 'please', speak: 'please', tip: '請' },
  { id: 'thank', label: 'thank you', speak: 'thank you', tip: '謝謝' },
  { id: 'schedule', label: 'schedule', speak: 'schedule', tip: '行程' },
  { id: 'client', label: 'client', speak: 'client', tip: '客戶' },
  { id: 'report', label: 'report', speak: 'report', tip: '報告' },
  { id: 'price', label: 'price', speak: 'price', tip: '價格' },
  { id: 'deadline', label: 'deadline', speak: 'deadline', tip: '截止日期' },
]
