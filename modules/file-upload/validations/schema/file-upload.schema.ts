import { z } from "zod";
import { FILE_UPLOAD_CONFIG } from "../../types/file-upload.types";

const ALLOWED_MIME_TYPES = [
  ...FILE_UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES,
  ...FILE_UPLOAD_CONFIG.ALLOWED_DOCUMENT_TYPES,
];

export const presignedUrlRequestSchema = z.object({
  fileName: z
    .string()
    .min(1, "Nombre de archivo requerido")
    .max(255, "Nombre de archivo muy largo"),
  fileType: z
    .string()
    .min(1, "Tipo de archivo requerido")
    .refine((type) => ALLOWED_MIME_TYPES.includes(type), {
      message: "Tipo de archivo no permitido",
    }),
  fileSize: z
    .number()
    .min(1, "Tamaño de archivo inválido")
    .max(
      FILE_UPLOAD_CONFIG.MAX_FILE_SIZE,
      "Archivo excede el tamaño máximo de 25MB"
    ),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});

export const confirmUploadSchema = z.object({
  fileKey: z.string().min(1, "File key requerido"),
  fileName: z.string().min(1, "Nombre de archivo requerido"),
  fileSize: z.number().min(1, "Tamaño inválido"),
  mimeType: z.string().min(1, "Tipo MIME requerido"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});

export const downloadRequestSchema = z.object({
  fileId: z.string().cuid("ID de archivo inválido"),
});

export const deleteFileSchema = z.object({
  fileId: z.string().cuid("ID de archivo inválido"),
});

export const getFilesSchema = z.object({
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  category: z.enum(["IMAGE", "DOCUMENT", "SPREADSHEET", "OTHER"]).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type PresignedUrlRequestInput = z.infer<typeof presignedUrlRequestSchema>;
export type ConfirmUploadInput = z.infer<typeof confirmUploadSchema>;
export type DownloadRequestInput = z.infer<typeof downloadRequestSchema>;
export type DeleteFileInput = z.infer<typeof deleteFileSchema>;
export type GetFilesInput = z.infer<typeof getFilesSchema>;
