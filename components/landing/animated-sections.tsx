"use client";

import { memo, useMemo, Children } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";

interface AnimatedFeatureGridProps {
  children: React.ReactNode;
}

export const AnimatedFeatureGrid = memo(function AnimatedFeatureGrid({
  children,
}: AnimatedFeatureGridProps) {
  const childArray = useMemo(() => Children.toArray(children), [children]);

  return (
    <>
      {childArray.map((child, index) => (
        <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
          {child}
        </AnimatedSection>
      ))}
    </>
  );
});

AnimatedFeatureGrid.displayName = "AnimatedFeatureGrid";

interface AnimatedTechGridProps {
  children: React.ReactNode;
}

export const AnimatedTechGrid = memo(function AnimatedTechGrid({
  children,
}: AnimatedTechGridProps) {
  const childArray = useMemo(() => Children.toArray(children), [children]);

  return (
    <>
      {childArray.map((child, index) => (
        <AnimatedSection key={index} animation="scale" delay={index * 80}>
          {child}
        </AnimatedSection>
      ))}
    </>
  );
});

AnimatedTechGrid.displayName = "AnimatedTechGrid";

interface AnimatedBenefitsListProps {
  children: React.ReactNode;
}

export const AnimatedBenefitsList = memo(function AnimatedBenefitsList({
  children,
}: AnimatedBenefitsListProps) {
  const childArray = useMemo(() => Children.toArray(children), [children]);

  return (
    <>
      {childArray.map((child, index) => (
        <AnimatedSection key={index} animation="fade-left" delay={index * 80}>
          {child}
        </AnimatedSection>
      ))}
    </>
  );
});

AnimatedBenefitsList.displayName = "AnimatedBenefitsList";
