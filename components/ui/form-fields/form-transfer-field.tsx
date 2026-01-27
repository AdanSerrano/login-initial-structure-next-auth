"use client";

import { memo, useCallback, useMemo, useRef, useReducer, useDeferredValue } from "react";
import type { FieldPath, FieldValues, ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Search,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps, FormFieldOption } from "./form-field.types";

export interface FormTransferFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  options: FormFieldOption<string>[];
  showSearch?: boolean;
  showSelectAll?: boolean;
  height?: number;
  labels?: {
    available?: string;
    selected?: string;
    searchAvailable?: string;
    searchSelected?: string;
    moveRight?: string;
    moveLeft?: string;
    moveAllRight?: string;
    moveAllLeft?: string;
  };
}

const DEFAULT_LABELS = {
  available: "Available",
  selected: "Selected",
  searchAvailable: "Search available...",
  searchSelected: "Search selected...",
  moveRight: "Move right",
  moveLeft: "Move left",
  moveAllRight: "Move all right",
  moveAllLeft: "Move all left",
};

interface SimpleCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
}

const SimpleCheckbox = memo(function SimpleCheckbox({ checked, indeterminate }: SimpleCheckboxProps) {
  return (
    <div
      className={cn(
        "size-4 shrink-0 rounded-[4px] border shadow-xs flex items-center justify-center",
        checked ? "bg-primary border-primary text-primary-foreground" : "border-input",
        indeterminate && !checked && "bg-primary/50 border-primary"
      )}
    >
      {checked && <Check className="size-3" />}
      {indeterminate && !checked && <div className="size-2 bg-primary-foreground rounded-sm" />}
    </div>
  );
});

interface TransferItemProps {
  item: FormFieldOption<string>;
  isChecked: boolean;
  disabled?: boolean;
  onToggle: (value: string) => void;
}

const TransferItem = memo(function TransferItem({
  item,
  isChecked,
  disabled,
  onToggle,
}: TransferItemProps) {
  const handleClick = useCallback(() => {
    if (!item.disabled && !disabled) {
      onToggle(item.value);
    }
  }, [item.disabled, item.value, disabled, onToggle]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-accent/50",
        isChecked && "bg-accent/30",
        (item.disabled || disabled) && "cursor-not-allowed opacity-50"
      )}
      onClick={handleClick}
    >
      <SimpleCheckbox checked={isChecked} />
      <span className="text-sm truncate">{item.label}</span>
    </div>
  );
});

interface SelectAllRowProps {
  allChecked: boolean;
  someChecked: boolean;
  disabled?: boolean;
  onSelectAll: () => void;
}

const SelectAllRow = memo(function SelectAllRow({
  allChecked,
  someChecked,
  disabled,
  onSelectAll,
}: SelectAllRowProps) {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onSelectAll();
    }
  }, [disabled, onSelectAll]);

  return (
    <div
      className={cn(
        "px-3 py-2 border-b flex items-center gap-2 cursor-pointer hover:bg-accent/50",
        disabled && "cursor-not-allowed opacity-50"
      )}
      onClick={handleClick}
    >
      <SimpleCheckbox checked={allChecked} indeterminate={someChecked && !allChecked} />
      <span className="text-sm">Select all</span>
    </div>
  );
});

interface TransferListProps {
  title: string;
  items: FormFieldOption<string>[];
  checkedSet: Set<string>;
  totalCount: number;
  checkedCount: number;
  searchValue: string;
  searchPlaceholder: string;
  showSearch: boolean;
  showSelectAll: boolean;
  height: number;
  disabled?: boolean;
  onToggleItem: (value: string) => void;
  onSelectAll: () => void;
  onSearchChange: (value: string) => void;
}

