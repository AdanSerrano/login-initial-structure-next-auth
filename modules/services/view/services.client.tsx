"use client";

import { memo, Children, useMemo } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";

interface ServicesClientWrapperProps {
  children: React.ReactNode;
}

export const ServicesClientWrapper = memo(function ServicesClientWrapper({
  children,
}: ServicesClientWrapperProps) {
  const childArray = useMemo(() => Children.toArray(children), [children]);

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {childArray.map((child, index) => (
        <AnimatedSection
          key={index}
          animation="fade-up"
          delay={index * 100}
          className="h-full"
        >
          {child}
        </AnimatedSection>
      ))}
    </div>
  );
});

ServicesClientWrapper.displayName = "ServicesClientWrapper";
