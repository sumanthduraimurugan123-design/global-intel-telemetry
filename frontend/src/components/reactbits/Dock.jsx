import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { playUiSound } from '../../services/soundSystem';

/**
 * React Bits - Dock & DockItem
 * macOS-style interactive magnification dock bar with physics spring scaling and tooltips.
 */

export function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  tooltip,
  isActive = false,
  badge = null,
}) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current ? ref.current.getBoundingClientRect() : { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-140, 0, 140], [42, 60, 42]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 14 });

  const handleClick = (e) => {
    playUiSound('click');
    if (onClick) onClick(e);
  };

  const handleMouseEnter = () => {
    playUiSound('hover');
  };

  return (
    <div className="relative group flex flex-col items-center">
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute -top-9 px-2.5 py-1 rounded-md bg-slate-900/95 border border-purple-500/40 text-slate-100 text-[11px] font-mono whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform group-hover:-translate-y-1 z-50 backdrop-blur-md">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}

      {/* Dock Item Button */}
      <motion.button
        ref={ref}
        style={{ width, height: width }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={`relative flex items-center justify-center rounded-2xl border transition-colors shadow-lg ${
          isActive
            ? 'bg-gradient-to-tr from-purple-600 to-pink-600 border-pink-400/80 text-white shadow-pink-500/30 ring-2 ring-pink-500/40'
            : 'bg-slate-900/85 border-white/10 hover:border-purple-400/60 text-slate-300 hover:text-white shadow-black/40'
        } ${className}`}
      >
        {children}

        {/* Optional Notification Badge */}
        {badge !== null && badge !== undefined && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-md shadow-rose-500/40 border border-slate-900">
            {badge}
          </span>
        )}

        {/* Active Dot */}
        {isActive && (
          <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-pink-400 shadow-sm shadow-pink-400" />
        )}
      </motion.button>
    </div>
  );
}

export default function Dock({
  items = [],
  className = '',
  orientation = 'horizontal', // 'horizontal'
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`flex items-end gap-2.5 px-3 py-2 rounded-2xl bg-slate-950/75 border border-purple-500/30 backdrop-blur-2xl shadow-2xl shadow-black/80 transition-all ${className}`}
    >
      {items.map((item, idx) => (
        <DockItem
          key={item.id || idx}
          mouseX={mouseX}
          onClick={item.onClick}
          tooltip={item.tooltip}
          isActive={item.isActive}
          badge={item.badge}
          className={item.className}
        >
          {item.icon}
        </DockItem>
      ))}
    </motion.div>
  );
}
