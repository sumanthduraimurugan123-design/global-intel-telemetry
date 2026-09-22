import React, { useRef, useState } from 'react';
import { playUiSound } from '../services/soundSystem';

/**
 * Spatial 3D Tilt Card with dynamic specular glare & tactile interaction
 */
export default function TiltCard({
  children,
  className = '',
  glowVariant = 'purple', // 'purple' | 'economy' | 'risk' | 'growth' | 'none'
  maxTilt = 7, // Max tilt angle in degrees
  onClick,
  onHover,
  interactive = true,
  ...props
}) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(`perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px) scale3d(1.008, 1.008, 1.008)`);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.14
    });
  };

  const handleMouseEnter = () => {
    if (interactive) {
      playUiSound('hover');
      if (onHover) onHover();
    }
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setTransform('perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)');
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleClick = (e) => {
    if (onClick) {
      playUiSound('click');
      onClick(e);
    }
  };

  // Determine ambient lighting glow class
  let glowClass = '';
  if (glowVariant === 'economy') glowClass = 'ambient-glow-economy';
  else if (glowVariant === 'risk') glowClass = 'ambient-glow-risk';
  else if (glowVariant === 'growth') glowClass = 'ambient-glow-growth';
  else if (glowVariant === 'purple') glowClass = 'ambient-glow-purple';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: transform || undefined,
        transition: transform ? 'transform 0.1s ease-out, box-shadow 0.25s ease' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        transformStyle: 'preserve-3d'
      }}
      className={`glass-card-luxe relative rounded-xl overflow-hidden will-change-transform ${glowClass} ${className}`}
      {...props}
    >
      {/* Dynamic Specular Glare Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Card Content Container */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
