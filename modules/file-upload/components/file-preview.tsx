"use client";

import { memo, useCallback } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FileUploadData, FilePreviewLabels } from "../types/file-upload.types";

interface FilePreviewProps {
  file: FileUploadData | null;
  labels: FilePreviewLabels;
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (fileId: string) => void;
}

const FilePreviewComponent = ({
  file,
  labels,
  locale,
  isOpen,
  onClose,
  onDownload,
}: FilePreviewProps) => {
  const formatFileSize = useCallback((bytes: number): string => {
    const units = ["B", "KB", "MB", "GB"];
    let unitIndex = 0;
    let size = bytes;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }, []);

  const handleDownload = useCallback(() => {
    if (file) {
      onDownload(file.id);
    }
  }, [file, onDownload]);

  if (!file) return null;

  const imageUrl = file.publicUrl || "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate pr-4">{file.fileName}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                {labels.downloadButton}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {imageUrl && (
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt={file.fileName}
                className="object-contain w-full h-full"
              />
            </div>
          )}

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">{labels.fileDetails}</h4>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">{labels.fileName}</dt>
              <dd className="truncate">{file.fileName}</dd>
              <dt className="text-muted-foreground">{labels.fileSize}</dt>
              <dd>{formatFileSize(file.fileSize)}</dd>
              <dt className="text-muted-foreground">{labels.uploadDate}</dt>
              <dd>{new Date(file.createdAt).toLocaleDateString(locale)}</dd>
            </dl>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const FilePreview = memo(FilePreviewComponent);
FilePreview.displayName = "FilePreview";
