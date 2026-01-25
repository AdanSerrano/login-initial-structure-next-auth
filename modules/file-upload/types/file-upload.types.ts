// String constants instead of Prisma enums (safer for migrations)
export const FileVisibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const;
export type FileVisibility = (typeof FileVisibility)[keyof typeof FileVisibility];

export const FileCategory = {
  IMAGE: "IMAGE",
  DOCUMENT: "DOCUMENT",
  SPREADSHEET: "SPREADSHEET",
  OTHER: "OTHER",
} as const;
export type FileCategory = (typeof FileCategory)[keyof typeof FileCategory];

export const FileUploadStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  DELETED: "DELETED",
} as const;
export type FileUploadStatus = (typeof FileUploadStatus)[keyof typeof FileUploadStatus];

export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 25 * 1024 * 1024, // 25 MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ] as string[],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ] as string[],
  IMAGE_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif", ".webp"] as string[],
  DOCUMENT_EXTENSIONS: [".pdf", ".doc", ".docx", ".xls", ".xlsx"] as string[],
};

export interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  visibility: FileVisibility;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  expiresAt: Date;
}

export interface ConfirmUploadRequest {
  fileKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  visibility: FileVisibility;
}

export interface FileUploadData {
  id: string;
  fileName: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  visibility: FileVisibility;
  category: FileCategory;
  status: FileUploadStatus;
  publicUrl: string | null;
  createdAt: Date;
}

export interface GetFilesParams {
  userId: string;
  visibility?: FileVisibility;
  category?: FileCategory;
  page?: number;
  limit?: number;
}

export interface FileUploadResult<T = unknown> {
  success?: string;
  error?: string;
  data?: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface FileUploadZoneLabels {
  dropzoneTitle: string;
  dropzoneDescription: string;
  browseButton: string;
  maxSizeText: string;
  uploadingText: string;
  errorTitle: string;
}

export interface FileListLabels {
  emptyTitle: string;
  emptyDescription: string;
  downloadButton: string;
  deleteButton: string;
  previewButton: string;
  confirmDeleteTitle: string;
  confirmDeleteMessage: string;
}

export interface FilePreviewLabels {
  closeButton: string;
  downloadButton: string;
  fileDetails: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
}

export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
