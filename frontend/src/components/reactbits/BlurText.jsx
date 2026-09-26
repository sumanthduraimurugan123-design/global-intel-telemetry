import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * React Bits - BlurText
 * Premium text entrance animation with smooth blur and spring translation.
 */
export default function BlurText({
  text = '',
  delay = 50,
  className = '',
  animateBy = 'words', // 'words' | 'letters'
  direction = 'top', // 'top' | 'bottom'
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = 'easeOut',
  onAnimationComplete,
}) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom =
    direction === 'top'
      ? { filter: 'blur(10px)', opacity: 0, transform: 'translate3d(0,-20px,0)' }
      : { filter: 'blur(10px)', opacity: 0, transform: 'translate3d(0,20px,0)' };

  const defaultTo = [
    {
      filter: 'blur(4px)',
      opacity: 0.6,
      transform: direction === 'top' ? 'translate3d(0,4px,0)' : 'translate3d(0,-4px,0)',
    },
    { filter: 'blur(0px)', opacity: 1, transform: 'translate3d(0,0,0)' },
  ];

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          initial={animationFrom || defaultFrom}
          animate={inView ? (animationTo || defaultTo) : (animationFrom || defaultFrom)}
          transition={{
            duration: 0.5,
            delay: (index * delay) / 1000,
            ease: easing,
          }}
          onAnimationComplete={
            index === elements.length - 1 ? onAnimationComplete : undefined
          }
          className="inline-block will-change-[transform,filter,opacity]"
        >
          {segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </span>
  );
}
