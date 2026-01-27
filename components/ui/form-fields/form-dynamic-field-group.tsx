"use client";

import { memo, useCallback, type ReactNode } from "react";
import {
  useFieldArray,
  type Control,
  type FieldValues,
  type FieldArrayPath,
  type UseFieldArrayReturn,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { FormLabel, FormDescription } from "@/components/ui/form";
import { FormFieldTooltip } from "./form-field-tooltip";
import type { TooltipConfig } from "./form-field.types";

export interface FormDynamicFieldGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TFieldArrayName;
  label?: ReactNode;
  description?: ReactNode;
  tooltip?: TooltipConfig | string;
  required?: boolean;
  minItems?: number;
  maxItems?: number;
  defaultValue?: Record<string, unknown>;
  renderField: (
    index: number,
    fieldArray: UseFieldArrayReturn<TFieldValues, TFieldArrayName>
  ) => ReactNode;
  labels?: {
    add?: string;
    remove?: string;
    moveUp?: string;
    moveDown?: string;
    empty?: string;
  };
  showDragHandle?: boolean;
  showMoveButtons?: boolean;
  addButtonPosition?: "top" | "bottom" | "both";
  variant?: "default" | "card" | "compact";
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
}

const DEFAULT_LABELS = {
  add: "Add item",
  remove: "Remove",
  moveUp: "Move up",
  moveDown: "Move down",
  empty: "No items added yet",
};

function FormDynamicFieldGroupComponent<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  tooltip,
  required,
  minItems = 0,
  maxItems,
  defaultValue = {},
  renderField,
  labels,
  showDragHandle = false,
  showMoveButtons = false,
  addButtonPosition = "bottom",
  variant = "default",
  disabled,
  className,
  itemClassName,
}: FormDynamicFieldGroupProps<TFieldValues, TFieldArrayName>) {
  const fieldArray = useFieldArray({
    control,
    name,
  });

  const { fields, append, remove, move } = fieldArray;

  const mergedLabels = { ...DEFAULT_LABELS, ...labels };

  const canAdd = maxItems === undefined || fields.length < maxItems;
  const canRemove = fields.length > minItems;

  const handleAdd = useCallback(() => {
    if (canAdd) {
      append(defaultValue as Parameters<typeof append>[0]);
    }
  }, [append, defaultValue, canAdd]);

  const handleRemove = useCallback(
    (index: number) => {
      if (canRemove) {
        remove(index);
      }
    },
    [remove, canRemove]
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index > 0) {
        move(index, index - 1);
      }
    },
    [move]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index < fields.length - 1) {
        move(index, index + 1);
      }
    },
    [move, fields.length]
  );

  const addButton = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleAdd}
      disabled={disabled || !canAdd}
      className="gap-2"
    >
      <Plus className="h-4 w-4" />
      {mergedLabels.add}
    </Button>
  );

  const variantStyles = {
    default: "",
    card: "rounded-lg border bg-card p-4",
    compact: "rounded border p-2",
  };

  return (
    <div className={cn("space-y-4", className)}>
      {(label || description) && (
        <div className="space-y-1">
          {label && (
            <div className="flex items-center gap-1.5">
              <FormLabel className="text-base">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              {tooltip && <FormFieldTooltip tooltip={tooltip} />}
            </div>
          )}
          {description && (
            <FormDescription className="text-xs">{description}</FormDescription>
          )}
        </div>
      )}

      {(addButtonPosition === "top" || addButtonPosition === "both") && (
        <div>{addButton}</div>
      )}

      <div className="space-y-3">
        {fields.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            {mergedLabels.empty}
          </div>
        ) : (
          fields.map((field, index) => (
            <div
              key={field.id}
              className={cn(
                "group relative",
                variantStyles[variant],
                itemClassName
              )}
            >
              <div className="flex items-start gap-2">
                {showDragHandle && (
                  <div className="mt-2 cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                )}

                {showMoveButtons && (
                  <div className="flex flex-col gap-1 mt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleMoveUp(index)}
                      disabled={disabled || index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleMoveDown(index)}
                      disabled={disabled || index === fields.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {renderField(index, fieldArray)}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 text-muted-foreground hover:text-destructive shrink-0",
                    variant === "default" && "opacity-0 group-hover:opacity-100 transition-opacity"
                  )}
                  onClick={() => handleRemove(index)}
                  disabled={disabled || !canRemove}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {(addButtonPosition === "bottom" || addButtonPosition === "both") && (
        <div>{addButton}</div>
      )}

      {maxItems && (
        <p className="text-xs text-muted-foreground text-right">
          {fields.length}/{maxItems} items
        </p>
      )}
    </div>
  );
}

export const FormDynamicFieldGroup = memo(
  FormDynamicFieldGroupComponent
) as typeof FormDynamicFieldGroupComponent;
