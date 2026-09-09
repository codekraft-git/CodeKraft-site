'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMotionValue, animate, motion } from 'motion/react';
import { cn } from '@/lib/utils';

export type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 24,
  speed = 40,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentSize, setContentSize] = useState(0);
  const translation = useMotionValue(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const size = direction === 'horizontal' ? entry.contentRect.width : entry.contentRect.height;
        if (size > 0) {
          setContentSize(size);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, children]);

  useEffect(() => {
    if (!contentSize) return;

    const currentSpeed = isHovering && speedOnHover !== undefined ? speedOnHover : speed;
    if (currentSpeed === 0) return;

    const totalDistance = contentSize + gap;
    const duration = totalDistance / Math.max(1, currentSpeed);
    const startVal = reverse ? -totalDistance : 0;
    const endVal = reverse ? 0 : -totalDistance;

    const controls = animate(translation, [startVal, endVal], {
      ease: 'linear',
      duration: Math.max(0.2, duration),
      repeat: Infinity,
      repeatType: 'loop',
    });

    return () => controls.stop();
  }, [contentSize, gap, speed, speedOnHover, isHovering, reverse, translation]);

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden relative select-none', className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className={cn(
          'flex flex-nowrap w-max',
          !isHorizontal && 'flex-col h-max'
        )}
        style={{
          gap: `${gap}px`,
          ...(isHorizontal ? { x: translation } : { y: translation }),
        }}
      >
        <div
          ref={contentRef}
          className={cn(
            'flex flex-nowrap shrink-0 items-center',
            !isHorizontal && 'flex-col'
          )}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
        <div
          className={cn(
            'flex flex-nowrap shrink-0 items-center',
            !isHorizontal && 'flex-col'
          )}
          style={{ gap: `${gap}px` }}
          aria-hidden="true"
        >
          {children}
        </div>
        <div
          className={cn(
            'flex flex-nowrap shrink-0 items-center',
            !isHorizontal && 'flex-col'
          )}
          style={{ gap: `${gap}px` }}
          aria-hidden="true"
        >
          {children}
        </div>
        <div
          className={cn(
            'flex flex-nowrap shrink-0 items-center',
            !isHorizontal && 'flex-col'
          )}
          style={{ gap: `${gap}px` }}
          aria-hidden="true"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
