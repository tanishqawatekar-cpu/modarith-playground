import React from 'react';
import {
  Calculator,
  Layers,
  ShieldAlert,
  KeyRound,
  Unlock,
  Network,
  BookOpen,
  Sparkles,
  Compass,
  Puzzle,
  Lock,
  Share2,
} from 'lucide-react';

export type ModuleTabId = 'euclid' | 'crt' | 'primality' | 'rsa' | 'cracker' | 'dh';

export type CategoryId = 'basics' | 'puzzles' | 'secrets' | 'sharing';

export interface CategoryInfo {
  id: CategoryId;
  title: string;
  subtitle: string;
  badgeText: string;
  icon: React.FC<{ className?: string }>;
  tools: ModuleTabId[];
}

export interface ModuleTabInfo {
  id: ModuleTabId;
  categoryId: CategoryId;
  label: string;
  shortTitle: string;
  unitTag: string;
  icon: React.FC<{ className?: string }>;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'basics',
    title: 'Number Basics',
    subtitle: 'Greatest common factors & clock-math inverses',
    badgeText: 'GCD & Inverse',
    icon: Compass,
    tools: ['euclid'],
  },
  {
    id: 'puzzles',
    title: 'Number Puzzles',
    subtitle: 'Remainder riddles & prime number tests',
    badgeText: '2 Tools',
    icon: Puzzle,
    tools: ['crt', 'primality'],
  },
  {
    id: 'secrets',
    title: 'Secret Messages',
    subtitle: 'Lock messages with RSA & test weak keys',
    badgeText: '2 Tools',
    icon: Lock,
    tools: ['rsa', 'cracker'],
  },
  {
    id: 'sharing',
    title: 'Share a Secret',
    subtitle: 'Agree on a private key in public view',
    badgeText: 'Key Exchange',
    icon: Share2,
    tools: ['dh'],
  },
];

export const MODULE_TABS: ModuleTabInfo[] = [
  {
    id: 'euclid',
    categoryId: 'basics',
    label: 'Greatest Common Factor & Clock Inverse Finder',
    shortTitle: 'GCD & Modular Inverse',
    unitTag: 'Number Basics • Unit 5',
    icon: Calculator,
    description:
      'Find the largest number that divides two whole numbers evenly, and check if a "clock arithmetic" inverse exists.',
  },
  {
    id: 'crt',
    categoryId: 'puzzles',
    label: 'Remainder Puzzle Solver (Chinese Remainder Theorem)',
    shortTitle: 'Remainder Puzzle (CRT)',
    unitTag: 'Number Puzzles • Unit 5',
    icon: Layers,
    description:
      'Find the smallest secret number that leaves specific remainders when divided by several different numbers.',
  },
  {
    id: 'primality',
    categoryId: 'puzzles',
    label: 'Prime Tester & "Fool the Test" Explorer',
    shortTitle: 'Fermat Prime Test & Fools',
    unitTag: 'Number Puzzles • Unit 1 & 5',
    icon: ShieldAlert,
    description:
      'Test whether a number looks prime using Fermat’s shortcut—and see how rare "impostor" Carmichael numbers trick it.',
  },
  {
    id: 'rsa',
    categoryId: 'secrets',
    label: 'Secret Message Maker (RSA Workbench)',
    shortTitle: 'RSA Secret Message Lab',
    unitTag: 'Secret Messages • Unit 2 & 5',
    icon: KeyRound,
    description:
      'Create a public lock and a private key from two prime numbers, then type a word to lock and unlock it live.',
  },
  {
    id: 'cracker',
    categoryId: 'secrets',
    label: 'Weak Key Breaker (RSA Factorisation Attack)',
    shortTitle: 'Break Weak RSA Keys',
    unitTag: 'Secret Messages • Unit 5',
    icon: Unlock,
    description:
      'See how an eavesdropper can unlock a secret message if the two prime numbers used to build the public lock are too small or too close.',
  },
  {
    id: 'dh',
    categoryId: 'sharing',
    label: 'Public Secret Sharing (Diffie–Hellman Exchange)',
    shortTitle: 'Diffie–Hellman Key Share',
    unitTag: 'Share a Secret • Unit 5',
    icon: Network,
    description:
      'Watch Alice and Bob create the exact same secret number over a public network without ever sending their private numbers.',
  },
];

interface NavbarProps {
  activeTab: ModuleTabId;
  onSelectTab: (tab: ModuleTabId) => void;
  onOpenTheory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenTheory,
}) => {
  const currentTabInfo = MODULE_TABS.find((t) => t.id === activeTab) ?? MODULE_TABS[0];
  const activeCategory = CATEGORIES.find((c) => c.id === currentTabInfo.categoryId) ?? CATEGORIES[0];

  const handleCategoryClick = (category: CategoryInfo) => {
    if (!category.tools.includes(activeTab)) {
      onSelectTab(category.tools[0]);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#684838]/20 bg-[#FFFCED]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar: Brand + Teacher Guide Button */}
        <div className="flex flex-wrap items-center justify-between py-4 gap-4 border-b border-[#E7D6BF]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#684838] flex items-center justify-center shadow-sm border border-[#30251F]/20">
              <Sparkles className="w-5 h-5 text-[#F2D879]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#30251F]">
                  ModArith Playground
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F2D879] text-[#30251F] border border-[#684838]/25">
                  Interactive Math Lab
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#30251F]/75">
                Explore everyday number puzzles, clock arithmetic, and how secret codes work
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenTheory}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#172C45] hover:bg-[#30251F] text-[#FFFCED] text-xs sm:text-sm font-semibold shadow-sm transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#F2D879]" />
              <span>Teacher Guide &amp; Proofs</span>
            </button>
          </div>
        </div>

        {/* 4 Intuitive Consumer-App Style Category Cards */}
        <div className="py-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#684838] mb-2.5">
            1. Choose a Topic Category
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            role="navigation"
            aria-label="Tool Categories"
          >
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isSelected = category.id === activeCategory.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={`group flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#172C45] text-[#FFFCED] border-[#172C45] shadow-md'
                      : 'bg-[#E7D6BF]/55 hover:bg-[#E7D6BF] text-[#30251F] border-[#684838]/20'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#F2D879] text-[#30251F]'
                        : 'bg-[#FFFCED] text-[#684838] border border-[#684838]/15'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm truncate">{category.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isSelected
                            ? 'bg-[#F2D879] text-[#30251F]'
                            : 'bg-[#FFFCED] text-[#684838]'
                        }`}
                      >
                        {category.badgeText}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 line-clamp-2 leading-snug ${
                        isSelected ? 'text-[#E7D6BF]' : 'text-[#30251F]/75'
                      }`}
                    >
                      {category.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-navigation Pill Strip for All 6 Tools */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 pt-1">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-bold text-[#684838] mr-1 whitespace-nowrap">
              2. Pick a Tool:
            </span>
            {MODULE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isInActiveCategory = tab.categoryId === activeCategory.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-[#684838] text-[#FFFCED] border-[#684838] shadow-sm'
                      : isInActiveCategory
                      ? 'bg-[#F2D879]/65 text-[#30251F] border-[#684838]/40 hover:bg-[#F2D879]'
                      : 'bg-[#FFFCED] text-[#30251F]/80 border-[#684838]/20 hover:bg-[#E7D6BF]/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
