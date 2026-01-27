"use client";

import { memo, useMemo, useCallback } from "react";
import type { FieldErrors, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface FormValidationSummaryProps<TFieldValues extends FieldValues = FieldValues> {
  errors: FieldErrors<TFieldValues>;
  fieldLabels?: Record<string, string>;
  maxErrors?: number;
  variant?: "default" | "compact" | "inline";
  showIcon?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
  onErrorClick?: (fieldName: string) => void;
  onDismiss?: () => void;
  labels?: {
    title?: string;
    singleError?: string;
    multipleErrors?: string;
    showMore?: string;
    showLess?: string;
  };
  className?: string;
}

interface FlatError {
  field: string;
  message: string;
}

function flattenErrors(
  errors: FieldErrors,
  prefix = ""
): FlatError[] {
  const result: FlatError[] = [];

  for (const [key, value] of Object.entries(errors)) {
    const fieldPath = prefix ? `${prefix}.${key}` : key;

    if (value?.message && typeof value.message === "string") {
      result.push({ field: fieldPath, message: value.message });
    } else if (typeof value === "object" && value !== null) {
      result.push(...flattenErrors(value as FieldErrors, fieldPath));
    }
  }

  return result;
}

function FormValidationSummaryComponent<TFieldValues extends FieldValues = FieldValues>({
  errors,
  fieldLabels = {},
  maxErrors = 5,
  variant = "default",
  showIcon = true,
  collapsible = false,
  defaultOpen = true,
  onErrorClick,
  onDismiss,
  labels,
  className,
}: FormValidationSummaryProps<TFieldValues>) {
  const mergedLabels = {
    title: "Please fix the following errors:",
    singleError: "error",
    multipleErrors: "errors",
    showMore: "Show all",
    showLess: "Show less",
    ...labels,
  };

  const flatErrors = useMemo(() => flattenErrors(errors), [errors]);

  const visibleErrors = useMemo(
    () => flatErrors.slice(0, maxErrors),
    [flatErrors, maxErrors]
  );

  const hasMore = flatErrors.length > maxErrors;
  const errorCount = flatErrors.length;

  const getFieldLabel = useCallback(
    (fieldName: string) => {
      return fieldLabels[fieldName] ?? fieldName.split(".").pop() ?? fieldName;
    },
    [fieldLabels]
  );

  const handleErrorClick = useCallback(
    (fieldName: string) => {
      if (onErrorClick) {
        onErrorClick(fieldName);
      } else {
        const element = document.querySelector(`[name="${fieldName}"]`);
        if (element instanceof HTMLElement) {
          element.focus();
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    },
    [onErrorClick]
  );

  if (errorCount === 0) return null;

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-sm text-destructive",
          className
        )}
      >
        {showIcon && <AlertCircle className="h-4 w-4 shrink-0" />}
        <span>
          {errorCount} {errorCount === 1 ? mergedLabels.singleError : mergedLabels.multipleErrors}
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2",
          className
        )}
      >
        <div className="flex items-center gap-2">
          {showIcon && <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />}
          <span className="text-sm font-medium">
            {errorCount} {errorCount === 1 ? mergedLabels.singleError : mergedLabels.multipleErrors}
          </span>
        </div>
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  const content = (
    <div className="space-y-2">
      <ul className="space-y-1">
        {visibleErrors.map(({ field, message }) => (
          <li key={field} className="flex items-start gap-2">
            <span className="text-destructive mt-0.5">•</span>
            <button
              type="button"
              onClick={() => handleErrorClick(field)}
              className="text-left text-sm hover:underline focus:outline-none focus:underline"
            >
              <span className="font-medium">{getFieldLabel(field)}:</span>{" "}
              <span className="text-muted-foreground">{message}</span>
            </button>
          </li>
        ))}
      </ul>
      {hasMore && (
        <p className="text-xs text-muted-foreground">
          +{flatErrors.length - maxErrors} more {flatErrors.length - maxErrors === 1 ? "error" : "errors"}
        </p>
      )}
    </div>
  );

  if (collapsible) {
    return (
      <Collapsible defaultOpen={defaultOpen} className={className}>
        <div
          className={cn(
            "rounded-lg border border-destructive/50 bg-destructive/10 overflow-hidden"
          )}
        >
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 hover:bg-destructive/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                {showIcon && <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />}
                <span className="text-sm font-medium">{mergedLabels.title}</span>
                <span className="text-xs text-muted-foreground">
                  ({errorCount} {errorCount === 1 ? mergedLabels.singleError : mergedLabels.multipleErrors})
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-3 border-t border-destructive/20 pt-3">
              {content}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-destructive/50 bg-destructive/10 p-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {showIcon && <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />}
          <p className="text-sm font-medium">{mergedLabels.title}</p>
        </div>
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mt-1 -mr-1"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {content}
    </div>
  );
}

export const FormValidationSummary = memo(
  FormValidationSummaryComponent
) as typeof FormValidationSummaryComponent;
