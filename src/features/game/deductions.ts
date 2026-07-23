import type { Guess } from './types'

export type Deductions = {
  disabledDigits: string[]
  disabledByPosition: string[][]
  confirmedByPosition: (string | null)[]
}

const DIGITS = Array.from({ length: 10 }, (_, digit) => String(digit))

export function calculateDeductions(length: number, guesses: Guess[]): Deductions {
  const forbiddenByPosition = Array.from(
    { length },
    () => new Set<string>(),
  )
  const eliminatedDigits = new Set<string>()
  const validGuesses = guesses.filter((guess) => guess.value.length === length)

  for (const guess of validGuesses) {
    const feedback = Number(guess.feedback || 0)

    if (feedback !== 0) continue

    for (let position = 0; position < length; position += 1) {
      forbiddenByPosition[position].add(guess.value[position])
    }

    if (new Set(guess.value).size === 1) {
      eliminatedDigits.add(guess.value[0])
    }
  }

  if (length <= 6) {
    refineFromCandidates(
      length,
      validGuesses,
      eliminatedDigits,
      forbiddenByPosition,
    )
  }

  const disabledByPosition = forbiddenByPosition.map((digits) => [...digits].sort())

  return {
    disabledDigits: [...eliminatedDigits].sort(),
    disabledByPosition,
    confirmedByPosition: disabledByPosition.map((disabledDigits) => {
      const allowedDigits = DIGITS.filter((digit) => !disabledDigits.includes(digit))
      return allowedDigits.length === 1 ? allowedDigits[0] : null
    }),
  }
}

function refineFromCandidates(
  length: number,
  guesses: Guess[],
  eliminatedDigits: Set<string>,
  forbiddenByPosition: Set<string>[],
): void {
  const allowedByPosition = Array.from(
    { length },
    () => new Set<string>(),
  )
  const appearingDigits = new Set<string>()
  let candidateCount = 0
  const totalCombinations = 10 ** length

  for (let value = 0; value < totalCombinations; value += 1) {
    const candidate = String(value).padStart(length, '0')

    if (!isCandidateConsistent(candidate, guesses)) continue

    candidateCount += 1
    for (let position = 0; position < length; position += 1) {
      const digit = candidate[position]
      appearingDigits.add(digit)
      allowedByPosition[position].add(digit)
    }
  }

  if (candidateCount === 0) return

  for (const digit of DIGITS) {
    if (!appearingDigits.has(digit)) eliminatedDigits.add(digit)

    for (let position = 0; position < length; position += 1) {
      if (!allowedByPosition[position].has(digit)) {
        forbiddenByPosition[position].add(digit)
      }
    }
  }
}

function isCandidateConsistent(candidate: string, guesses: Guess[]): boolean {
  return guesses.every((guess) => {
    let matchingPositions = 0

    for (let position = 0; position < candidate.length; position += 1) {
      if (candidate[position] === guess.value[position]) matchingPositions += 1
    }

    return matchingPositions === Number(guess.feedback || 0)
  })
}
