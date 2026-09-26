import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * React Bits - TrueFocus
 * Futuristic cyber focus brackets gliding smoothly across target terms or words.
 */
export default function TrueFocus({
  sentence = 'GLOBAL INTELLIGENCE NETWORK',
  manualMode = false,
  blurAmount = 2,
  borderColor = '#06B6D4',
  glowColor = 'rgba(6, 182, 212, 0.45)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1.2,
  className = '',
}) {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (manualMode) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex ?? 0);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-2 select-none ${className}`}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => (wordRefs.current[index] = el)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className={`cursor-pointer transition-all duration-300 font-display font-bold text-sm tracking-wide ${
              isActive ? 'text-white' : 'text-slate-400 opacity-75'
            }`}
            style={{
              filter: isActive ? 'blur(0px)' : `blur(${blurAmount}px)`,
            }}
          >
            {word}
          </span>
        );
      })}

      {/* Cyber Reticle Bracket Box */}
      <motion.div
        className="absolute pointer-events-none -inset-1 border border-cyan-400/80 rounded-md"
        animate={{
          x: focusRect.x - 4,
          y: focusRect.y - 2,
          width: focusRect.width + 8,
          height: focusRect.height + 4,
        }}
        transition={{
          duration: animationDuration,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          boxShadow: `0 0 16px ${glowColor}, inset 0 0 8px ${glowColor}`,
          borderColor,
        }}
      >
        {/* Neon Corners */}
        <span className="absolute -top-[3px] -left-[3px] w-2 h-2 border-t-2 border-l-2 border-cyan-300" />
        <span className="absolute -top-[3px] -right-[3px] w-2 h-2 border-t-2 border-r-2 border-cyan-300" />
        <span className="absolute -bottom-[3px] -left-[3px] w-2 h-2 border-b-2 border-l-2 border-cyan-300" />
        <span className="absolute -bottom-[3px] -right-[3px] w-2 h-2 border-b-2 border-r-2 border-cyan-300" />
      </motion.div>
    </div>
  );
}
