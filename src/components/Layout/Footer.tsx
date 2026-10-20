import React from 'react';
import { BookOpen, CheckCircle, HeartHandshake } from 'lucide-react';

interface FooterProps {
  onOpenTheory: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTheory }) => {
  return (
    <footer className="mt-16 border-t border-[#684838]/20 bg-[#E7D6BF]/45 py-8 text-xs text-[#30251F]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <HeartHandshake className="w-4 h-4 text-[#684838]" />
          <span>
            <strong className="text-[#30251F]">ModArith Playground</strong> — Designed for students, teachers, and curious minds learning Number Theory &amp; Cryptography.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#172C45]">
            <CheckCircle className="w-3.5 h-3.5 text-[#684838]" />
            Runs 100% in your browser with exact whole-number math
          </span>
          <button
            type="button"
            onClick={onOpenTheory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFCED] hover:bg-[#F2D879]/50 text-[#30251F] border border-[#684838]/25 font-semibold transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#684838]" />
            Open Teacher Guide &amp; Proofs
          </button>
        </div>
      </div>
    </footer>
  );
};
