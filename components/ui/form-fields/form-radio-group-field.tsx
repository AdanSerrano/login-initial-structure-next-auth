"use client";

import { memo } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps, SelectOption } from "./form-field.types";

export interface FormRadioGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  options: SelectOption[];
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "cards";
}

function FormRadioGroupFieldComponent<
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
  variant = "default",
}: FormRadioGroupFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-3", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          {description && (
            <FormDescription className="text-xs">
              {description}
            </FormDescription>
          )}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value ?? ""}
              disabled={disabled}
              className={cn(
                orientation === "horizontal"
                  ? "flex flex-wrap gap-4"
                  : "grid gap-3"
              )}
            >
              {options.map((option) =>
                variant === "cards" ? (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                      field.value === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                      option.disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <RadioGroupItem
                      value={option.value}
                      disabled={option.disabled}
                    />
                    <div className="flex-1 space-y-1">
                      <span className="text-sm font-medium">{option.label}</span>
                      {option.description && (
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </label>
                ) : (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`${name}-${option.value}`}
                      disabled={option.disabled}
                    />
                    <label
                      htmlFor={`${name}-${option.value}`}
                      className={cn(
                        "text-sm font-medium leading-none cursor-pointer",
                        option.disabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {option.label}
                      {option.description && (
                        <p className="text-xs text-muted-foreground font-normal mt-1">
                          {option.description}
                        </p>
                      )}
                    </label>
                  </div>
                )
              )}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const FormRadioGroupField = memo(
  FormRadioGroupFieldComponent
) as typeof FormRadioGroupFieldComponent;
