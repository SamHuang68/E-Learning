import { appendLearningEvent, type LearningMeta } from '../utils/storage'

export function track(
  type: string,
  payload?: Record<string, unknown>,
): void {
  appendLearningEvent(type, payload)
}

export function summarizeEvents(
  events: LearningMeta['events'],
): { byType: Record<string, number> } {
  return {
    byType: events.reduce<Record<string, number>>((acc, event) => {
      acc[event.type] = (acc[event.type] ?? 0) + 1
      return acc
    }, {}),
  }
}
