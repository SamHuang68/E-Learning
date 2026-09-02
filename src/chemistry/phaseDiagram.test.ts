import { describe, it, expect } from 'vitest'

describe('Chemistry Phase Diagrams, Supercritical CO2 & Clausius-Clapeyron Tests', () => {
  it('contrasts water negative solid-liquid slope with carbon dioxide positive slope', () => {
    // Water density: ice < liquid water => dP/dT < 0 (negative melting slope)
    const rhoIce = 0.9167 // g/cm^3
    const rhoWater = 0.9998 // g/cm^3 at 0 °C
    const deltaVWater = 1 / rhoWater - 1 / rhoIce // cm^3/g, negative value!
    expect(deltaVWater).toBeLessThan(0)

    // Clausius-Clapeyron for fusion: dP/dT = Delta H_fus / (T * Delta V)
    // Since Delta H_fus > 0 and Delta V < 0 => dP/dT < 0
    expect(deltaVWater).toBeCloseTo(-0.091, 3)

    // CO2 solid density > liquid density => Delta V > 0 => dP/dT > 0 (normal positive slope)
    const rhoSolidCo2 = 1.56 // g/cm^3
    const rhoLiquidCo2 = 1.18 // g/cm^3
    const deltaVCo2 = 1 / rhoLiquidCo2 - 1 / rhoSolidCo2
    expect(deltaVCo2).toBeGreaterThan(0)
  })

  it('verifies water triple point parameters and supercritical CO2 extraction conditions', () => {
    // Water Triple Point: 0.01 °C (273.16 K) and 0.00603 atm (611.65 Pa)
    const waterTripleTempC = 0.01 // °C
    const waterTripleTempK = waterTripleTempC + 273.15 // 273.16 K
    const waterTriplePressAtm = 0.00603 // atm
    expect(waterTripleTempK).toBeCloseTo(273.16, 2)
    expect(waterTriplePressAtm).toBeLessThan(0.01)

    // Supercritical CO2 critical point: Tc = 31.0 °C, Pc = 72.8 atm
    const co2CriticalTempC = 31.0
    const co2CriticalPressAtm = 72.8

    // Decaffeination operates above critical conditions (e.g. 40 °C and 100 atm)
    const operatingTempC = 40.0
    const operatingPressAtm = 100.0
    const isSupercritical = operatingTempC > co2CriticalTempC && operatingPressAtm > co2CriticalPressAtm
    expect(isSupercritical).toBe(true)
  })

  it('calculates boiling point reduction at high altitude (0.50 atm) via Clausius-Clapeyron equation', () => {
    // ln(P2 / P1) = -(Delta H_vap / R) * (1/T2 - 1/T1)
    const deltaHVap = 40660 // J/mol for water
    const rGas = 8.31446 // J/(mol*K)
    const t1 = 373.15 // K (100 °C normal boiling point at 1.00 atm)
    const p1 = 1.00 // atm
    const p2 = 0.50 // atm (half atmosphere)

    const lnPRatio = Math.log(p2 / p1) // ln(0.5) ≈ -0.693147
    // 1/T2 = 1/T1 - (R / Delta H_vap) * ln(P2 / P1)
    const invT2 = 1 / t1 - (rGas / deltaHVap) * lnPRatio
    const t2 = 1 / invT2 // K
    const t2Celsius = t2 - 273.15 // °C

    expect(t2Celsius).toBeCloseTo(81.3, 1)
    expect(t2Celsius).toBeLessThan(100.0)
    expect(t2Celsius).toBeGreaterThan(80.0)
  })
})
