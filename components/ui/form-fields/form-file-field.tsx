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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, X, File, Image, FileText, FileArchive } from "lucide-react";
import type { BaseFormFieldProps, FileWithPreview } from "./form-field.types";

export interface FormFileFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  showPreview?: boolean;
  labels?: {
    upload?: string;
    dragDrop?: string;
    remove?: string;
    maxSizeError?: string;
    maxFilesError?: string;
  };
  onFilesChange?: (files: File[]) => void;
  dropzoneClassName?: string;
}

const FILE_ICONS: Record<string, typeof File> = {
  image: Image,
  text: FileText,
  application: FileArchive,
  default: File,
};

function getFileIcon(type: string) {
  const category = type.split("/")[0];
  return FILE_ICONS[category] ?? FILE_ICONS.default;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function FormFileFieldComponent<
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
  accept,
  multiple = false,
  maxSize,
  maxFiles = 10,
  showPreview = true,
  labels,
  onFilesChange,
  dropzoneClassName,
}: FormFileFieldProps<TFieldValues, TName>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const defaultLabels = {
    upload: "Click to upload or drag and drop",
    dragDrop: "Drop files here",
    remove: "Remove",
    maxSizeError: "File too large",
    maxFilesError: "Too many files",
  };

  const mergedLabels = { ...defaultLabels, ...labels };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const files: FileWithPreview[] = field.value ?? [];

        const handleFiles = useCallback(
          (newFiles: FileList | null) => {
            if (!newFiles) return;

            const validFiles: FileWithPreview[] = [];
            const currentCount = files.length;

            Array.from(newFiles).forEach((file) => {
              if (maxSize && file.size > maxSize) return;
              if (!multiple && validFiles.length >= 1) return;
              if (multiple && currentCount + validFiles.length >= maxFiles)
                return;

              const fileWithPreview: FileWithPreview = Object.assign(file, {
                preview: file.type.startsWith("image/")
                  ? URL.createObjectURL(file)
                  : undefined,
              });
              validFiles.push(fileWithPreview);
            });

            const updatedFiles = multiple
              ? [...files, ...validFiles]
              : validFiles;

            field.onChange(updatedFiles);
            onFilesChange?.(updatedFiles);
          },
          [files, field, multiple, maxSize, maxFiles, onFilesChange]
        );

        const handleRemove = useCallback(
          (index: number) => {
            const file = files[index];
            if (file.preview) {
              URL.revokeObjectURL(file.preview);
            }
            const updatedFiles = files.filter((_, i) => i !== index);
            field.onChange(updatedFiles);
            onFilesChange?.(updatedFiles);
          },
          [files, field, onFilesChange]
        );

        const handleDragEnter = useCallback(
          (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounterRef.current++;
          },
          []
        );

        const handleDragLeave = useCallback(
          (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounterRef.current--;
          },
          []
        );

        const handleDragOver = useCallback((e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
        }, []);

        const handleDrop = useCallback(
          (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounterRef.current = 0;
            handleFiles(e.dataTransfer.files);
          },
          [handleFiles]
        );

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className="space-y-4">
                <div
                  onClick={() => inputRef.current?.click()}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
                    "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                    disabled && "pointer-events-none opacity-50",
                    fieldState.error && "border-destructive",
                    dropzoneClassName
                  )}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    {mergedLabels.upload}
                  </p>
                  {maxSize && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Max: {formatFileSize(maxSize)}
                    </p>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="sr-only"
                  />
                </div>

                {showPreview && files.length > 0 && (
                  <div className="grid gap-2">
                    {files.map((file, index) => {
                      const Icon = getFileIcon(file.type);

                      return (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          {file.preview ? (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <Icon className="h-10 w-10 text-muted-foreground p-2 rounded bg-muted" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(index)}
                            className="h-8 w-8 shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
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

export const FormFileField = memo(
  FormFileFieldComponent
) as typeof FormFileFieldComponent;
