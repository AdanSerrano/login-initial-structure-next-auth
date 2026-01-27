"use client";

import { memo, useCallback, type ReactNode } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import type { BaseFormFieldProps } from "./form-field.types";

export interface FormNumberFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  min?: number;
  max?: number;
  step?: number;
  showControls?: boolean;
  controlsPosition?: "sides" | "right";
  allowDecimal?: boolean;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  inputClassName?: string;
}

function FormNumberFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder,
  disabled,
  className,
  required,
  min,
  max,
  step = 1,
  showControls = false,
  controlsPosition = "right",
  allowDecimal = false,
  decimalPlaces = 2,
  prefix,
  suffix,
  inputClassName,
}: FormNumberFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const currentValue = typeof field.value === "number" ? field.value : 0;

        const handleIncrement = useCallback(() => {
          const newValue = currentValue + step;
          if (max !== undefined && newValue > max) return;
          field.onChange(
            allowDecimal
              ? parseFloat(newValue.toFixed(decimalPlaces))
              : newValue
          );
        }, [currentValue, field]);

        const handleDecrement = useCallback(() => {
          const newValue = currentValue - step;
          if (min !== undefined && newValue < min) return;
          field.onChange(
            allowDecimal
              ? parseFloat(newValue.toFixed(decimalPlaces))
              : newValue
          );
        }, [currentValue, field]);

        const handleChange = useCallback(
          (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === "") {
              field.onChange(undefined);
              return;
            }

            const parsed = allowDecimal
              ? parseFloat(value)
              : parseInt(value, 10);

            if (isNaN(parsed)) return;
            if (min !== undefined && parsed < min) return;
            if (max !== undefined && parsed > max) return;

            field.onChange(
              allowDecimal ? parseFloat(parsed.toFixed(decimalPlaces)) : parsed
            );
          },
          [field, min, max, allowDecimal, decimalPlaces]
        );

        const canDecrement = min === undefined || currentValue > min;
        const canIncrement = max === undefined || currentValue < max;

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div
                className={cn(
                  "flex items-center",
                  controlsPosition === "sides" && "gap-2"
                )}
              >
                {showControls && controlsPosition === "sides" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={disabled || !canDecrement}
                    onClick={handleDecrement}
                    className="h-9 w-9 shrink-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}

                <div className="relative flex-1">
                  {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {prefix}
                    </span>
                  )}
                  <Input
                    type="number"
                    inputMode={allowDecimal ? "decimal" : "numeric"}
                    placeholder={placeholder}
                    disabled={disabled}
                    min={min}
                    max={max}
                    step={step}
                    value={field.value ?? ""}
                    onChange={handleChange}
                    onBlur={field.onBlur}
                    className={cn(
                      "bg-background",
                      "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                      prefix && "pl-8",
                      suffix && "pr-8",
                      showControls && controlsPosition === "right" && "pr-20",
                      fieldState.error && "border-destructive",
                      inputClassName
                    )}
                  />
                  {suffix && !showControls && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {suffix}
                    </span>
                  )}

                  {showControls && controlsPosition === "right" && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={disabled || !canDecrement}
                        onClick={handleDecrement}
                        className="h-7 w-7"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={disabled || !canIncrement}
                        onClick={handleIncrement}
                        className="h-7 w-7"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {showControls && controlsPosition === "sides" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={disabled || !canIncrement}
                    onClick={handleIncrement}
                    className="h-9 w-9 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </FormControl>
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

export const FormNumberField = memo(
  FormNumberFieldComponent
) as typeof FormNumberFieldComponent;
