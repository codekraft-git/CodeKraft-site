"use client";

import { useEffect, useRef, useState } from "react";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => value * value * (3 - 2 * value);
const range = (value: number, start: number, end: number) => ease(clamp((value - start) / (end - start)));

/** Native scrolling drives one frame. Layout measurements are cached until resizing. */
export function useScrollMotion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [postHero, setPostHero] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stage = root.querySelector<HTMLElement>(".hero-scroll-stage")!;
    const hero = root.querySelector<HTMLElement>(".hero")!;
    const heroContent = hero.querySelector<HTMLElement>(".hero-content")!;
    const cue = hero.querySelector<HTMLElement>(".scroll-indicator")!;
    const progressBar = root.querySelector<HTMLElement>(".reading-progress > span")!;
    const sectionElements = Array.from(root.querySelectorAll<HTMLElement>("main > .section"));
    const projectElements = Array.from(root.querySelectorAll<HTMLElement>(".projects-grid > .project-card"));
    const reveals = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches;
    let frame = 0;
    let measureNeeded = true;
    let disposed = false;
    let viewportHeight = 0;
    let viewportWidth = 0;
    let maxScroll = 1;
    let stageTop = 0;
    let heroTravel = 1;
    let previousHeroProgress = -1;
    let currentSection = "";
    let headerScrolled = false;
    let revealObserver: IntersectionObserver | undefined;
    let sections: { element: HTMLElement; top: number; height: number }[] = [];
    let projects: { element: HTMLElement; top: number; height: number }[] = [];
    const smokeEvent = new Event("smoke-progress");

    const measure = () => {
      const y = window.scrollY;
      viewportHeight = window.innerHeight;
      viewportWidth = document.documentElement.clientWidth;
      maxScroll = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
      stageTop = stage.getBoundingClientRect().top + y;
      heroTravel = Math.max(1, stage.offsetHeight - hero.offsetHeight);
      sections = sectionElements.map(element => ({ element, top: element.getBoundingClientRect().top + y, height: element.offsetHeight }));
      projects = projectElements.map(element => {
        // offsetTop ignores the card's entrance transform.
        let top = 0;
        let node: HTMLElement | null = element;
        while (node) { top += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
        return { element, top, height: element.offsetHeight };
      });
      root.querySelectorAll<HTMLElement>(".services-grid, .projects-grid, .products-grid, .principles-grid").forEach(group => {
        const columns = getComputedStyle(group).gridTemplateColumns.split(" ").filter(Boolean).length || 1;
        Array.from(group.children).forEach((child, index) => {
          if (child instanceof HTMLElement) child.style.setProperty("--reveal-delay", `${(index % columns) * 90}ms`);
        });
      });
      previousHeroProgress = -1;
      measureNeeded = false;
    };

    const render = () => {
      frame = 0;
      if (disposed) return;
      if (measureNeeded) measure();
      const y = Math.max(0, window.scrollY);
      const progress = clamp((y - stageTop) / heroTravel);
      const isScrolled = progress >= 0.85;
      if (headerScrolled !== isScrolled) { headerScrolled = isScrolled; setScrolled(isScrolled); }
      const isPostHero = progress >= 0.25;
      setPostHero(isPostHero);
      root.dataset.postHero = isPostHero ? "true" : "false";
      const postHeroOpacity = range(progress, 0.65, 0.92);
      const cosmicLogoOpacity = range(progress, 0.16, 0.56);
      const glassTrap = range(progress, 0.16, 0.68);
      const starsOpacity = 0.78 + 0.22 * range(progress, 0.10, 0.65);
      const smokeAuraOpacity = 0.13 + 0.06 * range(progress, 0.15, 0.80);
      root.style.setProperty("--post-hero-opacity", `${postHeroOpacity}`);
      root.style.setProperty("--cosmic-logo-opacity", `${cosmicLogoOpacity}`);
      root.style.setProperty("--glass-trap", `${glassTrap}`);
      root.style.setProperty("--stars-opacity", `${starsOpacity}`);
      root.style.setProperty("--smoke-aura-opacity", `${smokeAuraOpacity}`);
      root.style.setProperty("--scroll-y", `${y}px`);
      let active = "home";
      for (const section of sections) if (section.top <= y + Math.min(180, viewportHeight * .25)) active = section.element.id;
      if (y >= maxScroll - 8) active = "contact";
      if (active !== currentSection) { currentSection = active; setActiveSection(active); }
      progressBar.style.transform = `scaleX(${clamp(y / maxScroll)})`;
      if (reduced) return;
      if (progress !== previousHeroProgress) {
        const split = ease(progress);
        const copyLift = ease(range(progress, 0.16, 0.56));
        const heroStyle = hero.style;
        heroStyle.setProperty("--smoke-progress", `${progress}`);
        heroStyle.setProperty("--smoke-shift", `${split * viewportWidth * .62}px`);
        heroStyle.setProperty("--smoke-rise", `${split * -viewportHeight * .065}px`);
        heroStyle.setProperty("--smoke-turn", `${split * 6}deg`);
        heroStyle.setProperty("--smoke-scale", `${1 + split * .12}`);
        heroStyle.setProperty("--smoke-base-opacity", `${1 - range(progress, 0, .30)}`);
        heroStyle.setProperty("--smoke-opacity", `${1 - range(progress, .26, .82)}`);
        heroStyle.setProperty("--light-opacity", `${1 - range(progress, 0, .52)}`);
        heroStyle.setProperty("--atmosphere-opacity", `${1 - range(progress, .62, .88)}`);
        heroStyle.setProperty("--hero-logo-opacity", `${1 - range(progress, 0.16, 0.56)}`);
        heroStyle.setProperty("--hero-copy-y", `${copyLift * -viewportHeight * 0.72}px`);
        heroStyle.setProperty("--hero-copy-opacity", `${1 - range(progress, 0.18, 0.52)}`);
        heroStyle.setProperty("--copy-shade", `${range(progress, .04, .28)}`);
        heroStyle.setProperty("--cue-opacity", `${1 - range(progress, 0, .12)}`);

        hero.dispatchEvent(smokeEvent);

        // The scroll cue and hero copy become decorative/inert as they dissolve cleanly
        cue.inert = progress >= .12;
        heroContent.inert = progress >= .52;
        previousHeroProgress = progress;
      }
      for (const section of sections) {
        if (section.top > y + viewportHeight * 1.4 || section.top + section.height < y - viewportHeight * 0.4) continue;
        const entrance = clamp((y + viewportHeight * .92 - section.top) / (viewportHeight * .7));
        section.element.style.setProperty("--section-line", `${ease(entrance)}`);
        if (section.top + section.height > y && section.top < y + viewportHeight) {
          const passage = clamp((y + viewportHeight - section.top) / (section.height + viewportHeight));
          section.element.style.setProperty("--section-drift", `${(passage - .5) * 110}px`);
        }
      }
      for (const project of projects) {
        if (project.top + project.height < y - 80 || project.top > y + viewportHeight + 80) continue;
        const passage = clamp((y + viewportHeight - project.top) / (viewportHeight + project.height));
        project.element.style.setProperty("--preview-y", `${(1 - passage * 2) * (viewportWidth < 600 ? 18 : 32)}px`);
        project.element.style.setProperty("--preview-tilt", `${(1 - passage) * 7}deg`);
      }
    };

    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(render); };
    const invalidate = () => { measureNeeded = true; schedule(); };
    const show = (element: HTMLElement) => {
      element.classList.remove("reveal-pending");
      element.classList.add("is-revealed");
    };
    const configureMotion = () => {
      reduced = preference.matches;
      root.dataset.motion = reduced ? "reduced" : "full";
      revealObserver?.disconnect();
      reveals.forEach(element => element.classList.remove("reveal-pending"));
      heroContent.inert = false;
      cue.inert = false;
      if (!reduced && "IntersectionObserver" in window) {
        revealObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            const element = entry.target as HTMLElement;
            if (entry.isIntersecting) show(element);
            else if (entry.boundingClientRect.top >= window.innerHeight && !element.contains(document.activeElement)) {
              element.classList.add("reveal-pending");
              element.classList.remove("is-revealed");
            }
          });
        }, { threshold: .06, rootMargin: "0px 0px -5% 0px" });
        reveals.forEach(element => {
          if (!element.classList.contains("is-revealed") && element.getBoundingClientRect().top >= window.innerHeight) {
            element.classList.add("reveal-pending");
          }
          revealObserver!.observe(element);
        });
      }
      invalidate();
    };
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      const pending = event.target.closest<HTMLElement>(".reveal-pending");
      if (pending) show(pending);
    };

    configureMotion();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    window.addEventListener("pageshow", invalidate);
    window.addEventListener("load", invalidate);
    preference.addEventListener("change", configureMotion);
    root.addEventListener("focusin", revealFocused);
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(invalidate) : undefined;
    [root, stage, hero, ...sectionElements].forEach(element => resizeObserver?.observe(element));
    document.fonts?.ready.then(() => { if (!disposed) invalidate(); });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("pageshow", invalidate);
      window.removeEventListener("load", invalidate);
      preference.removeEventListener("change", configureMotion);
      root.removeEventListener("focusin", revealFocused);
      revealObserver?.disconnect();
      resizeObserver?.disconnect();
      reveals.forEach(element => element.classList.remove("reveal-pending"));
      heroContent.inert = false;
      cue.inert = false;
      delete root.dataset.motion;
    };
  }, []);

  return { rootRef, activeSection, scrolled, postHero };
}
