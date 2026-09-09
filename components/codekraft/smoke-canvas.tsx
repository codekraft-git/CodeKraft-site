"use client";

import { useEffect, useRef } from "react";

const smooth = (value: number) => {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
};

/**
 * Volumetric Canvas smoke parting simulation.
 * Combines organic multi-octave billowing edges, fluid wave turbulence,
 * and procedural vapor puff eddies for a genuinely realistic smoke parting effect.
 */
export function SmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const atmosphere = canvas?.parentElement;
    const hero = atmosphere?.closest<HTMLElement>(".hero");
    if (!canvas || !atmosphere || !hero) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const source = document.createElement("canvas");
    const layer = document.createElement("canvas");
    const mask = document.createElement("canvas");

    // Pre-rendered radial smoke vapor puff for high-performance volumetric wisps
    const puffCanvas = document.createElement("canvas");
    puffCanvas.width = 128;
    puffCanvas.height = 128;
    const puffCtx = puffCanvas.getContext("2d");
    if (puffCtx) {
      const grad = puffCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(195, 225, 255, 0.495)");
      grad.addColorStop(0.25, "rgba(160, 200, 240, 0.308)");
      grad.addColorStop(0.55, "rgba(110, 160, 210, 0.132)");
      grad.addColorStop(0.85, "rgba(70, 120, 170, 0.033)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      puffCtx.fillStyle = grad;
      puffCtx.fillRect(0, 0, 128, 128);
    }

    const puffs = Array.from({ length: 40 }, (_, i) => {
      const norm = i / 40;
      const side = i % 2 === 0 ? 1 : -1;
      return {
        yNorm: 0.08 + norm * 0.84,
        side,
        driftSpeed: 0.28 + ((i * 37) % 100) / 100 * 0.38,
        vertDrift: -0.05 - ((i * 23) % 100) / 100 * 0.07,
        baseSize: 0.132 + ((i * 47) % 100) / 100 * 0.176,
        curlRate: 1.2 + ((i * 19) % 100) / 100 * 1.8,
        phase: ((i * 53) % 100) / 100 * Math.PI * 2,
      };
    });

    const sourceContext = source.getContext("2d");
    const layerContext = layer.getContext("2d");
    const maskContext = mask.getContext("2d");
    if (!sourceContext || !layerContext || !maskContext) return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = matchMedia("(pointer: coarse)");
    const photo = new Image();

    let frame = 0;
    let visible = true;
    let ready = false;
    let disposed = false;
    let lastFrame = 0;
    let width = 0;
    let height = 0;

    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const fallback = () => { stop(); delete atmosphere.dataset.smokeRenderer; };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height || !photo.naturalWidth) return;
      // Bound the drawing cost on high-DPI phones and large displays.
      const density = Math.min(devicePixelRatio || 1, 1, 1200 / bounds.width);
      width = Math.max(1, Math.round(bounds.width * density));
      height = Math.max(1, Math.round(bounds.height * density));
      canvas.width = source.width = layer.width = width;
      canvas.height = source.height = layer.height = height;
      mask.width = Math.max(1, Math.ceil(width / 4));
      mask.height = Math.max(1, Math.ceil(height / 4));
      const scale = Math.max(width / photo.naturalWidth, height / photo.naturalHeight);
      const photoWidth = photo.naturalWidth * scale;
      const photoHeight = photo.naturalHeight * scale;
      const alignX = innerWidth > 800 && innerWidth <= 1100 ? .58 : .5;
      const alignY = innerWidth <= 540 ? .35 : .5;
      sourceContext.clearRect(0, 0, width, height);
      sourceContext.drawImage(photo, (width - photoWidth) * alignX, (height - photoHeight) * alignY, photoWidth, photoHeight);
    };

    const drawWing = (side: number, progress: number, time: number) => {
      const life = Math.sin(progress * Math.PI);
      const travel = smooth(progress);
      layerContext.clearRect(0, 0, width, height);

      // Fine horizontal strips bend the original smoke into a continuous flowing field (optimized slice density)
      const strip = Math.max(5, Math.ceil(height / 64));
      for (let y = 0; y < height; y += strip) {
        const h = Math.min(strip, height - y);
        const normY = y / height;
        const w1 = Math.sin(normY * 8.5 + time * 0.54 + side * 1.3);
        const w2 = Math.cos(normY * 16.0 - time * 0.36 + side * 0.7) * 0.45;
        const flow = (w1 + w2) * life * width * 0.0253;
        layerContext.drawImage(source, 0, y, width, h, flow - width * 0.02, y, width * 1.04, h);
      }

      // Organic billowing edge mask with cloud-like lobes
      maskContext.clearRect(0, 0, mask.width, mask.height);
      maskContext.save();
      maskContext.fillStyle = "#fff";
      const blurRadius = Math.max(2, (mask.width * 0.07 * life) | 0);
      maskContext.filter = `blur(${blurRadius}px)`;

      const edge = (y: number) => {
        const ny = y / mask.height;
        const lobes = (
          Math.sin(ny * 5.5 + time * 0.48) * 0.095 +
          Math.cos(ny * 12.0 - time * 0.34) * 0.055 +
          Math.sin(ny * 24.0 + time * 0.22) * 0.028
        );
        return mask.width * (0.5 + life * lobes);
      };

      maskContext.beginPath();
      maskContext.moveTo(side < 0 ? 0 : mask.width, -20);
      maskContext.lineTo(edge(0), -20);
      for (let y = 0; y <= mask.height; y += mask.height / 36) maskContext.lineTo(edge(y), y);
      maskContext.lineTo(edge(mask.height), mask.height + 20);
      maskContext.lineTo(side < 0 ? 0 : mask.width, mask.height + 20);
      maskContext.closePath();
      maskContext.fill();
      maskContext.restore();

      layerContext.globalCompositeOperation = "destination-in";
      layerContext.drawImage(mask, 0, 0, width, height);
      layerContext.globalCompositeOperation = "source-over";

      // Composite parted wing with perspective lift & volumetric expansion
      context.save();
      context.translate(width * 0.5 + side * travel * width * 0.65, height * 0.5 - travel * height * 0.07);
      context.rotate(side * travel * 0.07);
      context.scale(1 + travel * 0.16, 1 + travel * 0.16);
      context.drawImage(layer, -width * 0.5, -height * 0.5);
      context.restore();
    };

    const drawAmbientSmoke = (time: number, opacity = 1) => {
      if (opacity <= 0) return;
      context.save();
      context.globalAlpha = opacity;

      // Gentle harmonic fluid wave undulation across horizontal strips (optimized slice density)
      const strip = Math.max(5, Math.ceil(height / 56));
      for (let y = 0; y < height; y += strip) {
        const h = Math.min(strip, height - y);
        const normY = y / height;
        // Zero displacement at top & bottom so canvas edges remain flush with black void
        const edgeDamp = Math.sin(normY * Math.PI);
        const w1 = Math.sin(normY * 4.8 + time * 0.46);
        const w2 = Math.cos(normY * 11.2 - time * 0.34) * 0.48;
        const wave = (w1 + w2) * edgeDamp * width * 0.0094;
        context.drawImage(source, 0, y, width, h, wave, y, width, h);
      }

      // Soft drifting ambient vapor wisps curling off the smoke body
      for (let i = 0; i < 26; i++) {
        const p = puffs[i];
        const loop = (time * 0.064 + i * 0.19) % 1;
        const fade = Math.sin(loop * Math.PI);
        const curlX = Math.sin(p.curlRate * time * 0.61 + p.phase) * width * 0.029;
        const curlY = -loop * height * 0.20;
        const px = width * (0.42 + p.side * 0.13) + curlX;
        const py = height * (0.26 + p.yNorm * 0.48) + curlY;
        const pSize = width * p.baseSize * 1.35;
        const alpha = fade * 0.21 * opacity;

        if (alpha > 0.005) {
          context.globalAlpha = alpha;
          context.drawImage(puffCanvas, px - pSize * 0.5, py - pSize * 0.5, pSize, pSize);
        }
      }
      context.restore();
    };

    const draw = (now: number) => {
      frame = 0;
      if (!ready || disposed || !visible || document.hidden || motion.matches) return;
      const progress = Math.max(0, Math.min(1, Number(hero.style.getPropertyValue("--smoke-progress")) || 0));
      const interval = coarsePointer.matches ? 1000 / 30 : 1000 / 45;
      const time = now / 1000;

      if (now - lastFrame >= interval - 1) {
        lastFrame = now;
        context.globalAlpha = 1;
        context.clearRect(0, 0, width, height);

        if (progress === 0) {
          drawAmbientSmoke(time, 1);
        } else if (progress < 1) {
          const ambientWeight = 1 - smooth(progress / 0.22);
          if (ambientWeight > 0.01) {
            drawAmbientSmoke(time, ambientWeight);
          }

          context.globalAlpha = 1 - smooth((progress - 0.55) / 0.44);
          drawWing(-1, progress, time);
          drawWing(1, progress, time);

          const bridge = 1 - smooth((progress - 0.02) / 0.22);
          if (bridge > 0) {
            context.globalAlpha = bridge;
            context.drawImage(source, 0, 0);
          }

          // Volumetric swirling mist puffs trailing into the wake
          const life = Math.sin(progress * Math.PI);
          const travel = smooth(progress);

          for (let i = 0; i < puffs.length; i++) {
            const p = puffs[i];
            const curlX = Math.sin(p.curlRate * time + p.phase) * width * 0.035 * life;
            const curlY = Math.cos(p.curlRate * time + p.phase) * height * 0.025 * life;
            const px = width * 0.5 + p.side * travel * width * p.driftSpeed + curlX;
            const py = height * p.yNorm + travel * height * p.vertDrift + curlY;
            const pSize = width * p.baseSize * (1 + travel * 1.5);
            const pAlpha = life * 0.40 * (1 - smooth((progress - 0.65) / 0.34));

            if (pAlpha > 0.005) {
              context.globalAlpha = pAlpha;
              context.drawImage(puffCanvas, px - pSize * 0.5, py - pSize * 0.5, pSize, pSize);
            }
          }
        }
        context.globalAlpha = 1;
        atmosphere.dataset.smokeRenderer = "canvas";
      }
      // When hero is in view and progress < 1, continuously animate living smoke
      if (progress < 1) frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (motion.matches) { fallback(); return; }
      if (ready && visible && !document.hidden && !frame) frame = requestAnimationFrame(draw);
    };

    const onVisibility = () => { if (document.hidden) stop(); else start(); };
    const onResize = () => { if (ready) { resize(); start(); } };
    const onScroll = () => { start(); };
    const onMotion = () => { start(); };

    const intersection = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    });
    intersection?.observe(hero);

    const sizes = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(onResize);
    sizes?.observe(canvas);

    motion.addEventListener("change", onMotion);
    hero.addEventListener("smoke-progress", onScroll);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    photo.onload = () => { if (!disposed) { ready = true; resize(); start(); } };
    photo.onerror = fallback;
    photo.src = "/assets/atmosphere.webp";

    return () => {
      disposed = true;
      fallback();
      intersection?.disconnect();
      sizes?.disconnect();
      motion.removeEventListener("change", onMotion);
      hero.removeEventListener("smoke-progress", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      photo.onload = null;
      photo.onerror = null;
      source.width = layer.width = mask.width = puffCanvas.width = 0;
    };
  }, []);

  return <canvas ref={canvasRef} className="smoke-canvas" aria-hidden="true"/>;
}
