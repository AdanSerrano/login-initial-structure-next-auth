import {
  FILE_UPLOAD_CONFIG,
  FileCategory,
  FileVisibility,
} from "../types/file-upload.types";

interface FileValidationResult {
  isValid: boolean;
  error?: string;
  category?: FileCategory;
}

export class FileUploadDomainService {
  public validateFileType(
    mimeType: string,
    fileName: string
  ): FileValidationResult {
    const extension = this.getFileExtension(fileName).toLowerCase();

    const isImage = FILE_UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isDocument =
      FILE_UPLOAD_CONFIG.ALLOWED_DOCUMENT_TYPES.includes(mimeType);

    if (!isImage && !isDocument) {
      return {
        isValid: false,
        error: `Tipo de archivo no permitido: ${mimeType}`,
      };
    }

    if (isImage && !FILE_UPLOAD_CONFIG.IMAGE_EXTENSIONS.includes(extension)) {
      return {
        isValid: false,
        error: "Extensión de archivo no coincide con el tipo MIME",
      };
    }

    if (
      isDocument &&
      !FILE_UPLOAD_CONFIG.DOCUMENT_EXTENSIONS.includes(extension)
    ) {
      return {
        isValid: false,
        error: "Extensión de archivo no coincide con el tipo MIME",
      };
    }

    return {
      isValid: true,
      category: this.determineCategory(mimeType),
    };
  }

  public validateFileSize(size: number): FileValidationResult {
    if (size <= 0) {
      return { isValid: false, error: "Tamaño de archivo inválido" };
    }

    if (size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Archivo excede el tamaño máximo de ${this.formatFileSize(
          FILE_UPLOAD_CONFIG.MAX_FILE_SIZE
        )}`,
      };
    }

    return { isValid: true };
  }

  public determineDefaultVisibility(mimeType: string): FileVisibility {
    const isImage = FILE_UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(mimeType);
    return isImage ? FileVisibility.PUBLIC : FileVisibility.PRIVATE;
  }

  public determineCategory(mimeType: string): FileCategory {
    if (FILE_UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return FileCategory.IMAGE;
    }

    if (mimeType === "application/pdf") {
      return FileCategory.DOCUMENT;
    }

    if (
      mimeType.includes("spreadsheet") ||
      mimeType.includes("excel") ||
      mimeType === "application/vnd.ms-excel"
    ) {
      return FileCategory.SPREADSHEET;
    }

    if (mimeType.includes("word") || mimeType.includes("document")) {
      return FileCategory.DOCUMENT;
    }

    return FileCategory.OTHER;
  }

  public generateFileKey(
    userId: string,
    fileName: string,
    visibility: FileVisibility
  ): string {
    const extension = this.getFileExtension(fileName);
    const uniqueId = crypto.randomUUID().slice(0, 12);
    const prefix = visibility === FileVisibility.PUBLIC ? "public" : "private";

    // URL limpia: public/a1b2c3d4e5f6.png
    return `${prefix}/${uniqueId}${extension}`;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_{2,}/g, "_")
      .toLowerCase();
  }

  private getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf(".");
    return lastDot !== -1 ? fileName.slice(lastDot) : "";
  }

  public formatFileSize(bytes: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let unitIndex = 0;
    let size = bytes;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}
