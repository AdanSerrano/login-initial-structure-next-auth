"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Star, Heart, ThumbsUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BaseFormFieldProps } from "./form-field.types";
import { FormFieldTooltip } from "./form-field-tooltip";

export interface FormRatingFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  max?: number;
  icon?: "star" | "heart" | "thumbsUp" | LucideIcon;
  size?: "sm" | "md" | "lg";
  allowHalf?: boolean;
  allowClear?: boolean;
  showValue?: boolean;
  labels?: string[];
  activeColor?: string;
  inactiveColor?: string;
}

const ICONS: Record<string, LucideIcon> = {
  star: Star,
  heart: Heart,
  thumbsUp: ThumbsUp,
};

const SIZES = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const GAP_SIZES = {
  sm: "gap-0.5",
  md: "gap-1",
  lg: "gap-1.5",
};

function FormRatingFieldComponent<
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
  max = 5,
  icon = "star",
  size = "md",
  allowHalf = false,
  allowClear = true,
  showValue = false,
  labels,
  activeColor = "text-yellow-500",
  inactiveColor = "text-muted-foreground/30",
}: FormRatingFieldProps<TFieldValues, TName>) {
  const hoverRef = useRef<number | null>(null);

  const Icon = typeof icon === "string" ? ICONS[icon] ?? Star : icon;
  const sizeClass = SIZES[size];
  const gapClass = GAP_SIZES[size];

  const ratingItems = useMemo(() => {
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [max]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value: number = field.value ?? 0;

        const handleClick = useCallback(
          (rating: number, isHalf: boolean = false) => {
            const newValue = isHalf ? rating - 0.5 : rating;
            if (allowClear && value === newValue) {
              field.onChange(0);
            } else {
              field.onChange(newValue);
            }
          },
          [field, value, allowClear]
        );

        const handleMouseEnter = useCallback((rating: number) => {
          hoverRef.current = rating;
        }, []);

        const handleMouseLeave = useCallback(() => {
          hoverRef.current = null;
        }, []);

        const getLabel = useCallback(
          (rating: number) => {
            if (labels && labels[rating - 1]) {
              return labels[rating - 1];
            }
            return null;
          },
          [labels]
        );

        const currentLabel = getLabel(Math.ceil(value));

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
              <div className="flex items-center gap-3">
                <div
                  className={cn("flex items-center", gapClass)}
                  onMouseLeave={handleMouseLeave}
                >
                  {ratingItems.map((rating) => {
                    const isFilled = rating <= value;
                    const isHalfFilled =
                      allowHalf && rating - 0.5 === value;
                    const isHovered =
                      hoverRef.current !== null && rating <= hoverRef.current;

                    return (
                      <div
                        key={rating}
                        className={cn(
                          "relative cursor-pointer transition-transform",
                          disabled && "cursor-not-allowed opacity-50",
                          !disabled && "hover:scale-110"
                        )}
                        onMouseEnter={() => !disabled && handleMouseEnter(rating)}
                      >
                        {allowHalf && (
                          <div
                            className="absolute inset-0 w-1/2 overflow-hidden z-10"
                            onClick={() => !disabled && handleClick(rating, true)}
                          >
                            <Icon
                              className={cn(
                                sizeClass,
                                "transition-colors fill-current",
                                isHalfFilled || (value >= rating - 0.5 && value < rating)
                                  ? activeColor
                                  : isHovered
                                    ? `${activeColor} opacity-50`
                                    : inactiveColor
                              )}
                            />
                          </div>
                        )}
                        <Icon
                          className={cn(
                            sizeClass,
                            "transition-colors",
                            isFilled || isHovered
                              ? `${activeColor} fill-current`
                              : inactiveColor
                          )}
                          onClick={() => !disabled && handleClick(rating)}
                        />
                      </div>
                    );
                  })}
                </div>
                {showValue && (
                  <span className="text-sm font-medium min-w-[2rem]">
                    {value > 0 ? value : "-"}
                  </span>
                )}
                {currentLabel && (
                  <span className="text-sm text-muted-foreground">
                    {currentLabel}
                  </span>
                )}
              </div>
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

export const FormRatingField = memo(
  FormRatingFieldComponent
) as typeof FormRatingFieldComponent;
