import React, { useEffect, useRef, useState } from 'react';

/**
 * React Bits - CountUp
 * Smooth spring-interpolated numerical counter with prefix, suffix & easeOutExpo physics.
 */
export default function CountUp({
  to = 0,
  from = 0,
  duration = 1.2,
  separator = ',',
  decimals = 0,
  decimal = '.',
  prefix = '',
  suffix = '',
  className = '',
  onEnd,
}) {
  const [value, setValue] = useState(from);
  const ref = useRef(null);
  const startRef = useRef(null);
  const targetVal = typeof to === 'number' ? to : parseFloat(to) || 0;

  useEffect(() => {
    let animationFrame;
    const startVal = value;
    const durationMs = duration * 1000;
    startRef.current = null;

    const easeOutExpo = (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));

    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutExpo(progress);

      const current = startVal + (targetVal - startVal) * eased;
      setValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setValue(targetVal);
        if (onEnd) onEnd();
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [to, duration]);

  const formatted = (() => {
    const fixed = value.toFixed(decimals);
    const [intPart, decPart] = fixed.split('.');
    const withSeparator = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return decPart ? `${withSeparator}${decimal}${decPart}` : withSeparator;
  })();

  return (
    <span ref={ref} className={`tabular-nums inline-block ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
