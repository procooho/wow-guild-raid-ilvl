'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [ripples, setRipples] = useState([]);

  // Raw mouse values for zero-lag primary cursor
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring values for trailing secondary cursor (Snappy spring configuration)
  const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if touch device or hover not supported
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    // Hide system cursor
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';

    // CSS styling to hide cursor on interactive elements and target custom selection
    const style = document.createElement('style');
    style.innerHTML = `
      a, button, input, textarea, select, [role="button"], .cursor-pointer { cursor: none !important; }
      ::selection { background: rgba(34, 211, 238, 0.3) !important; color: white !important; }
    `;
    document.head.appendChild(style);

    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      // Check for interactive elements
      const isInteractive =
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute?.('role') === 'button' ||
        target.classList?.contains('cursor-pointer');

      setIsHovered(!!isInteractive);

      // Check for text elements
      const isText =
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.closest('input') ||
        target.closest('textarea');

      setIsTextHovered(!!isText);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      const newRipple = {
        id: Date.now() + Math.random(),
        x: mouseX.get(),
        y: mouseY.get()
      };
      setRipples(prev => [...prev, newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 550);
    };

    const handleMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.documentElement.style.cursor = 'auto';
      document.body.style.cursor = 'auto';
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, [mouseX, mouseY, visible]);

  if (!enabled || !visible) return null;

  return (
    <>
      {/* Primary Zero-Lag Cursor (The Pointer / Crosshair) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999999] hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.75 : 1,
            rotate: isHovered ? 45 : 0,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="relative flex items-center justify-center w-6 h-6"
        >
          {/* Vertical Line */}
          <motion.div
            animate={{
              height: isTextHovered ? 20 : 14,
              width: isTextHovered ? 3 : 2,
            }}
            className="absolute bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
          />
          {/* Horizontal Line */}
          <motion.div
            animate={{
              width: isTextHovered ? 0 : 14,
              opacity: isTextHovered ? 0 : 1,
            }}
            className="absolute h-[2px] bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
          />
        </motion.div>
      </motion.div>

      {/* Secondary Trailing Cursor (The Reticle / Brackets) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999998] hidden md:block"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isTextHovered ? 0 : isHovered ? 1.4 : 1,
            rotate: isHovered ? 90 : 0,
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 25 }}
          className="relative flex items-center justify-center w-8 h-8 transition-transform duration-300"
        >
          {/* Corners / Brackets */}
          <motion.div
            animate={{
              borderColor: isHovered ? 'rgba(34, 211, 238, 0.4)' : 'rgba(34, 211, 238, 0.15)',
              scale: isClicking ? 0.75 : 1,
            }}
            className="w-full h-full border border-cyan-500/20 rounded-sm relative"
          >
            {/* Radar Dotted/Dashed Circle inside */}
            <div className="absolute inset-1 rounded-full border border-dashed border-cyan-400/25 animate-radar-spin" />

            {/* Corner Accents - slide outwards on hover! */}
            <motion.div
              animate={{
                x: isHovered ? -3 : 0,
                y: isHovered ? -3 : 0,
                borderColor: isHovered ? 'rgba(34, 211, 238, 1)' : 'rgba(34, 211, 238, 0.7)',
              }}
              className="absolute -top-[2px] -left-[2px] w-2 h-2 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_4px_#22d3ee]"
            />
            <motion.div
              animate={{
                x: isHovered ? 3 : 0,
                y: isHovered ? -3 : 0,
                borderColor: isHovered ? 'rgba(34, 211, 238, 1)' : 'rgba(34, 211, 238, 0.7)',
              }}
              className="absolute -top-[2px] -right-[2px] w-2 h-2 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_4px_#22d3ee]"
            />
            <motion.div
              animate={{
                x: isHovered ? -3 : 0,
                y: isHovered ? 3 : 0,
                borderColor: isHovered ? 'rgba(34, 211, 238, 1)' : 'rgba(34, 211, 238, 0.7)',
              }}
              className="absolute -bottom-[2px] -left-[2px] w-2 h-2 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_4px_#22d3ee]"
            />
            <motion.div
              animate={{
                x: isHovered ? 3 : 0,
                y: isHovered ? 3 : 0,
                borderColor: isHovered ? 'rgba(34, 211, 238, 1)' : 'rgba(34, 211, 238, 0.7)',
              }}
              className="absolute -bottom-[2px] -right-[2px] w-2 h-2 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_4px_#22d3ee]"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Spawning target square ripples */}
      {ripples.map(r => (
        <div
          key={r.id}
          className="fixed w-6 h-6 border border-cyan-400/80 pointer-events-none z-[999997] -translate-x-1/2 -translate-y-1/2 animate-ripple shadow-[0_0_8px_rgba(34,211,238,0.3)]"
          style={{ left: r.x, top: r.y }}
        >
          {/* Ripple Corners */}
          <div className="absolute -top-[2px] -left-[2px] w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-300" />
          <div className="absolute -top-[2px] -right-[2px] w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-300" />
          <div className="absolute -bottom-[2px] -left-[2px] w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-300" />
          <div className="absolute -bottom-[2px] -right-[2px] w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-300" />
        </div>
      ))}

      {/* Global CSS animations */}
      <style jsx global>{`
        @keyframes cursorRipple {
          0% {
            transform: translate3d(-50%, -50%, 0) scale(0.6) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate3d(-50%, -50%, 0) scale(2.8) rotate(45deg);
            opacity: 0;
          }
        }

        .animate-ripple {
          animation: cursorRipple 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        @keyframes radarSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-radar-spin {
          animation: radarSpin 12s linear infinite;
        }
      `}</style>
    </>
  );
}
