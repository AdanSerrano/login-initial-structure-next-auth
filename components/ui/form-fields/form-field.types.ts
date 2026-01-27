"use client";

import type { ReactNode } from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
} from "react-hook-form";
import type { LucideIcon } from "lucide-react";

export interface BaseFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export interface FormFieldOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface FormFieldWithIconProps {
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

export interface FormFieldWithOptionsProps<T = string> {
  options: FormFieldOption<T>[];
  emptyMessage?: string;
}

export type InputType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "search"
  | "number";

export type AlertVariant = "error" | "success" | "warning" | "info";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface GroupedSelectOption {
  label: string;
  options: SelectOption[];
}

export type SelectOptions = SelectOption[] | GroupedSelectOption[];

export function isGroupedOptions(
  options: SelectOptions
): options is GroupedSelectOption[] {
  return (
    options.length > 0 &&
    "options" in options[0] &&
    Array.isArray((options[0] as GroupedSelectOption).options)
  );
}

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

export interface FileWithPreview extends File {
  preview?: string;
}

export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

export interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function calculatePasswordStrength(password: string): {
  level: PasswordStrengthLevel;
  requirements: PasswordRequirement[];
} {
  const requirements: PasswordRequirement[] = [
    { label: "minChars", met: password.length >= 8 },
    { label: "uppercase", met: /[A-Z]/.test(password) },
    { label: "lowercase", met: /[a-z]/.test(password) },
    { label: "number", met: /[0-9]/.test(password) },
    { label: "specialChar", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = requirements.filter((r) => r.met).length;
  const level = Math.min(4, metCount) as PasswordStrengthLevel;

  return { level, requirements };
}
