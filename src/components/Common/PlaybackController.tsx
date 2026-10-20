import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface PlaybackControllerProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  label?: string;
}

export const PlaybackController: React.FC<PlaybackControllerProps> = ({
  currentStep,
  totalSteps,
  onStepChange,
  label = 'Walk through step-by-step',
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= totalSteps) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      onStepChange(Math.min(totalSteps, currentStep + 1));
    }, 850);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps, onStepChange]);

  const handleTogglePlay = () => {
    if (currentStep >= totalSteps) {
      onStepChange(1);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  if (totalSteps <= 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#E7D6BF]/60 border border-[#684838]/20">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            onStepChange(1);
          }}
          disabled={currentStep <= 1}
          title="Start from Step 1"
          className="p-2 rounded-xl bg-[#FFFCED] hover:bg-[#E7D6BF] disabled:opacity-40 text-[#30251F] border border-[#684838]/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            onStepChange(Math.max(1, currentStep - 1));
          }}
          disabled={currentStep <= 1}
          title="Previous step"
          className="p-2 rounded-xl bg-[#FFFCED] hover:bg-[#E7D6BF] disabled:opacity-40 text-[#30251F] border border-[#684838]/20 transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleTogglePlay}
          title={isPlaying ? 'Pause playback' : 'Play steps automatically'}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#684838] hover:bg-[#30251F] text-[#FFFCED] text-xs font-semibold shadow-sm transition-colors"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isPlaying ? 'Pause' : 'Play Steps'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            onStepChange(Math.min(totalSteps, currentStep + 1));
          }}
          disabled={currentStep >= totalSteps}
          title="Next step"
          className="p-2 rounded-xl bg-[#FFFCED] hover:bg-[#E7D6BF] disabled:opacity-40 text-[#30251F] border border-[#684838]/20 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            onStepChange(totalSteps);
          }}
          disabled={currentStep >= totalSteps}
          className="px-3 py-1.5 rounded-xl bg-[#FFFCED] hover:bg-[#E7D6BF] disabled:opacity-40 text-xs font-semibold text-[#30251F] border border-[#684838]/20 transition-colors"
        >
          Show All Steps
        </button>
      </div>

      <div className="flex items-center gap-3 flex-1 max-w-md">
        <span className="text-xs font-semibold text-[#30251F]/80 whitespace-nowrap">{label}:</span>
        <input
          type="range"
          min={1}
          max={totalSteps}
          value={currentStep}
          onChange={(e) => {
            setIsPlaying(false);
            onStepChange(Number(e.target.value));
          }}
          className="w-full accent-[#684838] cursor-pointer h-2 bg-[#FFFCED] rounded-lg"
        />
        <span className="text-xs font-mono font-bold text-[#30251F] bg-[#F2D879] border border-[#684838]/30 px-2.5 py-0.5 rounded-lg whitespace-nowrap">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
};
