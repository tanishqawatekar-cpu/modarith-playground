export interface EuclidStep {
  stepNumber: number;
  dividend: bigint;
  divisor: bigint;
  quotient: bigint;
  remainder: bigint;
  bezoutEq: string;
  s: bigint;
  t: bigint;
}

export interface ExtendedEuclidResult {
  gcd: bigint;
  x: bigint;
  y: bigint;
  steps: EuclidStep[];
}

export interface ModInverseResult {
  inverse: bigint | null;
  gcd: bigint;
  x: bigint;
  y: bigint;
  explanation: string;
  steps: EuclidStep[];
}

/**
 * Computes the Greatest Common Divisor (GCD) and Bézout coefficients (x, y)
 * such that a*x + b*y = gcd(a, b) using the Extended Euclidean Algorithm.
 */
export function extendedEuclid(a: bigint, b: bigint): ExtendedEuclidResult {
  const signA = a < 0n ? -1n : 1n;
  const signB = b < 0n ? -1n : 1n;
  const absA = a < 0n ? -a : a;
  const absB = b < 0n ? -b : b;

  let old_r = absA;
  let r = absB;
  let old_s = 1n;
  let s = 0n;
  let old_t = 0n;
  let t = 1n;

  const steps: EuclidStep[] = [];
  let stepNumber = 1;

  if (r === 0n) {
    return {
      gcd: old_r,
      x: signA * 1n,
      y: 0n,
      steps: [
        {
          stepNumber: 1,
          dividend: absA,
          divisor: 0n,
          quotient: 0n,
          remainder: absA,
          bezoutEq: `${absA} = 1 \\cdot ${a} + 0 \\cdot ${b}`,
          s: signA * 1n,
          t: 0n,
        },
      ],
    };
  }

  while (r !== 0n) {
    const quotient = old_r / r;
    const remainder = old_r - quotient * r;

    const next_s = old_s - quotient * s;
    const next_t = old_t - quotient * t;

    const signedS = signA * next_s;
    const signedT = signB * next_t;

    const formatCoeff = (c: bigint) => (c < 0n ? `(${c.toString()})` : c.toString());
    const bezoutEq = `${remainder.toString()} = ${formatCoeff(signedS)} \\cdot ${a.toString()} + ${formatCoeff(signedT)} \\cdot ${b.toString()}`;

    steps.push({
      stepNumber,
      dividend: old_r,
      divisor: r,
      quotient,
      remainder,
      bezoutEq,
      s: signedS,
      t: signedT,
    });

    old_r = r;
    r = remainder;
    old_s = s;
    s = next_s;
    old_t = t;
    t = next_t;
    stepNumber++;
  }

  const finalX = signA * old_s;
  const finalY = signB * old_t;

  return {
    gcd: old_r,
    x: finalX,
    y: finalY,
    steps,
  };
}

/**
 * Computes the modular multiplicative inverse a^-1 (mod m).
 * Returns null for inverse if gcd(a, m) != 1, along with a human-readable explanation.
 */
export function modInverse(a: bigint, m: bigint): ModInverseResult {
  if (m <= 0n) {
    return {
      inverse: null,
      gcd: 0n,
      x: 0n,
      y: 0n,
      explanation: 'Modulus m must be a positive integer greater than 0.',
      steps: [],
    };
  }

  const normalizedA = ((a % m) + m) % m;
  const result = extendedEuclid(a, m);

  if (result.gcd !== 1n) {
    return {
      inverse: null,
      gcd: result.gcd,
      x: result.x,
      y: result.y,
      explanation: `Modular inverse does not exist because gcd(${a}, ${m}) = ${result.gcd} ≠ 1. Numbers must be coprime for an inverse to exist in Z_${m}.`,
      steps: result.steps,
    };
  }

  const inv = ((result.x % m) + m) % m;
  return {
    inverse: inv,
    gcd: 1n,
    x: result.x,
    y: result.y,
    explanation: `Since gcd(${a}, ${m}) = 1, Bézout's identity gives (${a})(${result.x}) + (${m})(${result.y}) = 1. Reducing modulo ${m} yields ${a}⁻¹ ≡ ${inv} (mod ${m}) (with normalized residue ${normalizedA}).`,
    steps: result.steps,
  };
}
