import React, { useEffect, useState, useRef } from 'react';

/**
 * Animated rolling number counter for high-tech telemetry metrics
 */
export default function AnimatedCounter({ 
  value = 0, 
  duration = 900, 
  prefix = '', 
  suffix = '', 
  className = '' 
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const startValRef = useRef(0);
  const startTimeRef = useRef(null);
  const targetVal = typeof value === 'number' ? value : parseInt(value, 10) || 0;

  useEffect(() => {
    startValRef.current = displayValue;
    startTimeRef.current = null;
    let animationFrame;

    const easeOutExpo = (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));

    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const current = Math.round(
        startValRef.current + (targetVal - startValRef.current) * easedProgress
      );
      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetVal, duration]);

  return (
    <span className={`tabular-nums inline-block transition-colors ${className}`}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}
