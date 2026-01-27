"use client";

import { memo, useCallback, useRef, useEffect } from "react";
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
import { FormFieldTooltip } from "./form-field-tooltip";

export interface FormTextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  rows?: number;
  maxLength?: number;
  minLength?: number;
  showCharCount?: boolean;
  resizable?: boolean;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
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
  tooltip,
  rows = 3,
  maxLength,
  minLength,
  showCharCount,
  resizable = true,
  autoResize = false,
  minRows = 2,
  maxRows = 10,
  inputClassName,
}: FormTextareaFieldProps<TFieldValues, TName>) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = useCallback(
    (element: HTMLTextAreaElement | null) => {
      if (!element || !autoResize) return;

      element.style.height = "auto";
      const lineHeight = parseInt(getComputedStyle(element).lineHeight) || 20;
      const minHeight = minRows * lineHeight;
      const maxHeight = maxRows * lineHeight;
      const scrollHeight = element.scrollHeight;

      element.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
    },
    [autoResize, minRows, maxRows]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        useEffect(() => {
          adjustHeight(textareaRef.current);
        }, [field.value, adjustHeight]);

        const handleChange = useCallback(
          (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            field.onChange(e);
            adjustHeight(e.target);
          },
          [field, adjustHeight]
        );

        const setRef = useCallback(
          (element: HTMLTextAreaElement | null) => {
            textareaRef.current = element;
            if (typeof field.ref === "function") {
              field.ref(element);
            }
          },
          [field]
        );

        return (
          <FormItem className={className}>
            {label && (
              <div className="flex items-center gap-1.5">
                <FormLabel>
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                {tooltip && <FormFieldTooltip tooltip={tooltip} />}
              </div>
            )}
            <FormControl>
              <Textarea
                {...field}
                ref={setRef}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                rows={autoResize ? minRows : rows}
                maxLength={maxLength}
                minLength={minLength}
                value={field.value ?? ""}
                className={cn(
                  "bg-background",
                  (!resizable || autoResize) && "resize-none",
                  autoResize && "overflow-hidden",
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
        );
      }}
    />
  );
}

export const FormTextareaField = memo(
  FormTextareaFieldComponent
) as typeof FormTextareaFieldComponent;
