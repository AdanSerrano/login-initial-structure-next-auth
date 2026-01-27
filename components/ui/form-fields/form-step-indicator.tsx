"use client";

import { memo, useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Check, Circle, Loader2 } from "lucide-react";

export interface FormStep {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

export interface FormStepIndicatorProps {
  steps: FormStep[];
  currentStep: number;
  completedSteps?: number[];
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "compact" | "numbered";
  showLabels?: boolean;
  showDescriptions?: boolean;
  isLoading?: boolean;
  onStepClick?: (stepIndex: number) => void;
  allowNavigation?: boolean;
  className?: string;
}

function FormStepIndicatorComponent({
  steps,
  currentStep,
  completedSteps = [],
  orientation = "horizontal",
  variant = "default",
  showLabels = true,
  showDescriptions = false,
  isLoading = false,
  onStepClick,
  allowNavigation = false,
  className,
}: FormStepIndicatorProps) {
  const getStepStatus = useMemo(() => {
    return (index: number): "completed" | "current" | "upcoming" => {
      if (completedSteps.includes(index)) return "completed";
      if (index === currentStep) return "current";
      return "upcoming";
    };
  }, [currentStep, completedSteps]);

  const handleStepClick = (index: number) => {
    if (!allowNavigation || !onStepClick) return;
    const status = getStepStatus(index);
    if (status === "completed" || (status === "upcoming" && index < currentStep)) {
      onStepClick(index);
    }
  };

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        {steps.map((_, index) => {
          const status = getStepStatus(index);
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleStepClick(index)}
              disabled={!allowNavigation}
              className={cn(
                "h-2 rounded-full transition-all",
                status === "completed" && "w-8 bg-primary",
                status === "current" && "w-8 bg-primary",
                status === "upcoming" && "w-2 bg-muted-foreground/30",
                allowNavigation && status !== "upcoming" && "cursor-pointer hover:opacity-80"
              )}
            />
          );
        })}
      </div>
    );
  }

  if (orientation === "vertical") {
    return (
      <div className={cn("flex flex-col", className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex">
              <div className="flex flex-col items-center mr-4">
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={!allowNavigation}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    status === "completed" && "border-primary bg-primary text-primary-foreground",
                    status === "current" && "border-primary bg-background text-primary",
                    status === "upcoming" && "border-muted-foreground/30 bg-background text-muted-foreground",
                    allowNavigation && status !== "upcoming" && "cursor-pointer hover:opacity-80"
                  )}
                >
                  {isLoading && status === "current" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : status === "completed" ? (
                    <Check className="h-5 w-5" />
                  ) : variant === "numbered" ? (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  ) : (
                    step.icon ?? <Circle className="h-3 w-3 fill-current" />
                  )}
                </button>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-[24px] my-1",
                      completedSteps.includes(index)
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    )}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                {showLabels && (
                  <p
                    className={cn(
                      "font-medium leading-10",
                      status === "current" && "text-primary",
                      status === "upcoming" && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                )}
                {showDescriptions && step.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.id}
              className={cn("flex items-center", !isLast && "flex-1")}
            >
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={!allowNavigation}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    status === "completed" && "border-primary bg-primary text-primary-foreground",
                    status === "current" && "border-primary bg-background text-primary",
                    status === "upcoming" && "border-muted-foreground/30 bg-background text-muted-foreground",
                    allowNavigation && status !== "upcoming" && "cursor-pointer hover:opacity-80"
                  )}
                >
                  {isLoading && status === "current" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : status === "completed" ? (
                    <Check className="h-5 w-5" />
                  ) : variant === "numbered" ? (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  ) : (
                    step.icon ?? <Circle className="h-3 w-3 fill-current" />
                  )}
                </button>
                {showLabels && (
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium text-center max-w-[80px]",
                      status === "current" && "text-primary",
                      status === "upcoming" && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    completedSteps.includes(index)
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      {showDescriptions && steps[currentStep]?.description && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          {steps[currentStep].description}
        </p>
      )}
    </div>
  );
}

export const FormStepIndicator = memo(FormStepIndicatorComponent);
FormStepIndicator.displayName = "FormStepIndicator";
