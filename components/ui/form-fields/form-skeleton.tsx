"use client";

import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface FormSkeletonFieldProps {
  showLabel?: boolean;
  showDescription?: boolean;
  inputHeight?: "sm" | "md" | "lg" | "textarea";
  className?: string;
}

function FormSkeletonFieldComponent({
  showLabel = true,
  showDescription = false,
  inputHeight = "md",
  className,
}: FormSkeletonFieldProps) {
  const heights = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    textarea: "h-24",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && <Skeleton className="h-4 w-24" />}
      <Skeleton className={cn("w-full", heights[inputHeight])} />
      {showDescription && <Skeleton className="h-3 w-48" />}
    </div>
  );
}

export const FormSkeletonField = memo(FormSkeletonFieldComponent);
FormSkeletonField.displayName = "FormSkeletonField";

export interface FormSkeletonProps {
  fields?: number;
  showLabels?: boolean;
  showDescriptions?: boolean;
  columns?: 1 | 2 | 3;
  showSubmitButton?: boolean;
  className?: string;
}

function FormSkeletonComponent({
  fields = 3,
  showLabels = true,
  showDescriptions = false,
  columns = 1,
  showSubmitButton = true,
  className,
}: FormSkeletonProps) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  }[columns];

  return (
    <div className={cn("space-y-6", className)}>
      <div className={cn("grid gap-4", gridClass)}>
        {Array.from({ length: fields }).map((_, index) => (
          <FormSkeletonField
            key={index}
            showLabel={showLabels}
            showDescription={showDescriptions}
          />
        ))}
      </div>
      {showSubmitButton && (
        <Skeleton className="h-10 w-32" />
      )}
    </div>
  );
}

export const FormSkeleton = memo(FormSkeletonComponent);
FormSkeleton.displayName = "FormSkeleton";

export interface FormSkeletonSectionProps {
  title?: boolean;
  description?: boolean;
  fields?: number;
  className?: string;
}

function FormSkeletonSectionComponent({
  title = true,
  description = false,
  fields = 2,
  className,
}: FormSkeletonSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          {description && <Skeleton className="h-4 w-64" />}
        </div>
      )}
      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, index) => (
          <FormSkeletonField key={index} />
        ))}
      </div>
    </div>
  );
}

export const FormSkeletonSection = memo(FormSkeletonSectionComponent);
FormSkeletonSection.displayName = "FormSkeletonSection";
