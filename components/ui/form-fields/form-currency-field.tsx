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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type { BaseFormFieldProps, CurrencyConfig, DEFAULT_CURRENCIES } from "./form-field.types";
import { FormFieldTooltip } from "./form-field-tooltip";

export interface CurrencyValue {
  amount: number;
  currency: string;
  formatted: string;
}

export interface FormCurrencyFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  currencies?: CurrencyConfig[];
  defaultCurrency?: string;
  showCurrencySelect?: boolean;
  min?: number;
  max?: number;
  step?: number;
  inputClassName?: string;
}

const AVAILABLE_CURRENCIES: CurrencyConfig[] = [
  { code: "USD", symbol: "$", locale: "en-US", decimals: 2 },
  { code: "EUR", symbol: "€", locale: "de-DE", decimals: 2 },
  { code: "GBP", symbol: "£", locale: "en-GB", decimals: 2 },
  { code: "MXN", symbol: "$", locale: "es-MX", decimals: 2 },
  { code: "BRL", symbol: "R$", locale: "pt-BR", decimals: 2 },
  { code: "JPY", symbol: "¥", locale: "ja-JP", decimals: 0 },
  { code: "CAD", symbol: "C$", locale: "en-CA", decimals: 2 },
  { code: "AUD", symbol: "A$", locale: "en-AU", decimals: 2 },
  { code: "CHF", symbol: "CHF", locale: "de-CH", decimals: 2 },
  { code: "CNY", symbol: "¥", locale: "zh-CN", decimals: 2 },
];

function formatCurrency(
  amount: number,
  currency: CurrencyConfig
): string {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: currency.decimals ?? 2,
    maximumFractionDigits: currency.decimals ?? 2,
  }).format(amount);
}

function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^\d.,\-]/g, "").replace(",", ".");
  const number = parseFloat(cleaned);
  return isNaN(number) ? 0 : number;
}

function FormCurrencyFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "0.00",
  disabled,
  className,
  required,
  tooltip,
  currencies = AVAILABLE_CURRENCIES,
  defaultCurrency = "USD",
  showCurrencySelect = true,
  min,
  max,
  step = 0.01,
  inputClassName,
}: FormCurrencyFieldProps<TFieldValues, TName>) {
  const openRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value: CurrencyValue = field.value ?? {
          amount: 0,
          currency: defaultCurrency,
          formatted: "",
        };

        const selectedCurrency = useMemo(
          () => currencies.find((c) => c.code === value.currency) ?? currencies[0],
          [currencies, value.currency]
        );

        const handleCurrencyChange = useCallback(
          (currency: CurrencyConfig) => {
            const formatted = formatCurrency(value.amount, currency);
            field.onChange({
              ...value,
              currency: currency.code,
              formatted,
            });
            openRef.current = false;
          },
          [field, value]
        );

        const handleAmountChange = useCallback(
          (e: React.ChangeEvent<HTMLInputElement>) => {
            let amount = parseCurrencyInput(e.target.value);

            if (min !== undefined && amount < min) amount = min;
            if (max !== undefined && amount > max) amount = max;

            const formatted = formatCurrency(amount, selectedCurrency);
            field.onChange({
              ...value,
              amount,
              formatted,
            });
          },
          [field, value, selectedCurrency, min, max]
        );

        const handleBlur = useCallback(() => {
          const formatted = formatCurrency(value.amount, selectedCurrency);
          field.onChange({
            ...value,
            formatted,
          });
        }, [field, value, selectedCurrency]);

        const displayValue = useMemo(() => {
          if (document.activeElement === inputRef.current) {
            return value.amount === 0 ? "" : value.amount.toString();
          }
          return value.amount === 0 ? "" : value.amount.toFixed(selectedCurrency.decimals ?? 2);
        }, [value.amount, selectedCurrency.decimals]);

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
              <div className="flex gap-2">
                {showCurrencySelect && (
                  <Popover
                    open={openRef.current}
                    onOpenChange={(open) => {
                      openRef.current = open;
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        disabled={disabled}
                        className={cn(
                          "w-[100px] justify-between px-3 shrink-0",
                          fieldState.error && "border-destructive"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono">{selectedCurrency.symbol}</span>
                          <span className="text-muted-foreground">{selectedCurrency.code}</span>
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[150px] p-0" align="start">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {currencies.map((currency) => (
                              <CommandItem
                                key={currency.code}
                                value={currency.code}
                                onSelect={() => handleCurrencyChange(currency)}
                              >
                                <span className="font-mono mr-2">{currency.symbol}</span>
                                <span>{currency.code}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
                <div className="relative flex-1">
                  {!showCurrencySelect && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                      {selectedCurrency.symbol}
                    </span>
                  )}
                  <Input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    placeholder={placeholder}
                    disabled={disabled}
                    value={displayValue}
                    onChange={handleAmountChange}
                    onBlur={handleBlur}
                    className={cn(
                      "bg-background font-mono",
                      !showCurrencySelect && "pl-8",
                      fieldState.error && "border-destructive",
                      inputClassName
                    )}
                  />
                </div>
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

export const FormCurrencyField = memo(
  FormCurrencyFieldComponent
) as typeof FormCurrencyFieldComponent;
