import { FileUploadService } from "../services/file-upload.services";
import { FileUploadValidationService } from "../validations/file-upload.validation.service";
import type {
  PresignedUrlRequestInput,
  ConfirmUploadInput,
  GetFilesInput,
} from "../validations/schema/file-upload.schema";

export class FileUploadController {
  private service: FileUploadService;
  private validationService: FileUploadValidationService;

  constructor() {
    this.service = new FileUploadService();
    this.validationService = new FileUploadValidationService();
  }

  public async handleGetUploadUrl(input: PresignedUrlRequestInput) {
    const validation = this.validationService.validatePresignedUrlRequest(input);
    if (!validation.isValid) {
      return { error: validation.error };
    }

    return await this.service.getUploadPresignedUrl(validation.data!);
  }

  public async handleConfirmUpload(input: ConfirmUploadInput) {
    const validation = this.validationService.validateConfirmUpload(input);
    if (!validation.isValid) {
      return { error: validation.error };
    }

    return await this.service.confirmFileUpload(validation.data!);
  }

  public async handleGetDownloadUrl(fileId: string) {
    const validation = this.validationService.validateDownloadRequest({
      fileId,
    });
    if (!validation.isValid) {
      return { error: validation.error };
    }

    return await this.service.getDownloadPresignedUrl(fileId);
  }

  public async handleDeleteFile(fileId: string) {
    const validation = this.validationService.validateDeleteRequest({ fileId });
    if (!validation.isValid) {
      return { error: validation.error };
    }

    return await this.service.deleteFile(fileId);
  }

  public async handleGetUserFiles(input: GetFilesInput) {
    const validation = this.validationService.validateGetFiles(input);
    if (!validation.isValid) {
      return { error: validation.error };
    }

    return await this.service.getUserFiles(validation.data!);
  }
}
