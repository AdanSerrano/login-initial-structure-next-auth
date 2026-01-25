"use client";

import { memo, useCallback } from "react";
import {
  FileIcon,
  Download,
  Trash2,
  Eye,
  Image,
  FileText,
  Table,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FileUploadData } from "../types/file-upload.types";
import { FileCategory } from "../types/file-upload.types";

interface FileListItemLabels {
  downloadButton: string;
  deleteButton: string;
  previewButton: string;
}

interface FileListItemProps {
  file: FileUploadData;
  labels: FileListItemLabels;
  locale: string;
  isPending: boolean;
  onDownload: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  onPreview: (file: FileUploadData) => void;
}

const FileListItemComponent = ({
  file,
  labels,
  locale,
  isPending,
  onDownload,
  onDelete,
  onPreview,
}: FileListItemProps) => {
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

  const getCategoryIcon = useCallback(() => {
    switch (file.category) {
      case FileCategory.IMAGE:
        return <Image className="h-5 w-5 text-blue-500" />;
      case FileCategory.DOCUMENT:
        return <FileText className="h-5 w-5 text-red-500" />;
      case FileCategory.SPREADSHEET:
        return <Table className="h-5 w-5 text-green-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  }, [file.category]);

  const handleDownload = useCallback(() => {
    onDownload(file.id);
  }, [onDownload, file.id]);

  const handleDelete = useCallback(() => {
    onDelete(file.id);
  }, [onDelete, file.id]);

  const handlePreview = useCallback(() => {
    onPreview(file);
  }, [onPreview, file]);

  const isPreviewable = file.category === FileCategory.IMAGE;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {getCategoryIcon()}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{file.fileName}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-muted-foreground">
              {formatFileSize(file.fileSize)}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(file.createdAt).toLocaleDateString(locale)}
            </span>
            <Badge
              variant={file.visibility === "PUBLIC" ? "default" : "secondary"}
              className="text-xs"
            >
              {file.visibility}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-4">
        {isPreviewable && (
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            onClick={handlePreview}
            title={labels.previewButton}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={handleDownload}
          title={labels.downloadButton}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={handleDelete}
          title={labels.deleteButton}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const FileListItem = memo(FileListItemComponent);
FileListItem.displayName = "FileListItem";
