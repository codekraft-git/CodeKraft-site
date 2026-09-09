"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  depth: 1 | 2 | 3;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  colorIndex: number;
  hasFlare: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  fadeSpeed: number;
}

interface SmokeWisp {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  vx: number;
  vy: number;
  curlSpeed: number;
  phase: number;
  scale: number;
}

interface CosmicBackdropProps {
  active?: boolean;
}

// Palette of subtle, cool cosmic star hues
const STAR_COLOR_PREFIXES = [
  "rgba(255, 255, 255, ",
  "rgba(220, 240, 255, ",
  "rgba(175, 220, 255, ",
  "rgba(200, 230, 255, ",
  "rgba(160, 210, 255, ",
];

// Pre-computed lookup tables: eliminates ~21,600 throwaway string allocations per second
const STAR_COLOR_LUT = STAR_COLOR_PREFIXES.map(prefix =>
  Array.from({ length: 101 }, (_, i) => `${prefix}${(i / 100).toFixed(2)})`)
);
const STAR_FLARE_LUT = STAR_COLOR_PREFIXES.map(prefix =>
  Array.from({ length: 101 }, (_, i) => `${prefix}${(i / 100 * 0.55).toFixed(2)})`)
);
const STAR_HALO_LUT = STAR_COLOR_PREFIXES.map(prefix => `${prefix}0.7)`);

/**
 * Cosmic glass backdrop:
 * Renders an ethereal, softly blurred CodeKraft logo watermark,
 * an active multi-layered starfield with cosmic drift, twinkling, and meteor streaks,
 * and a persistent ambient fluid smoke aura that flows behind the entire website.
 */
