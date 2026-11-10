import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * Interactive Dots & Grid Background
 * Based on Framer Dots component (https://framer.com/m/Dots-1-9hMKym.js)
 * Clean interactive dots that react in real-time to cursor proximity.
 * Automatically adapts palette to Light & Dark modes.
 */
export default function DotsBackground({
  dotColor: propDotColor,
  hoverColor: propHoverColor,
  dotSize = 3,
  spacing = 48,
  proximityRadius = 150,
  maxOpacity: propMaxOpacity,
  backgroundOpacity: propBackgroundOpacity,
  gridType = "dots-lines", // "dots-lines" | "dots"
  lineOpacity: propLineOpacity,
}) {
  const { isDark } = useTheme();

  const dotColor = propDotColor || (isDark ? "#52525b" : "#787876");
  const hoverColor = propHoverColor || (isDark ? "#ff684d" : "#ff5436");
  const lineOpacity = propLineOpacity ?? (isDark ? 0.05 : 0.07);
  const backgroundOpacity = propBackgroundOpacity ?? (isDark ? 0.14 : 0.16);
  const maxOpacity = propMaxOpacity ?? (isDark ? 0.95 : 0.85);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      draw();
    };

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    let isMoving = false;
    let idleTimer = null;

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        renderLoop();
      }
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMoving = false;
      }, 1500);
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background grid lines if enabled
      if (gridType === "dots-lines") {
        ctx.strokeStyle = dotColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = lineOpacity;
        ctx.beginPath();

        const cols = Math.ceil(width / spacing);
        for (let c = 0; c <= cols; c++) {
          const x = c * spacing + spacing / 2;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }

        const rows = Math.ceil(height / spacing);
        for (let r = 0; r <= rows; r++) {
          const y = r * spacing + spacing / 2;
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
      }

      // 2. Draw interactive proximity dots
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let r = 0; r < rows; r++) {
        const y = r * spacing + spacing / 2;
        for (let c = 0; c < cols; c++) {
          const x = c * spacing + spacing / 2;

          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let opacity = backgroundOpacity;
          let currentSize = dotSize;
          let isHovered = false;

          if (dist < proximityRadius) {
            isHovered = true;
            const factor = 1 - dist / proximityRadius;
            opacity = Math.max(backgroundOpacity, backgroundOpacity + factor * (maxOpacity - backgroundOpacity));
            currentSize = dotSize + factor * 1.5;
          }

          ctx.globalAlpha = opacity;
          ctx.fillStyle = isHovered ? hoverColor : dotColor;
          ctx.beginPath();
          ctx.arc(x, y, currentSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const renderLoop = () => {
      // Smooth lerp mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.25;
      mouse.y += (mouse.targetY - mouse.y) * 0.25;

      draw();

      const diff = Math.abs(mouse.x - mouse.targetX) + Math.abs(mouse.y - mouse.targetY);
      if (isMoving || diff > 0.5) {
        animId = requestAnimationFrame(renderLoop);
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    resize();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(idleTimer);
    };
  }, [dotColor, hoverColor, dotSize, spacing, proximityRadius, maxOpacity, backgroundOpacity, gridType, lineOpacity]);

  return (
    <div
      id="framer-dots-bg"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
