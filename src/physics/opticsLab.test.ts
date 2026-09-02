import { describe, it, expect } from 'vitest'

describe('Physics Optics & Snell Law Tests', () => {
  it('calculates refraction angle theta2 correctly using Snell Law', () => {
    const n1 = 1.0 // Air
    const n2 = 1.5 // Glass
    const theta1Deg = 30
    const theta1Rad = (theta1Deg * Math.PI) / 180

    const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2
    const theta2Deg = (Math.asin(sinTheta2) * 180) / Math.PI

    expect(theta2Deg).toBeCloseTo(19.47, 1)
  })

  it('calculates critical angle for total internal reflection (TIR) correctly', () => {
    const n1 = 1.5 // Glass (optically denser)
    const n2 = 1.0 // Air (optically rarer)

    const criticalAngleDeg = (Math.asin(n2 / n1) * 180) / Math.PI
    // arcsin(1/1.5) = arcsin(2/3) ≈ 41.81 deg
    expect(criticalAngleDeg).toBeCloseTo(41.81, 1)
  })

  it('detects total internal reflection when incident angle exceeds critical angle', () => {
    const n1 = 1.5
    const n2 = 1.0
    const theta1Deg = 45 // > 41.81 deg
    const theta1Rad = (theta1Deg * Math.PI) / 180

    const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2
    const isTir = sinTheta2 > 1.0

    expect(isTir).toBe(true)
  })
})
