/**
 * CodeKraft Studio — Interactive Client Engine (UI/UX Only)
 * 100% Client-side, Zero-Backend Dependencies
 * High-performance Canvas rendering, Scroll Motion, Spotlights, and Modal Portals
 */

(function () {
  'use strict';

  /* -------------------------------------------------------------------------- */
  /* Helpers                                                                    */
  /* -------------------------------------------------------------------------- */
  const clamp = (val, min = 0, max = 1) => Math.max(min, Math.min(max, val));
  const range = (val, min, max) => clamp((val - min) / (max - min));
  const ease = (t) => t * t * (3 - 2 * t);

  const root = document.getElementById('studio-root') || document.body;
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('#reading-progress span');
  const heroStage = document.getElementById('home');
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const cue = document.querySelector('.scroll-indicator');

  /* -------------------------------------------------------------------------- */
  /* 1. Cosmic Backdrop Canvas Engine (Starfield, Flares, Meteors, Fluid Aura) */
  /* -------------------------------------------------------------------------- */
  (function initCosmicBackdrop() {
    const canvas = document.getElementById('cosmic-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const STAR_COLOR_PREFIXES = [
      'rgba(255, 255, 255, ',
      'rgba(220, 240, 255, ',
      'rgba(175, 220, 255, ',
      'rgba(200, 230, 255, ',
      'rgba(160, 210, 255, ',
    ];

    const STAR_COLOR_LUT = STAR_COLOR_PREFIXES.map((prefix) =>
      Array.from({ length: 101 }, (_, i) => `${prefix}${(i / 100).toFixed(2)})`)
    );
    const STAR_FLARE_LUT = STAR_COLOR_PREFIXES.map((prefix) =>
      Array.from({ length: 101 }, (_, i) => `${prefix}${((i / 100) * 0.55).toFixed(2)})`)
    );
    const STAR_HALO_LUT = STAR_COLOR_PREFIXES.map((prefix) => `${prefix}0.7)`);

    // Pre-rendered volumetric vapor puff for gentle ambient smoke aura
    const puffCanvas = document.createElement('canvas');
    puffCanvas.width = 160;
    puffCanvas.height = 160;
    const puffCtx = puffCanvas.getContext('2d');
    if (puffCtx) {
      const grad = puffCtx.createRadialGradient(80, 80, 0, 80, 80, 80);
      grad.addColorStop(0, 'rgba(180, 220, 255, 0.085)');
      grad.addColorStop(0.28, 'rgba(130, 185, 245, 0.045)');
      grad.addColorStop(0.6, 'rgba(65, 130, 205, 0.015)');
      grad.addColorStop(0.85, 'rgba(25, 75, 140, 0.003)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      puffCtx.fillStyle = grad;
      puffCtx.fillRect(0, 0, 160, 160);
    }

    let stars = [];
    let wisps = [];
    let shootingStars = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    function initBackdrop(w, h) {
      const count = Math.min(180, Math.max(90, Math.round((w * h) / 11000)));
      stars = Array.from({ length: count }, (_, i) => {
        const depth = i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1;
        const hasFlare = depth >= 2 && i % 6 === 0;

        let size = 0.6 + Math.random() * 0.7;
        let vx = (Math.random() - 0.35) * 0.16;
        let vy = -0.14 - Math.random() * 0.2;

        if (depth === 2) {
          size = 0.9 + Math.random() * 1.0;
          vx = (Math.random() - 0.35) * 0.35;
          vy = -0.3 - Math.random() * 0.36;
        } else if (depth === 3) {
          size = 1.3 + Math.random() * (hasFlare ? 1.6 : 1.1);
          vx = (Math.random() - 0.35) * 0.55;
          vy = -0.5 - Math.random() * 0.6;
        }

        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          depth,
          baseAlpha: 0.28 + Math.random() * 0.55,
          twinkleSpeed: 0.0025 + Math.random() * 0.0055,
          twinklePhase: Math.random() * Math.PI * 2,
          vx,
          vy,
          colorIndex: Math.floor(Math.random() * STAR_COLOR_PREFIXES.length),
          hasFlare,
        };
      });

      const wispCount = 12;
      wisps = Array.from({ length: wispCount }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: (w < 600 ? 120 : 180) + Math.random() * (w < 600 ? 90 : 140),
        baseAlpha: 0.18 + Math.random() * 0.22,
        vx: (Math.random() - 0.45) * 0.14,
        vy: -0.08 - Math.random() * 0.16,
        curlSpeed: 0.0003 + Math.random() * 0.0004,
        phase: (i / wispCount) * Math.PI * 2,
        scale: 1,
      }));

      shootingStars = [];
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.scale(dpr, dpr);
      initBackdrop(width, height);
    }

    function draw(now) {
      if (document.hidden) return;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw persistent fluid smoke aura wisps
      for (let i = 0; i < wisps.length; i++) {
        const wisp = wisps[i];
        wisp.x += Math.cos(now * wisp.curlSpeed + wisp.phase) * 0.35 + wisp.vx;
        wisp.y += Math.sin(now * (wisp.curlSpeed * 1.2) + wisp.phase) * 0.28 + wisp.vy;
        wisp.scale = 1 + Math.sin(now * 0.0005 + wisp.phase) * 0.14;

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

      // 2. Draw animated moving starfield
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < -15) star.x = width + 15;
        else if (star.x > width + 15) star.x = -15;
        if (star.y < -15) star.y = height + 15;
        else if (star.y > height + 15) star.y = -15;

        const blink = Math.sin(now * star.twinkleSpeed + star.twinklePhase);
        const alpha = Math.max(0.08, star.baseAlpha * (0.35 + 0.65 * ((blink + 1) * 0.5)));
        const alphaInt = Math.min(100, Math.max(8, (alpha * 100) | 0));

        ctx.fillStyle = STAR_COLOR_LUT[star.colorIndex][alphaInt];

        if (star.depth >= 2 && alphaInt > 45) {
          ctx.shadowBlur = star.size * 3.2;
          ctx.shadowColor = STAR_HALO_LUT[star.colorIndex];
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

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
        grad.addColorStop(0, 'rgba(144, 202, 255, 0)');
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
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    frame = requestAnimationFrame(draw);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
      } else {
        frame = requestAnimationFrame(draw);
      }
    });
  })();

  /* -------------------------------------------------------------------------- */
  /* 2. Smoke Canvas Engine (Volumetric Hero Atmosphere Simulation)             */
  /* -------------------------------------------------------------------------- */
  (function initSmokeCanvas() {
    const canvas = document.querySelector('.hero .smoke-canvas');
    if (!canvas) return;
    const atmosphere = canvas.parentElement;
    if (!atmosphere || !hero) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const source = document.createElement('canvas');
    const layer = document.createElement('canvas');
    const mask = document.createElement('canvas');

    const puffCanvas = document.createElement('canvas');
    puffCanvas.width = 128;
    puffCanvas.height = 128;
    const puffCtx = puffCanvas.getContext('2d');
    if (puffCtx) {
      const grad = puffCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(195, 225, 255, 0.495)');
      grad.addColorStop(0.25, 'rgba(160, 200, 240, 0.308)');
      grad.addColorStop(0.55, 'rgba(110, 160, 210, 0.132)');
      grad.addColorStop(0.85, 'rgba(70, 120, 170, 0.033)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      puffCtx.fillStyle = grad;
      puffCtx.fillRect(0, 0, 128, 128);
    }

    const puffs = Array.from({ length: 40 }, (_, i) => {
      const norm = i / 40;
      const side = i % 2 === 0 ? 1 : -1;
      return {
        yNorm: 0.08 + norm * 0.84,
        side,
        driftSpeed: 0.28 + (((i * 37) % 100) / 100) * 0.38,
        vertDrift: -0.05 - (((i * 23) % 100) / 100) * 0.07,
        baseSize: 0.132 + (((i * 47) % 100) / 100) * 0.176,
        curlRate: 1.2 + (((i * 19) % 100) / 100) * 1.8,
        phase: (((i * 53) % 100) / 100) * Math.PI * 2,
      };
    });

    const sourceContext = source.getContext('2d');
    const layerContext = layer.getContext('2d');
    const maskContext = mask.getContext('2d');
    if (!sourceContext || !layerContext || !maskContext) return;

    let frame = 0;
    let visible = true;
    let ready = false;
    let width = 0;
    let height = 0;
    let lastFrame = 0;

    const photo = new Image();

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height || !photo.naturalWidth) return;
      const density = Math.min(window.devicePixelRatio || 1, 1, 1200 / bounds.width);
      width = Math.max(1, Math.round(bounds.width * density));
      height = Math.max(1, Math.round(bounds.height * density));
      canvas.width = source.width = layer.width = width;
      canvas.height = source.height = layer.height = height;
      mask.width = Math.max(1, Math.ceil(width / 4));
      mask.height = height;

      sourceContext.drawImage(photo, 0, 0, width, height);
    }

    function drawWing(side, progress, time) {
      const life = Math.sin(progress * Math.PI);
      const travel = ease(progress);

      layerContext.clearRect(0, 0, width, height);
      const strip = Math.max(5, Math.ceil(height / 64));
      for (let y = 0; y < height; y += strip) {
        const h = Math.min(strip, height - y);
        const normY = y / height;
        const w1 = Math.sin(normY * 8.5 + time * 0.54 + side * 1.3);
        const w2 = Math.cos(normY * 16.0 - time * 0.36 + side * 0.7) * 0.45;
        const flow = (w1 + w2) * life * width * 0.0253;
        layerContext.drawImage(source, 0, y, width, h, flow - width * 0.02, y, width * 1.04, h);
      }

      maskContext.clearRect(0, 0, mask.width, mask.height);
      maskContext.save();
      maskContext.fillStyle = '#fff';
      const blurRadius = Math.max(2, (mask.width * 0.07 * life) | 0);
      maskContext.filter = `blur(${blurRadius}px)`;

      const edge = (y) => {
        const ny = y / mask.height;
        const lobes =
          Math.sin(ny * 5.5 + time * 0.48) * 0.095 +
          Math.cos(ny * 12.0 - time * 0.34) * 0.055 +
          Math.sin(ny * 24.0 + time * 0.22) * 0.028;
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

      layerContext.globalCompositeOperation = 'destination-in';
      layerContext.drawImage(mask, 0, 0, width, height);
      layerContext.globalCompositeOperation = 'source-over';

      context.save();
      context.translate(width * 0.5 + side * travel * width * 0.65, height * 0.5 - travel * height * 0.07);
      context.rotate(side * travel * 0.07);
      context.scale(1 + travel * 0.16, 1 + travel * 0.16);
      context.drawImage(layer, -width * 0.5, -height * 0.5);
      context.restore();
    }

    function drawAmbientSmoke(time, opacity = 1) {
      if (opacity <= 0) return;
      context.save();
      context.globalAlpha = opacity;

      const strip = Math.max(5, Math.ceil(height / 56));
      for (let y = 0; y < height; y += strip) {
        const h = Math.min(strip, height - y);
        const normY = y / height;
        const edgeDamp = Math.sin(normY * Math.PI);
        const w1 = Math.sin(normY * 4.8 + time * 0.46);
        const w2 = Math.cos(normY * 11.2 - time * 0.34) * 0.48;
        const wave = (w1 + w2) * edgeDamp * width * 0.0094;
        context.drawImage(source, 0, y, width, h, wave, y, width, h);
      }

      for (let i = 0; i < 26; i++) {
        const p = puffs[i];
        const loop = (time * 0.064 + i * 0.19) % 1;
        const fade = Math.sin(loop * Math.PI);
        const curlX = Math.sin(p.curlRate * time * 0.61 + p.phase) * width * 0.029;
        const curlY = -loop * height * 0.2;
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
    }

    function draw(now) {
      frame = 0;
      if (!ready || !visible || document.hidden) return;
      const progress = Math.max(0, Math.min(1, Number(hero.style.getPropertyValue('--smoke-progress')) || 0));
      const interval = 1000 / 45;
      const time = now / 1000;

      if (now - lastFrame >= interval - 1) {
        lastFrame = now;
        context.globalAlpha = 1;
        context.clearRect(0, 0, width, height);

        if (progress === 0) {
          drawAmbientSmoke(time, 1);
        } else if (progress < 1) {
          const ambientWeight = 1 - ease(progress / 0.22);
          if (ambientWeight > 0.01) {
            drawAmbientSmoke(time, ambientWeight);
          }

          context.globalAlpha = 1 - ease((progress - 0.55) / 0.44);
          drawWing(-1, progress, time);
          drawWing(1, progress, time);

          const bridge = 1 - ease((progress - 0.02) / 0.22);
          if (bridge > 0) {
            context.globalAlpha = bridge;
            context.drawImage(source, 0, 0);
          }

          const life = Math.sin(progress * Math.PI);
          const travel = ease(progress);

          for (let i = 0; i < puffs.length; i++) {
            const p = puffs[i];
            const curlX = Math.sin(p.curlRate * time + p.phase) * width * 0.035 * life;
            const curlY = Math.cos(p.curlRate * time + p.phase) * height * 0.025 * life;
            const px = width * 0.5 + p.side * travel * width * p.driftSpeed + curlX;
            const py = height * p.yNorm + travel * height * p.vertDrift + curlY;
            const pSize = width * p.baseSize * (1 + travel * 1.5);
            const pAlpha = life * 0.4 * (1 - ease((progress - 0.65) / 0.34));

            if (pAlpha > 0.005) {
              context.globalAlpha = pAlpha;
              context.drawImage(puffCanvas, px - pSize * 0.5, py - pSize * 0.5, pSize, pSize);
            }
          }
        }
        context.globalAlpha = 1;
        atmosphere.dataset.smokeRenderer = 'canvas';
      }

      if (progress < 1) frame = requestAnimationFrame(draw);
    }

    function start() {
      if (ready && visible && !document.hidden && !frame) {
        frame = requestAnimationFrame(draw);
      }
    }

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) start();
        else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      });
      observer.observe(hero);
    }

    hero.addEventListener('smoke-progress', start);
    window.addEventListener('resize', () => {
      if (ready) {
        resize();
        start();
      }
    }, { passive: true });

    photo.onload = () => {
      ready = true;
      resize();
      start();
    };
    photo.src = 'assets/atmosphere.webp';
  })();

  /* -------------------------------------------------------------------------- */
  /* 3. Scroll Motion Controller & Section Highlight Rigor                     */
  /* -------------------------------------------------------------------------- */
  (function initScrollMotion() {
    let stageTop = 0;
    let heroTravel = 1;
    let maxScroll = 1;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let previousHeroProgress = -1;
    let frame = 0;

    const navLinks = Array.from(document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-menu nav a[href^="#"]'));
    const sectionElements = Array.from(document.querySelectorAll('section[id], .hero-scroll-stage[id]'));
    const reveals = Array.from(document.querySelectorAll('.reveal'));
    const projectCards = Array.from(document.querySelectorAll('.project-card'));

    function measure() {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      stageTop = heroStage ? heroStage.offsetTop : 0;
      const stageHeight = heroStage ? heroStage.offsetHeight : viewportHeight * 2;
      heroTravel = Math.max(1, stageHeight - viewportHeight);
      maxScroll = Math.max(1, document.documentElement.scrollHeight - viewportHeight);

      document.querySelectorAll('.services-grid, .projects-grid, .products-grid, .principles-grid').forEach((group) => {
        const columns = getComputedStyle(group).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
        Array.from(group.children).forEach((child, index) => {
          child.style.setProperty('--reveal-delay', `${(index % columns) * 90}ms`);
        });
      });
    }

    function render() {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const progress = clamp((y - stageTop) / heroTravel);

      // Header scrolled glass styling
      if (header) {
        header.classList.toggle('header-scrolled', progress >= 0.85);
      }

      // Root backdrop variables
      const isPostHero = progress >= 0.25;
      root.dataset.postHero = isPostHero ? 'true' : 'false';
      const postHeroOpacity = range(progress, 0.65, 0.92);
      const cosmicLogoOpacity = range(progress, 0.16, 0.56);
      const glassTrap = range(progress, 0.16, 0.68);
      const starsOpacity = 0.78 + 0.22 * range(progress, 0.1, 0.65);
      const smokeAuraOpacity = 0.13 + 0.06 * range(progress, 0.15, 0.8);

      root.style.setProperty('--post-hero-opacity', `${postHeroOpacity}`);
      root.style.setProperty('--cosmic-logo-opacity', `${cosmicLogoOpacity}`);
      root.style.setProperty('--glass-trap', `${glassTrap}`);
      root.style.setProperty('--stars-opacity', `${starsOpacity}`);
      root.style.setProperty('--smoke-aura-opacity', `${smokeAuraOpacity}`);
      root.style.setProperty('--scroll-y', `${y}px`);

      // Reading progress bar
      if (progressBar) {
        progressBar.style.transform = `scaleX(${clamp(y / maxScroll)})`;
      }

      // Active Section Calculation
      let activeId = 'home';
      for (let i = 0; i < sectionElements.length; i++) {
        const sec = sectionElements[i];
        const top = sec.offsetTop;
        if (top <= y + Math.min(180, viewportHeight * 0.25)) {
          activeId = sec.id;
        }
      }
      if (y >= maxScroll - 8) activeId = 'contact';

      navLinks.forEach((link) => {
        const target = link.getAttribute('href')?.replace('#', '');
        if (target === activeId) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });

      // Hero Split & Atmosphere Animations
      if (hero && progress !== previousHeroProgress) {
        const split = ease(progress);
        const copyLift = ease(range(progress, 0.16, 0.56));
        const heroStyle = hero.style;

        heroStyle.setProperty('--smoke-progress', `${progress}`);
        heroStyle.setProperty('--smoke-shift', `${split * viewportWidth * 0.62}px`);
        heroStyle.setProperty('--smoke-rise', `${split * -viewportHeight * 0.065}px`);
        heroStyle.setProperty('--smoke-turn', `${split * 6}deg`);
        heroStyle.setProperty('--smoke-scale', `${1 + split * 0.12}`);
        heroStyle.setProperty('--smoke-base-opacity', `${1 - range(progress, 0, 0.3)}`);
        heroStyle.setProperty('--smoke-opacity', `${1 - range(progress, 0.26, 0.82)}`);
        heroStyle.setProperty('--light-opacity', `${1 - range(progress, 0, 0.52)}`);
        heroStyle.setProperty('--atmosphere-opacity', `${1 - range(progress, 0.62, 0.88)}`);
        heroStyle.setProperty('--hero-logo-opacity', `${1 - range(progress, 0.16, 0.56)}`);
        heroStyle.setProperty('--hero-copy-y', `${copyLift * -viewportHeight * 0.72}px`);
        heroStyle.setProperty('--hero-copy-opacity', `${1 - range(progress, 0.18, 0.52)}`);
        heroStyle.setProperty('--copy-shade', `${range(progress, 0.04, 0.28)}`);
        heroStyle.setProperty('--cue-opacity', `${1 - range(progress, 0, 0.12)}`);

        hero.dispatchEvent(new CustomEvent('smoke-progress'));

        if (cue) cue.inert = progress >= 0.12;
        if (heroContent) heroContent.inert = progress >= 0.52;
        previousHeroProgress = progress;
      }

      // Parallax Drifts on Section Titles
      sectionElements.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (top > y + viewportHeight * 1.4 || top + height < y - viewportHeight * 0.4) return;
        const entrance = clamp((y + viewportHeight * 0.92 - top) / (viewportHeight * 0.7));
        sec.style.setProperty('--section-line', `${ease(entrance)}`);
        if (top + height > y && top < y + viewportHeight) {
          const passage = clamp((y + viewportHeight - top) / (height + viewportHeight));
          sec.style.setProperty('--section-drift', `${(passage - 0.5) * 110}px`);
        }
      });

      // Parallax Tilt on Project Cards
      projectCards.forEach((card) => {
        const top = card.offsetTop;
        const height = card.offsetHeight;
        if (top + height < y - 80 || top > y + viewportHeight + 80) return;
        const passage = clamp((y + viewportHeight - top) / (viewportHeight + height));
        card.style.setProperty('--preview-y', `${(1 - passage * 2) * (viewportWidth < 600 ? 18 : 32)}px`);
        card.style.setProperty('--preview-tilt', `${(1 - passage) * 7}deg`);
      });
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(render);
    }

    // Scroll reveal observer
    if (typeof IntersectionObserver !== 'undefined') {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target;
            if (entry.isIntersecting) {
              el.classList.remove('reveal-pending');
              el.classList.add('is-revealed');
            } else if (entry.boundingClientRect.top >= window.innerHeight && !el.contains(document.activeElement)) {
              el.classList.add('reveal-pending');
              el.classList.remove('is-revealed');
            }
          });
        },
        { threshold: 0.06, rootMargin: '0px 0px -5% 0px' }
      );

      reveals.forEach((el) => {
        if (!el.classList.contains('is-revealed') && el.getBoundingClientRect().top >= window.innerHeight) {
          el.classList.add('reveal-pending');
        }
        revealObserver.observe(el);
      });
    }

    measure();
    render();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', () => {
      measure();
      schedule();
    }, { passive: true });
    document.fonts?.ready?.then(measure);
  })();

  /* -------------------------------------------------------------------------- */
  /* 4. Ambient Card Spotlights (Follow Cursor on Cards)                        */
  /* -------------------------------------------------------------------------- */
  (function initCardSpotlights() {
    const selector =
      '.service-card, .project-card, .product-card, .stat-card, .principle-card, .security-detail, .security-telemetry-hud, .contact-cta-card';
    const cards = document.querySelectorAll(selector);

    cards.forEach((card) => {
      card.addEventListener(
        'mousemove',
        (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        },
        { passive: true }
      );
    });
  })();

  /* -------------------------------------------------------------------------- */
  /* 5. Modals & Drawer Portals (Project Dialogs, Contact Dialog, Mobile Menu)   */
  /* -------------------------------------------------------------------------- */
  (function initModals() {
    const contactWrapper = document.getElementById('contact-dialog-wrapper');
    const project1Wrapper = document.getElementById('project-dialog-1-wrapper');
    const project2Wrapper = document.getElementById('project-dialog-2-wrapper');
    const drawerWrapper = document.getElementById('mobile-menu-drawer-wrapper');
    const selectProjectType = document.getElementById('contact-project-type');

    function openModal(wrapper) {
      if (!wrapper) return;
      wrapper.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      const focusable = wrapper.querySelector('input, select, textarea, button, a');
      if (focusable) setTimeout(() => focusable.focus(), 50);
    }

    function closeModal(wrapper) {
      if (!wrapper) return;
      wrapper.setAttribute('hidden', '');
      const anyOpen = document.querySelectorAll('.studio-modal-portal:not([hidden])').length > 0;
      if (!anyOpen) {
        document.body.style.overflow = '';
      }
    }

    function closeAllModals() {
      [contactWrapper, project1Wrapper, project2Wrapper, drawerWrapper].forEach(closeModal);
    }

    // Triggers for Contact Modal
    document.querySelectorAll('[data-open-contact]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(drawerWrapper);
        const subject = btn.dataset.subject || btn.dataset.serviceType;
        if (subject && selectProjectType) {
          selectProjectType.value = subject;
        }
        openModal(contactWrapper);
      });
    });

    // Triggers for Project 1 & 2
    document.querySelectorAll('[data-open-project]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.dataset.openProject;
        if (type === 'learning') openModal(project1Wrapper);
        else if (type === 'operations') openModal(project2Wrapper);
      });
    });

    // "Build something like this" buttons inside project dialogs
    document.querySelectorAll('[data-build-similar]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(project1Wrapper);
        closeModal(project2Wrapper);
        const similar = btn.dataset.buildSimilar;
        if (similar && selectProjectType) {
          selectProjectType.value = similar;
        }
        openModal(contactWrapper);
      });
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        openModal(drawerWrapper);
      });
    }

    // Close buttons & backdrop overlays
    document.querySelectorAll('[data-close-dialog]').forEach((btn) => {
      btn.addEventListener('click', () => {
        closeModal(contactWrapper);
        closeModal(project1Wrapper);
        closeModal(project2Wrapper);
      });
    });

    document.querySelectorAll('[data-close-drawer]').forEach((btn) => {
      btn.addEventListener('click', () => {
        closeModal(drawerWrapper);
      });
    });

    // Global ESC key closes active modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });
  })();

  /* -------------------------------------------------------------------------- */
  /* 6. Self-Contained Contact Form (Zero-Backend, WhatsApp & Email Dispatch)    */
  /* -------------------------------------------------------------------------- */
  (function initContactForm() {
    const form = document.getElementById('studio-contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const companyInput = document.getElementById('contact-company');
    const typeSelect = document.getElementById('contact-project-type');
    const msgInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit-btn');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const typeError = document.getElementById('projectType-error');
    const msgError = document.getElementById('message-error');
    const feedback = document.getElementById('form-feedback');

    const successState = document.getElementById('contact-success-state');
    const refText = document.getElementById('brief-ref-text');
    const resetBtn = document.getElementById('btn-reset-form');
    const waLink = document.getElementById('whatsapp-direct-link');
    const mailLink = document.getElementById('email-direct-link');

    function validate() {
      let valid = true;

      // Name
      if (!nameInput.value || nameInput.value.trim().length < 2) {
        nameError.textContent = 'Please enter your name (at least 2 characters).';
        nameError.removeAttribute('hidden');
        valid = false;
      } else {
        nameError.setAttribute('hidden', '');
      }

      // Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value || !emailPattern.test(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        emailError.removeAttribute('hidden');
        valid = false;
      } else {
        emailError.setAttribute('hidden', '');
      }

      // Project Type
      if (!typeSelect.value) {
        typeError.textContent = 'Please choose a project type.';
        typeError.removeAttribute('hidden');
        valid = false;
      } else {
        typeError.setAttribute('hidden', '');
      }

      // Message
      if (!msgInput.value || msgInput.value.trim().length < 10) {
        msgError.textContent = 'Tell us a little about your project (at least 10 characters).';
        msgError.removeAttribute('hidden');
        valid = false;
      } else {
        msgError.setAttribute('hidden', '');
      }

      return valid;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      feedback.setAttribute('hidden', '');

      if (!validate()) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Recording Brief...</span>`;

      setTimeout(() => {
        const refId = `CK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const company = companyInput ? companyInput.value.trim() : '';
        const projectType = typeSelect.value;
        const message = msgInput.value.trim();

        // Prepare WhatsApp and mailto links
        const whatsappMsg = `Hello CodeKraft Studio,\n\nRef: ${refId}\nName: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ''}\nProject Type: ${projectType}\n\nBrief:\n${message}`;
        const encodedWa = encodeURIComponent(whatsappMsg);
        waLink.href = `https://wa.me/919400750981?text=${encodedWa}`;

        const mailSubject = encodeURIComponent(`Project Brief: ${projectType} [${refId}]`);
        const mailBody = encodeURIComponent(whatsappMsg);
        mailLink.href = `mailto:codekraft.pvt@gmail.com?subject=${mailSubject}&body=${mailBody}`;

        refText.textContent = `Reference ID: ${refId}`;
        form.setAttribute('hidden', '');
        successState.removeAttribute('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Start a Project</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`;
      }, 350);
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        successState.setAttribute('hidden', '');
        form.removeAttribute('hidden');
      });
    }
  })();
})();
