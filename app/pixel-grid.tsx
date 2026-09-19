// Red-themed pixel grid SVG — shape inspired by a chunky pixel-art blob
// with stepped edges, interior cell grid, and bottom "teeth"

const CELL = 20; // px per cell
const GAP = 1;   // gap between cells

// 1 = filled cell, 0 = empty
// 24 columns × 16 rows
const GRID: number[][] = [
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0],
  [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0],
];

const COLS = GRID[0].length;
const ROWS = GRID.length;

const W = COLS * (CELL + GAP) + GAP;
const H = ROWS * (CELL + GAP) + GAP;

export default function PixelGrid({ size = 1 }: { size?: number }) {
  const w = W * size;
  const h = H * size;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={w}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        {/* Dark red overall background glow */}
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#3d0000" />
          <stop offset="100%" stopColor="#0d0000" />
        </radialGradient>

        {/* Cell fill gradient — each cell has a subtle vertical lift */}
        <linearGradient id="cellGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c0241a" />
          <stop offset="100%" stopColor="#7a0f0a" />
        </linearGradient>

        {/* Glow filter for the whole shape */}
        <filter id="outerGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Subtle inner glow per cell */}
        <filter id="cellGlow" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="0.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Clip to the filled shape for background */}
        <clipPath id="shapeClip">
          {GRID.map((row, ri) =>
            row.map((cell, ci) =>
              cell === 1 ? (
                <rect
                  key={`clip-${ri}-${ci}`}
                  x={ci * (CELL + GAP) + GAP}
                  y={ri * (CELL + GAP) + GAP}
                  width={CELL}
                  height={CELL}
                />
              ) : null
            )
          )}
        </clipPath>
      </defs>

      {/* Background for filled region */}
      <rect width={W} height={H} fill="url(#bgGlow)" clipPath="url(#shapeClip)" />

      {/* Cells */}
      <g filter="url(#outerGlow)">
        {GRID.map((row, ri) =>
          row.map((cell, ci) => {
            if (!cell) return null;
            const x = ci * (CELL + GAP) + GAP;
            const y = ri * (CELL + GAP) + GAP;

            // Edge detection for border highlight
            const topEmpty    = ri === 0 || GRID[ri - 1][ci] === 0;
            const leftEmpty   = ci === 0 || GRID[ri][ci - 1] === 0;
            const rightEmpty  = ci === COLS - 1 || GRID[ri][ci + 1] === 0;
            const bottomEmpty = ri === ROWS - 1 || GRID[ri + 1][ci] === 0;

            const isEdge = topEmpty || leftEmpty || rightEmpty || bottomEmpty;

            return (
              <g key={`${ri}-${ci}`}>
                {/* Cell body */}
                <rect
                  x={x} y={y}
                  width={CELL} height={CELL}
                  fill={isEdge ? 'url(#cellGrad)' : '#8b1310'}
                  rx={isEdge ? 1 : 0}
                />

                {/* Top highlight stripe on edge cells */}
                {topEmpty && (
                  <rect
                    x={x} y={y}
                    width={CELL} height={2}
                    fill="#e8453a"
                    opacity={0.6}
                  />
                )}

                {/* Left highlight */}
                {leftEmpty && (
                  <rect
                    x={x} y={y}
                    width={2} height={CELL}
                    fill="#e8453a"
                    opacity={0.35}
                  />
                )}

                {/* Bottom shadow on edge cells */}
                {bottomEmpty && (
                  <rect
                    x={x} y={y + CELL - 2}
                    width={CELL} height={2}
                    fill="#3a0500"
                    opacity={0.8}
                  />
                )}

                {/* Subtle grid line overlay for inner cells */}
                {!isEdge && (
                  <rect
                    x={x} y={y}
                    width={CELL} height={CELL}
                    fill="none"
                    stroke="#c0241a"
                    strokeWidth={0.3}
                    opacity={0.3}
                  />
                )}
              </g>
            );
          })
        )}
      </g>

      {/* Scanline overlay for retro depth */}
      {Array.from({ length: Math.ceil(H / 4) }).map((_, i) => (
        <line
          key={i}
          x1={0} y1={i * 4 + 2}
          x2={W} y2={i * 4 + 2}
          stroke="#000"
          strokeWidth={0.5}
          opacity={0.12}
        />
      ))}

      {/* Outer edge glow path */}
      <rect
        width={W} height={H}
        fill="none"
        stroke="#ff2020"
        strokeWidth={1}
        opacity={0.05}
        clipPath="url(#shapeClip)"
      />
    </svg>
  );
}
