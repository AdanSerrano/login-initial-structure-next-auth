"use client";

import { memo, useMemo, useRef } from "react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import type { BaseFormFieldProps, SelectOption } from "./form-field.types";

export interface FormComboboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  options: SelectOption[];
  emptyMessage?: string;
  searchPlaceholder?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

function FormComboboxFieldComponent<
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
  triggerClassName,
  contentClassName,
}: FormComboboxFieldProps<TFieldValues, TName>) {
  const openRef = useRef(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedOption = useMemo(
          () => options.find((opt) => opt.value === field.value),
          [field.value, options]
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
                      "w-full justify-between bg-background font-normal",
                      !field.value && "text-muted-foreground",
                      fieldState.error && "border-destructive",
                      triggerClassName
                    )}
                  >
                    {selectedOption?.label ?? placeholder ?? "Select..."}
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
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                          onSelect={() => {
                            field.onChange(
                              option.value === field.value ? "" : option.value
                            );
                            openRef.current = false;
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{option.label}</span>
                            {option.description && (
                              <span className="text-xs text-muted-foreground">
                                {option.description}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
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

export const FormComboboxField = memo(
  FormComboboxFieldComponent
) as typeof FormComboboxFieldComponent;
