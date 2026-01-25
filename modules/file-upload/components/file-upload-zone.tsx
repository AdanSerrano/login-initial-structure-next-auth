"use client";

import { memo, useCallback, useRef } from "react";
import { Upload, FileIcon, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FileVisibility } from "../types/file-upload.types";
import type { FileUploadZoneLabels } from "../types/file-upload.types";
import { FILE_UPLOAD_CONFIG } from "../types/file-upload.types";

interface FileUploadZoneProps {
  labels: FileUploadZoneLabels;
  visibility: FileVisibility;
  isPending: boolean;
  onFilesSelected: (files: File[], visibility: FileVisibility) => void;
  error?: string | null;
}

const FileUploadZoneComponent = ({
  labels,
  visibility,
  isPending,
  onFilesSelected,
  error,
}: FileUploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isDraggingRef = useRef(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = false;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = false;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesSelected(files, visibility);
      }
    },
    [onFilesSelected, visibility]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesSelected(files, visibility);
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onFilesSelected, visibility]
  );

  const handleBrowseClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const acceptTypes = [
    ...FILE_UPLOAD_CONFIG.IMAGE_EXTENSIONS,
    ...FILE_UPLOAD_CONFIG.DOCUMENT_EXTENSIONS,
  ].join(",");

  return (
    <Card
      className={cn(
        "border-2 border-dashed transition-colors cursor-pointer hover:border-primary/50",
        isPending && "opacity-50 pointer-events-none",
        error && "border-destructive"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center py-10 px-6 text-center">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptTypes}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isPending}
        />

        {isPending ? (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4" />
            <p className="text-sm text-muted-foreground">{labels.uploadingText}</p>
          </>
        ) : error ? (
          <>
            <AlertCircle className="h-10 w-10 text-destructive mb-4" />
            <p className="text-sm font-medium text-destructive">
              {labels.errorTitle}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm font-medium">{labels.dropzoneTitle}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {labels.dropzoneDescription}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleBrowseClick}
            >
              <FileIcon className="h-4 w-4 mr-2" />
              {labels.browseButton}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {labels.maxSizeText}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const FileUploadZone = memo(FileUploadZoneComponent);
FileUploadZone.displayName = "FileUploadZone";
