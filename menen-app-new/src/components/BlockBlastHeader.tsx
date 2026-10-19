import React from 'react';
import { Volume2, VolumeX, RotateCcw, Crown, Flame, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface BlockBlastHeaderProps {
  score: number;
  bestScore: number;
  comboStreak: number;
  onRestart: () => void;
  onOpenHelp: () => void;
}

export const BlockBlastHeader: React.FC<BlockBlastHeaderProps> = ({
  score,
  bestScore,
  comboStreak,
  onRestart,
  onOpenHelp,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.isMuted());

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
    if (!next) sound.playPickup();
  };

  return (
    <header className="w-full max-w-xl mx-auto px-4 py-3 flex items-center justify-between gap-4 select-none">
      {/* Brand & Crown */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center">
          <Crown className="w-5 h-5 text-amber-400 fill-amber-400 absolute -top-3.5 -rotate-12 drop-shadow-md" />
          <h1 className="text-2xl sm:text-3xl font-black font-kid tracking-wider bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-sm">
            MENEN
          </h1>
        </div>
      </div>

      {/* Middle Scores Hub */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Current Score */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase">
            SCORE
          </span>
          <span className="text-xl sm:text-3xl font-black font-mono tabular-nums text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Best High Score */}
        <div className="flex flex-col items-center bg-[#131D33] px-3 py-1 rounded-xl border border-[#1E2D4A]">
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
            <Crown className="w-3 h-3 fill-amber-400" />
            <span>BEST</span>
          </div>
          <span className="text-sm sm:text-lg font-bold font-mono tabular-nums text-amber-200">
            {bestScore.toLocaleString()}
          </span>
        </div>

        {/* Combo Badge if active */}
        {comboStreak > 1 && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-black text-xs animate-bounce shadow-md">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>x{comboStreak}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleMute}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-2 rounded-xl bg-[#131D33] border border-[#1E2D4A] text-slate-300 hover:text-white hover:bg-[#1C2A48] transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          onClick={onOpenHelp}
          title="Game Rules"
          className="p-2 rounded-xl bg-[#131D33] border border-[#1E2D4A] text-slate-300 hover:text-white hover:bg-[#1C2A48] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            sound.playPickup();
            onRestart();
          }}
          title="Restart Game"
          className="p-2 rounded-xl bg-[#131D33] border border-[#1E2D4A] text-slate-300 hover:text-white hover:bg-[#1C2A48] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
