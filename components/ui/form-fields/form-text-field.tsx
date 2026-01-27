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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps, InputType } from "./form-field.types";

export interface FormTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  type?: InputType;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputClassName?: string;
  showCharCount?: boolean;
  labelExtra?: ReactNode;
}

function FormTextFieldComponent<
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
  type = "text",
  autoComplete,
  maxLength,
  minLength,
  pattern,
  leftIcon,
  rightIcon,
  inputClassName,
  showCharCount,
  labelExtra,
}: FormTextFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {(label || labelExtra) && (
            <div className="flex items-center justify-between">
              {label && (
                <FormLabel>
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
              )}
              {labelExtra}
            </div>
          )}
          <FormControl>
            <div className="relative">
              {leftIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {leftIcon}
                </div>
              )}
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                maxLength={maxLength}
                minLength={minLength}
                pattern={pattern}
                value={field.value ?? ""}
                className={cn(
                  "bg-background",
                  leftIcon && "pl-10",
                  rightIcon && "pr-10",
                  fieldState.error && "border-destructive",
                  inputClassName
                )}
              />
              {rightIcon && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {rightIcon}
                </div>
              )}
            </div>
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

export const FormTextField = memo(
  FormTextFieldComponent
) as typeof FormTextFieldComponent;
