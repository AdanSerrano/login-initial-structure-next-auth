"use client";

import { memo, useMemo } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";

export interface FormSliderFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  showMinMax?: boolean;
  sliderClassName?: string;
}

function FormSliderFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  formatValue,
  showMinMax = false,
  sliderClassName,
}: FormSliderFieldProps<TFieldValues, TName>) {
  const format = useMemo(
    () => formatValue ?? ((v: number) => String(v)),
    [formatValue]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center justify-between">
            {label && <FormLabel>{label}</FormLabel>}
            {showValue && (
              <span className="text-sm font-medium tabular-nums">
                {format(field.value ?? min)}
              </span>
            )}
          </div>
          <FormControl>
            <div className="space-y-2">
              <Slider
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                value={[field.value ?? min]}
                onValueChange={([value]) => field.onChange(value)}
                className={sliderClassName}
              />
              {showMinMax && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{format(min)}</span>
                  <span>{format(max)}</span>
                </div>
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
      )}
    />
  );
}

export const FormSliderField = memo(
  FormSliderFieldComponent
) as typeof FormSliderFieldComponent;

export interface FormRangeSliderFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  min?: number;
  max?: number;
  step?: number;
  showValues?: boolean;
  formatValue?: (value: number) => string;
  showMinMax?: boolean;
  sliderClassName?: string;
}

function FormRangeSliderFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  min = 0,
  max = 100,
  step = 1,
  showValues = true,
  formatValue,
  showMinMax = false,
  sliderClassName,
}: FormRangeSliderFieldProps<TFieldValues, TName>) {
  const format = useMemo(
    () => formatValue ?? ((v: number) => String(v)),
    [formatValue]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const values: [number, number] = field.value ?? [min, max];

        return (
          <FormItem className={className}>
            <div className="flex items-center justify-between">
              {label && <FormLabel>{label}</FormLabel>}
              {showValues && (
                <span className="text-sm font-medium tabular-nums">
                  {format(values[0])} - {format(values[1])}
                </span>
              )}
            </div>
            <FormControl>
              <div className="space-y-2">
                <Slider
                  min={min}
                  max={max}
                  step={step}
                  disabled={disabled}
                  value={values}
                  onValueChange={(newValues) =>
                    field.onChange(newValues as [number, number])
                  }
                  className={sliderClassName}
                />
                {showMinMax && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{format(min)}</span>
                    <span>{format(max)}</span>
                  </div>
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

export const FormRangeSliderField = memo(
  FormRangeSliderFieldComponent
) as typeof FormRangeSliderFieldComponent;
