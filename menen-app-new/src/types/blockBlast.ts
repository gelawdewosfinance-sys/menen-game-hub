export type BlockColor =
  | 'yellow'
  | 'orange'
  | 'red'
  | 'green'
  | 'blue'
  | 'cyan'
  | 'purple'
  | 'pink';

export interface Piece {
  id: string;
  shape: number[][]; // 2D matrix of 1s and 0s
  color: BlockColor;
  placed?: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  subtext?: string;
  x: number;
  y: number;
  color: string;
  scale?: number;
}

export interface BlastParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
}

export const BLOCK_COLORS: Record<
  BlockColor,
  {
    bg: string;
    borderLight: string;
    borderDark: string;
    gradient: string;
    glow: string;
    hex: string;
  }
> = {
  yellow: {
    bg: 'bg-amber-400',
    borderLight: 'border-t-amber-200 border-l-amber-200',
    borderDark: 'border-b-amber-600 border-r-amber-600',
    gradient: 'from-amber-300 via-amber-400 to-amber-500',
    glow: 'shadow-[0_0_12px_rgba(251,191,36,0.5)]',
    hex: '#FBBF24',
  },
  orange: {
    bg: 'bg-orange-500',
    borderLight: 'border-t-orange-300 border-l-orange-300',
    borderDark: 'border-b-orange-700 border-r-orange-700',
    gradient: 'from-orange-400 via-orange-500 to-orange-600',
    glow: 'shadow-[0_0_12px_rgba(249,115,22,0.5)]',
    hex: '#F97316',
  },
  red: {
    bg: 'bg-red-500',
    borderLight: 'border-t-red-300 border-l-red-300',
    borderDark: 'border-b-red-700 border-r-red-700',
    gradient: 'from-red-400 via-red-500 to-red-600',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]',
    hex: '#EF4444',
  },
  green: {
    bg: 'bg-emerald-500',
    borderLight: 'border-t-emerald-300 border-l-emerald-300',
    borderDark: 'border-b-emerald-700 border-r-emerald-700',
    gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    hex: '#10B981',
  },
  blue: {
    bg: 'bg-blue-500',
    borderLight: 'border-t-blue-300 border-l-blue-300',
    borderDark: 'border-b-blue-700 border-r-blue-700',
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.5)]',
    hex: '#3B82F6',
  },
  cyan: {
    bg: 'bg-cyan-400',
    borderLight: 'border-t-cyan-200 border-l-cyan-200',
    borderDark: 'border-b-cyan-600 border-r-cyan-600',
    gradient: 'from-cyan-300 via-cyan-400 to-cyan-500',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.5)]',
    hex: '#06B6D4',
  },
  purple: {
    bg: 'bg-purple-500',
    borderLight: 'border-t-purple-300 border-l-purple-300',
    borderDark: 'border-b-purple-700 border-r-purple-700',
    gradient: 'from-purple-400 via-purple-500 to-purple-600',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.5)]',
    hex: '#A855F7',
  },
  pink: {
    bg: 'bg-pink-500',
    borderLight: 'border-t-pink-300 border-l-pink-300',
    borderDark: 'border-b-pink-700 border-r-pink-700',
    gradient: 'from-pink-400 via-pink-500 to-pink-600',
    glow: 'shadow-[0_0_12px_rgba(236,72,153,0.5)]',
    hex: '#EC4899',
  },
};

