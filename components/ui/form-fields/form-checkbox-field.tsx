"use client";

import { memo, type ReactNode } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps, SelectOption } from "./form-field.types";

export interface FormCheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  labelPosition?: "left" | "right";
  checkboxClassName?: string;
}

function FormCheckboxFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  labelPosition = "right",
  checkboxClassName,
}: FormCheckboxFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start space-x-3 space-y-0",
            className
          )}
        >
          {labelPosition === "left" && label && (
            <div className="space-y-1 leading-none flex-1">
              <FormLabel className="cursor-pointer">{label}</FormLabel>
              {description && (
                <FormDescription className="text-xs">
                  {description}
                </FormDescription>
              )}
            </div>
          )}
          <FormControl>
            <Checkbox
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={checkboxClassName}
            />
          </FormControl>
          {labelPosition === "right" && label && (
            <div className="space-y-1 leading-none">
              <FormLabel className="cursor-pointer">{label}</FormLabel>
              {description && (
                <FormDescription className="text-xs">
                  {description}
                </FormDescription>
              )}
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const FormCheckboxField = memo(
  FormCheckboxFieldComponent
) as typeof FormCheckboxFieldComponent;

export interface FormCheckboxGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  options: SelectOption[];
  orientation?: "horizontal" | "vertical";
  columns?: 1 | 2 | 3 | 4;
}

function FormCheckboxGroupFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  options,
  orientation = "vertical",
  columns = 1,
}: FormCheckboxGroupFieldProps<TFieldValues, TName>) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues: string[] = field.value ?? [];

        const handleToggle = (value: string, checked: boolean) => {
          if (checked) {
            field.onChange([...selectedValues, value]);
          } else {
            field.onChange(selectedValues.filter((v) => v !== value));
          }
        };

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            {description && (
              <FormDescription className="text-xs">
                {description}
              </FormDescription>
            )}
            <div
              className={cn(
                orientation === "horizontal"
                  ? "flex flex-wrap gap-4"
                  : `grid gap-3 ${gridClass}`
              )}
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleToggle(option.value, checked === true)
                    }
                    disabled={disabled || option.disabled}
                  />
                  <div className="space-y-1 leading-none">
                    <label className="text-sm font-medium cursor-pointer">
                      {option.label}
                    </label>
                    {option.description && (
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export const FormCheckboxGroupField = memo(
  FormCheckboxGroupFieldComponent
) as typeof FormCheckboxGroupFieldComponent;
