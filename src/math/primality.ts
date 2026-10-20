import { extendedEuclid } from './euclid';

export interface ModExpStep {
  stepIndex: number;
  bitIndex: number;
  bit: 0 | 1;
  accumulatorBefore: bigint;
  squaredMod: bigint;
  multipliedMod: bigint;
  currentPowerOfBase: bigint;
  operationDesc: string;
}

export interface ModExpResult {
  result: bigint;
  binaryBits: string;
  steps: ModExpStep[];
}

export interface FermatTestResult {
  n: bigint;
  base: bigint;
  gcdWithN: bigint;
  remainder: bigint;
  isProbablyPrime: boolean;
  isCarmichaelFool: boolean;
  verdictLabel: string;
  explanation: string;
  modExpTrace: ModExpResult;
}

export interface CarmichaelPreset {
  n: bigint;
  factors: bigint[];
  foolingBases: bigint[];
  witnessBases: bigint[];
  description: string;
}

export const CARMICHAEL_NUMBERS: CarmichaelPreset[] = [
  {
    n: 561n,
    factors: [3n, 11n, 17n],
    foolingBases: [2n, 4n, 5n, 7n, 8n, 10n, 13n, 14n],
    witnessBases: [3n, 6n, 11n, 17n],
    description: 'Smallest Carmichael number (3 × 11 × 17). Discovered by R. D. Carmichael in 1910.',
  },
  {
    n: 1105n,
    factors: [5n, 13n, 17n],
    foolingBases: [2n, 3n, 4n, 6n, 7n, 8n, 9n, 11n],
    witnessBases: [5n, 10n, 13n, 17n],
    description: 'Second Carmichael number (5 × 13 × 17). Fools Fermat for every base coprime to 1105.',
  },
  {
    n: 1729n,
    factors: [7n, 13n, 19n],
    foolingBases: [2n, 3n, 5n, 6n, 8n, 9n, 10n, 11n],
    witnessBases: [7n, 13n, 14n, 19n],
    description: 'The Hardy-Ramanujan Taxicab Number (7 × 13 × 19), also the third absolute Fermat pseudoprime.',
  },
  {
    n: 2465n,
    factors: [5n, 17n, 29n],
    foolingBases: [2n, 3n, 4n, 6n, 7n, 8n, 9n, 11n],
    witnessBases: [5n, 17n, 29n],
    description: 'Fourth Carmichael number (5 × 17 × 29), satisfying Korselt’s Criterion (p-1 | n-1 for all prime factors).',
  },
  {
    n: 2821n,
    factors: [7n, 13n, 31n],
    foolingBases: [2n, 3n, 4n, 5n, 6n, 8n, 9n, 10n],
    witnessBases: [7n, 13n, 31n],
    description: 'Fifth Carmichael number (7 × 13 × 31). All prime factors are square-free and p-1 divides 2820.',
  },
];

/**
 * Computes base^exp (mod mod) using Right-to-Left / Left-to-Right Square-and-Multiply
 * with a clean educational trace table.
 */
export function modularExponentiation(base: bigint, exp: bigint, mod: bigint): ModExpResult {
  if (mod <= 0n) {
    throw new Error('Modulus must be greater than 0.');
  }
  if (mod === 1n) {
    return {
      result: 0n,
      binaryBits: exp.toString(2),
      steps: [],
    };
  }
  if (exp === 0n) {
    return {
      result: 1n,
      binaryBits: '0',
      steps: [
        {
          stepIndex: 1,
          bitIndex: 0,
          bit: 0,
          accumulatorBefore: 1n,
          squaredMod: 1n,
          multipliedMod: 1n,
          currentPowerOfBase: base % mod,
          operationDesc: 'Exponent is 0 → Result is 1',
        },
      ],
    };
  }

  const normalizedBase = ((base % mod) + mod) % mod;
  const binaryStr = exp.toString(2);
  let acc = 1n;
  const steps: ModExpStep[] = [];

  for (let i = 0; i < binaryStr.length; i++) {
    const bit = binaryStr[i] === '1' ? 1 : 0;
    const bitIndex = binaryStr.length - 1 - i;
    const accBefore = acc;
    const squaredMod = (accBefore * accBefore) % mod;
    const multipliedMod = bit === 1 ? (squaredMod * normalizedBase) % mod : squaredMod;

    acc = multipliedMod;

    steps.push({
      stepIndex: i + 1,
      bitIndex,
      bit,
      accumulatorBefore: accBefore,
      squaredMod,
      multipliedMod,
      currentPowerOfBase: normalizedBase,
      operationDesc:
        bit === 1
          ? `Square (${accBefore}² mod ${mod} = ${squaredMod}) & Multiply (× ${normalizedBase} mod ${mod} = ${multipliedMod})`
          : `Square only (${accBefore}² mod ${mod} = ${squaredMod})`,
    });
  }

  return {
    result: acc,
    binaryBits: binaryStr,
    steps,
  };
}

