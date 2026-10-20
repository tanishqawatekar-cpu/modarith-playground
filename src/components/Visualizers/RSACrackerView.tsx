import React, { useState, useMemo } from 'react';
import { BlockMath } from 'react-katex';
import {
  Unlock,
  ShieldAlert,
  Cpu,
  Timer,
  Hash,
  Sparkles,
  AlertOctagon,
  Play,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { crackRSA } from '../../math/cracker';
import { generateRSAKeys, rsaProcessText } from '../../math/rsa';
import { StatusBadge } from '../Common/StatusBadge';
import { MathFormulaCard } from '../Common/MathFormulaCard';

interface InterceptedScenario {
  label: string;
  p: bigint;
  q: bigint;
  e: bigint;
  secretWord: string;
  note: string;
}

const SCENARIOS: InterceptedScenario[] = [
  {
    label: 'Close Primes Puzzle (n = 3233, Secret: "RSA")',
    p: 61n,
    q: 53n,
    e: 17n,
    secretWord: 'RSA',
    note: 'Primes 53 and 61 are close together — Fermat’s shortcut finds them in 1 step!',
  },
  {
    label: 'Twin-Like Primes (n = 10403, Secret: "HACKED")',
    p: 101n,
    q: 103n,
    e: 7n,
    secretWord: 'HACKED',
    note: 'Primes 101 and 103 sit right next to 102, so 102² - 10403 = 1² cracks it instantly!',
  },
  {
    label: 'Medium Weak Lock (n = 65993, Secret: "VICTORY")',
    p: 251n,
    q: 263n,
    e: 65537n,
    secretWord: 'VICTORY',
    note: 'Shows how factoring n = 251 × 263 lets an attacker rebuild the private key.',
  },
];

export const RSACrackerView: React.FC = () => {
  const [inputN, setInputN] = useState<string>('3233');
  const [inputE, setInputE] = useState<string>('17');
  const [inputCiphertext, setInputCiphertext] = useState<string>('2726, 1313, 2790');
  const [preferredMethod, setPreferredMethod] = useState<'auto' | 'fermat' | 'trial'>('auto');
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [attackTriggered, setAttackTriggered] = useState<boolean>(true);
  const [showSteps, setShowSteps] = useState<boolean>(false);

  const parsedN = useMemo(() => {
    try {
      return BigInt(inputN.trim() || '3233');
    } catch {
      return 3233n;
    }
  }, [inputN]);

  const parsedE = useMemo(() => {
    try {
      return BigInt(inputE.trim() || '17');
    } catch {
      return 17n;
    }
  }, [inputE]);

  const parsedCipherBlocks = useMemo(() => {
    return inputCiphertext
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        try {
          return BigInt(s);
        } catch {
          return 0n;
        }
      });
  }, [inputCiphertext]);

  const crackResult = useMemo(
    () => crackRSA(parsedN, parsedE, parsedCipherBlocks, preferredMethod),
    [parsedN, parsedE, parsedCipherBlocks, preferredMethod]
  );

  const handleLoadScenario = (scen: InterceptedScenario) => {
    const keys = generateRSAKeys(scen.p, scen.q, scen.e);
    const enc = rsaProcessText(scen.secretWord, keys.e, keys.d, keys.n);
    setInputN(keys.n.toString());
    setInputE(keys.e.toString());
    setInputCiphertext(enc.ciphertextBlocks.map((c) => c.toString()).join(', '));
    setAttackTriggered(true);
  };

  const handleLaunchAttack = () => {
    setIsAttacking(true);
    setAttackTriggered(false);
    setTimeout(() => {
      setIsAttacking(false);
      setAttackTriggered(true);
    }, 320);
  };

  return (
    <div className="space-y-6">
      {/* 1. Understand the Tool + Enter Intercepted Values */}
      <div className="rounded-3xl bg-[#E7D6BF]/55 border border-[#684838]/20 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#684838]/15">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2D879] text-[#30251F] text-xs font-bold">
              <Unlock className="w-3.5 h-3.5 text-[#684838]" />
              <span>Secret Messages • Weak Key Breaker</span>
            </div>
            <h2 className="text-2xl font-bold text-[#30251F]">
              Weak Key Breaker (RSA Factorisation Attack)
            </h2>
            <p className="text-sm text-[#30251F]/80 max-w-3xl">
              See how an eavesdropper who only knows the <strong>Public Lock</strong> can crack a secret message if the two prime numbers used to build the lock were too small or too close together.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLaunchAttack}
            disabled={isAttacking}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#684838] hover:bg-[#30251F] text-[#FFFCED] text-sm font-bold shadow-sm transition-all shrink-0"
          >
            <Play className={`w-4 h-4 text-[#F2D879] ${isAttacking ? 'animate-spin' : ''}`} />
            <span>{isAttacking ? 'Searching for Prime Factors...' : 'Initiate Factorization Attack'}</span>
          </button>
        </div>

        {/* Pre-loaded Scenarios */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#684838]">
            Choose an Intercepted Secret Message to Crack
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SCENARIOS.map((scen) => (
              <button
                key={scen.label}
                type="button"
                onClick={() => handleLoadScenario(scen)}
                className="p-3.5 rounded-2xl bg-[#FFFCED] hover:bg-[#E7D6BF]/80 border border-[#684838]/20 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#30251F]">
                  <Sparkles className="w-3.5 h-3.5 text-[#684838] shrink-0" />
                  <span>{scen.label}</span>
                </div>
                <p className="text-[11px] text-[#30251F]/75 mt-1 leading-relaxed">{scen.note}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#FFFCED] p-5 rounded-2xl border border-[#684838]/20">
          <div className="md:col-span-3">
            <label htmlFor="cracker-n" className="block text-sm font-bold text-[#30251F] mb-1">
              Public Lock Size (<span className="font-mono">n</span>)
            </label>
            <p className="text-xs text-[#30251F]/70 mb-2">Product of two hidden primes</p>
            <input
              id="cracker-n"
              type="text"
              value={inputN}
              onChange={(e) => setInputN(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#30251F] font-mono text-sm font-bold"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="cracker-e" className="block text-sm font-bold text-[#30251F] mb-1">
              Public Lock (<span className="font-mono">e</span>)
            </label>
            <p className="text-xs text-[#30251F]/70 mb-2">Public exponent</p>
            <input
              id="cracker-e"
              type="text"
              value={inputE}
              onChange={(e) => setInputE(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#172C45] font-mono text-sm font-bold"
            />
          </div>

          <div className="md:col-span-4">
            <label htmlFor="cracker-c" className="block text-sm font-bold text-[#30251F] mb-1">
              Intercepted Scrambled Numbers (<span className="font-mono">C</span>)
            </label>
            <p className="text-xs text-[#30251F]/70 mb-2">Comma-separated numbers</p>
            <input
              id="cracker-c"
              type="text"
              value={inputCiphertext}
              onChange={(e) => setInputCiphertext(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#684838] font-mono text-sm font-bold"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="cracker-method" className="block text-sm font-bold text-[#30251F] mb-1">
              Factoring Strategy
            </label>
            <p className="text-xs text-[#30251F]/70 mb-2">How to search for p &amp; q</p>
            <select
              id="cracker-method"
              value={preferredMethod}
              onChange={(e) => setPreferredMethod(e.target.value as 'auto' | 'fermat' | 'trial')}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#30251F] text-sm font-semibold"
            >
              <option value="auto">Smart Auto (Fermat → Trial)</option>
              <option value="fermat">Fermat Difference of Squares</option>
              <option value="trial">Odd Trial Division (3, 5, 7...)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Prominent Plain-English Answer Card */}
      {attackTriggered && (
        <>
          {crackResult.success ? (
            <div className="rounded-3xl bg-[#FFFCED] border-2 border-[#684838]/30 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7D6BF] pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#684838]">
                    Plain-English Attack Result
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#30251F] mt-1">
                    Cracked Secret Message:{' '}
                    <span className="px-3.5 py-1 rounded-xl bg-[#F2D879] text-[#30251F] font-mono">
                      &ldquo;{crackResult.recoveredPlaintext}&rdquo;
                    </span>
                  </h3>
                  <p className="text-sm text-[#30251F]/80 mt-2">
                    We split the public lock <strong>{parsedN.toString()}</strong> into its secret prime factors{' '}
                    <strong>{crackResult.p.toString()}</strong> and{' '}
                    <strong>{crackResult.q.toString()}</strong>, which revealed the hidden private key{' '}
                    <strong>d = {crackResult.d.toString()}</strong>!
                  </p>
                </div>

                <StatusBadge variant="success">
                  Cracked in {crackResult.iterations} {crackResult.iterations === 1 ? 'Step' : 'Steps'}
                </StatusBadge>
              </div>

              {/* 4 Friendly Summary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/20 p-4 flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#684838] text-[#FFFCED]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#30251F]/75">Found Prime Factors</div>
                    <div className="text-base font-mono font-bold text-[#30251F]">
                      {crackResult.p.toString()} × {crackResult.q.toString()}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/20 p-4 flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#172C45] text-[#F2D879]">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#30251F]/75">Guesses Needed</div>
                    <div className="text-base font-mono font-bold text-[#172C45]">
                      {crackResult.iterations} ({crackResult.methodUsed.split(' ')[0]})
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/20 p-4 flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#7C91AA]/30 text-[#172C45]">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#30251F]/75">Time Taken</div>
                    <div className="text-base font-mono font-bold text-[#30251F]">
                      {crackResult.executionTimeMs} ms
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F2D879]/50 border border-[#684838]/35 p-4 flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#684838] text-[#F2D879]">
                    <Unlock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#684838]">Recovered Private Key</div>
                    <div className="text-base font-mono font-extrabold text-[#30251F]">
                      d = {crackResult.d.toString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Expandable "How did we get this answer?" */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSteps((prev) => !prev)}
                  aria-expanded={showSteps}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#E7D6BF]/70 hover:bg-[#E7D6BF] text-[#30251F] font-bold text-sm border border-[#684838]/25 transition-colors"
                >
                  <span>
                    How did we crack this lock? (See factor search log &amp; key equations)
                  </span>
                  {showSteps ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {showSteps && (
                  <div className="mt-5 space-y-6 pt-4 border-t border-[#E7D6BF]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MathFormulaCard
                        title="1. Factor the Public Lock"
                        unitBadge={crackResult.methodUsed}
                        accent="rose"
                        formula={`n = ${parsedN.toString()} = ${crackResult.p.toString()} \\times ${crackResult.q.toString()}`}
                        subtitle="Splitting n into p and q breaks RSA's trapdoor."
                      />
                      <MathFormulaCard
                        title="2. Compute Secret Cycle φ(n)"
                        unitBadge="Euler's φ(n)"
                        accent="amber"
                        formula={`\\phi(n) = (${crackResult.p.toString()}-1)(${crackResult.q.toString()}-1) = ${crackResult.phi.toString()}`}
                        subtitle="Easy to compute once p and q are known."
                      />
                      <MathFormulaCard
                        title="3. Rebuild Private Key (d)"
                        unitBadge="Clock Inverse"
                        accent="emerald"
                        formula={`d \\equiv ${parsedE.toString()}^{-1} \\pmod{${crackResult.phi.toString()}} = ${crackResult.d.toString()}`}
                        subtitle={`Unlocks every ciphertext block via C^${crackResult.d.toString()} mod ${parsedN.toString()}.`}
                      />
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-[#684838]/25 bg-[#FFFCED]">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-[#E7D6BF]/70 text-[#30251F] text-xs uppercase tracking-wider border-b border-[#684838]/20">
                            <th className="py-3 px-4">Guess #</th>
                            <th className="py-3 px-4">Method</th>
                            <th className="py-3 px-4">Tested Value</th>
                            <th className="py-3 px-4">What We Checked</th>
                            <th className="py-3 px-4">Result</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E7D6BF] font-mono text-[#30251F]">
                          {crackResult.traceSteps.map((step) => (
                            <tr
                              key={step.iteration}
                              className={
                                step.foundFactor
                                  ? 'bg-[#F2D879]/45 font-bold'
                                  : 'hover:bg-[#E7D6BF]/25'
                              }
                            >
                              <td className="py-2.5 px-4 text-[#684838]">#{step.iteration}</td>
                              <td className="py-2.5 px-4 font-sans text-xs">{step.method}</td>
                              <td className="py-2.5 px-4 text-[#172C45]">{step.candidateDesc}</td>
                              <td className="py-2.5 px-4 font-sans text-xs">{step.detail}</td>
                              <td className="py-2.5 px-4">
                                {step.foundFactor ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#684838] text-[#FFFCED] text-xs">
                                    FACTORS FOUND!
                                  </span>
                                ) : (
                                  <span className="text-xs text-[#30251F]/60">Keep searching</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#684838] text-[#FFFCED] p-6 flex items-center gap-3.5 shadow-sm">
              <ShieldAlert className="w-6 h-6 text-[#F2D879] shrink-0" />
              <div>
                <h4 className="font-bold text-[#F2D879]">Could Not Crack This Lock</h4>
                <p className="text-sm">{crackResult.error}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Real-World Security Callout */}
      <div className="rounded-3xl bg-[#E7D6BF]/50 border border-[#684838]/25 p-6 flex flex-col md:flex-row items-start gap-4">
        <div className="p-3 rounded-2xl bg-[#172C45] text-[#F2D879] shrink-0">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div className="space-y-2 text-xs sm:text-sm text-[#30251F] leading-relaxed">
          <h4 className="text-base font-bold text-[#172C45]">
            Why Real-World 2048-Bit RSA Locks Cannot Be Cracked Like This
          </h4>
          <p>
            In this classroom demo, our prime numbers are small enough that your browser can test factors in less than a millisecond. Real bank and website encryption uses <strong>2048-bit prime locks</strong>—numbers with over <strong>616 digits</strong>!
          </p>
          <div className="bg-[#FFFCED] p-3 rounded-xl border border-[#684838]/20">
            <BlockMath math="\text{Guesses required for 2048-bit RSA} \approx \sqrt{2^{2048}} = 2^{1024} \approx 1.79 \times 10^{308}" />
          </div>
          <p className="text-[#30251F]/80">
            Even if every computer on Earth worked together, factoring a properly chosen 2048-bit lock would take billions of years.
          </p>
        </div>
      </div>
    </div>
  );
};
