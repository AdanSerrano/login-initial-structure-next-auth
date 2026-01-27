"use client";

import { memo, useCallback, useMemo, type ReactNode } from "react";
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
import { FormFieldTooltip } from "./form-field-tooltip";

export interface FormCheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  labelPosition?: "left" | "right";
  checkboxClassName?: string;
  indeterminate?: boolean;
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
  tooltip,
  labelPosition = "right",
  checkboxClassName,
  indeterminate,
}: FormCheckboxFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const checkedState = indeterminate
          ? "indeterminate"
          : (field.value ?? false);

        return (
          <FormItem
            className={cn(
              "flex flex-row items-start space-x-3 space-y-0",
              className
            )}
          >
            {labelPosition === "left" && label && (
              <div className="space-y-1 leading-none flex-1">
                <div className="flex items-center gap-1.5">
                  <FormLabel className="cursor-pointer">{label}</FormLabel>
                  {tooltip && <FormFieldTooltip tooltip={tooltip} />}
                </div>
                {description && (
                  <FormDescription className="text-xs">
                    {description}
                  </FormDescription>
                )}
              </div>
            )}
            <FormControl>
              <Checkbox
                checked={checkedState}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className={checkboxClassName}
              />
            </FormControl>
            {labelPosition === "right" && label && (
              <div className="space-y-1 leading-none">
                <div className="flex items-center gap-1.5">
                  <FormLabel className="cursor-pointer">{label}</FormLabel>
                  {tooltip && <FormFieldTooltip tooltip={tooltip} />}
                </div>
                {description && (
                  <FormDescription className="text-xs">
                    {description}
                  </FormDescription>
                )}
              </div>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export const FormCheckboxField = memo(
  FormCheckboxFieldComponent
) as typeof FormCheckboxFieldComponent;

export interface FormCheckboxWithSelectAllProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  options: SelectOption[];
  orientation?: "horizontal" | "vertical";
  columns?: 1 | 2 | 3 | 4;
  selectAllLabel?: string;
  showSelectAll?: boolean;
}

function FormCheckboxWithSelectAllComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  tooltip,
  options,
  orientation = "vertical",
  columns = 1,
  selectAllLabel = "Select all",
  showSelectAll = true,
}: FormCheckboxWithSelectAllProps<TFieldValues, TName>) {
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
        const enabledOptions = options.filter((o) => !o.disabled);
        const allSelected = enabledOptions.every((o) =>
          selectedValues.includes(o.value)
        );
        const someSelected =
          enabledOptions.some((o) => selectedValues.includes(o.value)) &&
          !allSelected;

        const handleToggle = useCallback(
          (value: string, checked: boolean) => {
            if (checked) {
              field.onChange([...selectedValues, value]);
            } else {
              field.onChange(selectedValues.filter((v) => v !== value));
            }
          },
          [selectedValues, field]
        );

        const handleSelectAll = useCallback(
          (checked: boolean | "indeterminate") => {
            if (checked === true) {
              const allEnabledValues = enabledOptions.map((o) => o.value);
              field.onChange(allEnabledValues);
            } else {
              field.onChange([]);
            }
          },
          [enabledOptions, field]
        );

        return (
          <FormItem className={className}>
            {label && (
              <div className="flex items-center gap-1.5">
                <FormLabel>{label}</FormLabel>
                {tooltip && <FormFieldTooltip tooltip={tooltip} />}
              </div>
            )}
            {description && (
              <FormDescription className="text-xs">
                {description}
              </FormDescription>
            )}

            {showSelectAll && enabledOptions.length > 1 && (
              <div className="flex items-center space-x-3 pb-2 border-b mb-2">
                <Checkbox
                  checked={someSelected ? "indeterminate" : allSelected}
                  onCheckedChange={handleSelectAll}
                  disabled={disabled}
                />
                <label className="text-sm font-medium cursor-pointer">
                  {selectAllLabel}
                </label>
              </div>
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

export const FormCheckboxWithSelectAll = memo(
  FormCheckboxWithSelectAllComponent
) as typeof FormCheckboxWithSelectAllComponent;

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