export function CosmicBackdrop({ active = true }: CosmicBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const smokeWispsRef = useRef<SmokeWisp[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let disposed = false;

    // Pre-rendered volumetric vapor puff for gentle ambient smoke aura
    const puffCanvas = document.createElement("canvas");
    puffCanvas.width = 160;
    puffCanvas.height = 160;
    const puffCtx = puffCanvas.getContext("2d");
    if (puffCtx) {
      const grad = puffCtx.createRadialGradient(80, 80, 0, 80, 80, 80);
      grad.addColorStop(0, "rgba(180, 220, 255, 0.085)");
      grad.addColorStop(0.28, "rgba(130, 185, 245, 0.045)");
      grad.addColorStop(0.60, "rgba(65, 130, 205, 0.015)");
      grad.addColorStop(0.85, "rgba(25, 75, 140, 0.003)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      puffCtx.fillStyle = grad;
      puffCtx.fillRect(0, 0, 160, 160);
    }

    const initBackdrop = (w: number, h: number) => {
      // 1. Initialize multi-layered stars with visible drift
      const count = Math.min(180, Math.max(90, Math.round((w * h) / 11000)));
      starsRef.current = Array.from({ length: count }, (_, i) => {
        const depth: 1 | 2 | 3 = i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1;
        const hasFlare = depth >= 2 && i % 6 === 0;

        let size = 0.6 + Math.random() * 0.7;
        let vx = (Math.random() - 0.35) * 0.16;
        let vy = -0.14 - Math.random() * 0.20;

        if (depth === 2) {
          size = 0.9 + Math.random() * 1.0;
          vx = (Math.random() - 0.35) * 0.35;
          vy = -0.30 - Math.random() * 0.36;
        } else if (depth === 3) {
          size = 1.3 + Math.random() * (hasFlare ? 1.6 : 1.1);
          vx = (Math.random() - 0.35) * 0.55;
          vy = -0.50 - Math.random() * 0.60;
        }

        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          depth,
          baseAlpha: 0.28 + Math.random() * 0.55,
          twinkleSpeed: 0.0025 + Math.random() * 0.0055, // 4-5x faster lively twinkling
          twinklePhase: Math.random() * Math.PI * 2,
          vx,
          vy,
          colorIndex: Math.floor(Math.random() * STAR_COLOR_PREFIXES.length),
          hasFlare,
        };
      });

      // 2. Initialize subtle, delicate ambient smoke aura wisps behind stars
      const wispCount = 12;
      smokeWispsRef.current = Array.from({ length: wispCount }, (_, i) => {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          radius: (w < 600 ? 120 : 180) + Math.random() * (w < 600 ? 90 : 140),
          baseAlpha: 0.18 + Math.random() * 0.22,
          vx: (Math.random() - 0.45) * 0.14,
          vy: -0.08 - Math.random() * 0.16,
          curlSpeed: 0.0003 + Math.random() * 0.0004,
          phase: (i / wispCount) * Math.PI * 2,
          scale: 1,
        };
      });

      shootingStarsRef.current = [];
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.scale(dpr, dpr);
      initBackdrop(width, height);
    };

    const draw = (now: number) => {
      frame = 0;
      if (disposed || document.hidden) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw persistent fluid smoke aura wisps (optimized zero-save loop)
      const wisps = smokeWispsRef.current;
      for (let i = 0; i < wisps.length; i++) {
        const wisp = wisps[i];

        // Harmonic organic curling motion
        wisp.x += Math.cos(now * wisp.curlSpeed + wisp.phase) * 0.35 + wisp.vx;
        wisp.y += Math.sin(now * (wisp.curlSpeed * 1.2) + wisp.phase) * 0.28 + wisp.vy;
        wisp.scale = 1 + Math.sin(now * 0.0005 + wisp.phase) * 0.14;

        // Screen wrap
        const pad = wisp.radius;
        if (wisp.x < -pad) wisp.x = width + pad;
        else if (wisp.x > width + pad) wisp.x = -pad;
        if (wisp.y < -pad) wisp.y = height + pad;
        else if (wisp.y > height + pad) wisp.y = -pad;

        const breathe = (Math.sin(now * 0.0006 + wisp.phase) + 1) * 0.5;
        const currentAlpha = wisp.baseAlpha * (0.75 + 0.25 * breathe);

        ctx.globalAlpha = currentAlpha;
        const drawSize = wisp.radius * 2 * wisp.scale;
        ctx.drawImage(puffCanvas, wisp.x - drawSize / 2, wisp.y - drawSize / 2, drawSize, drawSize);
      }
      ctx.globalAlpha = 1;

      // 2. Draw animated moving starfield (zero-allocation LUT lookups)
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Active celestial drift
        star.x += star.vx;
        star.y += star.vy;

        // Screen wrap with soft boundary
        if (star.x < -15) star.x = width + 15;
        else if (star.x > width + 15) star.x = -15;
        if (star.y < -15) star.y = height + 15;
        else if (star.y > height + 15) star.y = -15;

        // Lively sinusoidal organic twinkling
        const blink = Math.sin(now * star.twinkleSpeed + star.twinklePhase);
        const alpha = Math.max(0.08, star.baseAlpha * (0.35 + 0.65 * ((blink + 1) * 0.5)));
        const alphaInt = Math.min(100, Math.max(8, (alpha * 100) | 0));

        ctx.fillStyle = STAR_COLOR_LUT[star.colorIndex][alphaInt];

        // Soft halo on brighter foreground stars
        if (star.depth >= 2 && alphaInt > 45) {
          ctx.shadowBlur = star.size * 3.2;
          ctx.shadowColor = STAR_HALO_LUT[star.colorIndex];
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // 4-point crystal flare on prominent celestial nodes
        if (star.hasFlare && alphaInt > 35) {
          const flareLen = star.size * 4.2 * (alpha / star.baseAlpha);
          ctx.strokeStyle = STAR_FLARE_LUT[star.colorIndex][alphaInt];
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(star.x - flareLen, star.y);
          ctx.lineTo(star.x + flareLen, star.y);
          ctx.moveTo(star.x, star.y - flareLen);
          ctx.lineTo(star.x, star.y + flareLen);
          ctx.stroke();
        }
      }
      ctx.shadowBlur = 0;

      // 3. Periodic shooting stars / meteor streaks
      const shootingStars = shootingStarsRef.current;
      if (Math.random() < 0.007 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.85 + width * 0.1,
          y: Math.random() * height * 0.45,
          length: 65 + Math.random() * 90,
          speed: 6.5 + Math.random() * 4.5,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
          opacity: 0.9,
          fadeSpeed: 0.016 + Math.random() * 0.015,
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= s.fadeSpeed;

        if (s.opacity <= 0 || s.x > width + 100 || s.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "rgba(144, 202, 255, 0)");
        grad.addColorStop(0.7, `rgba(180, 225, 255, ${(s.opacity * 0.45).toFixed(3)})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${(s.opacity * 0.95).toFixed(3)})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    frame = requestAnimationFrame(draw);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!frame) {
        frame = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);

  return (
    <div className={`cosmic-backdrop ${active ? "is-active" : ""}`} aria-hidden="true">
      {/* Ambient Atmospheric Smoke Aura - Persists all over website */}
      <div className="ambient-smoke-aura-wrap" aria-hidden="true">
        <div className="ambient-smoke-drift ambient-smoke-drift-1">
          <img src="/assets/atmosphere.webp" alt="" draggable={false} />
        </div>
        <div className="ambient-smoke-drift ambient-smoke-drift-2">
          <img src="/assets/atmosphere.webp" alt="" draggable={false} />
        </div>
      </div>

      {/* Combined Starfield & Volumetric Smoke Wisps Canvas */}
      <canvas ref={canvasRef} className="cosmic-stars-canvas" />

      {/* Glass Logo Backdrop — Always Locked in Center */}
      <div className="cosmic-glass-stage">
        <div className="cosmic-logo-glow" />
        <img
          src="/assets/ck-glass-watermark.png"
          alt=""
          className="cosmic-glass-logo"
          draggable={false}
          loading="lazy"
        />
        <div className="cosmic-glass-overlay" />
      </div>
    </div>
  );
}
