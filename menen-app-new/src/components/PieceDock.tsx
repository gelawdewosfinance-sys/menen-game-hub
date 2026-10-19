import React from 'react';
import { BlockColor, canPlacePiece, Piece } from '../types/blockBlast';
import { BlockCell } from './BlockCell';

interface PieceDockProps {
  pieces: Piece[];
  selectedPieceId: string | null;
  onSelectPiece: (piece: Piece) => void;
  onDragStartPiece: (piece: Piece, e: React.PointerEvent) => void;
  board: (BlockColor | null)[][];
}

export const PieceDock: React.FC<PieceDockProps> = ({
  pieces,
  selectedPieceId,
  onSelectPiece,
  onDragStartPiece,
  board,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex items-center justify-around gap-2 sm:gap-4 p-3 bg-[#111A2E]/80 backdrop-blur-md rounded-2xl border border-[#1E2D4A] shadow-lg select-none">
      {pieces.map((piece) => {
        if (piece.placed) {
          return (
            <div
              key={piece.id}
              className="flex-1 h-28 sm:h-32 rounded-xl border border-dashed border-[#1E2D4A]/50 flex items-center justify-center opacity-30"
            >
              <span className="text-xs text-slate-500 font-mono">DONE</span>
            </div>
          );
        }

        // Check if piece can fit anywhere on the board
        const canFit = (() => {
          const h = piece.shape.length;
          const w = piece.shape[0].length;
          for (let r = 0; r <= 8 - h; r++) {
            for (let c = 0; c <= 8 - w; c++) {
              if (canPlacePiece(board, piece.shape, r, c)) {
                return true;
              }
            }
          }
          return false;
        })();

        const isSelected = selectedPieceId === piece.id;

        return (
          <div
            key={piece.id}
            onPointerDown={(e) => {
              if (canFit) {
                onDragStartPiece(piece, e);
              }
            }}
            onClick={() => {
              if (canFit) {
                onSelectPiece(piece);
              }
            }}
            className={`flex-1 h-28 sm:h-32 rounded-xl p-2 flex items-center justify-center cursor-grab active:cursor-grabbing transition-all touch-none relative ${
              isSelected
                ? 'bg-[#1C2B4B] border-2 border-amber-400 scale-105 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                : 'bg-[#141F38] border border-[#213052] hover:bg-[#182645] hover:border-slate-500'
            } ${!canFit ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
          >
            {/* Visual Mini Grid of the Piece */}
            <div
              className="grid gap-1 items-center justify-center transition-transform"
              style={{
                gridTemplateColumns: `repeat(${piece.shape[0].length}, minmax(0, 1fr))`,
              }}
            >
              {piece.shape.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  if (val === 0) {
                    return <div key={`${rIdx}-${cIdx}`} className="w-5 h-5 sm:w-6 sm:h-6" />;
                  }
                  return (
                    <BlockCell
                      key={`${rIdx}-${cIdx}`}
                      color={piece.color}
                      sizeClass="w-5 h-5 sm:w-6 sm:h-6"
                    />
                  );
                })
              )}
            </div>

            {/* Selection Hint Pill */}
            {isSelected && (
              <div className="absolute -top-2.5 px-2 py-0.5 bg-amber-400 text-slate-950 font-bold text-[9px] rounded-full shadow-xs uppercase tracking-wider">
                Ready to Drop
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
