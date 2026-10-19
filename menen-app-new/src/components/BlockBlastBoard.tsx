import React, { useRef } from 'react';
import { BlockColor, canPlacePiece, FloatingText, Piece } from '../types/blockBlast';
import { BlockCell } from './BlockCell';

interface BlockBlastBoardProps {
  board: (BlockColor | null)[][];
  activePiece: Piece | null;
  hoverPos: { row: number; col: number } | null;
  clearingCells: Set<string>; // set of "r,c" currently animating clear
  onCellClick: (row: number, col: number) => void;
  onCellHover: (row: number, col: number) => void;
  floatingTexts: FloatingText[];
  isShaking: boolean;
}

export const BlockBlastBoard: React.FC<BlockBlastBoardProps> = ({
  board,
  activePiece,
  hoverPos,
  clearingCells,
  onCellClick,
  onCellHover,
  floatingTexts,
  isShaking,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);

  // Check if active piece can be placed at hoverPos
  const isValidPlacement =
    activePiece && hoverPos
      ? canPlacePiece(board, activePiece.shape, hoverPos.row, hoverPos.col)
      : false;

  // Determine which rows & columns would be cleared if placed
  const previewClearedRows = new Set<number>();
  const previewClearedCols = new Set<number>();

  if (activePiece && hoverPos && isValidPlacement) {
    // Clone board and simulate placement
    const tempBoard = board.map((r) => [...r]);
    const shape = activePiece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[0].length; c++) {
        if (shape[r][c] === 1) {
          tempBoard[hoverPos.row + r][hoverPos.col + c] = activePiece.color;
        }
      }
    }

    // Check rows
    for (let r = 0; r < 8; r++) {
      if (tempBoard[r].every((cell) => cell !== null)) {
        previewClearedRows.add(r);
      }
    }
    // Check cols
    for (let c = 0; c < 8; c++) {
      let full = true;
      for (let r = 0; r < 8; r++) {
        if (tempBoard[r][c] === null) {
          full = false;
          break;
        }
      }
      if (full) {
        previewClearedCols.add(c);
      }
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-3 sm:p-5 select-none">
      {/* 8x8 Board Container with cosmic shadow and border */}
      <div
        ref={boardRef}
        className={`relative z-10 grid grid-cols-8 gap-1 sm:gap-1.5 p-2 sm:p-3 bg-[#0D1527] border-2 border-[#1E2D4A] rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-transform duration-100 ${
          isShaking ? 'animate-wiggle scale-98' : ''
        }`}
      >
        {board.map((row, r) =>
          row.map((cellColor, c) => {
            const cellKey = `${r},${c}`;
            const isClearing = clearingCells.has(cellKey);

            // Check if this cell is part of the ghost preview
            let isGhostCell = false;
            if (activePiece && hoverPos && isValidPlacement) {
              const relR = r - hoverPos.row;
              const relC = c - hoverPos.col;
              if (
                relR >= 0 &&
                relR < activePiece.shape.length &&
                relC >= 0 &&
                relC < activePiece.shape[0].length
              ) {
                if (activePiece.shape[relR][relC] === 1) {
                  isGhostCell = true;
                }
              }
            }

            const isLineClearHint =
              previewClearedRows.has(r) || previewClearedCols.has(c);

            return (
              <BlockCell
                key={cellKey}
                row={r}
                col={c}
                color={cellColor}
                isGhost={isGhostCell}
                ghostColor={activePiece?.color}
                isClearing={isClearing}
                isLineClearHint={isLineClearHint}
                onClick={() => onCellClick(r, c)}
                onMouseEnter={() => onCellHover(r, c)}
              />
            );
          })
        )}

        {/* Floating Blast & Combo Score Texts */}
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            className="absolute pointer-events-none z-30 flex flex-col items-center justify-center animate-out fade-out slide-out-to-top duration-1000 fill-mode-forwards"
            style={{
              left: `${ft.x}%`,
              top: `${ft.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span
              className="text-2xl sm:text-4xl font-black font-kid drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wide"
              style={{ color: ft.color }}
            >
              {ft.text}
            </span>
            {ft.subtext && (
              <span className="text-sm sm:text-lg font-extrabold text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] uppercase tracking-wider">
                {ft.subtext}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
