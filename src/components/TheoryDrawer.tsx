import React from 'react';
import { X, BookOpen, CheckCircle2, Sparkles, Compass, Award } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';

interface TheoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryDrawer: React.FC<TheoryDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Teacher Guide and Mathematical Proofs"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#30251F]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[#FFFCED] border-l border-[#684838]/30 shadow-2xl flex flex-col text-[#30251F]">
          {/* Header */}
          <div className="p-6 border-b border-[#684838]/20 flex items-center justify-between bg-[#E7D6BF]/70">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#172C45] text-[#F2D879]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#30251F]">
                  Teacher Guide, Syllabus &amp; Proof Context
                </h2>
                <p className="text-xs text-[#30251F]/75">
                  Plain-English intuition alongside Unit 1 (Proofs), Unit 2 (Counting), &amp; Unit 5 (Number Theory)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#FFFCED] hover:bg-[#684838] text-[#30251F] hover:text-[#FFFCED] border border-[#684838]/25 transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Unit 5 Connection */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#684838]" />
                <h3 className="text-sm font-bold text-[#172C45] uppercase tracking-wider">
                  1. Unit 5: Remainder Arithmetic (&ldquo;Clock Math&rdquo;)
                </h3>
              </div>

              <div className="rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/20 p-5 space-y-3 text-sm text-[#30251F]">
                <p className="leading-relaxed">
                  <strong>The Division Rule:</strong> Whenever you divide a whole number{' '}
                  <InlineMath math="a" /> by a positive number <InlineMath math="d" />, you get a whole quotient{' '}
                  <InlineMath math="q" /> and a leftover remainder <InlineMath math="r" /> smaller than <InlineMath math="d" />:
                </p>
                <div className="bg-[#FFFCED] p-3 rounded-xl border border-[#684838]/20">
                  <BlockMath math="a = d \cdot q + r \quad \text{where } 0 \le r < d" />
                </div>

                <p className="leading-relaxed pt-2">
                  <strong>Modular Congruence:</strong> Two numbers <InlineMath math="a" /> and <InlineMath math="b" /> are &ldquo;congruent modulo <InlineMath math="m" />&rdquo; if they leave the exact same remainder when divided by <InlineMath math="m" />:
                </p>
                <div className="bg-[#FFFCED] p-3 rounded-xl border border-[#684838]/20">
                  <BlockMath math="a \equiv b \pmod m \iff (a \bmod m) = (b \bmod m)" />
                </div>

                <p className="leading-relaxed pt-2">
                  <strong>Euler&apos;s Totient Function <InlineMath math="\phi(n)" />:</strong>{' '}
                  Counts how many positive numbers up to <InlineMath math="n" /> share no common factors with <InlineMath math="n" />. When <InlineMath math="n = p \times q" /> is made of two distinct prime numbers:
                </p>
                <div className="bg-[#FFFCED] p-3 rounded-xl border border-[#684838]/20">
                  <BlockMath math="\phi(p \cdot q) = (p - 1)(q - 1)" />
                </div>
              </div>
            </section>

            {/* Unit 1 Connection */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#172C45]" />
                <h3 className="text-sm font-bold text-[#172C45] uppercase tracking-wider">
                  2. Unit 1: Why These Algorithms Always Work (Formal Proofs)
                </h3>
              </div>

              <div className="rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/20 p-5 space-y-4 text-sm text-[#30251F]">
                <div>
                  <h4 className="font-bold text-[#30251F] mb-1">
                    A. Why Euclid&apos;s Remainder Trick Preserves the GCD
                  </h4>
                  <p className="text-xs text-[#30251F]/80 mb-2">
                    Key Idea: <InlineMath math="\gcd(a, b) = \gcd(b, a \bmod b)" />. Replacing the larger number with its remainder never changes the common factors.
                  </p>
                  <div className="bg-[#FFFCED] p-4 rounded-xl border border-[#684838]/20 space-y-2 text-xs leading-relaxed">
                    <p>
                      Let <InlineMath math="a = qb + r" />. Any number <InlineMath math="d" /> that divides both{' '}
                      <InlineMath math="a" /> and <InlineMath math="b" /> must also divide their difference{' '}
                      <InlineMath math="a - qb = r" />.
                    </p>
                    <p>
                      Conversely, any number that divides <InlineMath math="b" /> and <InlineMath math="r" /> also divides{' '}
                      <InlineMath math="qb + r = a" />. Because the pair <InlineMath math="(a,b)" /> and the smaller pair{' '}
                      <InlineMath math="(b,r)" /> share the exact same divisors, their greatest common divisor is identical!
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#684838]/20">
                  <h4 className="font-bold text-[#30251F] mb-1">
                    B. Why RSA Decryption Recovers Your Original Message
                  </h4>
                  <p className="text-xs text-[#30251F]/80 mb-2">
                    Raising a locked number <InlineMath math="C = M^e \bmod n" /> to the private key power <InlineMath math="d" /> undoes the lock:
                  </p>
                  <div className="bg-[#FFFCED] p-4 rounded-xl border border-[#684838]/20 space-y-2 text-xs leading-relaxed">
                    <p>
                      Since <InlineMath math="e \cdot d \equiv 1 \pmod{\phi(n)}" />, we can write{' '}
                      <InlineMath math="ed = 1 + k(p-1)(q-1)" />.
                    </p>
                    <BlockMath math="C^d \equiv (M^e)^d \equiv M^{1 + k(p-1)(q-1)} \equiv M \cdot \left(M^{p-1}\right)^{k(q-1)} \pmod p" />
                    <p>
                      By <strong>Fermat&apos;s Little Theorem</strong>, <InlineMath math="M^{p-1} \equiv 1 \pmod p" />, so the expression simplifies to <InlineMath math="M \pmod p" /> and similarly <InlineMath math="M \pmod q" />. By the <strong>Chinese Remainder Theorem</strong>:
                    </p>
                    <BlockMath math="C^d \equiv M \pmod{p \cdot q} \implies C^d \bmod n = M" />
                  </div>
                </div>
              </div>
            </section>

            {/* Unit 2 Connection */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#684838]" />
                <h3 className="text-sm font-bold text-[#172C45] uppercase tracking-wider">
                  3. Unit 2: Counting Prime Numbers &amp; Valid Keys
                </h3>
              </div>

              <div className="rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/20 p-5 space-y-4 text-sm text-[#30251F]">
                <div>
                  <h4 className="font-bold text-[#30251F] mb-1">
                    A. How Common Are Prime Numbers? (Prime Number Theorem)
                  </h4>
                  <p className="text-xs leading-relaxed">
                    The number of primes up to <InlineMath math="x" /> is approximately <InlineMath math="x / \ln(x)" />. Even for huge 1024-bit numbers, roughly 1 in every 355 odd numbers is prime—so computers can find large primes quickly, even though factoring their product is practically impossible!
                  </p>
                  <div className="bg-[#FFFCED] p-3 rounded-xl border border-[#684838]/20 my-2">
                    <BlockMath math="\pi(x) \sim \frac{x}{\ln x}" />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#684838]/20">
                  <h4 className="font-bold text-[#30251F] mb-1">
                    B. How Many Valid RSA Public Locks Exist?
                  </h4>
                  <p className="text-xs leading-relaxed">
                    Because the public key <InlineMath math="e" /> must share no factors with <InlineMath math="\phi(n)" />, the total number of valid choices for <InlineMath math="e" /> is found by applying Euler&apos;s totient a second time:
                  </p>
                  <div className="bg-[#FFFCED] p-3 rounded-xl border border-[#684838]/20 mt-2">
                    <BlockMath math="\text{Number of Valid Public Keys } e = \phi(\phi(n)) = \phi((p-1)(q-1))" />
                  </div>
                </div>
              </div>
            </section>

            {/* Classroom Takeaway */}
            <div className="rounded-2xl bg-[#F2D879]/45 border border-[#684838]/30 p-4 flex items-start gap-3">
              <Award className="w-5 h-5 text-[#684838] shrink-0 mt-0.5" />
              <div className="text-xs text-[#30251F] leading-relaxed">
                <strong>Classroom Tip:</strong> Start every lesson with the plain-English answer card in each tool, then click <em>&ldquo;How did we get this answer?&rdquo;</em> when students are ready to see the step-by-step division or exponentiation tables.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