const TransferList = memo(function TransferList({
  title,
  items,
  checkedSet,
  totalCount,
  checkedCount,
  searchValue,
  searchPlaceholder,
  showSearch,
  showSelectAll,
  height,
  disabled,
  onToggleItem,
  onSelectAll,
  onSearchChange,
}: TransferListProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  const enabledItems = useMemo(
    () => items.filter((i) => !i.disabled),
    [items]
  );

  const allChecked = useMemo(
    () => enabledItems.length > 0 && enabledItems.every((i) => checkedSet.has(i.value)),
    [enabledItems, checkedSet]
  );

  const someChecked = useMemo(
    () => items.some((i) => checkedSet.has(i.value)),
    [items, checkedSet]
  );

  return (
    <div className="flex-1 min-w-0 border rounded-lg overflow-hidden">
      <div className="border-b bg-muted/30 px-3 py-2 flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">
          {checkedCount}/{totalCount}
        </span>
      </div>

      {showSearch && (
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60 z-10 pointer-events-none" />
            <Input
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              disabled={disabled}
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
      )}

      {showSelectAll && items.length > 0 && (
        <SelectAllRow
          allChecked={allChecked}
          someChecked={someChecked}
          disabled={disabled}
          onSelectAll={onSelectAll}
        />
      )}

      <div className="overflow-y-auto p-1" style={{ height }}>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No items</p>
        ) : (
          items.map((item) => (
            <TransferItem
              key={item.value}
              item={item}
              isChecked={checkedSet.has(item.value)}
              disabled={disabled}
              onToggle={onToggleItem}
            />
          ))
        )}
      </div>
    </div>
  );
});

interface TransferContentProps {
  field: ControllerRenderProps<FieldValues, string>;
  hasError: boolean;
  disabled?: boolean;
  options: FormFieldOption<string>[];
  showSearch: boolean;
  showSelectAll: boolean;
  height: number;
  labels: typeof DEFAULT_LABELS;
}

