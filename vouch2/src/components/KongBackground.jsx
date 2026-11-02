import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * Kong-style High-Tech Square Grid & Spotlight Background
 * Inspired by Kong (konghq.com) developer infrastructure aesthetic:
 * Ultra-crisp repeating micro-grid with ambient top lighting and
 * real-time cursor-following spotlight glow.
 */
export default function KongBackground() {
  const { isDark } = useTheme();
  const bgRef = useRef(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.3;
    let currentX = targetX;
    let currentY = targetY;
    let animId;
    let isMoving = false;
    let idleTimer = null;

    const handlePointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      el.style.setProperty("--spotlight-opacity", "1");

      if (!isMoving) {
        isMoving = true;
        renderLoop();
      }

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMoving = false;
      }, 1200);
    };

    const handleMouseLeave = () => {
      el.style.setProperty("--spotlight-opacity", "0");
    };

    const renderLoop = () => {
      // Smooth lerp for buttery smooth spotlight movement
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;

      el.style.setProperty("--mouse-x", `${currentX}px`);
      el.style.setProperty("--mouse-y", `${currentY}px`);

      const diff = Math.abs(currentX - targetX) + Math.abs(currentY - targetY);
      if (isMoving || diff > 0.5) {
        animId = requestAnimationFrame(renderLoop);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div
      ref={bgRef}
      className={`kong-background-layer ${isDark ? "dark" : "light"}`}
      aria-hidden="true"
    >
      {/* 1. Base Kong Square Grid Pattern */}
      <div className="kong-grid-pattern" />

      {/* 2. Ambient Top Atmosphere Glow */}
      <div className="kong-top-ambient" />

      {/* 3. Interactive Cursor Spotlight */}
      <div className="kong-cursor-spotlight" />
    </div>
  );
}

