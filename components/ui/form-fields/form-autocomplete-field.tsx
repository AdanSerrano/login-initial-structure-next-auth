"use client";

import { memo, useCallback, useRef, useMemo, useDeferredValue } from "react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Loader2, Search } from "lucide-react";
import type { BaseFormFieldProps, SelectOption } from "./form-field.types";
import { FormFieldTooltip } from "./form-field-tooltip";

export interface FormAutoCompleteFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  suggestions?: SelectOption[];
  onSearch?: (query: string) => void | Promise<void>;
  isLoading?: boolean;
  minChars?: number;
  debounceMs?: number;
  allowFreeText?: boolean;
  showIcon?: boolean;
  labels?: {
    noResults?: string;
    loading?: string;
    minChars?: string;
  };
  inputClassName?: string;
  highlightMatch?: boolean;
}

const DEFAULT_LABELS = {
  noResults: "No results found",
  loading: "Loading...",
  minChars: "Type to search...",
};

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function FormAutoCompleteFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Type to search...",
  disabled,
  className,
  required,
  tooltip,
  suggestions = [],
  onSearch,
  isLoading = false,
  minChars = 1,
  allowFreeText = true,
  showIcon = true,
  labels,
  inputClassName,
  highlightMatch = true,
}: FormAutoCompleteFieldProps<TFieldValues, TName>) {
  const openRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mergedLabels = { ...DEFAULT_LABELS, ...labels };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const inputValue = field.value ?? "";
        const deferredValue = useDeferredValue(inputValue);

        const filteredSuggestions = useMemo(() => {
          if (deferredValue.length < minChars) return [];
          const query = deferredValue.toLowerCase();
          return suggestions.filter(
            (s) =>
              s.label.toLowerCase().includes(query) ||
              s.value.toLowerCase().includes(query)
          );
        }, [suggestions, deferredValue, minChars]);

        const handleInputChange = useCallback(
          (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            field.onChange(value);

            if (onSearch && value.length >= minChars) {
              if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
              }
              searchTimeoutRef.current = setTimeout(() => {
                onSearch(value);
              }, 300);
            }

            if (value.length >= minChars) {
              openRef.current = true;
            }
          },
          [field, onSearch, minChars]
        );

        const handleSelect = useCallback(
          (option: SelectOption) => {
            field.onChange(option.value);
            openRef.current = false;
            inputRef.current?.blur();
          },
          [field]
        );

        const handleFocus = useCallback(() => {
          if (inputValue.length >= minChars) {
            openRef.current = true;
          }
        }, [inputValue, minChars]);

        const handleKeyDown = useCallback(
          (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Escape") {
              openRef.current = false;
            } else if (e.key === "Enter" && !allowFreeText && filteredSuggestions.length > 0) {
              e.preventDefault();
              handleSelect(filteredSuggestions[0]);
            }
          },
          [allowFreeText, filteredSuggestions, handleSelect]
        );

        const showDropdown =
          openRef.current &&
          inputValue.length >= minChars &&
          (filteredSuggestions.length > 0 || isLoading);

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
            <Popover
              open={showDropdown}
              onOpenChange={(open) => {
                openRef.current = open;
              }}
            >
              <PopoverTrigger asChild>
                <FormControl>
                  <div className="relative">
                    {showIcon && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </div>
                    )}
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder={placeholder}
                      disabled={disabled}
                      value={inputValue}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      onKeyDown={handleKeyDown}
                      autoComplete="off"
                      className={cn(
                        "bg-background",
                        showIcon && "pl-10",
                        fieldState.error && "border-destructive",
                        inputClassName
                      )}
                    />
                  </div>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Command>
                  <CommandList>
                    {isLoading ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                        {mergedLabels.loading}
                      </div>
                    ) : filteredSuggestions.length === 0 ? (
                      <CommandEmpty>{mergedLabels.noResults}</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {filteredSuggestions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => handleSelect(option)}
                            disabled={option.disabled}
                          >
                            <div className="flex flex-col">
                              <span>
                                {highlightMatch
                                  ? highlightText(option.label, deferredValue)
                                  : option.label}
                              </span>
                              {option.description && (
                                <span className="text-xs text-muted-foreground">
                                  {option.description}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
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

export const FormAutoCompleteField = memo(
  FormAutoCompleteFieldComponent
) as typeof FormAutoCompleteFieldComponent;
