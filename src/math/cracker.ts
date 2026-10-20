import { modInverse } from './euclid';
import { rsaDecryptNumber } from './rsa';

export interface FactorizationIteration {
  iteration: number;
  method: 'Trial Division' | 'Fermat Difference of Squares';
  candidateDesc: string;
  testedValue: bigint;
  detail: string;
  foundFactor: boolean;
}

export interface CrackRSAResult {
  success: boolean;
  methodUsed: 'Trial Division' | 'Fermat Difference of Squares';
  p: bigint;
  q: bigint;
  phi: bigint;
  e: bigint;
  d: bigint;
  decryptedBlocks: bigint[];
  recoveredPlaintext: string;
  executionTimeMs: number;
  iterations: number;
  traceSteps: FactorizationIteration[];
  error?: string;
}

/**
 * Integer square root for BigInt using Newton's method: returns floor(sqrt(n)).
 */
export function bigintSqrt(n: bigint): bigint {
  if (n < 0n) throw new Error('Square root of negative bigint is not supported.');
  if (n < 2n) return n;

  let x0 = n / 2n;
  let x1 = (x0 + n / x0) / 2n;
  while (x1 < x0) {
    x0 = x1;
    x1 = (x0 + n / x0) / 2n;
  }
  return x0;
}

/**
 * Checks if a non-negative bigint is a perfect square, returning its root if so.
 */
export function isPerfectSquare(n: bigint): { isSquare: boolean; root: bigint } {
  if (n < 0n) return { isSquare: false, root: 0n };
  const root = bigintSqrt(n);
  return { isSquare: root * root === n, root };
}

/**
 * Factors n and reconstructs private key d to decrypt RSA ciphertext blocks.
 * Supports both Fermat's Difference of Squares (n = a^2 - b^2) and Trial Division.
 */
export function crackRSA(
  n: bigint,
  e: bigint,
  ciphertextBlocks: bigint[],
  preferredMethod: 'auto' | 'fermat' | 'trial' = 'auto'
): CrackRSAResult {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const traceSteps: FactorizationIteration[] = [];
  let p = 0n;
  let q = 0n;
  let iterations = 0;
  let methodUsed: 'Trial Division' | 'Fermat Difference of Squares' = 'Fermat Difference of Squares';

  if (n <= 3n) {
    return {
      success: false,
      methodUsed: 'Trial Division',
      p: 0n,
      q: 0n,
      phi: 0n,
      e,
      d: 0n,
      decryptedBlocks: [],
      recoveredPlaintext: '',
      executionTimeMs: 0,
      iterations: 0,
      traceSteps: [],
      error: 'Modulus n must be a composite integer greater than 3.',
    };
  }

  // Handle even n quickly
  if (n % 2n === 0n) {
    iterations = 1;
    p = 2n;
    q = n / 2n;
    methodUsed = 'Trial Division';
    traceSteps.push({
      iteration: 1,
      method: 'Trial Division',
      candidateDesc: 'Check divisor d = 2',
      testedValue: 2n,
      detail: `${n} mod 2 = 0 → Found factors 2 and ${q}`,
      foundFactor: true,
    });
  } else {
    // Try Fermat Factorization first if preferredMethod is 'fermat' or 'auto'
    const tryFermatFirst = preferredMethod === 'fermat' || preferredMethod === 'auto';

    if (tryFermatFirst) {
      let a = bigintSqrt(n);
      if (a * a < n) {
        a += 1n;
      }

      const maxFermatSteps = preferredMethod === 'fermat' ? 200000 : 5000;
      let fermatSteps = 0;

      while (fermatSteps < maxFermatSteps) {
        fermatSteps++;
        iterations++;
        const b2 = a * a - n;
        const sq = isPerfectSquare(b2);

        if (traceSteps.length < 25 || sq.isSquare) {
          traceSteps.push({
            iteration: iterations,
            method: 'Fermat Difference of Squares',
            candidateDesc: `a = ${a}`,
            testedValue: a,
            detail: sq.isSquare
              ? `b² = ${a}² - ${n} = ${b2} = ${sq.root}² (Perfect square! p = ${a - sq.root}, q = ${a + sq.root})`
              : `b² = ${a}² - ${n} = ${b2} (Not a perfect square)`,
            foundFactor: sq.isSquare,
          });
        }

        if (sq.isSquare) {
          const factor1 = a - sq.root;
          const factor2 = a + sq.root;
          if (factor1 > 1n && factor2 > 1n) {
            p = factor1 < factor2 ? factor1 : factor2;
            q = factor1 < factor2 ? factor2 : factor1;
            methodUsed = 'Fermat Difference of Squares';
          }
          break;
        }
        a += 1n;
      }
    }

    // Fallback or explicit Trial Division
    if (p === 0n) {
      methodUsed = 'Trial Division';
      if (preferredMethod === 'trial') {
        iterations = 0;
        traceSteps.length = 0;
      }

      let divisor = 3n;
      const limit = bigintSqrt(n);
      const maxTrialSteps = 500000;
      let trialSteps = 0;

      while (divisor <= limit && trialSteps < maxTrialSteps) {
        trialSteps++;
        iterations++;
        const rem = n % divisor;
        const found = rem === 0n;

        if (traceSteps.length < 25 || found) {
          traceSteps.push({
            iteration: iterations,
            method: 'Trial Division',
            candidateDesc: `d = ${divisor}`,
            testedValue: divisor,
            detail: found
              ? `${n} ÷ ${divisor} = ${n / divisor} with remainder 0 (Factor found!)`
              : `${n} mod ${divisor} = ${rem} ≠ 0`,
            foundFactor: found,
          });
        }

        if (found) {
          p = divisor;
          q = n / divisor;
          break;
        }
        divisor += 2n;
      }
    }
  }

  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const executionTimeMs = Math.max(0.05, Number((endTime - startTime).toFixed(3)));

  if (p <= 1n || q <= 1n || p * q !== n) {
    return {
      success: false,
      methodUsed,
      p: 0n,
      q: 0n,
      phi: 0n,
      e,
      d: 0n,
      decryptedBlocks: [],
      recoveredPlaintext: '',
      executionTimeMs,
      iterations,
      traceSteps,
      error: `Could not factor modulus n = ${n} within the interactive browser iteration limit.`,
    };
  }

  const phi = (p - 1n) * (q - 1n);
  const invResult = modInverse(e, phi);

  if (invResult.inverse === null) {
    return {
      success: false,
      methodUsed,
      p,
      q,
      phi,
      e,
      d: 0n,
      decryptedBlocks: [],
      recoveredPlaintext: '',
      executionTimeMs,
      iterations,
      traceSteps,
      error: `Factored n = ${p} × ${q}, but gcd(e=${e}, φ(n)=${phi}) ≠ 1, so private key d does not exist.`,
    };
  }

  const d = invResult.inverse;
  const decryptedBlocks = ciphertextBlocks.map((c) => rsaDecryptNumber(c, d, n));
  const recoveredPlaintext = decryptedBlocks
    .map((code) => {
      const num = Number(code);
      return num >= 32 && num <= 126 ? String.fromCharCode(num) : `[${code.toString()}]`;
    })
    .join('');

  return {
    success: true,
    methodUsed,
    p,
    q,
    phi,
    e,
    d,
    decryptedBlocks,
    recoveredPlaintext,
    executionTimeMs,
    iterations,
    traceSteps,
  };
}
