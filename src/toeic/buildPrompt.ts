import { toeicCertificates, toeicThemes, type ToeicBuilderConfig } from './data/certificates'
import type { UiLocale } from '../i18n/locale'
import { localizeToeicCertificate } from '../i18n/toeicCertificateCopy'

export function buildPrompt(config: ToeicBuilderConfig, locale: UiLocale) {
  const rawCert = toeicCertificates.find((c) => c.id === config.certificateId)
  const cert = rawCert ? localizeToeicCertificate(rawCert, locale) : undefined
  const theme = toeicThemes.find((t) => t.id === config.theme)
  return `# TOEIC Lesson Prompt

## Target certificate
- ${locale === 'en' ? cert?.nameEn : cert?.name} (${cert?.scoreMin}–${cert?.scoreMax})
- Audience: ${cert?.audience}

## Topic
- ${config.topic}
- Theme: ${locale === 'en' ? theme?.labelEn : `${theme?.label} / ${theme?.labelEn}`}
- Mode: ${config.mode}

## Hosts
### ${config.hostA.name}
${config.hostA.tone} — ${config.hostA.persona}

### ${config.hostB.name}
${config.hostB.tone} — ${config.hostB.persona}

## Output requirements
Create an 8–12 minute business-English audio lesson script for TOEIC preparation:
1. Warm-up (30s)
2. Core vocabulary (8–12 items) with example sentences
3. Dialogue aligned to the certificate band
4. One mini quiz (3 options)
5. Closing recap of 5 key phrases

Keep difficulty inside the ${cert?.scoreMin}–${cert?.scoreMax} band. Start the script now.`
}
