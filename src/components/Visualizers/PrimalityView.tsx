import React, { useState, useMemo } from 'react';
import { BlockMath } from 'react-katex';
import {
  ShieldAlert,
  Zap,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { fermatTest, CARMICHAEL_NUMBERS } from '../../math/primality';
import { PlaybackController } from '../Common/PlaybackController';
import { StatusBadge } from '../Common/StatusBadge';
import { MathFormulaCard } from '../Common/MathFormulaCard';

export const PrimalityView: React.FC = () => {
  const [inputN, setInputN] = useState<string>('561');
  const [inputBase, setInputBase] = useState<string>('2');
  const [visibleSteps, setVisibleSteps] = useState<number>(999);
  const [showSteps, setShowSteps] = useState<boolean>(false);

  const inputValidation = useMemo(() => {
    const trimmedN = inputN.trim();
    const trimmedBase = inputBase.trim();
    if (!trimmedN || !trimmedBase) {
      return {
        valid: false,
        message: 'Please enter both a number to test and a test base (like 2).',
      };
    }
    try {
      const n = BigInt(trimmedN);
      const base = BigInt(trimmedBase);
      if (n < 2n) {
        return {
          valid: false,
          message: 'Prime numbers must be whole numbers 2 or greater. Try testing 561 or 997.',
        };
      }
      if (base < 1n) {
        return {
          valid: false,
          message: 'The helper test base needs to be at least 1 (usually 2, 3, or 5).',
        };
      }
      return { valid: true, n, base };
    } catch {
      return {
        valid: false,
        message: 'Please enter whole numbers only, without decimals or letters.',
      };
    }
  }, [inputN, inputBase]);

  const parsedN = inputValidation.valid && inputValidation.n !== undefined ? inputValidation.n : 561n;
  const parsedBase =
    inputValidation.valid && inputValidation.base !== undefined ? inputValidation.base : 2n;

  const testResult = useMemo(() => fermatTest(parsedN, parsedBase), [parsedN, parsedBase]);
  const matchedCarmichael = useMemo(
    () => CARMICHAEL_NUMBERS.find((c) => c.n === parsedN),
    [parsedN]
  );

  const totalSteps = testResult.modExpTrace.steps.length;
  const activeStepCount = Math.min(Math.max(1, visibleSteps), totalSteps);
  const displayedSteps = testResult.modExpTrace.steps.slice(0, activeStepCount);

  const handleFoolFermat = () => {
    setInputN('561');
    setInputBase('2');
    setVisibleSteps(999);
  };

  return (
    <div className="space-y-6">
      {/* 1. Understand the Tool + Inputs */}
      <div className="rounded-3xl bg-[#E7D6BF]/55 border border-[#684838]/20 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#684838]/15">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2D879] text-[#30251F] text-xs font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-[#684838]" />
              <span>Number Puzzles • Prime Testing</span>
            </div>
            <h2 className="text-2xl font-bold text-[#30251F]">
              Prime Number Tester &amp; &ldquo;Fool the Test&rdquo; Explorer
            </h2>
            <p className="text-sm text-[#30251F]/80 max-w-3xl">
              Check whether a number looks prime using Fermat&apos;s quick shortcut—and discover how rare &ldquo;impostor&rdquo; numbers (Carmichael numbers) can disguise themselves as prime!
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={handleFoolFermat}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#684838] hover:bg-[#30251F] text-[#FFFCED] text-sm font-bold shadow-sm transition-all"
            >
              <Zap className="w-4 h-4 text-[#F2D879]" />
              <span>Fool Fermat&apos;s Test (Try 561 with base 2)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Inputs */}
          <div className="lg:col-span-5 space-y-4 bg-[#FFFCED] p-5 rounded-2xl border border-[#684838]/20">
            <div className="text-xs font-bold uppercase tracking-wider text-[#684838]">
              Enter a Number to Test
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="primality-n"
                  className="block text-sm font-bold text-[#30251F] mb-1"
                >
                  Number to Test (<span className="font-mono">n</span>)
                </label>
                <p className="text-xs text-[#30251F]/70 mb-2">e.g., 997 (prime) or 561</p>
                <input
                  id="primality-n"
                  type="text"
                  value={inputN}
                  onChange={(e) => setInputN(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#30251F] font-mono text-base font-bold"
                />
              </div>

              <div>
                <label
                  htmlFor="primality-base"
                  className="block text-sm font-bold text-[#30251F] mb-1"
                >
                  Helper Base (<span className="font-mono">a</span>)
                </label>
                <p className="text-xs text-[#30251F]/70 mb-2">Usually 2, 3, or 5</p>
                <input
                  id="primality-base"
                  type="text"
                  value={inputBase}
                  onChange={(e) => setInputBase(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#172C45] font-mono text-base font-bold"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setInputN('997');
                  setInputBase('2');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#E7D6BF]/60 hover:bg-[#E7D6BF] border border-[#684838]/20 text-xs text-[#30251F] font-semibold"
              >
                Real Prime: 997 (base 2)
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputN('561');
                  setInputBase('3');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#E7D6BF]/60 hover:bg-[#E7D6BF] border border-[#684838]/20 text-xs text-[#172C45] font-semibold"
              >
                Catch 561 Lying (use base 3)
              </button>
            </div>
          </div>

          {/* Right: Famous Impostor Numbers */}
          <div className="lg:col-span-7 space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#684838]">
              Famous &ldquo;Impostor&rdquo; Carmichael Numbers (Composite numbers that trick Fermat&apos;s Test)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {CARMICHAEL_NUMBERS.map((item) => {
                const isSelected = parsedN === item.n;
                return (
                  <button
                    key={item.n.toString()}
                    type="button"
                    onClick={() => {
                      setInputN(item.n.toString());
                      setInputBase(item.foolingBases[0].toString());
                      setVisibleSteps(999);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#172C45] border-[#172C45] text-[#FFFCED] shadow-sm'
                        : 'bg-[#FFFCED] border-[#684838]/20 text-[#30251F] hover:bg-[#E7D6BF]/70'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs font-bold">
                      <span>n = {item.n.toString()}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-[#F2D879] text-[#30251F]'
                            : 'bg-[#E7D6BF] text-[#684838]'
                        }`}
                      >
                        {item.factors.map((f) => f.toString()).join('×')}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] mt-1.5 truncate ${
                        isSelected ? 'text-[#E7D6BF]' : 'text-[#30251F]/70'
                      }`}
                    >
                      Tricks bases: {item.foolingBases.slice(0, 4).join(', ')}...
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {!inputValidation.valid && (
          <div className="p-4 rounded-2xl bg-[#684838] text-[#FFFCED] flex items-center gap-3 text-sm">
            <HelpCircle className="w-5 h-5 text-[#F2D879] shrink-0" />
            <span>{inputValidation.message}</span>
          </div>
        )}
      </div>

      {/* 2. Plain-English Answer Card */}
      <div className="rounded-3xl bg-[#FFFCED] border-2 border-[#684838]/30 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7D6BF] pb-5">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#684838]">
              Plain-English Verdict
            </span>
            <div className="flex items-center gap-3">
              {testResult.isCarmichaelFool ? (
                <AlertTriangle className="w-7 h-7 text-[#684838] shrink-0" />
              ) : testResult.isProbablyPrime ? (
                <CheckCircle2 className="w-7 h-7 text-[#684838] shrink-0" />
              ) : (
                <ShieldAlert className="w-7 h-7 text-[#172C45] shrink-0" />
              )}
              <h3 className="text-xl sm:text-2xl font-bold text-[#30251F]">
                {testResult.verdictLabel}
              </h3>
            </div>
            <p className="text-sm text-[#30251F]/85 leading-relaxed max-w-2xl">
              {testResult.explanation}
            </p>
          </div>

          <div className="bg-[#E7D6BF]/50 border border-[#684838]/25 rounded-2xl px-5 py-3.5 text-center shrink-0">
            <div className="text-xs font-bold text-[#684838] uppercase tracking-wider mb-1">
              Fermat&apos;s Remainder Check
            </div>
            <BlockMath
              math={`${parsedBase.toString()}^{${(parsedN - 1n).toString()}} \\equiv ${testResult.remainder.toString()} \\pmod{${parsedN.toString()}}`}
            />
          </div>
        </div>

        {/* Special Classroom Note when a Carmichael Number is active */}
        {matchedCarmichael && (
          <div className="p-4 rounded-2xl bg-[#F2D879]/45 border border-[#684838]/30 text-xs sm:text-sm text-[#30251F] flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#684838] shrink-0 mt-0.5" />
            <div className="space-y-1.5 leading-relaxed">
              <div>
                <strong>Why did {matchedCarmichael.n.toString()} fool the test?</strong>{' '}
                {matchedCarmichael.description} Even though{' '}
                <strong>
                  {matchedCarmichael.n.toString()} ={' '}
                  {matchedCarmichael.factors.map((f) => f.toString()).join(' × ')}
                </strong>{' '}
                is composite, it passes Fermat&apos;s test for every base that doesn&apos;t share one of its prime factors!
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span>Click a &ldquo;witness&rdquo; base that shares a factor to unmask it:</span>
                {matchedCarmichael.witnessBases.map((w) => (
                  <button
                    key={w.toString()}
                    type="button"
                    onClick={() => setInputBase(w.toString())}
                    className="px-2.5 py-1 rounded-lg bg-[#684838] hover:bg-[#30251F] font-mono text-xs font-bold text-[#FFFCED] transition-colors"
                  >
                    Try Base a = {w.toString()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Expandable "How did we get this answer?" */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowSteps((prev) => !prev)}
            aria-expanded={showSteps}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#E7D6BF]/70 hover:bg-[#E7D6BF] text-[#30251F] font-bold text-sm border border-[#684838]/25 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>
                How did we calculate {parsedBase.toString()}^
                {(parsedN - 1n).toString()} so fast? (See Square-and-Multiply steps)
              </span>
              <StatusBadge variant="info">{totalSteps} Fast Steps</StatusBadge>
            </span>
            {showSteps ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showSteps && (
            <div className="mt-5 space-y-6 pt-4 border-t border-[#E7D6BF]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MathFormulaCard
                  title="Exponent in Binary"
                  unitBadge={`${testResult.modExpTrace.binaryBits.length} bits`}
                  accent="indigo"
                  formula={`n - 1 = ${(parsedN - 1n).toString()}_{10} = \\mathtt{${testResult.modExpTrace.binaryBits}}_2`}
                  subtitle={`Instead of multiplying ${(parsedN - 1n).toString()} times, we only do ${testResult.modExpTrace.binaryBits.length} steps!`}
                />
                <MathFormulaCard
                  title="Shared Factor Check"
                  unitBadge="GCD"
                  accent={testResult.gcdWithN === 1n ? 'emerald' : 'rose'}
                  formula={`\\gcd(${parsedBase.toString()}, ${parsedN.toString()}) = ${testResult.gcdWithN.toString()}`}
                  subtitle={
                    testResult.gcdWithN === 1n
                      ? 'Base shares no factors with n.'
                      : `Base shares factor ${testResult.gcdWithN.toString()} with n!`
                  }
                />
                <MathFormulaCard
                  title="Speedup Shortcut"
                  unitBadge="Logarithmic"
                  accent="cyan"
                  formula={`\\mathcal{O}(\\log_2(n)) = ${testResult.modExpTrace.steps.length} \\text{ steps}`}
                  subtitle="Repeated squaring keeps numbers small at every step."
                />
              </div>

              <PlaybackController
                currentStep={activeStepCount}
                totalSteps={totalSteps}
                onStepChange={setVisibleSteps}
                label="Walk through binary bits"
              />

              <div className="overflow-x-auto rounded-2xl border border-[#684838]/25 bg-[#FFFCED]">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#E7D6BF]/70 text-[#30251F] text-xs uppercase tracking-wider border-b border-[#684838]/20">
                      <th className="py-3 px-4">Step</th>
                      <th className="py-3 px-4">Power of 2</th>
                      <th className="py-3 px-4">Binary Bit</th>
                      <th className="py-3 px-4">Value Before</th>
                      <th className="py-3 px-4">After Squaring</th>
                      <th className="py-3 px-4">Result After Step</th>
                      <th className="py-3 px-4">What Happened</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7D6BF] font-mono text-[#30251F]">
                    {displayedSteps.map((step, idx) => {
                      const isLast = idx === displayedSteps.length - 1;
                      return (
                        <tr
                          key={step.stepIndex}
                          className={
                            isLast
                              ? 'bg-[#F2D879]/40 font-semibold'
                              : 'hover:bg-[#E7D6BF]/25'
                          }
                        >
                          <td className="py-3 px-4 text-[#684838] font-bold">#{step.stepIndex}</td>
                          <td className="py-3 px-4">2^{step.bitIndex}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold ${
                                step.bit === 1
                                  ? 'bg-[#F2D879] text-[#30251F] border border-[#684838]/40'
                                  : 'bg-[#E7D6BF]/60 text-[#30251F]/70'
                              }`}
                            >
                              {step.bit}
                            </span>
                          </td>
                          <td className="py-3 px-4">{step.accumulatorBefore.toString()}</td>
                          <td className="py-3 px-4 text-[#172C45]">{step.squaredMod.toString()}</td>
                          <td className="py-3 px-4 font-bold text-[#684838]">
                            {step.multipliedMod.toString()}
                          </td>
                          <td className="py-3 px-4 font-sans text-xs text-[#30251F]/85">
                            {step.operationDesc}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
