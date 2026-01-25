import { auth } from "@/auth";
import { FileUploadRepository } from "../repository/file-upload.repository";
import { FileUploadDomainService } from "./file-upload.domain.service";
import { FileUploadS3Service } from "./file-upload.s3.service";
import {
  FileVisibility,
} from "../types/file-upload.types";
import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  ConfirmUploadRequest,
  FileUploadResult,
  FileUploadData,
  PaginatedResponse,
} from "../types/file-upload.types";

export class FileUploadService {
  private repository: FileUploadRepository;
  private domainService: FileUploadDomainService;
  private s3Service: FileUploadS3Service;

  constructor() {
    this.repository = new FileUploadRepository();
    this.domainService = new FileUploadDomainService();
    this.s3Service = new FileUploadS3Service();
  }

  public async getUploadPresignedUrl(
    request: PresignedUrlRequest
  ): Promise<FileUploadResult<PresignedUrlResponse>> {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const typeValidation = this.domainService.validateFileType(
      request.fileType,
      request.fileName
    );
    if (!typeValidation.isValid) {
      return { error: typeValidation.error };
    }

    const sizeValidation = this.domainService.validateFileSize(request.fileSize);
    if (!sizeValidation.isValid) {
      return { error: sizeValidation.error };
    }

    const fileKey = this.domainService.generateFileKey(
      session.user.id,
      request.fileName,
      request.visibility
    );

    const { url, expiresAt } = await this.s3Service.generateUploadUrl({
      fileKey,
      mimeType: request.fileType,
      fileSize: request.fileSize,
      visibility: request.visibility,
    });

    return {
      success: "URL de subida generada",
      data: {
        uploadUrl: url,
        fileKey,
        expiresAt,
      },
    };
  }

  public async confirmFileUpload(
    request: ConfirmUploadRequest
  ): Promise<FileUploadResult<FileUploadData>> {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const exists = await this.s3Service.verifyFileExists(
      request.fileKey,
      request.visibility
    );
    if (!exists) {
      return { error: "Archivo no encontrado en el servidor" };
    }

    const category = this.domainService.determineCategory(request.mimeType);

    const publicUrl =
      request.visibility === FileVisibility.PUBLIC
        ? this.s3Service.getPublicUrl(request.fileKey)
        : null;

    const fileExtension = request.fileName.split(".").pop() || "";

    const file = await this.repository.create({
      userId: session.user.id,
      fileName: request.fileName,
      fileKey: request.fileKey,
      fileSize: request.fileSize,
      mimeType: request.mimeType,
      fileExtension,
      visibility: request.visibility,
      category,
      publicUrl,
    });

    return {
      success: "Archivo subido exitosamente",
      data: file as FileUploadData,
    };
  }

  public async getDownloadPresignedUrl(
    fileId: string
  ): Promise<FileUploadResult<{ url: string; expiresAt: Date }>> {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const file = await this.repository.findById(fileId);
    if (!file) {
      return { error: "Archivo no encontrado" };
    }

    if (file.userId !== session.user.id) {
      return { error: "No tienes permiso para acceder a este archivo" };
    }

    if (file.visibility === FileVisibility.PUBLIC && file.publicUrl) {
      return {
        success: "URL obtenida",
        data: {
          url: file.publicUrl,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };
    }

    const { url, expiresAt } = await this.s3Service.generateDownloadUrl({
      fileKey: file.fileKey,
      fileName: file.fileName,
    });

    return {
      success: "URL de descarga generada",
      data: { url, expiresAt },
    };
  }

  public async deleteFile(fileId: string): Promise<FileUploadResult> {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const file = await this.repository.findById(fileId);
    if (!file) {
      return { error: "Archivo no encontrado" };
    }

    if (file.userId !== session.user.id) {
      return { error: "No tienes permiso para eliminar este archivo" };
    }

    await this.s3Service.deleteFile(file.fileKey, file.visibility as FileVisibility);
    await this.repository.softDelete(fileId);

    return { success: "Archivo eliminado exitosamente" };
  }

  public async getUserFiles(params: {
    visibility?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<FileUploadResult<PaginatedResponse<FileUploadData>>> {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const result = await this.repository.findByUserId({
      userId: session.user.id,
      visibility: params.visibility,
      category: params.category,
      page: params.page || 1,
      limit: params.limit || 20,
    });

    return { data: result };
  }
}
