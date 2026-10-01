import type { UiLocale } from './locale'
import type { CsUnit } from '../cs/data/curriculum'

const TITLES: Record<string, string> = {
  'cs-unit-1-foundation': 'Software, hardware, and computer system layers',
  'cs-unit-2-von-neumann': 'Von Neumann architecture and the five functional units',
  'cs-unit-3-digital-logic': "Data representation, two's complement, and digital logic",
  'cs-unit-4-operating-systems': 'Operating system kernels, scheduling, and memory management',
  'cs-unit-5-networking': 'Computer networks, TCP/IP, and Internet protocols',
  'cs-unit-6-ai-hardware': 'AI computing architectures and accelerator trends',
  'cs-unit-7-frontier-ai-models': 'Frontier AI algorithms, Transformers, and large language models',
}

export function csUnitTitle(locale: UiLocale, unit: CsUnit, numbered = true): string {
  if (locale !== 'en') return numbered ? unit.title : unit.title.replace(/^單元 \d+：/, '')
  const title = TITLES[unit.id]
  if (!title) throw new Error('缺少計算機概論單元英文標題：' + unit.id)
  const number = unit.id.match(/^cs-unit-(\d+)-/)?.[1]
  return numbered ? `Unit ${number}: ${title}` : title
}
