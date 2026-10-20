import { useState } from 'react';
import { Navbar, ModuleTabId, MODULE_TABS, CATEGORIES } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { TheoryDrawer } from './components/TheoryDrawer';
import { EuclidView } from './components/Visualizers/EuclidView';
import { CRTView } from './components/Visualizers/CRTView';
import { PrimalityView } from './components/Visualizers/PrimalityView';
import { RSAView } from './components/Visualizers/RSAView';
import { RSACrackerView } from './components/Visualizers/RSACrackerView';
import { DiffieHellmanView } from './components/Visualizers/DiffieHellmanView';

export function App() {
  const [activeTab, setActiveTab] = useState<ModuleTabId>('euclid');
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);

  const currentModuleInfo = MODULE_TABS.find((t) => t.id === activeTab) ?? MODULE_TABS[0];
  const currentCategory =
    CATEGORIES.find((c) => c.id === currentModuleInfo.categoryId) ?? CATEGORIES[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCED] text-[#30251F] transition-colors">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenTheory={() => setIsTheoryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Friendly Context Bar showing active category & plain-English overview */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-[#E7D6BF]/60 border border-[#684838]/20">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#172C45] text-[#FFFCED]">
              {currentCategory.title}
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#30251F]">
              {currentModuleInfo.description}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsTheoryOpen(true)}
            className="text-xs font-bold text-[#684838] hover:text-[#30251F] underline underline-offset-4 whitespace-nowrap self-start sm:self-auto"
          >
            Read Classroom Guide &amp; Proofs →
          </button>
        </div>

        {/* Active Module Visualizer */}
        {activeTab === 'euclid' && <EuclidView />}
        {activeTab === 'crt' && <CRTView />}
        {activeTab === 'primality' && <PrimalityView />}
        {activeTab === 'rsa' && <RSAView />}
        {activeTab === 'cracker' && <RSACrackerView />}
        {activeTab === 'dh' && <DiffieHellmanView />}
      </main>

      <Footer onOpenTheory={() => setIsTheoryOpen(true)} />

      {/* Slide-over Syllabus & Proof Context Drawer */}
      <TheoryDrawer isOpen={isTheoryOpen} onClose={() => setIsTheoryOpen(false)} />
    </div>
  );
}

export default App;
