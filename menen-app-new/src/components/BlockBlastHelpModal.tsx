import React from 'react';
import { X, Sparkles, Flame, Grid, Trophy } from 'lucide-react';
import { sound } from '../utils/audio';

interface BlockBlastHelpModalProps {
  onClose: () => void;
}

export const BlockBlastHelpModal: React.FC<BlockBlastHelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#111A2E] border-2 border-[#203052] rounded-3xl p-6 text-white shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2D4A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-kid text-white">How to Play Menen</h2>
              <p className="text-[11px] text-slate-400">Master the 8x8 Block Blast grid!</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPickup();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1E2D4A] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tips list */}
        <div className="space-y-3 py-4 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0D1527] border border-[#1E2D4A]">
            <Grid className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">1. Drag & Place Blocks</h3>
              <p className="mt-0.5 text-slate-400 leading-relaxed">
                Drag blocks from the bottom dock onto the 8x8 grid. You can also tap a block to select it, then tap the grid to place it!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0D1527] border border-[#1E2D4A]">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">2. Blast Rows & Columns</h3>
              <p className="mt-0.5 text-slate-400 leading-relaxed">
                Fill any horizontal row or vertical column completely to trigger an explosive blast and clear the blocks!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0D1527] border border-[#1E2D4A]">
            <Flame className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">3. Build Mega Combos</h3>
              <p className="mt-0.5 text-slate-400 leading-relaxed">
                Clear multiple lines in a single drop (+1080 Amazing!) or clear lines on consecutive moves to earn escalating combo multipliers!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0D1527] border border-[#1E2D4A]">
            <Trophy className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">4. Keep the Board Clean</h3>
              <p className="mt-0.5 text-slate-400 leading-relaxed">
                Always leave room for large 3x3 squares and long 5x1 lines. When none of the 3 pieces can fit, it is Game Over!
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPickup();
            onClose();
          }}
          className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition-colors cursor-pointer uppercase tracking-wider"
        >
          Let's Play!
        </button>
      </div>
    </div>
  );
};
