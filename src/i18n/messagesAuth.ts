export const AUTH_ZH = {
  'auth.missingConfig': '尚未設定 Supabase（缺少環境變數）。',
  'auth.deleteCloudBlocked': '雲端帳號刪除需由 Supabase 帳號管理流程處理。',
  'auth.deleteNoLocal': '目前沒有已登入的本機帳號。',
  'auth.deleteMissingLocal': '找不到可刪除的本機帳號。',
} as const

export const AUTH_EN: { [K in keyof typeof AUTH_ZH]: string } = {
  'auth.missingConfig': 'Supabase is not configured (missing environment variables).',
  'auth.deleteCloudBlocked': 'Cloud accounts must be deleted through Supabase account settings.',
  'auth.deleteNoLocal': 'There is no signed-in local account.',
  'auth.deleteMissingLocal': 'No local account could be deleted.',
}
