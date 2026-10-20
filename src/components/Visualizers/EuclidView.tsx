import React, { useState, useMemo } from 'react';
import { InlineMath } from 'react-katex';
import {
  Calculator,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import { extendedEuclid, modInverse } from '../../math/euclid';
import { PlaybackController } from '../Common/PlaybackController';
import { MathFormulaCard } from '../Common/MathFormulaCard';
import { StatusBadge } from '../Common/StatusBadge';

interface EuclidPreset {
  label: string;
  a: string;
  b: string;
  tag: string;
}

const PRESETS: EuclidPreset[] = [
  {
    label: 'Clock Inverse Example (17 and 43)',
    a: '17',
    b: '43',
    tag: 'Shares no factors • Inverse is 38',
  },
  {
    label: 'Shared Factor Example (252 and 105)',
    a: '252',
    b: '105',
    tag: 'Greatest Common Factor is 21 • No Inverse',
  },
  {
    label: 'Everyday Coprime Pair (35 and 64)',
    a: '35',
    b: '64',
    tag: 'Shares no factors • Inverse is 11',
  },
  {
    label: 'Real RSA Key Numbers (65537 and 3120)',
    a: '65537',
    b: '3120',
    tag: 'Finds secret key 2753',
  },
];

export const EuclidView: React.FC = () => {
  const [inputA, setInputA] = useState<string>('17');
  const [inputB, setInputB] = useState<string>('43');
  const [visibleSteps, setVisibleSteps] = useState<number>(999);
  const [showSteps, setShowSteps] = useState<boolean>(false);

  const inputValidation = useMemo(() => {
    const trimmedA = inputA.trim();
    const trimmedB = inputB.trim();
    if (!trimmedA || !trimmedB) {
      return {
        valid: false,
        message: 'Please enter a whole number in both boxes above to see the result.',
      };
    }
    try {
      const a = BigInt(trimmedA);
      const b = BigInt(trimmedB);
      if (b <= 0n) {
        return {
          valid: false,
          message:
            'The second number (clock size / divisor) needs to be a positive whole number greater than 0. Try entering 43 or 105.',
        };
      }
      return { valid: true, a, b };
    } catch {
      return {
        valid: false,
        message:
          'Only whole numbers (without decimals or letters) are allowed. For example, try 17 and 43.',
      };
    }
  }, [inputA, inputB]);

  const parsedA = inputValidation.valid && inputValidation.a !== undefined ? inputValidation.a : 17n;
  const parsedB = inputValidation.valid && inputValidation.b !== undefined ? inputValidation.b : 43n;

  const euclidResult = useMemo(() => extendedEuclid(parsedA, parsedB), [parsedA, parsedB]);
  const inverseResult = useMemo(() => modInverse(parsedA, parsedB), [parsedA, parsedB]);

  const totalSteps = euclidResult.steps.length;
  const activeStepCount = Math.min(Math.max(1, visibleSteps), totalSteps);
  const displayedSteps = euclidResult.steps.slice(0, activeStepCount);
  const currentHighlightedStep = displayedSteps[displayedSteps.length - 1];

  const handleApplyPreset = (preset: EuclidPreset) => {
    setInputA(preset.a);
    setInputB(preset.b);
    setVisibleSteps(999);
  };

  return (
    <div className="space-y-6">
      {/* 1. Understand the Tool + Enter Values */}
      <div className="rounded-3xl bg-[#E7D6BF]/55 border border-[#684838]/20 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#684838]/15">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2D879] text-[#30251F] text-xs font-bold">
              <Calculator className="w-3.5 h-3.5 text-[#684838]" />
              <span>Number Basics • Tool 1</span>
            </div>
            <h2 className="text-2xl font-bold text-[#30251F]">
              Greatest Common Factor &amp; Clock Inverse Finder
            </h2>
            <p className="text-sm text-[#30251F]/80 max-w-3xl">
              Find the largest whole number that divides two numbers evenly, and discover if there is a &ldquo;magic multiplier&rdquo; (modular inverse) that turns the first number into <span className="font-semibold">1</span> on a clock of size <span className="font-semibold">{parsedB.toString()}</span>.
            </p>
          </div>
        </div>

        {/* Friendly Inputs & Example Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-4 bg-[#FFFCED] p-5 rounded-2xl border border-[#684838]/20">
            <div className="text-xs font-bold uppercase tracking-wider text-[#684838]">
              Step 1: Enter Your Two Whole Numbers
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="euclid-input-a"
                  className="block text-sm font-bold text-[#30251F] mb-1"
                >
                  First Number (<span className="font-mono">a</span>)
                </label>
                <p className="text-xs text-[#30251F]/70 mb-2">
                  Any whole number (e.g., 17 or 252)
                </p>
                <input
                  id="euclid-input-a"
                  type="text"
                  value={inputA}
                  onChange={(e) => setInputA(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#30251F] font-mono text-base font-bold focus:border-[#172C45] transition-colors"
                  placeholder="e.g. 17"
                />
              </div>

              <div>
                <label
                  htmlFor="euclid-input-b"
                  className="block text-sm font-bold text-[#30251F] mb-1"
                >
                  Second Number / Clock Size (<span className="font-mono">m</span>)
                </label>
                <p className="text-xs text-[#30251F]/70 mb-2">
                  A positive whole number (e.g., 43 or 105)
                </p>
                <input
                  id="euclid-input-b"
                  type="text"
                  value={inputB}
                  onChange={(e) => setInputB(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#30251F] font-mono text-base font-bold focus:border-[#172C45] transition-colors"
                  placeholder="e.g. 43"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setVisibleSteps(999)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#684838] hover:bg-[#30251F] text-[#FFFCED] text-sm font-bold shadow-sm transition-colors"
              >
                <Calculator className="w-4 h-4 text-[#F2D879]" />
                <span>Calculate Common Factor &amp; Inverse</span>
              </button>
              <span className="text-xs text-[#30251F]/70">
                Updates automatically as you type
              </span>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="lg:col-span-6 space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#684838]">
              Or Try a Ready-Made Classroom Example
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESETS.map((preset) => {
                const isSelected = inputA === preset.a && inputB === preset.b;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#172C45] border-[#172C45] text-[#FFFCED] shadow-sm'
                        : 'bg-[#FFFCED] border-[#684838]/20 text-[#30251F] hover:bg-[#E7D6BF]/70'
                    }`}
                  >
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Sparkles
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? 'text-[#F2D879]' : 'text-[#684838]'
                        }`}
                      />
                      {preset.label}
                    </span>
                    <span
                      className={`text-[11px] mt-1 ${
                        isSelected ? 'text-[#E7D6BF]' : 'text-[#30251F]/75'
                      }`}
                    >
                      {preset.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Friendly Error Message if Input Invalid */}
        {!inputValidation.valid && (
          <div className="p-4 rounded-2xl bg-[#684838] text-[#FFFCED] flex items-center gap-3 text-sm shadow-sm">
            <HelpCircle className="w-5 h-5 text-[#F2D879] shrink-0" />
            <span>{inputValidation.message}</span>
          </div>
        )}
      </div>

      {/* 2. Prominent Plain-English Answer Card */}
      <div className="rounded-3xl bg-[#FFFCED] border-2 border-[#684838]/30 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7D6BF] pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#684838]">
              Plain-English Answer
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#30251F] mt-1">
              The Greatest Common Factor of {parsedA.toString()} and {parsedB.toString()} is{' '}
              <span className="px-2.5 py-0.5 rounded-xl bg-[#F2D879] text-[#30251F] font-mono">
                {euclidResult.gcd.toString()}
              </span>
            </h3>
            <p className="text-sm text-[#30251F]/80 mt-1">
              {euclidResult.gcd === 1n
                ? `Because ${parsedA.toString()} and ${parsedB.toString()} share no common factors other than 1, they are "coprime".`
                : `Both ${parsedA.toString()} and ${parsedB.toString()} can be divided evenly by ${euclidResult.gcd.toString()}.`}
            </p>
          </div>

          {/* Highlighted Modular Inverse Status Badge */}
          <div className="shrink-0">
            {inverseResult.inverse !== null ? (
              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#F2D879]/65 border border-[#684838]/40 text-[#30251F]">
                <CheckCircle2 className="w-5 h-5 text-[#684838] shrink-0" />
                <div className="text-sm">
                  <div className="font-bold">Clock Inverse Exists!</div>
                  <div className="font-mono text-xs mt-0.5">
                    Inverse exists: x ≡ {inverseResult.inverse.toString()} (mod {parsedB.toString()})
                  </div>
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#E7D6BF] border border-[#684838]/35 text-[#30251F]">
                <XCircle className="w-5 h-5 text-[#684838] shrink-0" />
                <div className="text-sm">
                  <div className="font-bold">No Clock Inverse</div>
                  <div className="text-xs text-[#30251F]/80">
                    Because they share a factor of {euclidResult.gcd.toString()} (not 1)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Plain English Explanation of the Inverse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#684838] mb-1">
              What does the Clock Inverse mean?
            </h4>
            {inverseResult.inverse !== null ? (
              <p className="text-sm text-[#30251F] leading-relaxed">
                If you multiply <strong>{parsedA.toString()}</strong> by{' '}
                <strong className="underline decoration-[#684838]">
                  {inverseResult.inverse.toString()}
                </strong>{' '}
                (which gives {(parsedA * inverseResult.inverse).toString()}) and divide by a clock size of{' '}
                <strong>{parsedB.toString()}</strong>, the leftover remainder is Play-by-Play{' '}
                <strong>1</strong>!
              </p>
            ) : (
              <p className="text-sm text-[#30251F] leading-relaxed">
                No matter what whole number you multiply <strong>{parsedA.toString()}</strong> by, dividing by{' '}
                <strong>{parsedB.toString()}</strong> will never leave a remainder of 1 because every multiple is still divisible by{' '}
                <strong>{euclidResult.gcd.toString()}</strong>.
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#684838] mb-1">
              Bézout&apos;s Balancing Equation
            </h4>
            <p className="text-sm text-[#30251F] leading-relaxed">
              We can combine your two numbers using multipliers{' '}
              <span className="font-mono font-bold">x = {euclidResult.x.toString()}</span> and{' '}
              <span className="font-mono font-bold">y = {euclidResult.y.toString()}</span> so they equal the greatest common factor:
            </p>
            <div className="mt-1.5 font-mono text-xs font-bold text-[#172C45]">
              ({parsedA.toString()}) × ({euclidResult.x.toString()}) + ({parsedB.toString()}) × ({euclidResult.y.toString()}) = {euclidResult.gcd.toString()}
            </div>
          </div>
        </div>

        {/* 3. Expandable "How did we get this answer?" Section */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowSteps((prev) => !prev)}
            aria-expanded={showSteps}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#E7D6BF]/70 hover:bg-[#E7D6BF] text-[#30251F] font-bold text-sm border border-[#684838]/25 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>How did we get this answer? (See step-by-step divisions &amp; formulas)</span>
              <StatusBadge variant="info">
                {totalSteps} {totalSteps === 1 ? 'Step' : 'Steps'}
              </StatusBadge>
            </span>
            {showSteps ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showSteps && (
            <div className="mt-5 space-y-6 pt-4 border-t border-[#E7D6BF]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MathFormulaCard
                  title="Greatest Common Divisor"
                  unitBadge="GCD"
                  accent="indigo"
                  formula={`\\gcd(${parsedA.toString()}, ${parsedB.toString()}) = ${euclidResult.gcd.toString()}`}
                  subtitle={
                    euclidResult.gcd === 1n
                      ? 'Since gcd = 1, the integers are coprime.'
                      : `Shares common factor ${euclidResult.gcd.toString()}.`
                  }
                />
                <MathFormulaCard
                  title="Bézout's Identity"
                  unitBadge="Linear Combination"
                  accent="cyan"
                  formula={`(${parsedA.toString()})(${euclidResult.x.toString()}) + (${parsedB.toString()})(${euclidResult.y.toString()}) = ${euclidResult.gcd.toString()}`}
                  subtitle={`Bézout coefficients: x = ${euclidResult.x.toString()}, y = ${euclidResult.y.toString()}`}
                />
                <MathFormulaCard
                  title="Modular Inverse"
                  unitBadge="Clock Math"
                  accent={inverseResult.inverse !== null ? 'emerald' : 'rose'}
                  formula={
                    inverseResult.inverse !== null
                      ? `${parsedA.toString()}^{-1} \\equiv ${inverseResult.inverse.toString()} \\pmod{${parsedB.toString()}}`
                      : `\\text{Undefined } (\\gcd \\neq 1)`
                  }
                  subtitle={inverseResult.explanation}
                />
              </div>

              <PlaybackController
                currentStep={activeStepCount}
                totalSteps={totalSteps}
                onStepChange={setVisibleSteps}
                label="Inspect Division Step"
              />

              {currentHighlightedStep && (
                <div className="rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/25 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#684838] flex items-center gap-1.5">
                      <span>Step #{currentHighlightedStep.stepNumber} Spotlight</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>
                        {currentHighlightedStep.remainder === 0n
                          ? 'Remainder reached 0 — We are done!'
                          : 'Divide and keep the remainder'}
                      </span>
                    </div>
                    <div className="text-sm text-[#30251F]">
                      Division:{' '}
                      <InlineMath
                        math={`${currentHighlightedStep.dividend.toString()} = ${currentHighlightedStep.quotient.toString()} \\cdot ${currentHighlightedStep.divisor.toString()} + ${currentHighlightedStep.remainder.toString()}`}
                      />
                    </div>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-[#FFFCED] border border-[#684838]/25 text-[#172C45] text-sm overflow-x-auto max-w-full">
                    <InlineMath math={currentHighlightedStep.bezoutEq} />
                  </div>
                </div>
              )}

              <div className="overflow-x-auto rounded-2xl border border-[#684838]/25 bg-[#FFFCED]">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#E7D6BF]/70 text-[#30251F] text-xs uppercase tracking-wider border-b border-[#684838]/20">
                      <th className="py-3 px-4">Step</th>
                      <th className="py-3 px-4">Number Divided</th>
                      <th className="py-3 px-4">Divided By</th>
                      <th className="py-3 px-4">Quotient</th>
                      <th className="py-3 px-4">Remainder</th>
                      <th className="py-3 px-4">Division Equation</th>
                      <th className="py-3 px-4">Bézout Equation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7D6BF] font-mono text-[#30251F]">
                    {displayedSteps.map((step, idx) => {
                      const isLastDisplayed = idx === displayedSteps.length - 1;
                      const isGcdRow =
                        step.remainder === euclidResult.gcd &&
                        (idx === euclidResult.steps.length - 2 || euclidResult.steps.length === 1);
                      return (
                        <tr
                          key={step.stepNumber}
                          className={`transition-colors ${
                            isLastDisplayed
                              ? 'bg-[#F2D879]/35 font-semibold'
                              : isGcdRow
                              ? 'bg-[#E7D6BF]/45'
                              : 'hover:bg-[#E7D6BF]/25'
                          }`}
                        >
                          <td className="py-3 px-4 font-bold text-[#684838]">#{step.stepNumber}</td>
                          <td className="py-3 px-4">{step.dividend.toString()}</td>
                          <td className="py-3 px-4">{step.divisor.toString()}</td>
                          <td className="py-3 px-4 text-[#172C45]">{step.quotient.toString()}</td>
                          <td className="py-3 px-4 font-bold text-[#684838]">
                            {step.remainder.toString()}
                            {isGcdRow && (
                              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#F2D879] text-[#30251F] border border-[#684838]/30">
                                GCD
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-sans text-xs">
                            <InlineMath
                              math={`${step.dividend.toString()} = ${step.quotient.toString()} \\times ${step.divisor.toString()} + ${step.remainder.toString()}`}
                            />
                          </td>
                          <td className="py-3 px-4 font-sans text-xs">
                            <InlineMath math={step.bezoutEq} />
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
