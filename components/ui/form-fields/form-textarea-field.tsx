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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";

export interface FormTextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  rows?: number;
  maxLength?: number;
  minLength?: number;
  showCharCount?: boolean;
  resizable?: boolean;
  inputClassName?: string;
}

function FormTextareaFieldComponent<
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
  rows = 3,
  maxLength,
  minLength,
  showCharCount,
  resizable = true,
  inputClassName,
}: FormTextareaFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              maxLength={maxLength}
              minLength={minLength}
              value={field.value ?? ""}
              className={cn(
                "bg-background",
                !resizable && "resize-none",
                fieldState.error && "border-destructive",
                inputClassName
              )}
            />
          </FormControl>
          <div className="flex items-center justify-between gap-2">
            {description && (
              <FormDescription className="text-xs flex-1">
                {description}
              </FormDescription>
            )}
            {showCharCount && maxLength && (
              <span className="text-xs text-muted-foreground">
                {(field.value?.length ?? 0)}/{maxLength}
              </span>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const FormTextareaField = memo(
  FormTextareaFieldComponent
) as typeof FormTextareaFieldComponent;
