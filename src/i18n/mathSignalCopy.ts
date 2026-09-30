import type { MathSolvingSignal } from '../math/data/solvingSignals'
import type { UiLocale } from './locale'
import { teachingCopy } from './teachingCopy'

const EN: Record<string, [string, string, string, string, string]> = {
  "sig-lcm": [
    "Number and quantity · LCM and recurring events",
    "Look for recurring departures, flashing lights, or meetings; find the next simultaneous event.",
    "Use the least common multiple of the two periods.",
    "Bus A departs every 12 minutes and bus B every 18 minutes. Both leave at 8:00. When do they next leave together?",
    "LCM(12, 18) = 36 minutes, so the next departure together is at 8:36."
  ],
  "sig-gcd": [
    "Number and quantity · GCD and equal grouping",
    "Look for the largest equal square tiles or the greatest number of equal groups with no remainder.",
    "Use the greatest common divisor of the dimensions or quantities.",
    "Cut a 36 cm by 24 cm rectangle into equal squares of the greatest possible area. What is their side length?",
    "GCD(36, 24) = 12 cm. The rectangle makes (36/12) × (24/12) = 6 squares."
  ],
  "sig-circle-area": [
    "Geometry · Circle area and circumference",
    "Given diameter d or radius r, find the area or circumference.",
    "Halve the diameter for the radius. Area = πr²; circumference = 2πr.",
    "Find the area and circumference of a circular clock face with a diameter of 20 cm.",
    "r = 10 cm; area = 3.14 × 100 = 314 cm²; circumference = 2 × 3.14 × 10 = 62.8 cm."
  ],
  "sig-speed-distance": [
    "Number and quantity · Catch-up and meeting",
    "Look for two people chasing from the same starting point or moving toward each other from two points.",
    "Add speeds when approaching; subtract speeds when chasing. Divide the distance or lead by the relative speed.",
    "A walks at 80 m/min and B at 60 m/min. B has a 100 m lead when A starts. How long until A catches B?",
    "t = 100 / (80 - 60) = 5 minutes."
  ],
  "sig-fraction-div": [
    "Number and quantity · Divide by a fraction",
    "Look for a fraction divided by a fraction, or a whole inferred from a fractional part.",
    "Multiply by the reciprocal of the divisor. Simplify before multiplying.",
    "A bottle contains 4/5 liter of juice. Each cup holds 2/15 liter. How many cups can be filled?",
    "(4/5) ÷ (2/15) = (4/5) × (15/2) = 6 cups."
  ],
  "sig-ratio-proportion": [
    "Algebra and ratio · Proportions",
    "Given a : b = c : d, solve for the unknown x.",
    "Cross-multiply: a × d = b × c.",
    "A map scale is 3 : 500. What real length does 12 cm on the map represent?",
    "3 : 500 = 12 : x; 3x = 6000; x = 2000 cm = 20 m."
  ]
}

export function localizeMathSignal(item: MathSolvingSignal, locale: UiLocale): MathSolvingSignal {
  const copy = EN[item.id]
  if (locale !== 'en' || !copy) return item
  return { ...item, gradeBand: teachingCopy(locale, item.gradeBand), topic: copy[0], problemSignal: copy[1], threeSecondRule: copy[2], firstStepFormula: item.firstStepFormula.replace(/總塊數/g, 'tiles').replace(/相遇/g, 'meeting').replace(/總距離/g, 'distance').replace(/追趕/g, 'catch').replace(/領先距離/g, 'lead').replace(/快/g, 'fast').replace(/慢/g, 'slow'), exampleProblem: { question: copy[3], quickSolve: copy[4] } }
}
