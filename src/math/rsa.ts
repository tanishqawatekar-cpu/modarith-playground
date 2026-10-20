import { extendedEuclid, modInverse } from './euclid';
import { isActuallyPrime, modularExponentiation } from './primality';

export interface RSAKeyPair {
  p: bigint;
  q: bigint;
  n: bigint;
  phi: bigint;
  e: bigint;
  d: bigint;
  validECandidates: bigint[];
  isValid: boolean;
  error?: string;
}

export interface RSACharBlockTrace {
  char: string;
  asciiCode: bigint;
  ciphertext: bigint;
  decryptedCode: bigint;
  decryptedChar: string;
}

export const DEMO_PRIMES: bigint[] = [
  11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n, 101n, 103n, 107n, 109n, 113n, 127n, 131n, 137n, 139n, 149n, 151n, 157n, 163n, 167n, 173n, 179n, 181n, 191n, 193n, 197n, 199n, 211n, 223n, 227n, 229n, 233n, 239n, 241n, 251n, 257n, 263n, 269n, 271n,
];

/**
 * Generates RSA public/private key components from two primes p and q.
 * Finds valid candidates for e (gcd(e, phi(n)) = 1), defaulting to 65537 if phi > 65537
 * and coprime, or the smallest odd integer >= 3 that is coprime to phi(n).
 */
export function generateRSAKeys(p: bigint, q: bigint, customE?: bigint): RSAKeyPair {
  if (p === q) {
    return {
      p,
      q,
      n: p * q,
      phi: 0n,
      e: 0n,
      d: 0n,
      validECandidates: [],
      isValid: false,
      error: 'Primes p and q must be distinct (p ≠ q); otherwise n = p² can be trivially factored by taking √n.',
    };
  }

  const pCheck = isActuallyPrime(p);
  if (!pCheck.prime) {
    return {
      p,
      q,
      n: p * q,
      phi: 0n,
      e: 0n,
      d: 0n,
      validECandidates: [],
      isValid: false,
      error: `Input p = ${p} is not prime${pCheck.smallestFactor ? ` (divisible by ${pCheck.smallestFactor})` : ''}.`,
    };
  }

  const qCheck = isActuallyPrime(q);
  if (!qCheck.prime) {
    return {
      p,
      q,
      n: p * q,
      phi: 0n,
      e: 0n,
      d: 0n,
      validECandidates: [],
      isValid: false,
      error: `Input q = ${q} is not prime${qCheck.smallestFactor ? ` (divisible by ${qCheck.smallestFactor})` : ''}.`,
    };
  }

  const n = p * q;
  const phi = (p - 1n) * (q - 1n);

  const validECandidates: bigint[] = [];
  let candidate = 3n;
  while (candidate < phi && validECandidates.length < 16) {
    if (extendedEuclid(candidate, phi).gcd === 1n) {
      validECandidates.push(candidate);
    }
    candidate += 2n;
  }

  if (phi > 65537n && extendedEuclid(65537n, phi).gcd === 1n && !validECandidates.includes(65537n)) {
    validECandidates.unshift(65537n);
  }

  let selectedE = customE;
  if (!selectedE || selectedE <= 1n || selectedE >= phi || extendedEuclid(selectedE, phi).gcd !== 1n) {
    if (phi > 65537n && extendedEuclid(65537n, phi).gcd === 1n) {
      selectedE = 65537n;
    } else {
      selectedE = validECandidates[0] ?? 3n;
    }
  }

  const inv = modInverse(selectedE, phi);
  if (inv.inverse === null) {
    return {
      p,
      q,
      n,
      phi,
      e: selectedE,
      d: 0n,
      validECandidates,
      isValid: false,
      error: `Failed to compute modular inverse d ≡ e⁻¹ (mod φ(n)).`,
    };
  }

  return {
    p,
    q,
    n,
    phi,
    e: selectedE,
    d: inv.inverse,
    validECandidates,
    isValid: true,
  };
}

/**
 * Encrypts a single numerical block M using public key (e, n): C = M^e mod n.
 */
export function rsaEncryptNumber(message: bigint, e: bigint, n: bigint): bigint {
  return modularExponentiation(message, e, n).result;
}

/**
 * Decrypts a single numerical block C using private key (d, n): M = C^d mod n.
 */
export function rsaDecryptNumber(ciphertext: bigint, d: bigint, n: bigint): bigint {
  return modularExponentiation(ciphertext, d, n).result;
}

/**
 * Encrypts and decrypts an ASCII text message character-by-character, returning full block traces.
 */
export function rsaProcessText(
  plaintext: string,
  e: bigint,
  d: bigint,
  n: bigint
): {
  blocks: RSACharBlockTrace[];
  ciphertextBlocks: bigint[];
  recoveredText: string;
  modulusWarning?: string;
} {
  const blocks: RSACharBlockTrace[] = [];
  const ciphertextBlocks: bigint[] = [];
  let maxAscii = 0n;

  for (let i = 0; i < plaintext.length; i++) {
    const code = BigInt(plaintext.charCodeAt(i));
    if (code > maxAscii) maxAscii = code;
    const c = rsaEncryptNumber(code, e, n);
    const m = rsaDecryptNumber(c, d, n);
    const decryptedChar = String.fromCharCode(Number(m));

    ciphertextBlocks.push(c);
    blocks.push({
      char: plaintext[i],
      asciiCode: code,
      ciphertext: c,
      decryptedCode: m,
      decryptedChar,
    });
  }

  const recoveredText = blocks.map((b) => b.decryptedChar).join('');
  const modulusWarning =
    n <= maxAscii
      ? `Warning: Modulus n = ${n} is smaller than or equal to character ASCII value (${maxAscii}). Information loss occurs mod ${n}! Choose larger primes so n > 127.`
      : undefined;

  return {
    blocks,
    ciphertextBlocks,
    recoveredText,
    modulusWarning,
  };
}
