import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * React Bits - RotatingText
 * Dynamic cycler that rotates through phrases with silky Framer Motion transitions.
 */
export default function RotatingText({
  texts = [],
  rotationInterval = 3200,
  transition = { type: 'spring', damping: 25, stiffness: 300 },
  className = '',
  itemClassName = '',
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!texts || texts.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, rotationInterval);
    return () => clearInterval(interval);
  }, [texts, rotationInterval]);

  if (!texts || texts.length === 0) return null;

  return (
    <span className={`inline-flex items-center overflow-hidden relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 18, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -18, opacity: 0, filter: 'blur(4px)' }}
          transition={transition}
          className={`inline-block ${itemClassName}`}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
