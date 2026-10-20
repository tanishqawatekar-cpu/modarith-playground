import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'purple';
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<StatusBadgeProps['variant'], string> = {
  success: 'bg-[#F2D879]/60 text-[#30251F] border-[#684838]/35',
  warning: 'bg-[#F2D879] text-[#30251F] border-[#684838]/50',
  danger: 'bg-[#684838] text-[#FFFCED] border-[#30251F]',
  info: 'bg-[#7C91AA]/25 text-[#172C45] border-[#7C91AA]/50',
  purple: 'bg-[#172C45] text-[#FFFCED] border-[#172C45]',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, children, className = '' }) => {
  const Icon =
    variant === 'success'
      ? CheckCircle2
      : variant === 'warning'
      ? AlertTriangle
      : variant === 'danger'
      ? XCircle
      : variant === 'purple'
      ? Sparkles
      : Info;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${variantClasses[variant]} ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{children}</span>
    </span>
  );
};
