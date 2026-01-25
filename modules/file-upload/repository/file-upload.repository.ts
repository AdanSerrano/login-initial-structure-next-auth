import { db } from "@/utils/db";
import type {
  FileUploadData,
  PaginatedResponse,
} from "../types/file-upload.types";
import { createPaginationMeta, FileUploadStatus } from "../types/file-upload.types";

interface CreateFileParams {
  userId: string;
  fileName: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  fileExtension: string;
  visibility: string;
  category: string;
  publicUrl?: string | null;
}

interface FindFilesParams {
  userId: string;
  visibility?: string;
  category?: string;
  page: number;
  limit: number;
}

export class FileUploadRepository {
  public async create(params: CreateFileParams) {
    return await db.fileUpload.create({
      data: {
        userId: params.userId,
        fileName: params.fileName,
        fileKey: params.fileKey,
        fileSize: params.fileSize,
        mimeType: params.mimeType,
        fileExtension: params.fileExtension,
        visibility: params.visibility,
        category: params.category,
        status: FileUploadStatus.COMPLETED,
        publicUrl: params.publicUrl,
      },
    });
  }

  public async findById(id: string) {
    return await db.fileUpload.findUnique({
      where: { id, deletedAt: null },
    });
  }

  public async findByKey(fileKey: string) {
    return await db.fileUpload.findUnique({
      where: { fileKey, deletedAt: null },
    });
  }

  public async findByUserId(
    params: FindFilesParams
  ): Promise<PaginatedResponse<FileUploadData>> {
    const { userId, visibility, category, page, limit } = params;

    const where = {
      userId,
      deletedAt: null,
      ...(visibility && { visibility }),
      ...(category && { category }),
    };

    const [files, total] = await Promise.all([
      db.fileUpload.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          fileName: true,
          fileKey: true,
          fileSize: true,
          mimeType: true,
          visibility: true,
          category: true,
          status: true,
          publicUrl: true,
          createdAt: true,
        },
      }),
      db.fileUpload.count({ where }),
    ]);

    return {
      data: files as FileUploadData[],
      pagination: createPaginationMeta(page, limit, total),
    };
  }

  public async softDelete(id: string) {
    return await db.fileUpload.update({
      where: { id },
      data: { deletedAt: new Date(), status: FileUploadStatus.DELETED },
    });
  }

  public async updateStatus(id: string, status: string) {
    return await db.fileUpload.update({
      where: { id },
      data: { status },
    });
  }
}
