import React from 'react';
import { RotateCcw, Crown, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameOverModalProps {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  totalLinesCleared: number;
  maxCombo: number;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  bestScore,
  isNewBest,
  totalLinesCleared,
  maxCombo,
  onPlayAgain,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#111A2E] border-2 border-[#203052] rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center">
        {/* Crown or Sad Robot Icon */}
        <div className="relative -mt-12 w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 border-4 border-[#111A2E] shadow-xl flex items-center justify-center">
          <Crown className="w-10 h-10 text-white fill-white" />
        </div>

        <h2 className="text-2xl font-black font-kid text-white mt-4 tracking-wide">
          {isNewBest ? 'NEW HIGH SCORE! 👑' : 'GAME OVER'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isNewBest ? 'Incredible run! You set a new personal record!' : 'No more valid moves remaining!'}
        </p>

        {/* Score Board */}
        <div className="w-full bg-[#0D1527] border border-[#1E2D4A] rounded-2xl p-4 my-5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Final Score</span>
            <span className="text-2xl font-black font-mono tabular-nums text-white">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1E2D4A]/60">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-amber-400" />
              <span>All-Time Best</span>
            </span>
            <span className="text-sm font-bold font-mono tabular-nums text-amber-200">
              {bestScore.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#1E2D4A]/60">
            <span>Lines Cleared</span>
            <span className="font-bold text-slate-200 font-mono">{totalLinesCleared}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Highest Combo</span>
            <span className="font-bold text-orange-400 font-mono">x{maxCombo}</span>
          </div>
        </div>

        {/* Play Again CTA */}
        <button
          onClick={() => {
            sound.playPickup();
            onPlayAgain();
          }}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 active:scale-95 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
