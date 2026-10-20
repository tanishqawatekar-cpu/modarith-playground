import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import {
  Network,
  Lock,
  Globe,
  CheckCircle2,
  ArrowRightLeft,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { computeDiffieHellman, DH_PRESETS } from '../../math/diffieHellman';
import { StatusBadge } from '../Common/StatusBadge';

export const DiffieHellmanView: React.FC = () => {
  const [inputP, setInputP] = useState<string>('23');
  const [inputG, setInputG] = useState<string>('5');
  const [alicePrivate, setAlicePrivate] = useState<string>('6');
  const [bobPrivate, setBobPrivate] = useState<string>('15');
  const [exchangePulse, setExchangePulse] = useState<boolean>(false);
  const [showProof, setShowProof] = useState<boolean>(false);

  const parsedP = useMemo(() => {
    try {
      const v = BigInt(inputP.trim() || '23');
      return v > 2n ? v : 23n;
    } catch {
      return 23n;
    }
  }, [inputP]);

  const parsedG = useMemo(() => {
    try {
      const v = BigInt(inputG.trim() || '5');
      return v > 1n ? v : 5n;
    } catch {
      return 5n;
    }
  }, [inputG]);

  const parsedA = useMemo(() => {
    try {
      const v = BigInt(alicePrivate.trim() || '6');
      return v >= 1n ? v : 6n;
    } catch {
      return 6n;
    }
  }, [alicePrivate]);

  const parsedB = useMemo(() => {
    try {
      const v = BigInt(bobPrivate.trim() || '15');
      return v >= 1n ? v : 15n;
    } catch {
      return 15n;
    }
  }, [bobPrivate]);

  const dhResult = useMemo(
    () => computeDiffieHellman(parsedP, parsedG, parsedA, parsedB),
    [parsedP, parsedG, parsedA, parsedB]
  );

  const triggerAnimateExchange = () => {
    setExchangePulse(true);
    setTimeout(() => setExchangePulse(false), 900);
  };

  return (
    <div className="space-y-6">
      {/* 1. Understand the Tool + Presets */}
      <div className="rounded-3xl bg-[#E7D6BF]/55 border border-[#684838]/20 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#684838]/15">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2D879] text-[#30251F] text-xs font-bold">
              <Network className="w-3.5 h-3.5 text-[#684838]" />
              <span>Share a Secret • Diffie–Hellman Key Exchange</span>
            </div>
            <h2 className="text-2xl font-bold text-[#30251F]">
              Public Secret Sharing (Diffie–Hellman Exchange)
            </h2>
            <p className="text-sm text-[#30251F]/80 max-w-3xl">
              See how two people (Alice and Bob) can agree on the exact same secret number across a public chat room without ever sending their private numbers over the internet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={triggerAnimateExchange}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#684838] hover:bg-[#30251F] text-[#FFFCED] text-sm font-bold shadow-sm transition-all"
            >
              <RefreshCw className={`w-4 h-4 text-[#F2D879] ${exchangePulse ? 'animate-spin' : ''}`} />
              <span>Swap Public Numbers</span>
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#684838]">
            Try a Ready-Made Example
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DH_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setInputP(preset.p.toString());
                  setInputG(preset.g.toString());
                  setAlicePrivate(preset.a.toString());
                  setBobPrivate(preset.b.toString());
                  triggerAnimateExchange();
                }}
                className="p-3.5 rounded-2xl bg-[#FFFCED] hover:bg-[#E7D6BF]/80 border border-[#684838]/20 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#30251F]">
                  <Sparkles className="w-3.5 h-3.5 text-[#684838] shrink-0" />
                  <span>{preset.label}</span>
                </div>
                <p className="text-[11px] text-[#30251F]/75 mt-1 line-clamp-2">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Prominent Plain-English Answer Banner */}
      <div className="rounded-3xl bg-[#FFFCED] border-2 border-[#684838]/30 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7D6BF] pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#684838]">
              Plain-English Result
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#30251F] mt-1">
              Alice and Bob both independently calculated the secret key{' '}
              <span className="px-3.5 py-0.5 rounded-xl bg-[#F2D879] text-[#30251F] font-mono">
                K = {dhResult.aliceSharedSecret.toString()}
              </span>
            </h3>
            <p className="text-sm text-[#30251F]/80 mt-2">
              Anyone listening on the public network only saw the clock size <strong>{parsedP.toString()}</strong>, starting number <strong>{parsedG.toString()}</strong>, Alice&apos;s mixed number <strong>{dhResult.alicePublic.toString()}</strong>, and Bob&apos;s mixed number <strong>{dhResult.bobPublic.toString()}</strong>—never the secret key <strong>{dhResult.aliceSharedSecret.toString()}</strong>!
            </p>
          </div>
          {dhResult.keysMatch && (
            <StatusBadge variant="success">
              Identical Match: {dhResult.aliceSharedSecret.toString()} = {dhResult.bobSharedSecret.toString()}
            </StatusBadge>
          )}
        </div>

        {/* Three-Column Interactive Story: Alice | Public Network | Bob */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: ALICE */}
          <div className="lg:col-span-4 rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/25 p-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#684838]/15 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#684838]">
                    Person 1 (Private)
                  </span>
                  <h4 className="text-lg font-bold text-[#30251F]">Alice&apos;s Secret Side</h4>
                </div>
                <span className="p-2 rounded-xl bg-[#684838] text-[#FFFCED]">
                  <Lock className="w-4 h-4" />
                </span>
              </div>

              <div>
                <label
                  htmlFor="dh-alice-a"
                  className="block text-sm font-bold text-[#30251F] mb-1"
                >
                  Step 1: Alice Picks a Private Number (<span className="font-mono">a</span>)
                </label>
                <p className="text-xs text-[#30251F]/70 mb-2">Kept secret by Alice (e.g., 6)</p>
                <input
                  id="dh-alice-a"
                  type="text"
                  value={alicePrivate}
                  onChange={(e) => setAlicePrivate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#30251F] font-mono text-base font-bold"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#FFFCED] border border-[#684838]/20 space-y-1">
                <div className="text-xs font-bold text-[#684838]">
                  Step 2: Alice Mixes Her Public Number (A)
                </div>
                <p className="text-xs text-[#30251F]/75">
                  Raises <span className="font-mono">{parsedG.toString()}^{parsedA.toString()}</span> on a clock of <span className="font-mono">{parsedP.toString()}</span>:
                </p>
                <div className="text-base font-mono font-bold text-[#30251F] pt-1">
                  A = {dhResult.alicePublic.toString()}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F2D879]/55 border border-[#684838]/35 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#30251F]">
                  Step 4: Alice Unlocks Shared Key
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#684838]" />
              </div>
              <p className="text-xs text-[#30251F]/80">
                Takes Bob&apos;s public number (<span className="font-mono">B = {dhResult.bobPublic.toString()}</span>) to her private power <span className="font-mono">a = {parsedA.toString()}</span>:
              </p>
              <div className="text-lg font-mono font-extrabold text-[#30251F] pt-1">
                Secret Key = {dhResult.aliceSharedSecret.toString()}
              </div>
            </div>
          </div>

          {/* CENTER: PUBLIC NETWORK */}
          <div className="lg:col-span-4 rounded-2xl bg-[#172C45] text-[#FFFCED] p-5 flex flex-col justify-between space-y-5 shadow-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#7C91AA]/30 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F2D879]">
                    Visible to Everyone
                  </span>
                  <h4 className="text-lg font-bold text-[#FFFCED]">Public Channel</h4>
                </div>
                <span className="p-2 rounded-xl bg-[#7C91AA]/25 text-[#F2D879]">
                  <Globe className="w-4 h-4" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="dh-p"
                    className="block text-xs font-bold uppercase tracking-wider text-[#E7D6BF] mb-1"
                  >
                    Clock Size (Prime p)
                  </label>
                  <input
                    id="dh-p"
                    type="text"
                    value={inputP}
                    onChange={(e) => setInputP(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFCED] text-[#30251F] font-mono text-sm font-bold"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dh-g"
                    className="block text-xs font-bold uppercase tracking-wider text-[#E7D6BF] mb-1"
                  >
                    Base Number (g)
                  </label>
                  <input
                    id="dh-g"
                    type="text"
                    value={inputG}
                    onChange={(e) => setInputG(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFCED] text-[#30251F] font-mono text-sm font-bold"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div
                  className={`p-3.5 rounded-xl border transition-all duration-500 ${
                    exchangePulse
                      ? 'bg-[#F2D879] text-[#30251F] border-[#F2D879] scale-[1.02]'
                      : 'bg-[#FFFCED]/10 border-[#7C91AA]/40 text-[#FFFCED]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>Step 3A: Alice Sends A → Bob</span>
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-mono text-base font-bold">
                    Public A = {dhResult.alicePublic.toString()}
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-xl border transition-all duration-500 ${
                    exchangePulse
                      ? 'bg-[#F2D879] text-[#30251F] border-[#F2D879] scale-[1.02]'
                      : 'bg-[#FFFCED]/10 border-[#7C91AA]/40 text-[#FFFCED]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>Step 3B: Bob Sends B → Alice</span>
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-mono text-base font-bold">
                    Public B = {dhResult.bobPublic.toString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFFCED]/10 border border-[#7C91AA]/30 text-xs text-[#E7D6BF] leading-relaxed">
              <strong className="text-[#F2D879] block mb-0.5">Paint-Mixing Analogy:</strong>
              Mixing two paint colours is easy, but un-mixing them to find Alice&apos;s or Bob&apos;s private colour is practically impossible!
            </div>
          </div>

          {/* RIGHT: BOB */}
          <div className="lg:col-span-4 rounded-2xl bg-[#E7D6BF]/45 border border-[#684838]/25 p-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#684838]/15 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#172C45]">
                    Person 2 (Private)
                  </span>
                  <h4 className="text-lg font-bold text-[#30251F]">Bob&apos;s Secret Side</h4>
                </div>
                <span className="p-2 rounded-xl bg-[#172C45] text-[#FFFCED]">
                  <Lock className="w-4 h-4" />
                </span>
              </div>

              <div>
                <label
                  htmlFor="dh-bob-b"
                  className="block text-sm font-bold text-[#30251F] mb-1"
                >
                  Step 1: Bob Picks a Private Number (<span className="font-mono">b</span>)
                </label>
                <p className="text-xs text-[#30251F]/70 mb-2">Kept secret by Bob (e.g., 15)</p>
                <input
                  id="dh-bob-b"
                  type="text"
                  value={bobPrivate}
                  onChange={(e) => setBobPrivate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#FFFCED] border-2 border-[#684838]/35 text-[#172C45] font-mono text-base font-bold"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#FFFCED] border border-[#684838]/20 space-y-1">
                <div className="text-xs font-bold text-[#172C45]">
                  Step 2: Bob Mixes His Public Number (B)
                </div>
                <p className="text-xs text-[#30251F]/75">
                  Raises <span className="font-mono">{parsedG.toString()}^{parsedB.toString()}</span> on a clock of <span className="font-mono">{parsedP.toString()}</span>:
                </p>
                <div className="text-base font-mono font-bold text-[#30251F] pt-1">
                  B = {dhResult.bobPublic.toString()}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F2D879]/55 border border-[#684838]/35 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#30251F]">
                  Step 4: Bob Unlocks Shared Key
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#684838]" />
              </div>
              <p className="text-xs text-[#30251F]/80">
                Takes Alice&apos;s public number (<span className="font-mono">A = {dhResult.alicePublic.toString()}</span>) to his private power <span className="font-mono">b = {parsedB.toString()}</span>:
              </p>
              <div className="text-lg font-mono font-extrabold text-[#30251F] pt-1">
                Secret Key = {dhResult.bobSharedSecret.toString()}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Expandable "How did we get this answer?" */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowProof((prev) => !prev)}
            aria-expanded={showProof}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#E7D6BF]/70 hover:bg-[#E7D6BF] text-[#30251F] font-bold text-sm border border-[#684838]/25 transition-colors"
          >
            <span>
              How do Alice and Bob end up with the exact same number? (See the exponent rule)
            </span>
            {showProof ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showProof && (
            <div className="mt-5 space-y-4 pt-4 border-t border-[#E7D6BF]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#E7D6BF]/40 border border-[#684838]/20">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#684838] mb-1">
                    Alice&apos;s Calculation
                  </div>
                  <BlockMath
                    math={`K_A = B^a \\bmod p = (${parsedG.toString()}^{${parsedB.toString()}})^{${parsedA.toString()}} \\bmod ${parsedP.toString()} = ${dhResult.aliceSharedSecret.toString()}`}
                  />
                </div>
                <div className="p-4 rounded-2xl bg-[#E7D6BF]/40 border border-[#684838]/20">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#172C45] mb-1">
                    Bob&apos;s Calculation
                  </div>
                  <BlockMath
                    math={`K_B = A^b \\bmod p = (${parsedG.toString()}^{${parsedA.toString()}})^{${parsedB.toString()}} \\bmod ${parsedP.toString()} = ${dhResult.bobSharedSecret.toString()}`}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFCED] border border-[#684838]/25 text-sm text-[#30251F]">
                <BlockMath math="K_A \equiv (g^b)^a \equiv g^{a \cdot b} \equiv (g^a)^b \equiv K_B \pmod p" />
                <p className="text-xs text-[#30251F]/80 text-center mt-1">
                  Because multiplying powers in either order gives <InlineMath math="b \times a = a \times b" />, both sides always arrive at the exact same remainder!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
