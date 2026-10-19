import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BlockColor,
  canAnyPieceBePlaced,
  canPlacePiece,
  FloatingText,
  generateThreePieces,
  Piece,
} from './types/blockBlast';
import { sound } from './utils/audio';
import { BlockBlastHeader } from './components/BlockBlastHeader';
import { BlockBlastBoard } from './components/BlockBlastBoard';
import { BlockCell } from './components/BlockCell';
import { PieceDock } from './components/PieceDock';
import { GameOverModal } from './components/GameOverModal';
import { BlockBlastHelpModal } from './components/BlockBlastHelpModal';

export default function App() {
  // 8x8 Board state (null = empty slot)
  const [board, setBoard] = useState<(BlockColor | null)[][]>(() =>
    Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null))
  );

  // Available hand of 3 pieces
  const [pieces, setPieces] = useState<Piece[]>(() => generateThreePieces());

  // Interaction State (Tap or Drag)
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [hoverPos, setHoverPos] = useState<{ row: number; col: number } | null>(null);
  const [draggingPiece, setDraggingPiece] = useState<Piece | null>(null);
  const [dragPointerPos, setDragPointerPos] = useState<{ x: number; y: number } | null>(null);

  // Scores
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('menen_best_score');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Streaks & Stats
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [totalLinesCleared, setTotalLinesCleared] = useState<number>(0);

  // Visual Effects
  const [clearingCells, setClearingCells] = useState<Set<string>>(new Set());
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Game Lifecycle Modals
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Check Game Over condition whenever pieces or board change
  const checkGameOver = useCallback(
    (currentBoard: (BlockColor | null)[][], currentPieces: Piece[]) => {
      const canMove = canAnyPieceBePlaced(currentBoard, currentPieces);
      if (!canMove) {
        sound.playGameOver();
        setIsGameOver(true);
      }
    },
    []
  );

  // Reset Game
  const handleRestart = () => {
    setBoard(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null)));
    const newPieces = generateThreePieces();
    setPieces(newPieces);
    setSelectedPiece(null);
    setHoverPos(null);
    setDraggingPiece(null);
    setDragPointerPos(null);
    setScore(0);
    setComboStreak(0);
    setClearingCells(new Set());
    setFloatingTexts([]);
    setIsGameOver(false);
    setIsNewBest(false);
  };

  // Place a piece onto the grid at (row, col)
  const placePieceAt = (piece: Piece, row: number, col: number) => {
    if (!canPlacePiece(board, piece.shape, row, col)) {
      sound.playPickup();
      return false;
    }

    // Play placement thud
    sound.playPlace();

    // 1. Copy board & apply new block
    const newBoard = board.map((r) => [...r]);
    let cellsPlaced = 0;

    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[0].length; c++) {
        if (piece.shape[r][c] === 1) {
          newBoard[row + r][col + c] = piece.color;
          cellsPlaced++;
        }
      }
    }

    // Mark piece as placed
    const updatedPieces = pieces.map((p) => (p.id === piece.id ? { ...p, placed: true } : p));

    // Calculate lines to clear (both rows and columns)
    const fullRows: number[] = [];
    const fullCols: number[] = [];

    for (let r = 0; r < 8; r++) {
      if (newBoard[r].every((cell) => cell !== null)) {
        fullRows.push(r);
      }
    }

    for (let c = 0; c < 8; c++) {
      let isFull = true;
      for (let r = 0; r < 8; r++) {
        if (newBoard[r][c] === null) {
          isFull = false;
          break;
        }
      }
      if (isFull) {
        fullCols.push(c);
      }
    }

    const linesCount = fullRows.length + fullCols.length;
    let turnPoints = cellsPlaced * 10;

    if (linesCount > 0) {
      // Line Clear Blast!
      const newStreak = comboStreak + 1;
      setComboStreak(newStreak);
      setMaxCombo((prev) => Math.max(prev, newStreak));
      setTotalLinesCleared((prev) => prev + linesCount);

      // Score formula
      // 1 line = 100, 2 lines = 300, 3 lines = 600, 4 lines = 1080 (matching the reference!)
      let baseLineScore = 100;
      if (linesCount === 2) baseLineScore = 300;
      else if (linesCount === 3) baseLineScore = 600;
      else if (linesCount >= 4) baseLineScore = 1080;

      const comboBonus = (newStreak - 1) * 150;
      turnPoints += baseLineScore + comboBonus;

      // Collect all cleared cell coordinates
      const cellsToClear = new Set<string>();
      fullRows.forEach((r) => {
        for (let c = 0; c < 8; c++) cellsToClear.add(`${r},${c}`);
      });
      fullCols.forEach((c) => {
        for (let r = 0; r < 8; r++) cellsToClear.add(`${r},${c}`);
      });

      setClearingCells(cellsToClear);

      // Trigger Screen Shake on multiple lines
      if (linesCount >= 2) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
      }

      // Audio feedback
      sound.playLineClear(linesCount, newStreak);
      if (linesCount >= 3 || newStreak >= 3) {
        setTimeout(() => sound.playMegaBlast(), 100);
      }

      // Spawn floating score text ("+1080 Amazing!" or "Combo x3!")
      let textTitle = `+${baseLineScore + comboBonus}`;
      let textSub = 'Nice!';
      let textColor = '#FBBF24';

      if (linesCount >= 4 || baseLineScore >= 1080) {
        textSub = 'Amazing!';
        textColor = '#EC4899';
      } else if (linesCount === 3) {
        textSub = 'Awesome!';
        textColor = '#38BDF8';
      } else if (linesCount === 2) {
        textSub = 'Great!';
        textColor = '#34D399';
      }

      if (newStreak >= 2) {
        textSub = `Combo x${newStreak}!`;
      }

      const floatingId = `ft_${Date.now()}`;
      setFloatingTexts((prev) => [
        ...prev,
        {
          id: floatingId,
          text: textTitle,
          subtext: textSub,
          x: 50,
          y: 45,
          color: textColor,
        },
      ]);

      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((f) => f.id !== floatingId));
      }, 1100);

      // Clear the rows & columns from board after brief blast animation
      setTimeout(() => {
        setBoard((prevBoard) => {
          const clearedBoard = prevBoard.map((rowArr, rIdx) =>
            rowArr.map((cell, cIdx) => {
              if (fullRows.includes(rIdx) || fullCols.includes(cIdx)) {
                return null;
              }
              return cell;
            })
          );
          return clearedBoard;
        });
        setClearingCells(new Set());
      }, 250);
    } else {
      // No lines cleared this turn -> reset combo streak
      setComboStreak(0);
      setBoard(newBoard);
    }

    // Update score
    const nextScore = score + turnPoints;
    setScore(nextScore);
    if (nextScore > bestScore) {
      setBestScore(nextScore);
      setIsNewBest(true);
      try {
        localStorage.setItem('menen_best_score', String(nextScore));
      } catch {
        // ignore
      }
    }

    // Check if all 3 pieces have been placed
    const remainingUnplaced = updatedPieces.filter((p) => !p.placed);
    if (remainingUnplaced.length === 0) {
      const freshPieces = generateThreePieces();
      setPieces(freshPieces);
      checkGameOver(newBoard, freshPieces);
    } else {
      setPieces(updatedPieces);
      checkGameOver(newBoard, updatedPieces);
    }

    // Reset interaction selections
    setSelectedPiece(null);
    setHoverPos(null);
    setDraggingPiece(null);
    setDragPointerPos(null);

    return true;
  };

  // Cell Click (when a piece is selected via tap)
  const handleCellClick = (row: number, col: number) => {
    const active = draggingPiece || selectedPiece;
    if (!active) return;
    placePieceAt(active, row, col);
  };

  // Cell Hover (updates ghost preview)
  const handleCellHover = (row: number, col: number) => {
    const active = draggingPiece || selectedPiece;
    if (!active) return;
    setHoverPos({ row, col });
  };

  // Drag start from piece dock
  const handleDragStartPiece = (piece: Piece, e: React.PointerEvent) => {
    setSelectedPiece(piece);
    setDraggingPiece(piece);
    setDragPointerPos({ x: e.clientX, y: e.clientY });
    sound.playPickup();
  };

  // Global Pointer Move & Up listeners for Drag & Drop
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingPiece) return;
      setDragPointerPos({ x: e.clientX, y: e.clientY });

      // Identify element underneath pointer
      const elem = document.elementFromPoint(e.clientX, e.clientY);
      if (elem) {
        // Check if hovering over a cell or board
        const cellElem = elem.closest('[data-cell]');
        if (cellElem) {
          const r = parseInt(cellElem.getAttribute('data-r') || '-1', 10);
          const c = parseInt(cellElem.getAttribute('data-c') || '-1', 10);
          if (r >= 0 && c >= 0) {
            setHoverPos({ row: r, col: c });
          }
        }
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (draggingPiece) {
        if (hoverPos) {
          placePieceAt(draggingPiece, hoverPos.row, hoverPos.col);
        } else {
          // Identify if dropped over board
          const elem = document.elementFromPoint(e.clientX, e.clientY);
          const cellElem = elem?.closest('[data-cell]');
          if (cellElem) {
            const r = parseInt(cellElem.getAttribute('data-r') || '-1', 10);
            const c = parseInt(cellElem.getAttribute('data-c') || '-1', 10);
            if (r >= 0 && c >= 0) {
              placePieceAt(draggingPiece, r, c);
            }
          }
        }
        setDraggingPiece(null);
        setDragPointerPos(null);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingPiece, hoverPos, board, pieces, score, bestScore, comboStreak]);

  const activePieceForPreview = draggingPiece || selectedPiece;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#070D1A] text-white flex flex-col items-center justify-between p-2 sm:p-4 font-sans select-none overflow-x-hidden relative"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 20%, #15223D 0%, #070D1A 75%)`,
      }}
    >
      {/* Top HUD with Scores, Crown, and Controls */}
      <BlockBlastHeader
        score={score}
        bestScore={bestScore}
        comboStreak={comboStreak}
        onRestart={handleRestart}
        onOpenHelp={() => setHelpOpen(true)}
      />

      {/* Main Playing Field */}
      <main className="w-full flex-1 flex flex-col items-center justify-center my-auto">
        <BlockBlastBoard
          board={board}
          activePiece={activePieceForPreview}
          hoverPos={hoverPos}
          clearingCells={clearingCells}
          onCellClick={handleCellClick}
          onCellHover={handleCellHover}
          floatingTexts={floatingTexts}
          isShaking={isShaking}
        />
      </main>

      {/* Bottom Piece Hand Dock */}
      <footer className="w-full pb-2">
        <PieceDock
          pieces={pieces}
          selectedPieceId={selectedPiece?.id || null}
          onSelectPiece={(piece) => {
            sound.playPickup();
            setSelectedPiece(selectedPiece?.id === piece.id ? null : piece);
          }}
          onDragStartPiece={handleDragStartPiece}
          board={board}
        />
      </footer>

      {/* Dragging Piece Floating Overlay */}
      {draggingPiece && dragPointerPos && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 opacity-95 scale-105 filter drop-shadow-2xl"
          style={{
            left: `${dragPointerPos.x}px`,
            top: `${dragPointerPos.y - 50}px`,
          }}
        >
          <div
            className="grid gap-1 items-center justify-center"
            style={{
              gridTemplateColumns: `repeat(${draggingPiece.shape[0].length}, minmax(0, 1fr))`,
            }}
          >
            {draggingPiece.shape.map((row, r) =>
              row.map((val, c) => {
                if (val === 0) return <div key={`${r}-${c}`} className="w-8 h-8 sm:w-10 sm:h-10" />;
                return (
                  <BlockCell
                    key={`${r}-${c}`}
                    color={draggingPiece.color}
                    sizeClass="w-8 h-8 sm:w-10 sm:h-10"
                  />
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <GameOverModal
          score={score}
          bestScore={bestScore}
          isNewBest={isNewBest}
          totalLinesCleared={totalLinesCleared}
          maxCombo={maxCombo}
          onPlayAgain={handleRestart}
        />
      )}

      {/* Help / Rules Modal */}
      {helpOpen && <BlockBlastHelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  );
}
