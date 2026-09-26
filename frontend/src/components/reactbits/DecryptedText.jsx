import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * React Bits - DecryptedText
 * High-tech scrambled text reveal animation with sequential or random glyph resolution.
 */
export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 12,
  sequential = true,
  revealDirection = 'start', // 'start' | 'end' | 'center'
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+0123456789',
  className = '',
  parentClassName = '',
  encryptedClassName = 'text-cyan-400 font-mono opacity-80',
  animateOn = 'hover', // 'hover' | 'view'
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const intervalRef = useRef(null);

  const getNextIndex = (revealedSet) => {
    const textLength = text.length;
    switch (revealDirection) {
      case 'start':
        return revealedSet.size;
      case 'end':
        return textLength - 1 - revealedSet.size;
      case 'center': {
        const middle = Math.floor(textLength / 2);
        const offset = Math.floor(revealedSet.size / 2);
        const nextIndex =
          revealedSet.size % 2 === 0
            ? middle + offset
            : middle - offset - 1;

        if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
          return nextIndex;
        }
        for (let i = 0; i < textLength; i++) {
          if (!revealedSet.has(i)) return i;
        }
        return 0;
      }
      default:
        return revealedSet.size;
    }
  };

  const getRandomChar = (origChar) => {
    if (useOriginalCharsOnly) {
      const positions = Array.from(text).filter(c => c !== ' ');
      return positions[Math.floor(Math.random() * positions.length)] || origChar;
    }
    return characters[Math.floor(Math.random() * characters.length)];
  };

  const startScrambling = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    setRevealedIndices(new Set());

    let currentIteration = 0;

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRevealedIndices((prevRevealed) => {
        if (sequential) {
          if (prevRevealed.size < text.length) {
            const nextIdx = getNextIndex(prevRevealed);
            const nextSet = new Set(prevRevealed);
            nextSet.add(nextIdx);
            setDisplayText(
              text
                .split('')
                .map((char, i) => {
                  if (char === ' ') return ' ';
                  if (nextSet.has(i)) return char;
                  return getRandomChar(char);
                })
                .join('')
            );
            return nextSet;
          } else {
            clearInterval(intervalRef.current);
            setIsScrambling(false);
            setDisplayText(text);
            return prevRevealed;
          }
        } else {
          setDisplayText(
            text
              .split('')
              .map((char, i) => {
                if (char === ' ') return ' ';
                if (prevRevealed.has(i)) return char;
                if (currentIteration >= maxIterations) return char;
                return getRandomChar(char);
              })
              .join('')
          );

          currentIteration++;
          if (currentIteration > maxIterations) {
            clearInterval(intervalRef.current);
            setIsScrambling(false);
            setDisplayText(text);
          }
          return prevRevealed;
        }
      });
    }, speed);
  };

  useEffect(() => {
    setDisplayText(text);
    if (animateOn === 'view') {
      startScrambling();
    }
    return () => clearInterval(intervalRef.current);
  }, [text, animateOn]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (animateOn === 'hover') {
      startScrambling();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <motion.span
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealed =
            revealedIndices.has(index) || !isScrambling || char === ' ';
          return (
            <span
              key={index}
              className={isRevealed ? className : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
