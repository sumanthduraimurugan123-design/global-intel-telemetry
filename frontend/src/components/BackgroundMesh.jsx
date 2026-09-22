import React, { useEffect, useRef } from 'react';

/**
 * Spatial Ambient Background Mesh
 * Features:
 * - Animated particle constellation & grid nodes
 * - Smooth cursor-tracking parallax
 * - Time-of-day color temperature shifts
 * - Critical alert pulse aura
 * - Topic-aware ambient lighting
 */
export default function BackgroundMesh({ 
  activeTopic = 'all', 
  hasCriticalAlert = false 
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseRef.current.targetX = (clientX / width - 0.5) * 40;
      mouseRef.current.targetY = (clientY / height - 0.5) * 40;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Node count scaled to screen width
    const nodeCount = Math.min(Math.floor((width * height) / 28000), 55);
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.35 + 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulseOffset: Math.random() * Math.PI * 2
    }));

    let tick = 0;

    // Determine time of day palette
    const hour = new Date().getHours();
    const isNight = hour >= 21 || hour < 6;
    const isDusk = hour >= 17 && hour < 21;

    const render = () => {
      tick += 0.015;

      // Mouse smoothing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Context-Aware Ambient Radial Orbs
      let primaryHue = 265; // default purple
      let secondaryHue = 195; // default cyan

      if (hasCriticalAlert) {
        primaryHue = 350; // Rose/Red warning
        secondaryHue = 25; // Amber
      } else if (activeTopic === 'Economy') {
        primaryHue = 205; // Cool sapphire
        secondaryHue = 175; // Aqua
      } else if (activeTopic === 'Defense' || activeTopic === 'Geopolitics') {
        primaryHue = 280; // Deep amethyst
        secondaryHue = 345; // Crimson accent
      } else if (activeTopic === 'Cyber' || activeTopic === 'Energy') {
        primaryHue = 160; // Cyber Emerald
        secondaryHue = 200; // Cyan
      }

      // Base background gradient reflecting time-of-day
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isNight) {
        bgGrad.addColorStop(0, '#02050e');
        bgGrad.addColorStop(0.6, '#04091a');
        bgGrad.addColorStop(1, '#02040a');
      } else if (isDusk) {
        bgGrad.addColorStop(0, '#080514');
        bgGrad.addColorStop(0.6, '#0b081e');
        bgGrad.addColorStop(1, '#03030c');
      } else {
        bgGrad.addColorStop(0, '#03081a');
        bgGrad.addColorStop(0.6, '#06102a');
        bgGrad.addColorStop(1, '#020612');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient Glowing Orb 1 (Top Left, Parallax)
      const orb1X = width * 0.25 - mouseRef.current.x * 1.5;
      const orb1Y = height * 0.2 - mouseRef.current.y * 1.5;
      const orb1Grad = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, width * 0.45);
      const orb1Alpha = hasCriticalAlert ? 0.16 : 0.12;
      orb1Grad.addColorStop(0, `hsla(${primaryHue}, 85%, 60%, ${orb1Alpha})`);
      orb1Grad.addColorStop(1, 'transparent');
      ctx.fillStyle = orb1Grad;
      ctx.fillRect(0, 0, width, height);

      // Ambient Glowing Orb 2 (Bottom Right, Parallax)
      const orb2X = width * 0.75 + mouseRef.current.x * 1.2;
      const orb2Y = height * 0.7 + mouseRef.current.y * 1.2;
      const orb2Grad = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, width * 0.4);
      orb2Grad.addColorStop(0, `hsla(${secondaryHue}, 90%, 55%, 0.08)`);
      orb2Grad.addColorStop(1, 'transparent');
      ctx.fillStyle = orb2Grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle Geometric Grid Lines (Depth layer)
      ctx.strokeStyle = `hsla(${primaryHue}, 60%, 75%, 0.025)`;
      ctx.lineWidth = 1;
      const gridSpacing = 80;
      const offsetX = (mouseRef.current.x * 0.3) % gridSpacing;
      const offsetY = (mouseRef.current.y * 0.3) % gridSpacing;

      ctx.beginPath();
      for (let x = offsetX; x < width; x += gridSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = offsetY; y < height; y += gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 3. Floating Node Constellation
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Wrap around bounds
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        // Draw particle with gentle pulsing alpha
        const currentAlpha = node.alpha * (0.8 + 0.3 * Math.sin(tick * 2 + node.pulseOffset));
        const px = node.x - mouseRef.current.x * 0.5;
        const py = node.y - mouseRef.current.y * 0.5;

        ctx.fillStyle = `hsla(${primaryHue}, 90%, 75%, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const ox = other.x - mouseRef.current.x * 0.5;
          const oy = other.y - mouseRef.current.y * 0.5;
          const dx = px - ox;
          const dy = py - oy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.07;
            ctx.strokeStyle = `hsla(${primaryHue}, 80%, 70%, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(ox, oy);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeTopic, hasCriticalAlert]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{ opacity: 0.95 }}
      aria-hidden="true"
    />
  );
}
