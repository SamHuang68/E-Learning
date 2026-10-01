export const HUB_MARK_ZH = {
  'hub.physics.mark': '物',
  'hub.chemistry.mark': '化',
  'hub.zh.mark': '華',
} as const

export const HUB_MARK_EN: { [K in keyof typeof HUB_MARK_ZH]: string } = {
  'hub.physics.mark': 'Ph',
  'hub.chemistry.mark': 'Ch',
  'hub.zh.mark': 'Zh',
}
