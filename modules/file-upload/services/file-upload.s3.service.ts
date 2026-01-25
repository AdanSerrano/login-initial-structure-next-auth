import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, R2_CONFIG } from "@/lib/aws/s3-client";
import { FileVisibility } from "../types/file-upload.types";

interface GenerateUploadUrlParams {
  fileKey: string;
  mimeType: string;
  fileSize: number;
  visibility: FileVisibility;
}

interface GenerateDownloadUrlParams {
  fileKey: string;
  fileName: string;
}

export class FileUploadS3Service {
  private readonly bucket = R2_CONFIG.bucket;
  private readonly publicUrl = R2_CONFIG.publicUrl;
  private readonly uploadExpiry = parseInt(
    process.env.PRESIGNED_URL_UPLOAD_EXPIRY || "3600"
  );
  private readonly downloadExpiry = parseInt(
    process.env.PRESIGNED_URL_DOWNLOAD_EXPIRY || "900"
  );

  public async generateUploadUrl(
    params: GenerateUploadUrlParams
  ): Promise<{ url: string; expiresAt: Date }> {
    const { fileKey, mimeType, fileSize } = params;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ContentType: mimeType,
      ContentLength: fileSize,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: this.uploadExpiry,
    });

    const expiresAt = new Date(Date.now() + this.uploadExpiry * 1000);

    return { url, expiresAt };
  }

  public async generateDownloadUrl(
    params: GenerateDownloadUrlParams
  ): Promise<{ url: string; expiresAt: Date }> {
    const { fileKey, fileName } = params;

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ResponseContentDisposition: `attachment; filename="${fileName}"`,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: this.downloadExpiry,
    });

    const expiresAt = new Date(Date.now() + this.downloadExpiry * 1000);

    return { url, expiresAt };
  }

  public getPublicUrl(fileKey: string): string {
    // Use custom domain or R2.dev public URL
    if (this.publicUrl) {
      return `${this.publicUrl}/${fileKey}`;
    }
    // Fallback: generate presigned URL (if no public access configured)
    return "";
  }

  public async verifyFileExists(
    fileKey: string,
    _visibility: FileVisibility
  ): Promise<boolean> {
    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: fileKey,
        })
      );
      return true;
    } catch {
      return false;
    }
  }

  public async deleteFile(
    fileKey: string,
    _visibility: FileVisibility
  ): Promise<void> {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      })
    );
  }
}
