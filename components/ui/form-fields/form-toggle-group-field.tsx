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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps, SelectOption } from "./form-field.types";
import { FormFieldTooltip } from "./form-field-tooltip";

export interface FormToggleGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  options: SelectOption[];
  type?: "single" | "multiple";
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
  allowDeselect?: boolean;
}

function FormToggleGroupFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  required,
  tooltip,
  options,
  type = "single",
  variant = "outline",
  size = "default",
  fullWidth = false,
  allowDeselect = true,
}: FormToggleGroupFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleSingleChange = useCallback(
          (value: string) => {
            if (allowDeselect || value) {
              field.onChange(value || null);
            }
          },
          [field, allowDeselect]
        );

        const handleMultipleChange = useCallback(
          (values: string[]) => {
            field.onChange(values);
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
              {type === "single" ? (
                <ToggleGroup
                  type="single"
                  value={field.value ?? ""}
                  onValueChange={handleSingleChange}
                  disabled={disabled}
                  variant={variant}
                  size={size}
                  className={cn(fullWidth && "w-full")}
                >
                  {options.map((option) => (
                    <ToggleGroupItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      className={cn(
                        fullWidth && "flex-1",
                        "gap-2"
                      )}
                    >
                      {option.icon && <option.icon className="h-4 w-4" />}
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              ) : (
                <ToggleGroup
                  type="multiple"
                  value={field.value ?? []}
                  onValueChange={handleMultipleChange}
                  disabled={disabled}
                  variant={variant}
                  size={size}
                  className={cn(fullWidth && "w-full")}
                >
                  {options.map((option) => (
                    <ToggleGroupItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      className={cn(
                        fullWidth && "flex-1",
                        "gap-2"
                      )}
                    >
                      {option.icon && <option.icon className="h-4 w-4" />}
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
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

export const FormToggleGroupField = memo(
  FormToggleGroupFieldComponent
) as typeof FormToggleGroupFieldComponent;