const TransferContent = memo(function TransferContent({
  field,
  hasError,
  disabled,
  options,
  showSearch,
  showSelectAll,
  height,
  labels,
}: TransferContentProps) {
  const leftCheckedRef = useRef<Set<string>>(new Set());
  const rightCheckedRef = useRef<Set<string>>(new Set());
  const leftSearchRef = useRef("");
  const rightSearchRef = useRef("");

  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const deferredLeftSearch = useDeferredValue(leftSearchRef.current);
  const deferredRightSearch = useDeferredValue(rightSearchRef.current);

  const fieldValue: string[] = useMemo(
    () => (Array.isArray(field.value) ? field.value : []),
    [field.value]
  );

  const fieldValueSet = useMemo(() => new Set(fieldValue), [fieldValue]);

  const availableItems = useMemo(
    () => options.filter((opt) => !fieldValueSet.has(opt.value)),
    [options, fieldValueSet]
  );

  const selectedItems = useMemo(
    () => options.filter((opt) => fieldValueSet.has(opt.value)),
    [options, fieldValueSet]
  );

  const filteredAvailable = useMemo(
    () =>
      deferredLeftSearch
        ? availableItems.filter((item) =>
            item.label.toLowerCase().includes(deferredLeftSearch.toLowerCase())
          )
        : availableItems,
    [availableItems, deferredLeftSearch]
  );

  const filteredSelected = useMemo(
    () =>
      deferredRightSearch
        ? selectedItems.filter((item) =>
            item.label.toLowerCase().includes(deferredRightSearch.toLowerCase())
          )
        : selectedItems,
    [selectedItems, deferredRightSearch]
  );

  const handleLeftToggle = useCallback((value: string) => {
    const set = leftCheckedRef.current;
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    forceUpdate();
  }, []);

  const handleRightToggle = useCallback((value: string) => {
    const set = rightCheckedRef.current;
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    forceUpdate();
  }, []);

  const handleSelectAllLeft = useCallback(() => {
    const enabledItems = filteredAvailable.filter((i) => !i.disabled).map((i) => i.value);
    const set = leftCheckedRef.current;
    const allChecked = enabledItems.every((v) => set.has(v));

    if (allChecked) {
      enabledItems.forEach((v) => set.delete(v));
    } else {
      enabledItems.forEach((v) => set.add(v));
    }
    forceUpdate();
  }, [filteredAvailable]);

  const handleSelectAllRight = useCallback(() => {
    const enabledItems = filteredSelected.filter((i) => !i.disabled).map((i) => i.value);
    const set = rightCheckedRef.current;
    const allChecked = enabledItems.every((v) => set.has(v));

    if (allChecked) {
      enabledItems.forEach((v) => set.delete(v));
    } else {
      enabledItems.forEach((v) => set.add(v));
    }
    forceUpdate();
  }, [filteredSelected]);

  const handleMoveRight = useCallback(() => {
    const toMove = Array.from(leftCheckedRef.current);
    if (toMove.length === 0) return;

    const newValue = [...fieldValue, ...toMove];
    field.onChange(newValue);
    leftCheckedRef.current.clear();
  }, [field, fieldValue]);

  const handleMoveLeft = useCallback(() => {
    const toRemove = rightCheckedRef.current;
    if (toRemove.size === 0) return;

    const newValue = fieldValue.filter((v) => !toRemove.has(v));
    field.onChange(newValue);
    rightCheckedRef.current.clear();
  }, [field, fieldValue]);

  const handleMoveAllRight = useCallback(() => {
    const toMove = filteredAvailable.filter((i) => !i.disabled).map((i) => i.value);
    if (toMove.length === 0) return;

    const newValue = [...fieldValue, ...toMove];
    field.onChange(newValue);
    leftCheckedRef.current.clear();
  }, [field, fieldValue, filteredAvailable]);

  const handleMoveAllLeft = useCallback(() => {
    const toRemove = new Set(filteredSelected.filter((i) => !i.disabled).map((i) => i.value));
    if (toRemove.size === 0) return;

    const newValue = fieldValue.filter((v) => !toRemove.has(v));
    field.onChange(newValue);
    rightCheckedRef.current.clear();
  }, [field, fieldValue, filteredSelected]);

  const handleLeftSearchChange = useCallback((value: string) => {
    leftSearchRef.current = value;
    forceUpdate();
  }, []);

  const handleRightSearchChange = useCallback((value: string) => {
    rightSearchRef.current = value;
    forceUpdate();
  }, []);

  const leftCheckedCount = leftCheckedRef.current.size;
  const rightCheckedCount = rightCheckedRef.current.size;

  const canMoveRight = leftCheckedCount > 0;
  const canMoveLeft = rightCheckedCount > 0;
  const canMoveAllRight = filteredAvailable.some((i) => !i.disabled);
  const canMoveAllLeft = filteredSelected.some((i) => !i.disabled);

  return (
    <div
      className={cn(
        "flex items-stretch gap-2",
        hasError && "[&>div]:border-destructive"
      )}
    >
      <TransferList
        title={labels.available}
        items={filteredAvailable}
        checkedSet={leftCheckedRef.current}
        totalCount={availableItems.length}
        checkedCount={leftCheckedCount}
        searchValue={leftSearchRef.current}
        searchPlaceholder={labels.searchAvailable}
        showSearch={showSearch}
        showSelectAll={showSelectAll}
        height={height}
        disabled={disabled}
        onToggleItem={handleLeftToggle}
        onSelectAll={handleSelectAllLeft}
        onSearchChange={handleLeftSearchChange}
      />

      <div className="flex flex-col gap-2 justify-center px-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleMoveAllRight}
          disabled={disabled || !canMoveAllRight}
          className="h-8 w-8"
          title={labels.moveAllRight}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleMoveRight}
          disabled={disabled || !canMoveRight}
          className="h-8 w-8"
          title={labels.moveRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleMoveLeft}
          disabled={disabled || !canMoveLeft}
          className="h-8 w-8"
          title={labels.moveLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleMoveAllLeft}
          disabled={disabled || !canMoveAllLeft}
          className="h-8 w-8"
          title={labels.moveAllLeft}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>

      <TransferList
        title={labels.selected}
        items={filteredSelected}
        checkedSet={rightCheckedRef.current}
        totalCount={selectedItems.length}
        checkedCount={rightCheckedCount}
        searchValue={rightSearchRef.current}
        searchPlaceholder={labels.searchSelected}
        showSearch={showSearch}
        showSelectAll={showSelectAll}
        height={height}
        disabled={disabled}
        onToggleItem={handleRightToggle}
        onSelectAll={handleSelectAllRight}
        onSearchChange={handleRightSearchChange}
      />
    </div>
  );
});

function FormTransferFieldComponent<
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
  options,
  showSearch = true,
  showSelectAll = true,
  height = 250,
  labels: customLabels,
}: FormTransferFieldProps<TFieldValues, TName>) {
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...customLabels }), [customLabels]);

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
            <TransferContent
              field={field as unknown as ControllerRenderProps<FieldValues, string>}
              hasError={!!fieldState.error}
              disabled={disabled}
              options={options}
              showSearch={showSearch}
              showSelectAll={showSelectAll}
              height={height}
              labels={labels}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const FormTransferField = memo(
  FormTransferFieldComponent
) as typeof FormTransferFieldComponent;
