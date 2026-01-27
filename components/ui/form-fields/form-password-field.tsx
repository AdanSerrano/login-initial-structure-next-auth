"use client";

import { memo, useMemo, useCallback, useRef, type ReactNode } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/pasword-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Copy, CheckCheck } from "lucide-react";
import type { BaseFormFieldProps } from "./form-field.types";
import { calculatePasswordStrength } from "./form-field.types";
import { FormFieldTooltip } from "./form-field-tooltip";

export interface PasswordStrengthLabels {
  requirements?: string;
  minChars?: string;
  uppercase?: string;
  lowercase?: string;
  number?: string;
  specialChar?: string;
}

export interface FormPasswordFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  autoComplete?: "current-password" | "new-password" | "off";
  showStrengthIndicator?: boolean;
  showRequirements?: boolean;
  showCopyButton?: boolean;
  strengthLabels?: PasswordStrengthLabels;
  inputClassName?: string;
  labelExtra?: ReactNode;
  onCopied?: () => void;
}

const STRENGTH_COLORS = [
  "bg-destructive",
  "bg-destructive",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
];

const STRENGTH_WIDTHS = ["w-0", "w-1/5", "w-2/5", "w-3/5", "w-4/5", "w-full"];

function FormPasswordFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "••••••••",
  disabled,
  className,
  required,
  tooltip,
  autoComplete = "current-password",
  showStrengthIndicator = false,
  showRequirements = false,
  showCopyButton = false,
  strengthLabels,
  inputClassName,
  labelExtra,
  onCopied,
}: FormPasswordFieldProps<TFieldValues, TName>) {
  const copiedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const defaultLabels: Required<PasswordStrengthLabels> = {
    requirements: "Password requirements",
    minChars: "8+ characters",
    uppercase: "Uppercase letter",
    lowercase: "Lowercase letter",
    number: "Number",
    specialChar: "Special character",
  };

  const labels = { ...defaultLabels, ...strengthLabels };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { level, requirements } = useMemo(
          () => calculatePasswordStrength(field.value ?? ""),
          [field.value]
        );

        const hasValue = Boolean(field.value);

        const handleCopy = useCallback(async () => {
          if (!field.value) return;

          try {
            await navigator.clipboard.writeText(field.value);
            copiedRef.current = true;

            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
              copiedRef.current = false;
            }, 2000);

            onCopied?.();
          } catch {
            // Clipboard API not available
          }
        }, [field.value, onCopied]);

        return (
          <FormItem className={className}>
            {(label || labelExtra) && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {label && (
                    <FormLabel>
                      {label}
                      {required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </FormLabel>
                  )}
                  {tooltip && <FormFieldTooltip tooltip={tooltip} />}
                </div>
                {labelExtra}
              </div>
            )}
            <FormControl>
              <div className="relative">
                <PasswordInput
                  {...field}
                  placeholder={placeholder}
                  disabled={disabled}
                  autoComplete={autoComplete}
                  value={field.value ?? ""}
                  className={cn(
                    "bg-background",
                    showCopyButton ? "pr-20" : "pr-10",
                    fieldState.error && "border-destructive",
                    inputClassName
                  )}
                />
                {showCopyButton && hasValue && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={handleCopy}
                    disabled={disabled}
                  >
                    {copiedRef.current ? (
                      <CheckCheck className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </FormControl>

            {showStrengthIndicator && hasValue && (
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      STRENGTH_COLORS[level],
                      STRENGTH_WIDTHS[level + 1]
                    )}
                  />
                </div>
              </div>
            )}

            {showRequirements && hasValue && (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm font-medium mb-3">{labels.requirements}</p>
                <div className="grid grid-cols-2 gap-2">
                  {requirements.map((req) => (
                    <div
                      key={req.label}
                      className={cn(
                        "flex items-center gap-2 text-xs",
                        req.met ? "text-green-600" : "text-muted-foreground"
                      )}
                    >
                      {req.met ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      {labels[req.label as keyof PasswordStrengthLabels]}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {description && (
              <FormDescription className="text-xs">
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export const FormPasswordField = memo(
  FormPasswordFieldComponent
) as typeof FormPasswordFieldComponent;
