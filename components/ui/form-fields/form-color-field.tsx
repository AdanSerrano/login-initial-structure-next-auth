"use client";

import { memo, useCallback, useRef } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";

export interface FormColorFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  presetColors?: string[];
  showInput?: boolean;
  format?: "hex" | "rgb";
  triggerClassName?: string;
}

const DEFAULT_PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
  "#000000",
];

function FormColorFieldComponent<
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
  presetColors = DEFAULT_PRESET_COLORS,
  showInput = true,
  format = "hex",
  triggerClassName,
}: FormColorFieldProps<TFieldValues, TName>) {
  const openRef = useRef(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const handleColorChange = useCallback(
          (color: string) => {
            field.onChange(color);
          },
          [field]
        );

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
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-start bg-background font-normal",
                      !field.value && "text-muted-foreground",
                      fieldState.error && "border-destructive",
                      triggerClassName
                    )}
                  >
                    <div
                      className="mr-2 h-5 w-5 rounded border"
                      style={{ backgroundColor: field.value ?? "#ffffff" }}
                    />
                    {field.value ?? "Select color"}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="start">
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-2">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        className={cn(
                          "h-8 w-8 rounded-md border-2 transition-transform hover:scale-110",
                          field.value === color
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {showInput && (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={field.value ?? "#000000"}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="h-9 w-9 cursor-pointer rounded border p-0"
                      />
                      <Input
                        type="text"
                        value={field.value ?? ""}
                        onChange={(e) => handleColorChange(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  )}
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

export const FormColorField = memo(
  FormColorFieldComponent
) as typeof FormColorFieldComponent;
