import type { ToeicCertificate } from '../toeic/data/certificates'
import type { UiLocale } from './locale'

const EN: Record<ToeicCertificate['id'], Pick<ToeicCertificate, 'audience' | 'mapTitle' | 'mapDesc'>> = {
  orange: {
    audience: 'For learners with basic vocabulary who need practice with longer conversations and complex business contexts. Start with alphabet sounds and high-frequency words.',
    mapTitle: 'Foundation course map',
    mapDesc: 'Alphabet and pronunciation → high-frequency words → short listening tasks for TOEIC foundations.',
  },
  green: {
    audience: 'For routine workplace documents and communication, with a focus on graduation and entry-level workplace requirements in Taiwan.',
    mapTitle: 'Green certificate course map',
    mapDesc: 'Office routines, email, and Part 5/6 grammar for graduation and early-career practice.',
  },
  blue: {
    audience: 'For social and routine business communication, with a focus on roles in international companies and overseas assignments.',
    mapTitle: 'Blue certificate course map',
    mapDesc: 'Meetings, client communication, and Part 3/4 listening for international workplace practice.',
  },
  gold: {
    audience: 'For fluent meeting facilitation and negotiation. Practice senior international roles, cross-border negotiations, and complex business texts.',
    mapTitle: 'Gold certificate course map',
    mapDesc: 'Meeting facilitation, negotiation language, and advanced reading and listening for business fluency.',
  },
}

export function localizeToeicCertificate(cert: ToeicCertificate, locale: UiLocale): ToeicCertificate {
  return locale === 'en' ? { ...cert, ...EN[cert.id] } : cert
}
