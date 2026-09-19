// Red-themed pixel grid SVG — shape inspired by a chunky pixel-art blob
// with stepped edges, interior cell grid, and bottom "teeth"
// Red is now confined to the outline (edge cells); interior cells are neutral.

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
        {/* Neutral dark background for the interior — no red here now */}
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </radialGradient>

        {/* Red gradient kept only for edge (outline) cells */}
        <linearGradient id="cellGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c0241a" />
          <stop offset="100%" stopColor="#7a0f0a" />
        </linearGradient>

        {/* Glow filter for the whole shape (keeps the outline glowing red) */}
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

      {/* Background for filled region — neutral, not red */}
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
                {/* Cell body — neutral gray everywhere, no red fill */}
                <rect
                  x={x} y={y}
                  width={CELL} height={CELL}
                  fill="#2e2e2e"
                />

                {/* Border stripes — red, thicker, on every outward-facing side */}
                {topEmpty && (
                  <rect
                    x={x} y={y}
                    width={CELL} height={3}
                    fill="#e8453a"
                  />
                )}
                {leftEmpty && (
                  <rect
                    x={x} y={y}
                    width={3} height={CELL}
                    fill="#e8453a"
                  />
                )}
                {rightEmpty && (
                  <rect
                    x={x + CELL - 3} y={y}
                    width={3} height={CELL}
                    fill="#e8453a"
                  />
                )}
                {bottomEmpty && (
                  <rect
                    x={x} y={y + CELL - 3}
                    width={CELL} height={3}
                    fill="#e8453a"
                  />
                )}

                {/* Grid line overlay for inner cells — neutral gray, not red */}
                {!isEdge && (
                  <rect
                    x={x} y={y}
                    width={CELL} height={CELL}
                    fill="none"
                    stroke="#4a4a4a"
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

      {/* Outer edge glow path — red, kept as the outline accent */}
      <rect
        width={W} height={H}
        fill="none"
        stroke="#ff2020"
        strokeWidth={2}
        opacity={0.08}
        clipPath="url(#shapeClip)"
      />
    </svg>
  );
}
