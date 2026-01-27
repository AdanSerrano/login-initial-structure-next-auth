"use client";

import { memo, useCallback, useRef, useMemo } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
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
import { X, Plus } from "lucide-react";
import type { BaseFormFieldProps, TagOption } from "./form-field.types";
import { FormFieldTooltip } from "./form-field-tooltip";

export interface FormTagFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  suggestions?: TagOption[];
  maxTags?: number;
  allowCustom?: boolean;
  validateTag?: (tag: string) => boolean;
  transformTag?: (tag: string) => string;
  labels?: {
    add?: string;
    placeholder?: string;
    noSuggestions?: string;
    maxReached?: string;
  };
  tagClassName?: string;
}

const DEFAULT_LABELS = {
  add: "Add tag",
  placeholder: "Type to add...",
  noSuggestions: "No suggestions found",
  maxReached: "Maximum tags reached",
};

function FormTagFieldComponent<
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
  suggestions = [],
  maxTags,
  allowCustom = true,
  validateTag,
  transformTag,
  labels,
  tagClassName,
}: FormTagFieldProps<TFieldValues, TName>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);

  const mergedLabels = { ...DEFAULT_LABELS, ...labels };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const tags: string[] = field.value ?? [];
        const isMaxReached = maxTags !== undefined && tags.length >= maxTags;

        const filteredSuggestions = useMemo(() => {
          const input = inputRef.current?.value?.toLowerCase() ?? "";
          return suggestions.filter(
            (s) =>
              !tags.includes(s.value) &&
              (input === "" || s.label.toLowerCase().includes(input))
          );
        }, [suggestions, tags]);

        const addTag = useCallback(
          (value: string) => {
            if (isMaxReached) return;

            let processedValue = value.trim();
            if (!processedValue) return;

            if (transformTag) {
              processedValue = transformTag(processedValue);
            }

            if (validateTag && !validateTag(processedValue)) return;
            if (tags.includes(processedValue)) return;

            field.onChange([...tags, processedValue]);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          },
          [tags, field, isMaxReached, transformTag, validateTag]
        );

        const removeTag = useCallback(
          (tagToRemove: string) => {
            field.onChange(tags.filter((t) => t !== tagToRemove));
          },
          [tags, field]
        );

        const handleKeyDown = useCallback(
          (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const value = inputRef.current?.value;
              if (value && allowCustom) {
                addTag(value);
                openRef.current = false;
              }
            } else if (e.key === "Backspace" && !inputRef.current?.value && tags.length > 0) {
              removeTag(tags[tags.length - 1]);
            }
          },
          [addTag, removeTag, tags, allowCustom]
        );

        const getTagColor = useCallback(
          (tagValue: string) => {
            const suggestion = suggestions.find((s) => s.value === tagValue);
            return suggestion?.color;
          },
          [suggestions]
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
              <div
                className={cn(
                  "flex flex-wrap gap-2 p-2 rounded-md border bg-background min-h-[42px]",
                  fieldState.error && "border-destructive",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {tags.map((tag) => {
                  const color = getTagColor(tag);
                  return (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className={cn("gap-1 pr-1", tagClassName)}
                      style={color ? { backgroundColor: color, color: "#fff" } : undefined}
                    >
                      {suggestions.find((s) => s.value === tag)?.label ?? tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        disabled={disabled}
                        className="ml-1 rounded-full hover:bg-black/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}

                {!isMaxReached && (
                  <Popover
                    open={openRef.current}
                    onOpenChange={(open) => {
                      openRef.current = open;
                    }}
                  >
                    <PopoverTrigger asChild>
                      <div className="flex-1 min-w-[120px]">
                        <Input
                          ref={inputRef}
                          placeholder={isMaxReached ? mergedLabels.maxReached : (placeholder ?? mergedLabels.placeholder)}
                          disabled={disabled || isMaxReached}
                          onKeyDown={handleKeyDown}
                          onFocus={() => {
                            openRef.current = true;
                          }}
                          className="border-0 shadow-none p-0 h-7 focus-visible:ring-0"
                        />
                      </div>
                    </PopoverTrigger>
                    {(filteredSuggestions.length > 0 || allowCustom) && (
                      <PopoverContent
                        className="w-[200px] p-0"
                        align="start"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                        <Command>
                          <CommandList>
                            <CommandEmpty>
                              {allowCustom
                                ? mergedLabels.add
                                : mergedLabels.noSuggestions}
                            </CommandEmpty>
                            <CommandGroup>
                              {filteredSuggestions.map((suggestion) => (
                                <CommandItem
                                  key={suggestion.value}
                                  value={suggestion.value}
                                  onSelect={() => {
                                    addTag(suggestion.value);
                                    openRef.current = false;
                                  }}
                                >
                                  {suggestion.color && (
                                    <div
                                      className="h-3 w-3 rounded-full mr-2"
                                      style={{ backgroundColor: suggestion.color }}
                                    />
                                  )}
                                  {suggestion.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    )}
                  </Popover>
                )}
              </div>
            </FormControl>
            <div className="flex items-center justify-between">
              {description && (
                <FormDescription className="text-xs flex-1">
                  {description}
                </FormDescription>
              )}
              {maxTags && (
                <span className="text-xs text-muted-foreground">
                  {tags.length}/{maxTags}
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

export const FormTagField = memo(
  FormTagFieldComponent
) as typeof FormTagFieldComponent;
