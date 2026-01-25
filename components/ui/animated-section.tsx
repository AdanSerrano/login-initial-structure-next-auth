"use client";

import { memo, useMemo } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type AnimationType = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade" | "scale" | "slide-up";

interface AnimatedSectionProps {
  as?: "div" | "li" | "span" | "section" | "article";
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

const animationStyles: Record<AnimationType, { initial: string; animate: string }> = {
  "fade-up": {
    initial: "opacity-0 translate-y-8",
    animate: "opacity-100 translate-y-0",
  },
  "fade-down": {
    initial: "opacity-0 -translate-y-8",
    animate: "opacity-100 translate-y-0",
  },
  "fade-left": {
    initial: "opacity-0 translate-x-8",
    animate: "opacity-100 translate-x-0",
  },
  "fade-right": {
    initial: "opacity-0 -translate-x-8",
    animate: "opacity-100 translate-x-0",
  },
  "fade": {
    initial: "opacity-0",
    animate: "opacity-100",
  },
  "scale": {
    initial: "opacity-0 scale-95",
    animate: "opacity-100 scale-100",
  },
  "slide-up": {
    initial: "opacity-0 translate-y-12",
    animate: "opacity-100 translate-y-0",
  },
};

export const AnimatedSection = memo(function AnimatedSection({
  as: Component = "div",
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 500,
  threshold = 0.1,
  triggerOnce = true,
}: AnimatedSectionProps) {
  const { ref, hasBeenInView } = useInView<HTMLElement>({
    threshold,
    triggerOnce,
  });

  const styles = useMemo(() => animationStyles[animation], [animation]);

  const transitionStyle = useMemo(
    () => ({
      transitionDuration: `${duration}ms`,
      transitionDelay: `${delay}ms`,
    }),
    [duration, delay]
  );

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement> & React.RefObject<HTMLLIElement>}
      className={cn(
        "transition-all ease-out",
        hasBeenInView ? styles.animate : styles.initial,
        className
      )}
      style={transitionStyle}
    >
      {children}
    </Component>
  );
});

AnimatedSection.displayName = "AnimatedSection";

// Componentes pre-configurados para uso común
export const FadeUp = memo(function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={delay} className={className}>
      {children}
    </AnimatedSection>
  );
});
FadeUp.displayName = "FadeUp";

export const FadeIn = memo(function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <AnimatedSection animation="fade" delay={delay} className={className}>
      {children}
    </AnimatedSection>
  );
});
FadeIn.displayName = "FadeIn";

export const ScaleIn = memo(function ScaleIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <AnimatedSection animation="scale" delay={delay} className={className}>
      {children}
    </AnimatedSection>
  );
});
ScaleIn.displayName = "ScaleIn";

export const SlideUp = memo(function SlideUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <AnimatedSection animation="slide-up" delay={delay} className={className}>
      {children}
    </AnimatedSection>
  );
});
SlideUp.displayName = "SlideUp";