// Complete catalog of Block Blast puzzle shapes
export const ALL_SHAPES: { shape: number[][]; defaultColor: BlockColor }[] = [
  // 1x1 dot
  { shape: [[1]], defaultColor: 'yellow' },

  // 1x2, 2x1 dominos
  { shape: [[1, 1]], defaultColor: 'cyan' },
  { shape: [[1], [1]], defaultColor: 'cyan' },

  // 1x3, 3x1 triominos
  { shape: [[1, 1, 1]], defaultColor: 'blue' },
  { shape: [[1], [1], [1]], defaultColor: 'blue' },

  // 1x4, 4x1 tetrominos
  { shape: [[1, 1, 1, 1]], defaultColor: 'green' },
  { shape: [[1], [1], [1], [1]], defaultColor: 'green' },

  // 1x5, 5x1 pentominos
  { shape: [[1, 1, 1, 1, 1]], defaultColor: 'purple' },
  { shape: [[1], [1], [1], [1], [1]], defaultColor: 'purple' },

  // 2x2 square
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    defaultColor: 'yellow',
  },

  // 3x3 big square
  {
    shape: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    defaultColor: 'orange',
  },

  // Small Corner 2x2 (4 rotations)
  {
    shape: [
      [1, 1],
      [1, 0],
    ],
    defaultColor: 'orange',
  },
  {
    shape: [
      [1, 1],
      [0, 1],
    ],
    defaultColor: 'orange',
  },
  {
    shape: [
      [1, 0],
      [1, 1],
    ],
    defaultColor: 'orange',
  },
  {
    shape: [
      [0, 1],
      [1, 1],
    ],
    defaultColor: 'orange',
  },

  // Big Corner L 3x3 (4 rotations)
  {
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    defaultColor: 'purple',
  },
  {
    shape: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
    defaultColor: 'purple',
  },
  {
    shape: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    defaultColor: 'purple',
  },
  {
    shape: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
    defaultColor: 'purple',
  },

  // L-shapes 3x2 (4 rotations)
  {
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    defaultColor: 'red',
  },
  {
    shape: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    defaultColor: 'red',
  },
  {
    shape: [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
    defaultColor: 'red',
  },
  {
    shape: [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
    defaultColor: 'red',
  },

  // L-shapes 2x3 (4 rotations)
  {
    shape: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    defaultColor: 'pink',
  },
  {
    shape: [
      [1, 1, 1],
      [0, 0, 1],
    ],
    defaultColor: 'pink',
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    defaultColor: 'pink',
  },
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    defaultColor: 'pink',
  },

  // T-shapes
  {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    defaultColor: 'green',
  },
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    defaultColor: 'green',
  },
  {
    shape: [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    defaultColor: 'green',
  },
  {
    shape: [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
    defaultColor: 'green',
  },

  // Plus / Cross shape
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    defaultColor: 'yellow',
  },

  // Z / S shapes
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    defaultColor: 'cyan',
  },
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    defaultColor: 'cyan',
  },
  {
    shape: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    defaultColor: 'cyan',
  },
  {
    shape: [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    defaultColor: 'cyan',
  },
];

/** Generate a balanced set of 3 random pieces */
export function generateThreePieces(): Piece[] {
  const pieces: Piece[] = [];
  const colors: BlockColor[] = [
    'yellow',
    'orange',
    'red',
    'green',
    'blue',
    'cyan',
    'purple',
    'pink',
  ];

  for (let i = 0; i < 3; i++) {
    const randomTemplate = ALL_SHAPES[Math.floor(Math.random() * ALL_SHAPES.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    pieces.push({
      id: `p_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
      shape: randomTemplate.shape,
      color: color,
      placed: false,
    });
  }

  return pieces;
}

/** Check if a piece can fit at grid position (row, col) */
export function canPlacePiece(
  board: (BlockColor | null)[][],
  shape: number[][],
  row: number,
  col: number
): boolean {
  const shapeH = shape.length;
  const shapeW = shape[0].length;

  if (row < 0 || col < 0 || row + shapeH > 8 || col + shapeW > 8) {
    return false;
  }

  for (let r = 0; r < shapeH; r++) {
    for (let c = 0; c < shapeW; c++) {
      if (shape[r][c] === 1) {
        if (board[row + r][col + c] !== null) {
          return false;
        }
      }
    }
  }

  return true;
}

/** Check if any of the given pieces can fit anywhere on the 8x8 board */
export function canAnyPieceBePlaced(
  board: (BlockColor | null)[][],
  pieces: Piece[]
): boolean {
  const unplaced = pieces.filter((p) => !p.placed);
  if (unplaced.length === 0) return true;

  for (const piece of unplaced) {
    const shapeH = piece.shape.length;
    const shapeW = piece.shape[0].length;

    for (let r = 0; r <= 8 - shapeH; r++) {
      for (let c = 0; c <= 8 - shapeW; c++) {
        if (canPlacePiece(board, piece.shape, r, c)) {
          return true;
        }
      }
    }
  }

  return false;
}
