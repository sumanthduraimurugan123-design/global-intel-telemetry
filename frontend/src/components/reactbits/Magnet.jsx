import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * React Bits - Magnet
 * Physics-based interactive magnetic pull towards cursor within proximity radius.
 */
export default function Magnet({
  children,
  padding = 45,
  disabled = false,
  magnetStrength = 0.28,
  activeTransition = { type: 'spring', damping: 15, stiffness: 180, mass: 0.1 },
  inactiveTransition = { type: 'spring', damping: 12, stiffness: 220 },
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const dist = Math.hypot(clientX - centerX, clientY - centerY);
    const maxDist = Math.max(width, height) / 2 + padding;

    if (dist < maxDist) {
      setIsHovered(true);
      setPosition({
        x: (clientX - centerX) * magnetStrength,
        y: (clientY - centerY) * magnetStrength,
      });
    } else {
      setIsHovered(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={isHovered ? activeTransition : inactiveTransition}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
