import type { PhysicsQuestion } from '../data/curriculum'

export type PhysicsLabMatch = {
  id: string
  name: string
  icon: string
  badge: string
  description: string
}

type PhysicsLabId = 'projectile' | 'shm' | 'optics' | 'circuit' | 'buoyancy'

const PHYSICS_LABS: Record<PhysicsLabId, PhysicsLabMatch> = {
  projectile: {
    id: 'projectile',
    name: '斜向拋體運動實驗室',
    icon: '🚀',
    badge: '拋體運動學',
    description: '調控初速、發射仰角與重力加速度，即時觀測拋物線軌跡與水平射程。',
  },
  shm: {
    id: 'shm',
    name: '簡諧運動與單擺實驗室',
    icon: '⏱️',
    badge: '簡諧與力學能守恆',
    description: '調節擺長、振幅與彈性係數，動態剖析速度、加速度與動能位能週期性轉化。',
  },
  optics: {
    id: 'optics',
    name: '司乃耳折射與透鏡光學實驗室',
    icon: '🌈',
    badge: '幾何光學與全反射',
    description: '連續變換入射角與介質折射率，實測司乃耳定律、全反射臨界角與透鏡成像規律。',
  },
  circuit: {
    id: 'circuit',
    name: '直流電路歐姆定律實驗室',
    icon: '⚡',
    badge: '電路分析與歐姆定律',
    description: '自由配置電源電壓與電阻串並聯拓撲，即時模擬迴路電流、分壓與電功率消耗。',
  },
  buoyancy: {
    id: 'buoyancy',
    name: '阿基米德浮力與密度實驗室',
    icon: '⛵',
    badge: '流體靜力與浮力',
    description: '沉浸式測試固體在不同液體密度下的排開體積、浮力大小與秤重視重變化。',
  },
}

const PHYSICS_LAB_BY_EXPLICIT_HINT: Readonly<Record<string, PhysicsLabId>> = {
  'lab-projectile-motion': 'projectile',
  'lab-shm-oscillation': 'shm',
  'lab-j8-lens-optics': 'optics',
  'lab-j9-circuit-magnetism': 'circuit',
  'lab-kirchhoff-circuit': 'circuit',
  'lab-j7-density': 'buoyancy',
  'lab-j8-buoyancy-pressure': 'buoyancy',
}

function labIdFromExplicitHint(hint: string): PhysicsLabId | undefined {
  return PHYSICS_LAB_BY_EXPLICIT_HINT[hint.trim().toLowerCase()]
}

/**
 * 只在題目或單元明確指向現有五個實驗室之一時回傳連結。
 * 有單元建議但不屬於這五個實驗室時直接 fail-closed，避免再用題幹中的
 * 「動能、安培、臨界角、彈簧」等共用字詞猜測錯誤實驗室。
 */
export function resolvePhysicsLab(
  question: PhysicsQuestion,
  unitSuggestedLab?: string,
): PhysicsLabMatch | undefined {
  if (question.interactiveLab) {
    const hintedLab = labIdFromExplicitHint(question.interactiveLab)
    return hintedLab ? PHYSICS_LABS[hintedLab] : undefined
  }

  if (unitSuggestedLab) {
    const hintedLab = labIdFromExplicitHint(unitSuggestedLab)
    return hintedLab ? PHYSICS_LABS[hintedLab] : undefined
  }

  // 模擬考沒有單元建議，僅接受能直接識別現有實驗室的專有詞。
  const text = `${question.title} ${question.question} ${question.solution}`.toLowerCase()

  if (/\bprojectile\b|拋體|拋射|平拋|斜拋/.test(text)) {
    return PHYSICS_LABS.projectile
  }
  if (/\bsimple harmonic\b|\bshm\b|簡諧|單擺|彈簧振子|擺長|振幅/.test(text)) {
    return PHYSICS_LABS.shm
  }
  if (/\boptics?\b|\blens\b|\bsnell\b|司乃耳|全反射|透鏡|折射|焦距|成像/.test(text)) {
    return PHYSICS_LABS.optics
  }
  if (/\bcircuit\b|\bohm(?:'s)? law\b|\bkirchhoff\b|電路|電阻|歐姆定律|克希荷夫|串聯|並聯/.test(text)) {
    return PHYSICS_LABS.circuit
  }
  if (/\bbuoyancy\b|\bdensity\b|\barchimedes\b|浮力|阿基米德|密度|排水法|漂浮|下沉/.test(text)) {
    return PHYSICS_LABS.buoyancy
  }

  return undefined
}
