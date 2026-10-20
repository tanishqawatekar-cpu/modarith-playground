import { isActuallyPrime, modularExponentiation, ModExpResult } from './primality';

export interface DiffieHellmanResult {
  p: bigint;
  g: bigint;
  alicePrivate: bigint;
  bobPrivate: bigint;
  alicePublic: bigint;
  bobPublic: bigint;
  aliceSharedSecret: bigint;
  bobSharedSecret: bigint;
  keysMatch: boolean;
  isPrimeModulus: boolean;
  traces: {
    alicePublicTrace: ModExpResult;
    bobPublicTrace: ModExpResult;
    aliceSharedTrace: ModExpResult;
    bobSharedTrace: ModExpResult;
  };
}

export interface DHPreset {
  label: string;
  p: bigint;
  g: bigint;
  a: bigint;
  b: bigint;
  description: string;
}

export const DH_PRESETS: DHPreset[] = [
  {
    label: 'Classic Textbook (p = 23, g = 5)',
    p: 23n,
    g: 5n,
    a: 6n,
    b: 15n,
    description: 'Standard textbook prime p = 23 with primitive root g = 5.',
  },
  {
    label: 'Medium Prime (p = 97, g = 5)',
    p: 97n,
    g: 5n,
    a: 36n,
    b: 58n,
    description: 'Two-digit prime p = 97 where g = 5 generates the full multiplicative group Z_97*.',
  },
  {
    label: 'Safe Prime Demo (p = 467, g = 2)',
    p: 467n,
    g: 2n,
    a: 123n,
    b: 319n,
    description: 'Safe prime p = 2q + 1 = 467 (where q = 233 is a Sophie Germain prime).',
  },
  {
    label: '4-Digit Group (p = 7919, g = 7)',
    p: 7919n,
    g: 7n,
    a: 1429n,
    b: 5211n,
    description: '1000th prime p = 7919 with primitive root generator g = 7.',
  },
];

/**
 * Simulates the complete Diffie-Hellman key exchange protocol over F_p*.
 */
export function computeDiffieHellman(
  p: bigint,
  g: bigint,
  alicePrivate: bigint,
  bobPrivate: bigint
): DiffieHellmanResult {
  const validP = p > 1n ? p : 2n;
  const isPrimeModulus = isActuallyPrime(validP).prime;

  const alicePublicTrace = modularExponentiation(g, alicePrivate, validP);
  const bobPublicTrace = modularExponentiation(g, bobPrivate, validP);

  const alicePublic = alicePublicTrace.result;
  const bobPublic = bobPublicTrace.result;

  const aliceSharedTrace = modularExponentiation(bobPublic, alicePrivate, validP);
  const bobSharedTrace = modularExponentiation(alicePublic, bobPrivate, validP);

  const aliceSharedSecret = aliceSharedTrace.result;
  const bobSharedSecret = bobSharedTrace.result;

  return {
    p: validP,
    g,
    alicePrivate,
    bobPrivate,
    alicePublic,
    bobPublic,
    aliceSharedSecret,
    bobSharedSecret,
    keysMatch: aliceSharedSecret === bobSharedSecret,
    isPrimeModulus,
    traces: {
      alicePublicTrace,
      bobPublicTrace,
      aliceSharedTrace,
      bobSharedTrace,
    },
  };
}
