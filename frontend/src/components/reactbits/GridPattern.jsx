import React, { useId } from 'react';

/**
 * React Bits - GridPattern
 * Futuristic cyber matrix grid pattern with glowing accents & subtle gradient fades.
 */
export default function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = '0',
  className = '',
  squares = [],
  ...props
}) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full stroke-purple-500/10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] ${className}`}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares.length > 0 && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sqX, sqY], idx) => (
            <rect
              strokeWidth="0"
              key={`${sqX}-${sqY}-${idx}`}
              width={width - 1}
              height={height - 1}
              x={sqX * width + 1}
              y={sqY * height + 1}
              fill="rgba(168, 85, 247, 0.08)"
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
