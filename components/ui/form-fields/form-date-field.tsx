"use client";

import { memo, useRef, useCallback } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import type { BaseFormFieldProps, DateRange } from "./form-field.types";

export interface FormDateFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDays?: (date: Date) => boolean;
  locale?: string;
  formatDate?: (date: Date) => string;
  triggerClassName?: string;
}

const defaultFormatDate = (date: Date, locale = "en-US") =>
  date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function FormDateFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Pick a date",
  disabled,
  className,
  required,
  minDate,
  maxDate,
  disabledDates,
  disabledDays,
  locale = "en-US",
  formatDate,
  triggerClassName,
}: FormDateFieldProps<TFieldValues, TName>) {
  const openRef = useRef(false);

  const format = useCallback(
    (date: Date) => formatDate?.(date) ?? defaultFormatDate(date, locale),
    [formatDate, locale]
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      if (disabledDates?.some((d) => d.toDateString() === date.toDateString()))
        return true;
      if (disabledDays?.(date)) return true;
      return false;
    },
    [minDate, maxDate, disabledDates, disabledDays]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn("flex flex-col", className)}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <Popover
            open={openRef.current}
            onOpenChange={(open) => {
              openRef.current = open;
            }}
          >
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-background",
                    !field.value && "text-muted-foreground",
                    fieldState.error && "border-destructive",
                    triggerClassName
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value) : placeholder}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  openRef.current = false;
                }}
                disabled={isDateDisabled}
                defaultMonth={field.value}
              />
            </PopoverContent>
          </Popover>
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

export const FormDateField = memo(
  FormDateFieldComponent
) as typeof FormDateFieldComponent;

export interface FormDateRangeFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDays?: (date: Date) => boolean;
  locale?: string;
  formatDate?: (date: Date) => string;
  numberOfMonths?: 1 | 2;
  triggerClassName?: string;
}

function FormDateRangeFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Pick a date range",
  disabled,
  className,
  required,
  minDate,
  maxDate,
  disabledDates,
  disabledDays,
  locale = "en-US",
  formatDate,
  numberOfMonths = 2,
  triggerClassName,
}: FormDateRangeFieldProps<TFieldValues, TName>) {
  const openRef = useRef(false);

  const format = useCallback(
    (date: Date) => formatDate?.(date) ?? defaultFormatDate(date, locale),
    [formatDate, locale]
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      if (disabledDates?.some((d) => d.toDateString() === date.toDateString()))
        return true;
      if (disabledDays?.(date)) return true;
      return false;
    },
    [minDate, maxDate, disabledDates, disabledDays]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const range = field.value as DateRange | undefined;

        const displayValue = range?.from
          ? range.to
            ? `${format(range.from)} - ${format(range.to)}`
            : format(range.from)
          : placeholder;

        return (
          <FormItem className={cn("flex flex-col", className)}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <Popover
              open={openRef.current}
              onOpenChange={(open) => {
                openRef.current = open;
              }}
            >
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background",
                      !range?.from && "text-muted-foreground",
                      fieldState.error && "border-destructive",
                      triggerClassName
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {displayValue}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={(newRange) => {
                    field.onChange(newRange);
                    if (newRange?.from && newRange?.to) {
                      openRef.current = false;
                    }
                  }}
                  disabled={isDateDisabled}
                  numberOfMonths={numberOfMonths}
                  defaultMonth={range?.from}
                />
              </PopoverContent>
            </Popover>
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

export const FormDateRangeField = memo(
  FormDateRangeFieldComponent
) as typeof FormDateRangeFieldComponent;
