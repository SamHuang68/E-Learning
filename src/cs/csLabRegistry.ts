export const CS_LAB_ID = {
  VON_NEUMANN: 'von-neumann',
  PIPELINE_HAZARD: 'pipeline-hazard',
  CACHE_MAPPING: 'cache-mapping',
  ARCH_MAP: 'arch-map',
  AI_TRANSFORMER: 'ai-transformer',
} as const

export type CsLabId = (typeof CS_LAB_ID)[keyof typeof CS_LAB_ID]

export const CS_LAB_IDS: readonly CsLabId[] = Object.freeze(Object.values(CS_LAB_ID))
