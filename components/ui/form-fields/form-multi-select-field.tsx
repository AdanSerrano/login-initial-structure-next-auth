"use client";

import { memo, useMemo, useCallback, useRef } from "react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import type { BaseFormFieldProps, SelectOption } from "./form-field.types";

export interface FormMultiSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  options: SelectOption[];
  emptyMessage?: string;
  searchPlaceholder?: string;
  maxItems?: number;
  triggerClassName?: string;
  contentClassName?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

function FormMultiSelectFieldComponent<
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
  options,
  emptyMessage = "No results found.",
  searchPlaceholder = "Search...",
  maxItems,
  triggerClassName,
  contentClassName,
  badgeVariant = "secondary",
}: FormMultiSelectFieldProps<TFieldValues, TName>) {
  const openRef = useRef(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedValues: string[] = field.value ?? [];

        const selectedOptions = useMemo(
          () => options.filter((opt) => selectedValues.includes(opt.value)),
          [selectedValues, options]
        );

        const handleSelect = useCallback(
          (value: string) => {
            const isSelected = selectedValues.includes(value);
            if (isSelected) {
              field.onChange(selectedValues.filter((v) => v !== value));
            } else if (!maxItems || selectedValues.length < maxItems) {
              field.onChange([...selectedValues, value]);
            }
          },
          [selectedValues, field, maxItems]
        );

        const handleRemove = useCallback(
          (value: string) => {
            field.onChange(selectedValues.filter((v) => v !== value));
          },
          [selectedValues, field]
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
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-between bg-background font-normal min-h-9 h-auto",
                      selectedValues.length === 0 && "text-muted-foreground",
                      fieldState.error && "border-destructive",
                      triggerClassName
                    )}
                  >
                    <div className="flex flex-wrap gap-1 flex-1">
                      {selectedOptions.length > 0 ? (
                        selectedOptions.map((option) => (
                          <Badge
                            key={option.value}
                            variant={badgeVariant}
                            className="mr-1"
                          >
                            {option.label}
                            <button
                              type="button"
                              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(option.value);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <span>{placeholder ?? "Select..."}</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className={cn("w-[--radix-popover-trigger-width] p-0", contentClassName)}
                align="start"
              >
                <Command>
                  <CommandInput placeholder={searchPlaceholder} />
                  <CommandList>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => {
                        const isSelected = selectedValues.includes(option.value);
                        const isDisabled =
                          option.disabled ||
                          (!isSelected &&
                            maxItems !== undefined &&
                            selectedValues.length >= maxItems);

                        return (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            disabled={isDisabled}
                            onSelect={() => handleSelect(option.value)}
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                            <div className="flex flex-col">
                              <span>{option.label}</span>
                              {option.description && (
                                <span className="text-xs text-muted-foreground">
                                  {option.description}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
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

export const FormMultiSelectField = memo(
  FormMultiSelectFieldComponent
) as typeof FormMultiSelectFieldComponent;
