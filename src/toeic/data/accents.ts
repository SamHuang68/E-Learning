/**
 * TOEIC 官方四國口音設定與語音配置 (Toeic Accents)
 * 涵蓋多益聽力測驗 4 大指定口音：美式 (US)、英式 (UK)、澳洲 (AU)、加拿大 (CA)。
 */

export type ToeicAccentCode = 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'

export type ToeicAccent = {
  code: ToeicAccentCode
  name: string
  nameEn: string
  flag: string
  region: string
  regionEn: string
  features: string
  featuresEn: string
  testWeight: string // 考題占比
  testWeightEn: string
}

export const TOEIC_ACCENTS: ToeicAccent[] = [
  {
    code: 'en-US',
    name: '美式英語 (American)',
    nameEn: 'American English',
    flag: '🇺🇸',
    region: '美國 (North America)',
    regionEn: 'United States (North America)',
    features: '標準美式捲舌 (Rhotic)、美式 flap-t（如 water 唸成 wader）、連讀弱讀顯著。',
    featuresEn: 'Rhotic pronunciation, a flap /t/ as in water sounding like wader, and prominent linking and vowel reduction.',
    testWeight: '約佔聽力考題 50%',
    testWeightEn: 'About 50% of listening questions',
  },
  {
    code: 'en-GB',
    name: '英式英語 (British)',
    nameEn: 'British English',
    flag: '🇬🇧',
    region: '英國 (UK RP)',
    regionEn: 'United Kingdom (Received Pronunciation)',
    features: '非捲舌音 (Non-rhotic)、清脆爆破音 /t/、長母音顯著（如 can\'t 發 /kɑːnt/）。',
    featuresEn: 'Non-rhotic pronunciation, a crisp released /t/, and prominent long vowels such as /kɑːnt/ in can\'t.',
    testWeight: '約佔聽力考題 25%',
    testWeightEn: 'About 25% of listening questions',
  },
  {
    code: 'en-AU',
    name: '澳洲英語 (Australian)',
    nameEn: 'Australian English',
    flag: '🇦🇺',
    region: '澳洲 / 大洋洲',
    regionEn: 'Australia / Oceania',
    features: '雙母音變化（/eɪ/ 偏向 /aɪ/ 如 day 唸成 die）、句尾上升語調 (HRT)。',
    featuresEn: 'A shifted /eɪ/ diphthong that can make day approach die, plus high-rising intonation at the end of statements.',
    testWeight: '約佔聽力考題 15%',
    testWeightEn: 'About 15% of listening questions',
  },
  {
    code: 'en-CA',
    name: '加拿大英語 (Canadian)',
    nameEn: 'Canadian English',
    flag: '🇨🇦',
    region: '加拿大',
    regionEn: 'Canada',
    features: '近似美式發音，帶有加拿大抬升音 (Canadian Raising 如 about 發 /əˈbʌʊt/)。',
    featuresEn: 'Close to American English, with Canadian raising in words such as about.',
    testWeight: '約佔聽力考題 10%',
    testWeightEn: 'About 10% of listening questions',
  },
]

/**
 * 依據口音代碼尋找最佳的 Web Speech 系統語音物件
 */
export function findBestVoiceForAccent(
  voices: SpeechSynthesisVoice[],
  targetCode: ToeicAccentCode,
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null

  // 1. 優先精確比對 lang (如 en-US, en-GB, en-AU, en-CA)
  const exact = voices.find((v) => v.lang.toLowerCase() === targetCode.toLowerCase())
  if (exact) return exact

  // 2. 次要依據國家代碼比對 (如 US, GB, AU, CA)
  const countryCode = targetCode.split('-')[1]?.toLowerCase()
  const countryMatch = voices.find(
    (v) => v.lang.toLowerCase().includes(countryCode) && v.lang.startsWith('en'),
  )
  if (countryMatch) return countryMatch

  // 3. 回退至任何英語語音
  const anyEnglish = voices.find((v) => v.lang.startsWith('en'))
  return anyEnglish ?? voices[0] ?? null
}
