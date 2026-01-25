"use client";

import { memo, useMemo } from "react";
import { FileX } from "lucide-react";
import { FileListItem } from "./file-list-item";
import type { FileUploadData, FileListLabels } from "../types/file-upload.types";

interface FileListProps {
  files: FileUploadData[];
  labels: FileListLabels;
  locale: string;
  isPending: boolean;
  onDownload: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  onPreview: (file: FileUploadData) => void;
}

const FileListComponent = ({
  files,
  labels,
  locale,
  isPending,
  onDownload,
  onDelete,
  onPreview,
}: FileListProps) => {
  const itemLabels = useMemo(
    () => ({
      downloadButton: labels.downloadButton,
      deleteButton: labels.deleteButton,
      previewButton: labels.previewButton,
    }),
    [labels.downloadButton, labels.deleteButton, labels.previewButton]
  );

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileX className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm font-medium">{labels.emptyTitle}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {labels.emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <FileListItem
          key={file.id}
          file={file}
          labels={itemLabels}
          locale={locale}
          isPending={isPending}
          onDownload={onDownload}
          onDelete={onDelete}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
};

export const FileList = memo(FileListComponent);
FileList.displayName = "FileList";
