import { describe, it, expect } from 'vitest';
import { extendedEuclid, modInverse } from '../src/math/euclid';
import { solveCRT } from '../src/math/crt';
import { modularExponentiation, fermatTest, CARMICHAEL_NUMBERS } from '../src/math/primality';
import { generateRSAKeys, rsaEncryptNumber, rsaDecryptNumber, rsaProcessText } from '../src/math/rsa';
import { crackRSA } from '../src/math/cracker';
import { computeDiffieHellman } from '../src/math/diffieHellman';

describe('ModArith Playground Core Math Engines', () => {
  describe('1. Extended Euclidean Algorithm & Modular Inverse (euclid.ts)', () => {
    it('computes gcd and Bézout coefficients for coprime pair (17, 43)', () => {
      const res = extendedEuclid(17n, 43n);
      expect(res.gcd).toBe(1n);
      expect(17n * res.x + 43n * res.y).toBe(1n);
      expect(res.steps.length).toBeGreaterThan(0);

      const inv = modInverse(17n, 43n);
      expect(inv.inverse).toBe(38n);
      expect((17n * 38n) % 43n).toBe(1n);
    });

    it('computes gcd and Bézout coefficients for non-coprime pair (252, 105)', () => {
      const res = extendedEuclid(252n, 105n);
      expect(res.gcd).toBe(21n);
      expect(252n * res.x + 105n * res.y).toBe(21n);

      const inv = modInverse(252n, 105n);
      expect(inv.inverse).toBeNull();
    });
  });

  describe('2. Chinese Remainder Theorem Solver (crt.ts)', () => {
    it('solves textbook Sunzi congruence system (x ≡ 2 mod 3, 3 mod 5, 2 mod 7 => x = 23 mod 105)', () => {
      const result = solveCRT([
        { a: 2n, m: 3n },
        { a: 3n, m: 5n },
        { a: 2n, m: 7n },
      ]);
      expect(result.success).toBe(true);
      expect(result.M).toBe(105n);
      expect(result.x).toBe(23n);
      expect(23n % 3n).toBe(2n);
      expect(23n % 5n).toBe(3n);
      expect(23n % 7n).toBe(2n);
    });

    it('rejects non-pairwise-coprime moduli and reports the violated pair', () => {
      const result = solveCRT([
        { a: 1n, m: 6n },
        { a: 3n, m: 10n },
        { a: 2n, m: 7n },
      ]);
      expect(result.success).toBe(false);
      expect(result.violatedPair).toBeDefined();
      expect(result.violatedPair?.gcd).toBe(2n);
    });
  });

  describe('3. Primality & Carmichael Pseudoprimes (primality.ts)', () => {
    it('computes square-and-multiply modular exponentiation accurately', () => {
      const res = modularExponentiation(2n, 560n, 561n);
      expect(res.result).toBe(1n);
      expect(res.binaryBits).toBe((560n).toString(2));
    });

    it('detects Carmichael number 561 fooling Fermat primality test at base 2', () => {
      const fermat = fermatTest(561n, 2n);
      expect(fermat.remainder).toBe(1n);
      expect(fermat.isProbablyPrime).toBe(true);
      expect(fermat.isCarmichaelFool).toBe(true);
      expect(CARMICHAEL_NUMBERS.some((c) => c.n === 561n)).toBe(true);
    });

    it('exposes composite 561 when tested with non-coprime witness base 3', () => {
      const fermat = fermatTest(561n, 3n);
      expect(fermat.isProbablyPrime).toBe(false);
      expect(fermat.gcdWithN).toBe(3n);
    });
  });

  describe('4. RSA Encryption & Decryption Round-Trip (rsa.ts)', () => {
    it('generates valid keys and performs full numerical and ASCII text round-trip (M -> C -> M)', () => {
      const keys = generateRSAKeys(61n, 53n, 17n);
      expect(keys.isValid).toBe(true);
      expect(keys.n).toBe(3233n);
      expect(keys.phi).toBe(3120n);
      expect(keys.e).toBe(17n);
      expect(keys.d).toBe(2753n);

      const m = 65n;
      const c = rsaEncryptNumber(m, keys.e, keys.n);
      expect(c).toBe(2790n);
      const decrypted = rsaDecryptNumber(c, keys.d, keys.n);
      expect(decrypted).toBe(m);

      const textRoundTrip = rsaProcessText('HELLO', keys.e, keys.d, keys.n);
      expect(textRoundTrip.recoveredText).toBe('HELLO');
      expect(textRoundTrip.blocks.length).toBe(5);
    });
  });

  describe('5. RSA Factorization Cracker (cracker.ts)', () => {
    it('factors small modulus n, reconstructs private exponent d, and recovers original plaintext', () => {
      const keys = generateRSAKeys(61n, 53n, 17n);
      const { ciphertextBlocks } = rsaProcessText('RSA', keys.e, keys.d, keys.n);

      const attack = crackRSA(keys.n, keys.e, ciphertextBlocks);
      expect(attack.success).toBe(true);
      expect(attack.p * attack.q).toBe(3233n);
      expect(attack.phi).toBe(3120n);
      expect(attack.d).toBe(2753n);
      expect(attack.recoveredPlaintext).toBe('RSA');
    });
  });

  describe('6. Diffie-Hellman Key Exchange (diffieHellman.ts)', () => {
    it('derives identical shared secret keys for Alice and Bob', () => {
      const dh = computeDiffieHellman(23n, 5n, 6n, 15n);
      expect(dh.alicePublic).toBe(8n);
      expect(dh.bobPublic).toBe(19n);
      expect(dh.aliceSharedSecret).toBe(2n);
      expect(dh.bobSharedSecret).toBe(2n);
      expect(dh.keysMatch).toBe(true);
    });
  });
});
