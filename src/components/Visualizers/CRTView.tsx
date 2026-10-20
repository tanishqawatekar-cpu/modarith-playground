import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import {
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { solveCRT, CongruenceInput } from '../../math/crt';
import { StatusBadge } from '../Common/StatusBadge';
import { MathFormulaCard } from '../Common/MathFormulaCard';

interface CongruenceRowState {
  id: string;
  a: string;
  m: string;
}

const CRT_PRESETS: Array<{ label: string; subtitle: string; rows: Array<{ a: string; m: string }> }> = [
  {
    label: 'Classic Egg Basket Puzzle (Answer: 23)',
    subtitle: 'Leftover 2 when grouped by 3, leftover 3 by 5, leftover 2 by 7',
    rows: [
      { a: '2', m: '3' },
      { a: '3', m: '5' },
      { a: '2', m: '7' },
    ],
  },
  {
    label: 'Four-Clock Puzzle (Answer: 314)',
    subtitle: 'Divisors 3, 4, 5, and 7 with remainders 2, 2, 4, and 6',
    rows: [
      { a: '2', m: '3' },
      { a: '2', m: '4' },
      { a: '4', m: '5' },
      { a: '6', m: '7' },
    ],
  },
  {
    label: 'Shared Factor Error Example (Divisors 6 & 10)',
    subtitle: 'Shows why divisors must not share common factors like 2',
    rows: [
      { a: '1', m: '6' },
      { a: '3', m: '10' },
      { a: '2', m: '7' },
    ],
  },
];

export const CRTView: React.FC = () => {
  const [rows, setRows] = useState<CongruenceRowState[]>([
    { id: '1', a: '2', m: '3' },
    { id: '2', a: '3', m: '5' },
    { id: '3', a: '2', m: '7' },
  ]);
  const [showSteps, setShowSteps] = useState<boolean>(false);

  const parsedCongruences: CongruenceInput[] = useMemo(() => {
    return rows.map((r) => {
      let a = 0n;
      let m = 2n;
      try {
        a = BigInt(r.a.trim() || '0');
      } catch {
        a = 0n;
      }
      try {
        m = BigInt(r.m.trim() || '2');
      } catch {
        m = 2n;
      }
      return { a, m };
    });
  }, [rows]);

  const crtResult = useMemo(() => solveCRT(parsedCongruences), [parsedCongruences]);

  const handleAddRow = () => {
    const candidatePrimes = ['11', '13', '17', '19', '23', '29'];
    const usedModuli = new Set(rows.map((r) => r.m.trim()));
    const nextMod = candidatePrimes.find((p) => !usedModuli.has(p)) ?? '11';
    setRows((prev) => [...prev, { id: String(Date.now()), a: '1', m: nextMod }]);
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length <= 2) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRowChange = (id: string, field: 'a' | 'm', value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  return (
    <div className="space-y-6">
      {/* 1. Understand the Tool & Enter Clue Rows */}
      <div className="rounded-3xl bg-[#E7D6BF]/55 border border-[#684838]/20 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#684838]/15">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2D879] text-[#30251F] text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-[#684838]" />
              <span>Number Puzzles • Chinese Remainder Theorem</span>
            </div>
            <h2 className="text-2xl font-bold text-[#30251F]">
              Remainder Puzzle Solver
            </h2>
            <p className="text-sm text-[#30251F]/80 max-w-3xl">
              Find the smallest mystery number <span className="font-semibold">x</span> that leaves your chosen leftover remainders when divided by several different group sizes.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#684838]">
            Try a Sample Remainder Puzzle
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CRT_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  setRows(
                    preset.rows.map((r, i) => ({
                      id: `preset-${i}-${Date.now()}`,
                      a: r.a,
                      m: r.m,
                    }))
                  )
                }
                className="p-3.5 rounded-2xl bg-[#FFFCED] hover:bg-[#E7D6BF]/80 border border-[#684838]/20 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#30251F]">
                  <Sparkles className="w-3.5 h-3.5 text-[#684838] shrink-0" />
                  <span>{preset.label}</span>
                </div>
                <p className="text-[11px] text-[#30251F]/75 mt-1">{preset.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Clue Rows + Coprimality Checker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3 bg-[#FFFCED] p-5 rounded-2xl border border-[#684838]/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#684838]">
                  Enter Your Remainder Clues ({rows.length} Clues)
                </h3>
                <p className="text-xs text-[#30251F]/70">
                  Each row says: &ldquo;When divided by Group Size, the Leftover Remainder is...&rdquo;
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#684838] hover:bg-[#30251F] text-[#FFFCED] text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#F2D879]" />
                Add Another Clue
              </button>
            </div>

            <div className="space-y-2.5 pt-2">
              {rows.map((row, idx) => (
                <div
                  key={row.id}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 p-3 rounded-xl bg-[#E7D6BF]/40 border border-[#684838]/20"
                >
                  <span className="text-xs font-mono font-bold text-[#684838] px-2 py-1 rounded-lg bg-[#FFFCED]">
                    Clue #{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#30251F]">
                    Remainder is
                  </span>
                  <input
                    type="text"
                    value={row.a}
                    onChange={(e) => handleRowChange(row.id, 'a', e.target.value)}
                    aria-label={`Remainder a_${idx + 1}`}
                    className="w-20 px-3 py-1.5 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#30251F] font-mono text-sm font-bold"
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#30251F]">
                    when divided by
                  </span>
                  <input
                    type="text"
                    value={row.m}
                    onChange={(e) => handleRowChange(row.id, 'm', e.target.value)}
                    aria-label={`Modulus m_${idx + 1}`}
                    className="w-20 px-3 py-1.5 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#172C45] font-mono text-sm font-bold"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveRow(row.id)}
                    disabled={rows.length <= 2}
                    title="Remove this clue"
                    className="ml-auto p-1.5 rounded-lg text-[#30251F]/60 hover:text-[#684838] hover:bg-[#FFFCED] disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Friendly Divisor Compatibility Check */}
          <div className="lg:col-span-5 rounded-2xl bg-[#FFFCED] border border-[#684838]/20 p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#684838]">
                  Do the Divisors Work Together?
                </h3>
                {crtResult.success ? (
                  <StatusBadge variant="success">All Divisors Compatible</StatusBadge>
                ) : (
                  <StatusBadge variant="danger">Shared Factor Found</StatusBadge>
                )}
              </div>
              <p className="text-xs text-[#30251F]/75 mb-3">
                For a guaranteed single solution, no two group sizes (divisors) may share a common factor greater than 1:
              </p>

              <div className="flex flex-wrap gap-2">
                {crtResult.coprimePairs.map((pair) => (
                  <div
                    key={`${pair.i}-${pair.j}`}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 ${
                      pair.isCoprime
                        ? 'bg-[#E7D6BF]/40 border-[#684838]/25 text-[#30251F]'
                        : 'bg-[#684838] border-[#30251F] text-[#FFFCED] font-bold'
                    }`}
                  >
                    {pair.isCoprime ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#684838]" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-[#F2D879]" />
                    )}
                    <span>
                      gcd({pair.m_i.toString()}, {pair.m_j.toString()}) = {pair.gcd.toString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {!crtResult.success && crtResult.error && (
              <div className="p-4 rounded-2xl bg-[#684838] text-[#FFFCED] text-xs space-y-1.5 leading-relaxed">
                <strong className="block text-[#F2D879] text-sm">
                  How to fix this puzzle:
                </strong>
                <p>{crtResult.error}</p>
                {crtResult.violatedPair && (
                  <p className="text-[#E7D6BF]">
                    Try changing <strong>{crtResult.violatedPair.m_i.toString()}</strong> or{' '}
                    <strong>{crtResult.violatedPair.m_j.toString()}</strong> to a prime number like <strong>5, 7, 11, or 13</strong> so they don&apos;t share a factor of {crtResult.violatedPair.gcd.toString()}.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Prominent Plain-English Answer Card */}
      {crtResult.success && crtResult.x !== undefined && crtResult.M !== undefined && (
        <div className="rounded-3xl bg-[#FFFCED] border-2 border-[#684838]/30 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7D6BF] pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#684838]">
                Plain-English Answer
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#30251F] mt-1">
                The smallest mystery number is{' '}
                <span className="px-3 py-0.5 rounded-xl bg-[#F2D879] text-[#30251F] font-mono">
                  x = {crtResult.x.toString()}
                </span>
              </h3>
              <p className="text-sm text-[#30251F]/80 mt-2">
                And the pattern repeats every <strong>{crtResult.M.toString()}</strong> numbers (so{' '}
                <span className="font-mono font-semibold">
                  {(crtResult.x + crtResult.M).toString()}
                </span>
                ,{' '}
                <span className="font-mono font-semibold">
                  {(crtResult.x + 2n * crtResult.M).toString()}
                </span>
                , etc. also solve the puzzle!).
              </p>
            </div>

            <div className="px-5 py-3.5 rounded-2xl bg-[#172C45] text-[#FFFCED] text-center shrink-0">
              <div className="text-[11px] uppercase tracking-wider text-[#E7D6BF] mb-1">
                Combined Math Statement
              </div>
              <div className="text-base font-mono font-bold text-[#F2D879]">
                x ≡ {crtResult.x.toString()} (mod {crtResult.M.toString()})
              </div>
            </div>
          </div>

          {/* Quick Verification Pills */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#684838] mb-2.5">
              Quick Check: Does x = {crtResult.x.toString()} really match every clue?
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {crtResult.steps.map((step) => {
                const q = crtResult.x! / step.m;
                return (
                  <div
                    key={step.index}
                    className="p-3.5 rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/20 text-xs text-[#30251F] flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#684838] shrink-0" />
                    <div>
                      <div className="font-bold">
                        {crtResult.x!.toString()} ÷ {step.m.toString()} = {q.toString()} with remainder{' '}
                        <span className="px-1.5 py-0.5 rounded bg-[#F2D879] font-mono">
                          {step.a.toString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
              <span>How did we get this answer? (See Chinese Remainder Theorem steps)</span>
              {showSteps ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showSteps && (
              <div className="mt-5 space-y-6 pt-4 border-t border-[#E7D6BF]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MathFormulaCard
                    title="1. Multiply All Divisors (M)"
                    unitBadge="Step 1"
                    accent="indigo"
                    formula={`M = ${crtResult.steps
                      .map((s) => s.m.toString())
                      .join(' \\times ')} = ${crtResult.M.toString()}`}
                    subtitle="The cycle length where the pattern repeats."
                  />
                  <MathFormulaCard
                    title="2. Add Weighted Parts"
                    unitBadge="Step 2"
                    accent="cyan"
                    formula={`\\sum a_i M_i y_i = ${crtResult.sumBeforeMod?.toString()}`}
                    subtitle="Sum of each remainder multiplied by its helper weights."
                  />
                  <MathFormulaCard
                    title="3. Take Final Remainder"
                    unitBadge="Step 3"
                    accent="emerald"
                    formula={`x = ${crtResult.sumBeforeMod?.toString()} \\bmod ${crtResult.M.toString()} = ${crtResult.x.toString()}`}
                    subtitle={`Smallest non-negative answer in mod ${crtResult.M.toString()}.`}
                  />
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#684838]/25 bg-[#FFFCED]">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#E7D6BF]/70 text-[#30251F] text-xs uppercase tracking-wider border-b border-[#684838]/20">
                        <th className="py-3 px-4">Clue</th>
                        <th className="py-3 px-4">Equation</th>
                        <th className="py-3 px-4">Remainder (<InlineMath math="a_i" />)</th>
                        <th className="py-3 px-4">Divisor (<InlineMath math="m_i" />)</th>
                        <th className="py-3 px-4">Other Divisors (<InlineMath math="M_i = M / m_i" />)</th>
                        <th className="py-3 px-4">Clock Inverse (<InlineMath math="y_i" />)</th>
                        <th className="py-3 px-4">Row Product (<InlineMath math="a_i M_i y_i" />)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7D6BF] font-mono text-[#30251F]">
                      {crtResult.steps.map((step) => (
                        <tr key={step.index} className="hover:bg-[#E7D6BF]/30">
                          <td className="py-3 px-4 font-bold text-[#684838]">#{step.index}</td>
                          <td className="py-3 px-4 font-sans">
                            <InlineMath
                              math={`x \\equiv ${step.a.toString()} \\pmod{${step.m.toString()}}`}
                            />
                          </td>
                          <td className="py-3 px-4">{step.a.toString()}</td>
                          <td className="py-3 px-4 text-[#172C45] font-bold">{step.m.toString()}</td>
                          <td className="py-3 px-4">{step.M_i.toString()}</td>
                          <td className="py-3 px-4">
                            {step.y_i.toString()}{' '}
                            <span className="text-xs text-[#30251F]/60">
                              ({step.M_i.toString()}×{step.y_i.toString()} ≡ 1 mod {step.m.toString()})
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-[#684838]">
                            {step.partialProduct.toString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-2xl bg-[#E7D6BF]/40 border border-[#684838]/20 overflow-x-auto">
                  <BlockMath
                    math={`x \\equiv \\left(${crtResult.steps
                      .map((s) => `${s.a.toString()} \\cdot ${s.M_i.toString()} \\cdot ${s.y_i.toString()}`)
                      .join(' + ')}\\right) \\equiv ${crtResult.sumBeforeMod?.toString()} \\equiv ${crtResult.x.toString()} \\pmod{${crtResult.M.toString()}}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
