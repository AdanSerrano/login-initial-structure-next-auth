import {
  presignedUrlRequestSchema,
  confirmUploadSchema,
  downloadRequestSchema,
  deleteFileSchema,
  getFilesSchema,
  type PresignedUrlRequestInput,
  type ConfirmUploadInput,
  type DownloadRequestInput,
  type DeleteFileInput,
  type GetFilesInput,
} from "./schema/file-upload.schema";

interface ValidationResult<T> {
  isValid: boolean;
  error?: string;
  data?: T;
}

export class FileUploadValidationService {
  public validatePresignedUrlRequest(
    data: PresignedUrlRequestInput
  ): ValidationResult<PresignedUrlRequestInput> {
    const result = presignedUrlRequestSchema.safeParse(data);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return { isValid: false, error: firstIssue?.message };
    }

    return { isValid: true, data: result.data };
  }

  public validateConfirmUpload(
    data: ConfirmUploadInput
  ): ValidationResult<ConfirmUploadInput> {
    const result = confirmUploadSchema.safeParse(data);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return { isValid: false, error: firstIssue?.message };
    }

    return { isValid: true, data: result.data };
  }

  public validateDownloadRequest(
    data: DownloadRequestInput
  ): ValidationResult<DownloadRequestInput> {
    const result = downloadRequestSchema.safeParse(data);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return { isValid: false, error: firstIssue?.message };
    }

    return { isValid: true, data: result.data };
  }

  public validateDeleteRequest(
    data: DeleteFileInput
  ): ValidationResult<DeleteFileInput> {
    const result = deleteFileSchema.safeParse(data);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return { isValid: false, error: firstIssue?.message };
    }

    return { isValid: true, data: result.data };
  }

  public validateGetFiles(data: GetFilesInput): ValidationResult<GetFilesInput> {
    const result = getFilesSchema.safeParse(data);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return { isValid: false, error: firstIssue?.message };
    }

    return { isValid: true, data: result.data };
  }
}
