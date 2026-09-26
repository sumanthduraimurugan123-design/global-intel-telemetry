import React, { useRef, useState } from 'react';
import { playUiSound } from '../../services/soundSystem';

/**
 * React Bits - SpotlightCard
 * Mouse-tracking radial spotlight glow card with illuminated boundary & dynamic specular ambience.
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(168, 85, 247, 0.22)',
  borderColor = 'rgba(168, 85, 247, 0.45)',
  spotlightSize = 340,
  onClick,
  onMouseEnter,
  interactive = true,
  ...props
}) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: -500, y: -500 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = (e) => {
    if (!interactive) return;
    setOpacity(1);
    playUiSound('hover');
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setOpacity(0);
  };

  const handleClick = (e) => {
    if (onClick) {
      playUiSound('click');
      onClick(e);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative rounded-2xl border border-white/10 bg-slate-950/75 backdrop-blur-xl overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Outer Spotlight Border Lighting Layer */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${borderColor}, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Inner Radial Ambient Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(${spotlightSize * 1.2}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* Card Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
