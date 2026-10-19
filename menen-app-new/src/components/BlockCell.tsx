import React from 'react';
import { BlockColor, BLOCK_COLORS } from '../types/blockBlast';

interface BlockCellProps {
  color?: BlockColor | null;
  isGhost?: boolean;
  ghostColor?: BlockColor;
  isClearing?: boolean;
  isLineClearHint?: boolean;
  sizeClass?: string;
  row?: number;
  col?: number;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

export const BlockCell: React.FC<BlockCellProps> = ({
  color,
  isGhost = false,
  ghostColor,
  isClearing = false,
  isLineClearHint = false,
  sizeClass = 'w-10 h-10 sm:w-12 sm:h-12',
  row,
  col,
  onClick,
  onMouseEnter,
}) => {
  // Empty slot on the grid
  if (!color && !isGhost) {
    return (
      <div
        data-cell="true"
        data-r={row}
        data-c={col}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className={`${sizeClass} rounded-lg bg-[#141E33] border border-[#1E2C4A] transition-all relative flex items-center justify-center ${
          isLineClearHint ? 'ring-2 ring-amber-400/80 bg-[#1E2D4F]' : ''
        }`}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#1F2C47]/60 pointer-events-none" />
      </div>
    );
  }

  // Ghost preview cell
  if (isGhost && ghostColor) {
    const meta = BLOCK_COLORS[ghostColor];
    return (
      <div
        data-cell="true"
        data-r={row}
        data-c={col}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className={`${sizeClass} rounded-lg border-2 border-dashed transition-all relative flex items-center justify-center opacity-60 ${meta.bg} ${meta.glow}`}
      >
        <div className="w-2 h-2 rounded-full bg-white/60" />
      </div>
    );
  }

  // Filled 3D Glossy Jewel Block
  const activeColor = color || 'yellow';
  const meta = BLOCK_COLORS[activeColor];

  return (
    <div
      data-cell="true"
      data-r={row}
      data-c={col}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`relative ${sizeClass} rounded-lg p-0.5 transition-all select-none overflow-hidden ${
        isClearing ? 'scale-115 brightness-150 animate-pulse' : ''
      } ${isLineClearHint ? 'brightness-125' : ''}`}
    >
      {/* 3D Beveled Shell */}
      <div
        className={`w-full h-full rounded-md border-t-2 border-l-2 border-b-2 border-r-2 ${meta.borderLight} ${meta.borderDark} bg-gradient-to-br ${meta.gradient} shadow-md flex items-center justify-center relative overflow-hidden`}
      >
        {/* Top-left corner glossy reflection */}
        <div className="absolute top-0.5 left-0.5 w-3/4 h-2/5 bg-gradient-to-b from-white/45 to-transparent rounded-xs pointer-events-none" />

        {/* Inner subtle embossed square for that signature tactile Block Blast toy feel */}
        <div className="w-3/5 h-3/5 rounded-xs border border-white/20 bg-white/10 pointer-events-none" />
      </div>
    </div>
  );
};
