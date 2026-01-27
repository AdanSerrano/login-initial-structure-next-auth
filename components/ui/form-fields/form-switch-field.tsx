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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";

export interface FormSwitchFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  labelPosition?: "left" | "right";
  switchClassName?: string;
  reverse?: boolean;
}

function FormSwitchFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  labelPosition = "left",
  switchClassName,
  reverse = false,
}: FormSwitchFieldProps<TFieldValues, TName>) {
  const showLabelFirst = reverse
    ? labelPosition === "right"
    : labelPosition === "left";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm",
            className
          )}
        >
          {showLabelFirst && label && (
            <div className="space-y-0.5">
              <FormLabel className="cursor-pointer">{label}</FormLabel>
              {description && (
                <FormDescription className="text-xs">
                  {description}
                </FormDescription>
              )}
            </div>
          )}
          <FormControl>
            <Switch
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={switchClassName}
            />
          </FormControl>
          {!showLabelFirst && label && (
            <div className="space-y-0.5">
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

export const FormSwitchField = memo(
  FormSwitchFieldComponent
) as typeof FormSwitchFieldComponent;

export interface FormSwitchInlineFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  switchClassName?: string;
}

function FormSwitchInlineFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  switchClassName,
}: FormSwitchInlineFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn("flex flex-row items-center gap-3", className)}
        >
          <FormControl>
            <Switch
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={switchClassName}
            />
          </FormControl>
          {label && (
            <div className="space-y-0.5">
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

export const FormSwitchInlineField = memo(
  FormSwitchInlineFieldComponent
) as typeof FormSwitchInlineFieldComponent;
