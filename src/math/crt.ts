import { extendedEuclid, modInverse } from './euclid';

export interface CongruenceInput {
  a: bigint;
  m: bigint;
}

export interface CRTRowStep {
  index: number;
  a: bigint;
  m: bigint;
  M_i: bigint;
  y_i: bigint;
  partialProduct: bigint;
}

export interface CoprimeCheckPair {
  i: number;
  j: number;
  m_i: bigint;
  m_j: bigint;
  gcd: bigint;
  isCoprime: boolean;
}

export interface CRTResult {
  success: boolean;
  error?: string;
  violatedPair?: CoprimeCheckPair;
  coprimePairs: CoprimeCheckPair[];
  x?: bigint;
  M?: bigint;
  sumBeforeMod?: bigint;
  steps: CRTRowStep[];
}

/**
 * Solves a system of simultaneous linear congruences x ≡ a_i (mod m_i)
 * using the Chinese Remainder Theorem (CRT).
 */
export function solveCRT(congruences: CongruenceInput[]): CRTResult {
  if (congruences.length === 0) {
    return {
      success: false,
      error: 'At least one congruence equation is required.',
      coprimePairs: [],
      steps: [],
    };
  }

  for (let i = 0; i < congruences.length; i++) {
    if (congruences[i].m <= 1n) {
      return {
        success: false,
        error: `Modulus m_${i + 1} = ${congruences[i].m} must be an integer greater than 1.`,
        coprimePairs: [],
        steps: [],
      };
    }
  }

  const coprimePairs: CoprimeCheckPair[] = [];
  let firstViolation: CoprimeCheckPair | undefined;

  for (let i = 0; i < congruences.length; i++) {
    for (let j = i + 1; j < congruences.length; j++) {
      const m_i = congruences[i].m;
      const m_j = congruences[j].m;
      const { gcd } = extendedEuclid(m_i, m_j);
      const isCoprime = gcd === 1n;
      const pair: CoprimeCheckPair = {
        i: i + 1,
        j: j + 1,
        m_i,
        m_j,
        gcd,
        isCoprime,
      };
      coprimePairs.push(pair);
      if (!isCoprime && !firstViolation) {
        firstViolation = pair;
      }
    }
  }

  if (firstViolation) {
    return {
      success: false,
      error: `Moduli are not pairwise coprime: gcd(m_${firstViolation.i}, m_${firstViolation.j}) = gcd(${firstViolation.m_i}, ${firstViolation.m_j}) = ${firstViolation.gcd} ≠ 1.`,
      violatedPair: firstViolation,
      coprimePairs,
      steps: [],
    };
  }

  const M = congruences.reduce((acc, curr) => acc * curr.m, 1n);
  const steps: CRTRowStep[] = [];
  let sumBeforeMod = 0n;

  for (let idx = 0; idx < congruences.length; idx++) {
    const { a, m } = congruences[idx];
    const normalizedA = ((a % m) + m) % m;
    const M_i = M / m;
    const invResult = modInverse(M_i, m);
    const y_i = invResult.inverse ?? 0n;
    const partialProduct = normalizedA * M_i * y_i;

    sumBeforeMod += partialProduct;
    steps.push({
      index: idx + 1,
      a: normalizedA,
      m,
      M_i,
      y_i,
      partialProduct,
    });
  }

  const x = ((sumBeforeMod % M) + M) % M;

  return {
    success: true,
    coprimePairs,
    x,
    M,
    sumBeforeMod,
    steps,
  };
}
