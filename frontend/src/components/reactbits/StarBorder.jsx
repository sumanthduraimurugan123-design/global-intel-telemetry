import React from 'react';
import { playUiSound } from '../../services/soundSystem';

/**
 * React Bits - StarBorder
 * Continuous luminous orbital gradient star border for high-priority commands & actions.
 */
export default function StarBorder({
  as: Component = 'button',
  className = '',
  color = '#EC4899', // Pink / Magenta default
  speed = '4s',
  children,
  onClick,
  ...props
}) {
  const handleClick = (e) => {
    playUiSound('click');
    if (onClick) onClick(e);
  };

  return (
    <Component
      onClick={handleClick}
      className={`relative inline-block py-[1px] px-[1px] overflow-hidden rounded-xl transition-transform active:scale-95 ${className}`}
      {...props}
    >
      {/* Rotating Star Glow Background */}
      <div
        className="absolute w-[300%] h-[300%] -top-[100%] -left-[100%] rounded-full opacity-70 pointer-events-none animate-star-spin"
        style={{
          background: `radial-gradient(circle, ${color} 10%, transparent 60%)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />

      {/* Second Counter-rotating Subtle Ambient Glow */}
      <div
        className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] rounded-full opacity-40 pointer-events-none animate-star-spin-reverse"
        style={{
          background: `radial-gradient(circle, #38BDF8 15%, transparent 70%)`,
          animationDuration: '6s',
        }}
        aria-hidden="true"
      />

      {/* Inner Content Container */}
      <div className="relative z-10 w-full h-full bg-slate-950/90 rounded-[11px] backdrop-blur-md">
        {children}
      </div>
    </Component>
  );
}
