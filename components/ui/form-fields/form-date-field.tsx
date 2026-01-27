"use client";

import { memo, useRef, useCallback, useMemo } from "react";
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
import type { BaseFormFieldProps, DateRange, DatePreset } from "./form-field.types";
import { FormFieldTooltip } from "./form-field-tooltip";

export interface DateRangePreset {
  label: string;
  getValue: () => DateRange;
}

const DEFAULT_DATE_PRESETS: DatePreset[] = [
  { label: "Today", getValue: () => new Date() },
  {
    label: "Tomorrow",
    getValue: () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    },
  },
  {
    label: "In 7 days",
    getValue: () => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    },
  },
  {
    label: "In 30 days",
    getValue: () => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    },
  },
];

const DEFAULT_DATE_RANGE_PRESETS: DateRangePreset[] = [
  {
    label: "Today",
    getValue: () => {
      const today = new Date();
      return { from: today, to: today };
    },
  },
  {
    label: "Last 7 days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 7);
      return { from, to };
    },
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 30);
      return { from, to };
    },
  },
  {
    label: "This month",
    getValue: () => {
      const from = new Date();
      from.setDate(1);
      const to = new Date();
      return { from, to };
    },
  },
  {
    label: "Last month",
    getValue: () => {
      const to = new Date();
      to.setDate(0);
      const from = new Date(to);
      from.setDate(1);
      return { from, to };
    },
  },
];

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
  presets?: DatePreset[];
  showPresets?: boolean;
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
  tooltip,
  minDate,
  maxDate,
  disabledDates,
  disabledDays,
  locale = "en-US",
  formatDate,
  triggerClassName,
  presets,
  showPresets = false,
}: FormDateFieldProps<TFieldValues, TName>) {
  const openRef = useRef(false);

  const activePresets = useMemo(
    () => (showPresets ? (presets ?? DEFAULT_DATE_PRESETS) : []),
    [showPresets, presets]
  );

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
        const handlePresetClick = useCallback(
          (preset: DatePreset) => {
            const date = preset.getValue();
            field.onChange(date);
            openRef.current = false;
          },
          [field]
        );

        return (
          <FormItem className={cn("flex flex-col", className)}>
            {label && (
              <div className="flex items-center gap-1.5">
                <FormLabel>
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                {tooltip && <FormFieldTooltip tooltip={tooltip} />}
              </div>
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
                <div className="flex">
                  {activePresets.length > 0 && (
                    <div className="flex flex-col gap-1 p-3 border-r">
                      {activePresets.map((preset) => (
                        <Button
                          key={preset.label}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="justify-start text-left"
                          onClick={() => handlePresetClick(preset)}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  )}
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
                </div>
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
  presets?: DateRangePreset[];
  showPresets?: boolean;
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
  tooltip,
  minDate,
  maxDate,
  disabledDates,
  disabledDays,
  locale = "en-US",
  formatDate,
  numberOfMonths = 2,
  triggerClassName,
  presets,
  showPresets = false,
}: FormDateRangeFieldProps<TFieldValues, TName>) {
  const openRef = useRef(false);

  const activePresets = useMemo(
    () => (showPresets ? (presets ?? DEFAULT_DATE_RANGE_PRESETS) : []),
    [showPresets, presets]
  );

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

        const handlePresetClick = useCallback(
          (preset: DateRangePreset) => {
            const range = preset.getValue();
            field.onChange(range);
            openRef.current = false;
          },
          [field]
        );

        return (
          <FormItem className={cn("flex flex-col", className)}>
            {label && (
              <div className="flex items-center gap-1.5">
                <FormLabel>
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                {tooltip && <FormFieldTooltip tooltip={tooltip} />}
              </div>
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
                <div className="flex">
                  {activePresets.length > 0 && (
                    <div className="flex flex-col gap-1 p-3 border-r">
                      {activePresets.map((preset) => (
                        <Button
                          key={preset.label}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="justify-start text-left"
                          onClick={() => handlePresetClick(preset)}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  )}
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
                </div>
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
