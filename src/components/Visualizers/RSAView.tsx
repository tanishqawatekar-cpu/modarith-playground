import React, { useState, useMemo } from 'react';
import { InlineMath } from 'react-katex';
import {
  KeyRound,
  Lock,
  Unlock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DEMO_PRIMES, generateRSAKeys, rsaProcessText } from '../../math/rsa';
import { MathFormulaCard } from '../Common/MathFormulaCard';
import { StatusBadge } from '../Common/StatusBadge';

export const RSAView: React.FC = () => {
  const [pIndex, setPIndex] = useState<number>(15);
  const [qIndex, setQIndex] = useState<number>(17);
  const [manualP, setManualP] = useState<string>('61');
  const [manualQ, setManualQ] = useState<string>('53');
  const [customE, setCustomE] = useState<string>('17');
  const [message, setMessage] = useState<string>('HELLO');
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const parsedP = useMemo(() => {
    try {
      return BigInt(manualP.trim() || '61');
    } catch {
      return 61n;
    }
  }, [manualP]);

  const parsedQ = useMemo(() => {
    try {
      return BigInt(manualQ.trim() || '53');
    } catch {
      return 53n;
    }
  }, [manualQ]);

  const parsedCustomE = useMemo(() => {
    try {
      const val = BigInt(customE.trim() || '0');
      return val > 1n ? val : undefined;
    } catch {
      return undefined;
    }
  }, [customE]);

  const rsaKeys = useMemo(
    () => generateRSAKeys(parsedP, parsedQ, parsedCustomE),
    [parsedP, parsedQ, parsedCustomE]
  );

  const textResult = useMemo(() => {
    if (!rsaKeys.isValid) return null;
    return rsaProcessText(message, rsaKeys.e, rsaKeys.d, rsaKeys.n);
  }, [message, rsaKeys]);

  const handleSliderP = (idx: number) => {
    setPIndex(idx);
    setManualP(DEMO_PRIMES[idx].toString());
  };

  const handleSliderQ = (idx: number) => {
    setQIndex(idx);
    setManualQ(DEMO_PRIMES[idx].toString());
  };

  return (
    <div className="space-y-6">
      {/* 1. Understand the Tool + Pick Prime Numbers */}
      <div className="rounded-3xl bg-[#E7D6BF]/55 border border-[#684838]/20 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#684838]/15">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2D879] text-[#30251F] text-xs font-bold">
              <KeyRound className="w-3.5 h-3.5 text-[#684838]" />
              <span>Secret Messages • RSA Workbench</span>
            </div>
            <h2 className="text-2xl font-bold text-[#30251F]">
              Secret Message Maker (RSA Encryption)
            </h2>
            <p className="text-sm text-[#30251F]/80 max-w-3xl">
              Pick two prime numbers to build a <strong>Public Lock</strong> (that anyone can use to scramble a message) and a <strong>Private Key</strong> (that only you can use to unlock it).
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setManualP('61');
                setManualQ('53');
                setCustomE('17');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFFCED] hover:bg-[#E7D6BF] border border-[#684838]/25 text-xs font-bold text-[#30251F] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#684838]" />
              Classic Textbook Example (p=61, q=53)
            </button>
            <button
              type="button"
              onClick={() => {
                setManualP('251');
                setManualQ('263');
                setCustomE('65537');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFFCED] hover:bg-[#E7D6BF] border border-[#684838]/25 text-xs font-bold text-[#172C45] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#684838]" />
              Larger Primes (p=251, q=263)
            </button>
          </div>
        </div>

        {/* Step 1: Prime Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#FFFCED] border border-[#684838]/20 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="rsa-p" className="text-xs font-bold uppercase tracking-wider text-[#684838]">
                Step 1A: First Prime Number (p)
              </label>
              <span className="font-mono text-sm font-bold text-[#30251F] bg-[#F2D879] border border-[#684838]/30 px-2.5 py-0.5 rounded-lg">
                p = {manualP}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={DEMO_PRIMES.length - 1}
              value={pIndex}
              onChange={(e) => handleSliderP(Number(e.target.value))}
              className="w-full accent-[#684838] cursor-pointer"
              aria-label="Slide to pick first prime number p"
            />
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#30251F]/75">Or type a prime:</span>
              <input
                id="rsa-p"
                type="text"
                value={manualP}
                onChange={(e) => setManualP(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#30251F] font-mono text-sm font-bold"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFCED] border border-[#684838]/20 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="rsa-q" className="text-xs font-bold uppercase tracking-wider text-[#172C45]">
                Step 1B: Second Prime Number (q)
              </label>
              <span className="font-mono text-sm font-bold text-[#FFFCED] bg-[#172C45] px-2.5 py-0.5 rounded-lg">
                q = {manualQ}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={DEMO_PRIMES.length - 1}
              value={qIndex}
              onChange={(e) => handleSliderQ(Number(e.target.value))}
              className="w-full accent-[#172C45] cursor-pointer"
              aria-label="Slide to pick second prime number q"
            />
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#30251F]/75">Or type a prime:</span>
              <input
                id="rsa-q"
                type="text"
                value={manualQ}
                onChange={(e) => setManualQ(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#30251F] font-mono text-sm font-bold"
              />
            </div>
          </div>
        </div>

        {/* Friendly Error if not prime or equal */}
        {!rsaKeys.isValid && rsaKeys.error && (
          <div className="p-4 rounded-2xl bg-[#684838] text-[#FFFCED] flex items-center gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 text-[#F2D879] shrink-0" />
            <div>
              <strong className="block text-[#F2D879]">Let&apos;s adjust your prime numbers:</strong>
              <span>{rsaKeys.error} Use the sliders above to pick two different prime numbers!</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Plain-English Key Summary & Interactive Secret Message Box */}
      {rsaKeys.isValid && (
        <div className="rounded-3xl bg-[#FFFCED] border-2 border-[#684838]/30 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Public Lock vs Private Key Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5 border-b border-[#E7D6BF]">
            <div className="p-5 rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/25 flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-[#172C45] text-[#F2D879] shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#172C45]">
                  Your Public Lock (Share with anyone)
                </span>
                <div className="text-xl font-mono font-bold text-[#30251F] mt-0.5">
                  Lock (e = {rsaKeys.e.toString()}, n = {rsaKeys.n.toString()})
                </div>
                <p className="text-xs text-[#30251F]/75 mt-1">
                  Anyone can lock a letter <span className="font-mono">M</span> by computing{' '}
                  <span className="font-mono font-semibold">
                    M^{rsaKeys.e.toString()} mod {rsaKeys.n.toString()}
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F2D879]/35 border border-[#684838]/35 flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-[#684838] text-[#FFFCED] shrink-0">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#684838]">
                  Your Private Key (Keep strictly secret!)
                </span>
                <div className="text-xl font-mono font-bold text-[#30251F] mt-0.5">
                  Key (d = {rsaKeys.d.toString()}, n = {rsaKeys.n.toString()})
                </div>
                <p className="text-xs text-[#30251F]/75 mt-1">
                  Unlocks any scrambled number <span className="font-mono">C</span> by raising{' '}
                  <span className="font-mono font-semibold">
                    C^{rsaKeys.d.toString()} mod {rsaKeys.n.toString()}
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Type a Secret Message */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#684838]">
                  Step 2: Type a Message to Lock &amp; Unlock
                </span>
                <h3 className="text-lg font-bold text-[#30251F]">
                  Watch Your Message Turn Into Secret Numbers and Back Again
                </h3>
              </div>
              {textResult && textResult.recoveredText === message ? (
                <StatusBadge variant="success">
                  Unlocked Message Matches &ldquo;{textResult.recoveredText}&rdquo;
                </StatusBadge>
              ) : (
                <StatusBadge variant="warning">Choose Larger Primes for Full Letters</StatusBadge>
              )}
            </div>

            {textResult?.modulusWarning && (
              <div className="p-4 rounded-2xl bg-[#F2D879]/70 border border-[#684838]/40 text-xs text-[#30251F] flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#684838] shrink-0" />
                <span>{textResult.modulusWarning}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              <div className="lg:col-span-4 bg-[#E7D6BF]/40 p-4 rounded-2xl border border-[#684838]/20">
                <label
                  htmlFor="rsa-message-input"
                  className="block text-xs font-bold uppercase tracking-wider text-[#684838] mb-2"
                >
                  1. Your Original Message
                </label>
                <input
                  id="rsa-message-input"
                  type="text"
                  value={message}
                  maxLength={24}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type HELLO..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#30251F] font-mono text-base font-bold"
                />
              </div>

              <div className="lg:col-span-4 bg-[#172C45] text-[#FFFCED] p-4 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F2D879] mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>2. Scrambled Ciphertext Numbers</span>
                </div>
                <div className="font-mono text-sm font-bold text-[#FFFCED] break-all">
                  [{textResult?.ciphertextBlocks.map((c) => c.toString()).join(', ')}]
                </div>
                <div className="text-[11px] text-[#E7D6BF] mt-1">
                  Safe to send across a public network
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#F2D879]/45 border border-[#684838]/30 p-4 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#684838] mb-1">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>3. Unlocked with Private Key</span>
                </div>
                <div className="font-mono text-xl font-extrabold text-[#30251F] tracking-wide">
                  {textResult?.recoveredText || '(empty)'}
                </div>
                <div className="text-[11px] text-[#30251F]/75 mt-1">
                  Restored using private key d = {rsaKeys.d.toString()}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Expandable "How did we get this answer?" */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              aria-expanded={showDetails}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#E7D6BF]/70 hover:bg-[#E7D6BF] text-[#30251F] font-bold text-sm border border-[#684838]/25 transition-colors"
            >
              <span>
                How did we build these keys and encrypt each letter? (See formulas &amp; letter-by-letter table)
              </span>
              {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showDetails && (
              <div className="mt-5 space-y-6 pt-4 border-t border-[#E7D6BF]">
                {/* Public Exponent Picker */}
                <div className="p-4 rounded-2xl bg-[#E7D6BF]/40 border border-[#684838]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#684838]">
                      Try Other Valid Public Lock Numbers (<InlineMath math="\gcd(e, \phi(n)) = 1" />)
                    </div>
                    <p className="text-xs text-[#30251F]/75 mt-0.5">
                      Click any option below to see how the Private Key <InlineMath math="d" /> automatically updates:
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rsaKeys.validECandidates.slice(0, 10).map((cand) => {
                      const isSelected = rsaKeys.e === cand;
                      return (
                        <button
                          key={cand.toString()}
                          type="button"
                          onClick={() => setCustomE(cand.toString())}
                          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-[#684838] text-[#FFFCED] border-[#684838]'
                              : 'bg-[#FFFCED] text-[#30251F] border-[#684838]/25 hover:bg-[#E7D6BF]'
                          }`}
                        >
                          e = {cand.toString()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <MathFormulaCard
                    title="1. Clock Size (n = p × q)"
                    unitBadge="Modulus"
                    accent="indigo"
                    formula={`n = ${rsaKeys.p.toString()} \\times ${rsaKeys.q.toString()} = ${rsaKeys.n.toString()}`}
                    subtitle="Part of both keys."
                  />
                  <MathFormulaCard
                    title="2. Secret Cycle φ(n)"
                    unitBadge="Totient"
                    accent="cyan"
                    formula={`\\phi(n) = (${rsaKeys.p.toString()}-1)(${rsaKeys.q.toString()}-1) = ${rsaKeys.phi.toString()}`}
                    subtitle="Used to find the private key."
                  />
                  <MathFormulaCard
                    title="3. Public Lock (e, n)"
                    unitBadge="Encrypt"
                    accent="emerald"
                    formula={`(e, n) = (${rsaKeys.e.toString()},\\; ${rsaKeys.n.toString()})`}
                    subtitle={`C = M^${rsaKeys.e.toString()} mod ${rsaKeys.n.toString()}`}
                  />
                  <MathFormulaCard
                    title="4. Private Key (d, n)"
                    unitBadge="Decrypt"
                    accent="amber"
                    formula={`(d, n) = (${rsaKeys.d.toString()},\\; ${rsaKeys.n.toString()})`}
                    subtitle={`${rsaKeys.e.toString()} × ${rsaKeys.d.toString()} ≡ 1 (mod ${rsaKeys.phi.toString()})`}
                  />
                </div>

                {textResult && textResult.blocks.length > 0 && (
                  <div className="overflow-x-auto rounded-2xl border border-[#684838]/25 bg-[#FFFCED]">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-[#E7D6BF]/70 text-[#30251F] text-xs uppercase tracking-wider border-b border-[#684838]/20">
                          <th className="py-3 px-4">#</th>
                          <th className="py-3 px-4">Letter</th>
                          <th className="py-3 px-4">Letter Code (<InlineMath math="M" />)</th>
                          <th className="py-3 px-4">
                            Locked Number (<InlineMath math={`C = M^{${rsaKeys.e.toString()}} \\bmod ${rsaKeys.n.toString()}`} />)
                          </th>
                          <th className="py-3 px-4">
                            Unlocked Code (<InlineMath math={`M' = C^{${rsaKeys.d.toString()}} \\bmod ${rsaKeys.n.toString()}`} />)
                          </th>
                          <th className="py-3 px-4">Restored Letter</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7D6BF] font-mono text-[#30251F]">
                        {textResult.blocks.map((block, idx) => (
                          <tr key={idx} className="hover:bg-[#E7D6BF]/25">
                            <td className="py-3 px-4 text-[#684838] font-bold">#{idx + 1}</td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-0.5 rounded-lg bg-[#E7D6BF] text-[#30251F] font-bold">
                                &apos;{block.char}&apos;
                              </span>
                            </td>
                            <td className="py-3 px-4">{block.asciiCode.toString()}</td>
                            <td className="py-3 px-4 font-bold text-[#172C45]">
                              {block.ciphertext.toString()}
                            </td>
                            <td className="py-3 px-4 text-[#684838]">
                              <div className="flex items-center gap-2">
                                <span>{block.decryptedCode.toString()}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#F2D879] text-[#30251F] font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#684838]" />
                                &apos;{block.decryptedChar}&apos;
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
