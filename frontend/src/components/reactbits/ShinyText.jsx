import React from 'react';

/**
 * React Bits - ShinyText
 * Metallic light sheen sweeping across high-priority badges & titles.
 */
export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
  shimmerWidth = 100,
  children
}) {
  const content = text || children;

  return (
    <span
      className={`inline-block relative overflow-hidden bg-clip-text text-transparent font-medium ${
        disabled ? 'text-slate-400' : ''
      } ${className}`}
      style={{
        backgroundImage: disabled
          ? 'none'
          : `linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0) 70%)`,
        backgroundSize: `${shimmerWidth * 2}% 100%`,
        animation: disabled ? 'none' : `shinyBadge ${speed}s ease-in-out infinite`,
        WebkitBackgroundClip: 'text',
      }}
    >
      {content}
    </span>
  );
}