/**
 * Checks if a small/medium bigint is prime via trial division (for educational ground-truth verification).
 */
export function isActuallyPrime(n: bigint): { prime: boolean; smallestFactor?: bigint } {
  if (n < 2n) return { prime: false };
  if (n === 2n || n === 3n) return { prime: true };
  if (n % 2n === 0n) return { prime: false, smallestFactor: 2n };
  if (n % 3n === 0n) return { prime: false, smallestFactor: 3n };

  let i = 5n;
  // Cap trial division at 1,000,000 iterations to guarantee instant UI responsiveness
  let iterations = 0;
  while (i * i <= n && iterations < 1000000) {
    if (n % i === 0n) return { prime: false, smallestFactor: i };
    if (n % (i + 2n) === 0n) return { prime: false, smallestFactor: i + 2n };
    i += 6n;
    iterations++;
  }
  return { prime: true };
}

/**
 * Evaluates Fermat's Primality Test: base^(n-1) mod n === 1.
 */
export function fermatTest(n: bigint, base: bigint): FermatTestResult {
  if (n <= 2n) {
    const modExpTrace = modularExponentiation(base, n > 1n ? n - 1n : 0n, n > 0n ? n : 1n);
    return {
      n,
      base,
      gcdWithN: 1n,
      remainder: modExpTrace.result,
      isProbablyPrime: n === 2n,
      isCarmichaelFool: false,
      verdictLabel: n === 2n ? 'Prime (2 is the only even prime)' : 'Composite / Invalid (< 2)',
      explanation: n === 2n ? '2 is prime.' : 'Integers less than 2 are not prime.',
      modExpTrace,
    };
  }

  const { gcd } = extendedEuclid(base, n);
  const modExpTrace = modularExponentiation(base, n - 1n, n);
  const remainder = modExpTrace.result;
  const isProbablyPrime = remainder === 1n;

  const actualCheck = isActuallyPrime(n);
  const isCarmichaelFool = isProbablyPrime && !actualCheck.prime;

  let verdictLabel = '';
  let explanation = '';

  if (isProbablyPrime) {
    if (isCarmichaelFool) {
      verdictLabel = 'Probably Prime (PSEUDOPRIME FOOL!)';
      explanation = `Fermat's test computed ${base}^(${n - 1n}) ≡ 1 (mod ${n}), declaring ${n} "Probably Prime". However, ${n} is actually COMPOSITE (divisible by ${actualCheck.smallestFactor})! Base a = ${base} is a Fermat liar for ${n}.`;
    } else {
      verdictLabel = 'Probably Prime';
      explanation = `Fermat's Little Theorem holds: ${base}^(${n - 1n}) ≡ 1 (mod ${n}). No composite witness detected with base ${base}.`;
    }
  } else {
    verdictLabel = 'Definitely Composite';
    if (gcd > 1n) {
      explanation = `Base ${base} shares a non-trivial common factor with ${n}: gcd(${base}, ${n}) = ${gcd} > 1, proving ${n} is composite (and ${base}^(${n - 1n}) ≡ ${remainder} ≠ 1 mod ${n}).`;
    } else {
      explanation = `By contrapositive of Fermat's Little Theorem, since ${base}^(${n - 1n}) ≡ ${remainder} ≠ 1 (mod ${n}), base ${base} is a Fermat witness proving ${n} is definitely composite.`;
    }
  }

  return {
    n,
    base,
    gcdWithN: gcd,
    remainder,
    isProbablyPrime,
    isCarmichaelFool,
    verdictLabel,
    explanation,
    modExpTrace,
  };
}
