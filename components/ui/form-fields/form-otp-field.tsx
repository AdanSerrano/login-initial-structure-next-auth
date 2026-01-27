"use client";

import { memo } from "react";
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

export interface FormOTPFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  length?: 4 | 6 | 8;
  pattern?: "digits" | "alphanumeric";
  showSeparator?: boolean;
  separatorAfter?: number;
  autoSubmit?: boolean;
  onComplete?: (value: string) => void;
  inputClassName?: string;
}

function FormOTPFieldComponent<
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
  length = 6,
  pattern = "digits",
  showSeparator = false,
  separatorAfter,
  autoSubmit = false,
  onComplete,
  inputClassName,
}: FormOTPFieldProps<TFieldValues, TName>) {
  const separatorPosition = separatorAfter ?? Math.floor(length / 2);
  const patternRegex =
    pattern === "digits" ? REGEXP_ONLY_DIGITS : REGEXP_ONLY_DIGITS_AND_CHARS;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <InputOTP
              maxLength={length}
              pattern={patternRegex}
              disabled={disabled}
              value={field.value ?? ""}
              onChange={field.onChange}
              onComplete={(value) => {
                if (autoSubmit && onComplete) {
                  onComplete(value);
                }
              }}
              containerClassName={cn(
                "justify-center",
                fieldState.error && "[&_[data-slot=input-otp-slot]]:border-destructive"
              )}
              className={inputClassName}
            >
              {showSeparator ? (
                <>
                  <InputOTPGroup>
                    {Array.from({ length: separatorPosition }).map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    {Array.from({ length: length - separatorPosition }).map(
                      (_, i) => (
                        <InputOTPSlot
                          key={separatorPosition + i}
                          index={separatorPosition + i}
                        />
                      )
                    )}
                  </InputOTPGroup>
                </>
              ) : (
                <InputOTPGroup>
                  {Array.from({ length }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              )}
            </InputOTP>
          </FormControl>
          {description && (
            <FormDescription className="text-xs text-center">
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-center" />
        </FormItem>
      )}
    />
  );
}

export const FormOTPField = memo(
  FormOTPFieldComponent
) as typeof FormOTPFieldComponent;
