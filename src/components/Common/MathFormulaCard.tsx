import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';

interface MathFormulaCardProps {
  title: string;
  formula: string;
  subtitle?: string;
  unitBadge?: string;
  inline?: boolean;
  accent?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan';
}

const accentStyles: Record<NonNullable<MathFormulaCardProps['accent']>, string> = {
  indigo: 'border-[#172C45]/25 bg-[#FFFCED] text-[#172C45]',
  emerald: 'border-[#684838]/30 bg-[#FFFCED] text-[#30251F]',
  amber: 'border-[#684838]/35 bg-[#F2D879]/25 text-[#30251F]',
  rose: 'border-[#684838]/40 bg-[#E7D6BF]/70 text-[#30251F]',
  cyan: 'border-[#7C91AA]/40 bg-[#FFFCED] text-[#172C45]',
};

export const MathFormulaCard: React.FC<MathFormulaCardProps> = ({
  title,
  formula,
  subtitle,
  unitBadge,
  inline = false,
  accent = 'indigo',
}) => {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm transition-all ${accentStyles[accent]}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#684838]">{title}</h4>
        {unitBadge && (
          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#F2D879]/70 border border-[#684838]/25 text-[#30251F]">
            {unitBadge}
          </span>
        )}
      </div>
      <div className="my-1 overflow-x-auto text-[#30251F] py-1">
        {inline ? <InlineMath math={formula} /> : <BlockMath math={formula} />}
      </div>
      {subtitle && <p className="text-xs text-[#30251F]/80 mt-1.5 leading-relaxed">{subtitle}</p>}
    </div>
  );
};
